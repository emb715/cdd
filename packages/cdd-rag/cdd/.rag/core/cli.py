#!/usr/bin/env python3
"""
CDD-RAG Command Line Interface
Main entry point for RAG operations
"""

import sys
import argparse
from pathlib import Path
from typing import List, Optional
from datetime import datetime
import frontmatter

from .config import load_config, get_config
from .embedder import Embedder
from .vector_store import VectorStore
from .query_engine import QueryEngine
from .llm_client import LLMClient
from .models import Document, Chunk, DocumentType


class Indexer:
    """Handles indexing of CDD workspace"""

    def __init__(self):
        self.config = get_config()
        self.embedder = Embedder()
        self.vector_store = VectorStore()

    def index_workspace(self, workspace_path: Optional[Path] = None):
        """Index all markdown files in workspace"""
        workspace_path = workspace_path or self.config.workspace_path

        print(f"🔍 Indexing CDD workspace: {workspace_path}")

        # Find markdown files
        md_files = self._find_markdown_files(workspace_path)
        print(f"📄 Found {len(md_files)} markdown files")

        if not md_files:
            print("❌ No markdown files found!")
            return

        # Process files
        all_chunks = []
        all_embeddings = []
        total_files_processed = 0

        for file_path in md_files:
            try:
                chunks, embeddings = self._process_file(file_path, workspace_path)
                if chunks:
                    all_chunks.extend(chunks)
                    all_embeddings.extend(embeddings)
                    total_files_processed += 1
                    print(f"  ✓ {file_path.name} ({len(chunks)} chunks)")
            except Exception as e:
                print(f"  ✗ {file_path.name}: {e}")

        # Add to vector store
        if all_chunks:
            print(f"\n📥 Storing {len(all_chunks)} chunks in vector database...")
            self.vector_store.add_chunks(all_chunks, all_embeddings)
            print(f"✅ Indexed {total_files_processed} files, {len(all_chunks)} chunks")
        else:
            print("❌ No chunks to index!")

    def _find_markdown_files(self, workspace_path: Path) -> List[Path]:
        """Find all markdown files, excluding templates and excluded patterns"""
        md_files = []

        for md_file in workspace_path.rglob("*.md"):
            # Skip if matches exclude patterns
            if self._should_exclude(md_file):
                continue

            md_files.append(md_file)

        return sorted(md_files)

    def _should_exclude(self, file_path: Path) -> bool:
        """Check if file matches exclude patterns"""
        file_str = str(file_path)

        # Skip templates
        if ".meta/templates" in file_str or ".meta/examples" in file_str:
            return True

        # Check exclude patterns from config
        for pattern in self.config.exclude_patterns:
            if pattern in file_str:
                return True

        return False

    def _process_file(
        self, file_path: Path, workspace_path: Path
    ) -> tuple[List[Chunk], List[List[float]]]:
        """Process a single file into chunks with embeddings"""
        # Read file
        content = file_path.read_text(encoding="utf-8")

        # Parse frontmatter
        try:
            post = frontmatter.loads(content)
            metadata = post.metadata
            body = post.content
        except:
            metadata = {}
            body = content

        # Detect document type
        doc_type = DocumentType.from_filename(file_path.name)

        # Extract work ID from path
        work_id = self._extract_work_id(file_path)

        # Create document
        document = Document(
            path=file_path,
            content=body,
            doc_type=doc_type,
            metadata=metadata,
            work_id=work_id,
            title=metadata.get("title"),
            work_type=metadata.get("type"),
            status=metadata.get("status"),
            priority=metadata.get("priority"),
            tags=metadata.get("tags", []),
        )

        # Chunk content
        chunks = self._chunk_document(document, workspace_path)

        if not chunks:
            return [], []

        # Generate embeddings
        chunk_texts = [chunk.content for chunk in chunks]
        embeddings = self.embedder.embed_batch(chunk_texts, show_progress=False)

        return chunks, embeddings

    def _extract_work_id(self, file_path: Path) -> Optional[str]:
        """Extract work ID from file path (e.g., '0001' from 'cdd/0001-feature/DECISIONS.md')"""
        for part in file_path.parts:
            # Look for pattern like "0001-feature" or "0001"
            if part and len(part) >= 4 and part[:4].isdigit():
                return part[:4]
        return None

    def _chunk_document(self, document: Document, workspace_path: Path) -> List[Chunk]:
        """Chunk a document into smaller pieces"""
        chunks = []
        content = document.content

        chunk_size = self.config.chunk_size
        overlap = self.config.chunk_overlap

        # Simple chunking by character count
        for i in range(0, len(content), chunk_size - overlap):
            chunk_content = content[i : i + chunk_size]

            if not chunk_content.strip():
                continue

            # Skip chunks that are too small
            if len(chunk_content.strip()) < self.config.min_chunk_size:
                continue

            # Create chunk
            rel_path = document.path.relative_to(workspace_path)
            chunk_id = f"{rel_path}:chunk:{len(chunks)}"

            chunk = Chunk(
                id=chunk_id,
                content=chunk_content.strip(),
                source_file=str(rel_path),
                work_id=document.work_id,
                document_type=document.doc_type.value,
                chunk_index=len(chunks),
                total_chunks=0,  # Will be updated later
                title=document.title,
                work_type=document.work_type,
                priority=document.priority,
                status=document.status,
                tags=document.tags,
                indexed_at=datetime.now(),
            )

            chunks.append(chunk)

        # Update total_chunks
        for chunk in chunks:
            chunk.total_chunks = len(chunks)

        return chunks


def cmd_index(args):
    """Index the CDD workspace"""
    indexer = Indexer()
    indexer.index_workspace()


def cmd_search(args):
    """Search the knowledge base"""
    query_engine = QueryEngine()

    # Check if empty
    if query_engine.is_empty():
        print("❌ Knowledge base is empty! Run 'python -m core.cli index' first.")
        return

    # Search
    result = query_engine.search(
        query=args.query,
        n_results=args.limit,
        work_type=args.type,
        status=args.status,
    )

    # Display results
    print(f"\n💭 Searching for: '{args.query}'")
    if args.type or args.status:
        filters = []
        if args.type:
            filters.append(f"type={args.type}")
        if args.status:
            filters.append(f"status={args.status}")
        print(f"🎯 Filters: {', '.join(filters)}")

    print(f"📊 Searched {query_engine.vector_store.count()} chunks in {result.search_time_ms:.0f}ms\n")

    if not result.results:
        print("ℹ️  No results found\n")
        print("💡 Suggestions:")
        print("  • Try broader search terms")
        print("  • Lower similarity threshold in config.yaml")
        print("  • Verify workspace is indexed")
        return

    print(f"📚 Found {len(result.results)} results:\n")

    for i, search_result in enumerate(result.results, 1):
        chunk = search_result.chunk

        # Header
        print(f"{i}. {chunk.source_file} (score: {search_result.score:.2f})")

        # Metadata
        meta_parts = []
        if chunk.work_id:
            meta_parts.append(f"Work ID: {chunk.work_id}")
        if chunk.work_type:
            meta_parts.append(f"Type: {chunk.work_type}")
        if chunk.status:
            meta_parts.append(f"Status: {chunk.status}")
        if meta_parts:
            print(f"   {' | '.join(meta_parts)}")

        # Content preview
        preview = chunk.content[:300]
        if len(chunk.content) > 300:
            preview += "..."
        print(f"\n   {preview}\n")


def cmd_ask(args):
    """Ask a question with AI"""
    query_engine = QueryEngine()
    llm_client = LLMClient()

    # Check if empty
    if query_engine.is_empty():
        print("❌ Knowledge base is empty! Run 'python -m core.cli index' first.")
        return

    print(f"\n🔍 Searching knowledge base...")

    # Search
    result = query_engine.search(query=args.question, n_results=args.context_chunks)

    if not result.results:
        print("❌ No relevant context found")
        return

    print(f"📊 Found {len(result.results)} relevant chunks\n")
    print(f"🤖 Generating AI answer with {args.model or llm_client.default_model}...\n")

    # Enhance with AI answer
    result = llm_client.enhance_query_result(result, model=args.model)

    # Display answer
    print("💡 Answer:\n")
    print(result.answer)
    print(f"\n📚 Sources:")
    for i, search_result in enumerate(result.results, 1):
        print(f"  {i}. {search_result.chunk.source_file}")

    print(f"\n📊 Cost: ${result.answer_cost:.4f} | Tokens: {result.answer_tokens}")


def cmd_stats(args):
    """Show knowledge base statistics"""
    vector_store = VectorStore()
    stats = vector_store.get_stats()

    print(f"\n📊 RAG Index Statistics")
    print(f"{'─' * 40}")
    print(f"Total documents: {stats.total_documents}")
    print(f"Total chunks: {stats.total_chunks}")
    print(f"Total work items: {stats.total_work_items}")

    if stats.by_type:
        print(f"\nBy Type:")
        for doc_type, count in sorted(stats.by_type.items()):
            print(f"  {doc_type}: {count}")

    if stats.by_status:
        print(f"\nBy Status:")
        for status, count in sorted(stats.by_status.items()):
            print(f"  {status}: {count}")

    if stats.last_indexed:
        print(f"\nLast indexed: {stats.last_indexed.strftime('%Y-%m-%d %H:%M:%S')}")

    print(f"Vector DB size: {stats.index_size_mb:.1f} MB")


def cmd_update(args):
    """Incrementally update the index"""
    print("🔄 Incremental update not yet implemented")
    print("💡 Use 'index' command to re-index everything")


def main():
    """Main CLI entry point"""
    # Load config
    try:
        load_config()
    except Exception as e:
        print(f"❌ Failed to load config: {e}")
        sys.exit(1)

    # Create parser
    parser = argparse.ArgumentParser(
        description="CDD-RAG: Semantic search and AI-powered context for CDD workspaces"
    )
    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    # Index command
    index_parser = subparsers.add_parser("index", help="Index CDD workspace")

    # Search command
    search_parser = subparsers.add_parser("search", help="Search knowledge base")
    search_parser.add_argument("query", help="Search query")
    search_parser.add_argument("--limit", type=int, default=5, help="Number of results")
    search_parser.add_argument("--type", help="Filter by work item type")
    search_parser.add_argument("--status", help="Filter by work item status")

    # Ask command
    ask_parser = subparsers.add_parser("ask", help="Ask question with AI")
    ask_parser.add_argument("question", help="Question to ask")
    ask_parser.add_argument("--model", help="LLM model to use")
    ask_parser.add_argument("--context-chunks", type=int, default=5, help="Number of context chunks")

    # Stats command
    stats_parser = subparsers.add_parser("stats", help="Show index statistics")

    # Update command
    update_parser = subparsers.add_parser("update", help="Incrementally update index")

    # Parse args
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    # Execute command
    commands = {
        "index": cmd_index,
        "search": cmd_search,
        "ask": cmd_ask,
        "stats": cmd_stats,
        "update": cmd_update,
    }

    try:
        commands[args.command](args)
    except KeyboardInterrupt:
        print("\n\n⏸️  Interrupted")
        sys.exit(130)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        if get_config().verbose:
            import traceback

            traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
