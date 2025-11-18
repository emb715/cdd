"""
Query engine for searching and retrieving context from CDD workspace
Combines embedder and vector store for semantic search
"""

import time
from typing import List, Optional, Dict, Any
from pathlib import Path

from .config import get_config
from .embedder import Embedder
from .vector_store import VectorStore
from .models import QueryResult, SearchResult, IndexStats


class QueryEngine:
    """Handles search queries and context retrieval"""

    def __init__(
        self, embedder: Optional[Embedder] = None, vector_store: Optional[VectorStore] = None
    ):
        """
        Initialize query engine

        Args:
            embedder: Embedder instance (created if None)
            vector_store: VectorStore instance (created if None)
        """
        self.config = get_config()
        self.embedder = embedder or Embedder()
        self.vector_store = vector_store or VectorStore()

    def search(
        self,
        query: str,
        n_results: Optional[int] = None,
        min_score: Optional[float] = None,
        work_type: Optional[str] = None,
        status: Optional[str] = None,
        work_id: Optional[str] = None,
        template_mode: Optional[str] = None,
        artifact_type: Optional[str] = None,
        artifact_domain: Optional[str] = None,
    ) -> QueryResult:
        """
        Search the knowledge base

        Args:
            query: Search query text
            n_results: Number of results (defaults to config)
            min_score: Minimum similarity score (defaults to config)
            work_type: Filter by work item type
            status: Filter by work item status
            work_id: Filter by specific work ID
            template_mode: Filter by template mode (solo-dev, minimal, comprehensive)
            artifact_type: Filter by artifact type (PROBLEM_BRIEF, TECHNICAL_RFC, etc.)
            artifact_domain: Filter by artifact domain (product, engineering, risk, qa)

        Returns:
            QueryResult with search results
        """
        start_time = time.time()

        # Use config defaults if not specified
        n_results = n_results or self.config.default_results
        min_score = min_score or self.config.min_similarity

        # Embed query
        query_embedding = self.embedder.embed(query)

        # Build filters
        filters = {}
        if work_type:
            filters["work_type"] = work_type
        if status:
            filters["status"] = status
        if work_id:
            filters["work_id"] = work_id
        if template_mode:
            filters["template_mode"] = template_mode
        if artifact_type:
            filters["document_type"] = artifact_type
        if artifact_domain:
            filters["artifact_domain"] = artifact_domain

        # Search vector store
        results = self.vector_store.search(
            query_embedding=query_embedding, n_results=n_results * 2, filters=filters if filters else None
        )

        # Filter by minimum score
        filtered_results = [r for r in results if r.score >= min_score]

        # Apply type/status weights if configured
        if self.config.type_weights or self.config.status_weights:
            filtered_results = self._apply_weights(filtered_results)

        # Re-rank if enabled
        if self.config.enable_reranking and len(filtered_results) > 1:
            filtered_results = self._rerank(query, filtered_results)

        # Limit to requested number
        final_results = filtered_results[:n_results]

        # Calculate search time
        search_time_ms = (time.time() - start_time) * 1000

        return QueryResult(
            query=query,
            results=final_results,
            total_results=len(final_results),
            search_time_ms=search_time_ms,
        )

    def _apply_weights(self, results: List[SearchResult]) -> List[SearchResult]:
        """Apply type and status weights to boost certain results"""
        weighted_results = []

        for result in results:
            weight = 1.0

            # Apply document type weight
            doc_type = result.chunk.document_type
            if doc_type and doc_type in self.config.type_weights:
                weight *= self.config.type_weights[doc_type]

            # Apply status weight
            status = result.chunk.status
            if status and status in self.config.status_weights:
                weight *= self.config.status_weights[status]

            # Adjust score
            result.score = min(1.0, result.score * weight)
            weighted_results.append(result)

        # Re-sort by adjusted score
        weighted_results.sort(key=lambda r: r.score, reverse=True)

        return weighted_results

    def _rerank(self, query: str, results: List[SearchResult]) -> List[SearchResult]:
        """
        Re-rank results for better relevance
        Simple implementation: boost results with query terms in content
        """
        query_terms = set(query.lower().split())

        for result in results:
            content_lower = result.chunk.content.lower()

            # Count matching terms
            matches = sum(1 for term in query_terms if term in content_lower)

            # Boost score slightly based on term matches
            if matches > 0:
                boost = 1.0 + (matches * 0.05)  # 5% boost per matching term
                result.score = min(1.0, result.score * boost)

        # Re-sort
        results.sort(key=lambda r: r.score, reverse=True)

        return results

    def get_context_for_query(
        self, query: str, max_tokens: Optional[int] = None, n_results: int = 5
    ) -> str:
        """
        Get formatted context for LLM from search results

        Args:
            query: Search query
            max_tokens: Maximum tokens for context (defaults to config)
            n_results: Number of results to include

        Returns:
            Formatted context string
        """
        max_tokens = max_tokens or self.config.max_context_tokens

        # Search
        query_result = self.search(query, n_results=n_results)

        if not query_result.results:
            return ""

        # Format context with sources
        context_parts = []
        total_chars = 0
        max_chars = max_tokens * 4  # Rough estimate: 1 token ≈ 4 chars

        for i, result in enumerate(query_result.results, 1):
            chunk = result.chunk

            # Build source header
            source_info = f"Source {i}: {chunk.source_file}"
            if chunk.work_id:
                source_info += f" (Work ID: {chunk.work_id})"
            if chunk.section:
                source_info += f"\nSection: {chunk.section}"

            # Build chunk text
            chunk_text = f"{source_info}\n{'-' * 40}\n{chunk.content}\n"

            # Check if adding this chunk would exceed max
            if total_chars + len(chunk_text) > max_chars and context_parts:
                break

            context_parts.append(chunk_text)
            total_chars += len(chunk_text)

        return "\n\n".join(context_parts)

    def get_stats(self) -> IndexStats:
        """Get statistics about the indexed knowledge base"""
        return self.vector_store.get_stats()

    def is_empty(self) -> bool:
        """Check if knowledge base is empty"""
        return self.vector_store.count() == 0
