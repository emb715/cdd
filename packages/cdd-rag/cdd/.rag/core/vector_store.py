"""
Vector database wrapper using ChromaDB
Local SQLite-based storage, no cloud required
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
from pathlib import Path
import chromadb
from chromadb.config import Settings

from .config import get_config
from .models import Chunk, SearchResult, IndexStats


class VectorStore:
    """Manages vector database operations with ChromaDB"""

    def __init__(self, persist_dir: str = None, collection_name: str = None):
        """
        Initialize vector store

        Args:
            persist_dir: Directory to persist database
            collection_name: Name of the collection
        """
        config = get_config()

        self.persist_dir = persist_dir or str(config.persist_dir)
        self.collection_name = collection_name or config.collection_name
        self.distance_metric = config.distance_metric

        self._client = None
        self._collection = None

    def _get_client(self):
        """Get or create ChromaDB client"""
        if self._client is None:
            # Ensure directory exists
            Path(self.persist_dir).mkdir(parents=True, exist_ok=True)

            self._client = chromadb.PersistentClient(path=self.persist_dir)

        return self._client

    def _get_collection(self):
        """Get or create collection"""
        if self._collection is None:
            client = self._get_client()

            # Get or create collection
            self._collection = client.get_or_create_collection(
                name=self.collection_name,
                metadata={
                    "description": "CDD knowledge base",
                    "distance_metric": self.distance_metric,
                },
            )

        return self._collection

    def add_chunks(self, chunks: List[Chunk], embeddings: List[List[float]]):
        """
        Add chunks with their embeddings to the database

        Args:
            chunks: List of Chunk objects
            embeddings: List of embedding vectors
        """
        if not chunks or not embeddings:
            return

        collection = self._get_collection()

        # Prepare data for ChromaDB
        ids = [chunk.id for chunk in chunks]
        documents = [chunk.content for chunk in chunks]
        metadatas = [chunk.to_dict() for chunk in chunks]

        # Remove None values and convert to strings where needed
        for metadata in metadatas:
            # Remove None values
            metadata = {k: v for k, v in metadata.items() if v is not None}

            # ChromaDB requires metadata values to be strings, ints, floats, or bools
            for key, value in list(metadata.items()):
                if isinstance(value, list):
                    metadata[key] = ",".join(str(v) for v in value)
                elif not isinstance(value, (str, int, float, bool)):
                    metadata[key] = str(value)

        # Add to collection
        collection.add(ids=ids, embeddings=embeddings, documents=documents, metadatas=metadatas)

    def search(
        self,
        query_embedding: List[float],
        n_results: int = 5,
        filters: Dict[str, Any] = None,
    ) -> List[SearchResult]:
        """
        Search for similar chunks

        Args:
            query_embedding: Query vector
            n_results: Number of results to return
            filters: Optional metadata filters

        Returns:
            List of SearchResult objects
        """
        collection = self._get_collection()

        # Check if collection is empty
        if collection.count() == 0:
            return []

        # Build where clause for filters
        where = None
        if filters:
            # Convert filters to ChromaDB format
            where = {}
            for key, value in filters.items():
                if value is not None:
                    where[key] = value

        # Query
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where=where if where else None,
        )

        # Parse results into SearchResult objects
        search_results = []
        for i in range(len(results["ids"][0])):
            # Reconstruct chunk from metadata
            metadata = results["metadatas"][0][i]

            # Parse tags back from comma-separated string
            tags = metadata.get("tags", "")
            if isinstance(tags, str) and tags:
                tags = [t.strip() for t in tags.split(",")]
            else:
                tags = []

            chunk = Chunk(
                id=results["ids"][0][i],
                content=results["documents"][0][i],
                source_file=metadata.get("source_file", ""),
                work_id=metadata.get("work_id"),
                document_type=metadata.get("document_type"),
                section=metadata.get("section"),
                section_path=metadata.get("section_path"),
                chunk_index=metadata.get("chunk_index", 0),
                total_chunks=metadata.get("total_chunks", 1),
                title=metadata.get("title"),
                work_type=metadata.get("work_type"),
                priority=metadata.get("priority"),
                status=metadata.get("status"),
                tags=tags,
                indexed_at=datetime.fromisoformat(metadata["indexed_at"])
                if metadata.get("indexed_at")
                else None,
            )

            distance = results["distances"][0][i]
            score = 1 - distance  # Convert distance to similarity score

            search_results.append(
                SearchResult(chunk=chunk, distance=distance, score=score, metadata=metadata)
            )

        return search_results

    def delete(self, ids: List[str]):
        """Delete chunks by IDs"""
        if not ids:
            return

        collection = self._get_collection()
        collection.delete(ids=ids)

    def delete_by_source(self, source_file: str):
        """Delete all chunks from a specific source file"""
        collection = self._get_collection()

        # Get all chunks from this source
        results = collection.get(where={"source_file": source_file})

        if results["ids"]:
            collection.delete(ids=results["ids"])

    def delete_by_work_id(self, work_id: str):
        """Delete all chunks from a specific work item"""
        collection = self._get_collection()

        # Get all chunks from this work item
        results = collection.get(where={"work_id": work_id})

        if results["ids"]:
            collection.delete(ids=results["ids"])

    def get_stats(self) -> IndexStats:
        """Get statistics about the indexed data"""
        collection = self._get_collection()

        total_chunks = collection.count()

        if total_chunks == 0:
            return IndexStats()

        # Get all metadata to compute statistics
        all_data = collection.get()
        metadatas = all_data["metadatas"]

        # Extract unique work IDs
        work_ids = set()
        by_type = {}
        by_status = {}
        by_priority = {}

        for metadata in metadatas:
            work_id = metadata.get("work_id")
            if work_id:
                work_ids.add(work_id)

            doc_type = metadata.get("document_type")
            if doc_type:
                by_type[doc_type] = by_type.get(doc_type, 0) + 1

            status = metadata.get("status")
            if status:
                by_status[status] = by_status.get(status, 0) + 1

            priority = metadata.get("priority")
            if priority:
                by_priority[priority] = by_priority.get(priority, 0) + 1

        # Get last indexed time
        last_indexed = None
        for metadata in metadatas:
            indexed_at = metadata.get("indexed_at")
            if indexed_at:
                try:
                    dt = datetime.fromisoformat(indexed_at)
                    if last_indexed is None or dt > last_indexed:
                        last_indexed = dt
                except (ValueError, TypeError):
                    pass

        # Estimate database size
        db_path = Path(self.persist_dir)
        index_size_mb = 0
        if db_path.exists():
            for file in db_path.rglob("*"):
                if file.is_file():
                    index_size_mb += file.stat().st_size / (1024 * 1024)

        return IndexStats(
            total_documents=len(
                set(m.get("source_file") for m in metadatas if m.get("source_file"))
            ),
            total_chunks=total_chunks,
            total_work_items=len(work_ids),
            by_type=by_type,
            by_status=by_status,
            by_priority=by_priority,
            last_indexed=last_indexed,
            index_size_mb=index_size_mb,
        )

    def count(self) -> int:
        """Get total number of chunks"""
        collection = self._get_collection()
        return collection.count()

    def clear(self):
        """Clear all data from collection"""
        client = self._get_client()
        try:
            client.delete_collection(name=self.collection_name)
        except:
            pass
        self._collection = None

    def reset(self):
        """Reset the vector store completely"""
        self.clear()
        self._get_collection()  # Recreate empty collection
