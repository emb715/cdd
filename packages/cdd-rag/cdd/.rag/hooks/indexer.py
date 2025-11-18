"""
Auto-indexing hooks for CDD work items
Automatically index work items when completed
"""

from pathlib import Path
from typing import Optional
from datetime import datetime
import frontmatter

from ..core.config import get_config
from ..core.embedder import Embedder
from ..core.vector_store import VectorStore
from ..core.models import Document, Chunk, DocumentType
from .utils import extract_work_id_from_path, get_work_item_directory


def auto_index_work_item(work_id: str, async_mode: bool = True) -> bool:
    """
    Automatically index a work item after completion

    This is called by /cdd:complete-work hook

    Args:
        work_id: Work item ID (e.g., '0001')
        async_mode: Whether to index asynchronously

    Returns:
        True if indexing started/completed, False otherwise
    """
    try:
        config = get_config()

        # Check if auto-indexing is enabled
        if not config.auto_index_on_complete:
            return False

        # Check async setting
        if async_mode and not config.auto_index_async:
            async_mode = False

        # Notify user
        if config.auto_index_notify:
            print(f"\n🔍 RAG Update:")
            if async_mode:
                print(f"  ⏳ Indexing work item {work_id} in background...")
            else:
                print(f"  📥 Indexing work item {work_id}...")

        # Index the work item
        success, chunks_added = index_work_item(work_id)

        if success and config.auto_index_notify:
            print(f"  ✓ Work item indexed")
            print(f"  ✓ {chunks_added} new chunks added")

        return success

    except Exception as e:
        print(f"  ✗ Indexing failed: {e}")
        return False


def index_work_item(work_id: str) -> tuple[bool, int]:
    """
    Index a specific work item

    Args:
        work_id: Work item ID (e.g., '0001')

    Returns:
        Tuple of (success, chunks_added)
    """
    try:
        config = get_config()

        # Find work item directory
        work_dir = get_work_item_directory(work_id)
        if not work_dir:
            print(f"  ⚠️  Work item directory not found for {work_id}")
            return False, 0

        # Find markdown files in work item
        md_files = list(work_dir.glob("*.md"))

        if not md_files:
            print(f"  ⚠️  No markdown files found in {work_dir}")
            return False, 0

        # Filter by summary_only setting
        if config.index_summary_only:
            md_files = [f for f in md_files if "IMPLEMENTATION_SUMMARY" in f.name]

        if not md_files:
            return False, 0

        # Initialize components
        embedder = Embedder()
        vector_store = VectorStore()

        # Process each file
        all_chunks = []
        all_embeddings = []

        for md_file in md_files:
            chunks, embeddings = _process_file(md_file, work_id, config.workspace_path)
            all_chunks.extend(chunks)
            all_embeddings.extend(embeddings)

        # Delete existing chunks for this work item (if incremental)
        if config.incremental_indexing:
            vector_store.delete_by_work_id(work_id)

        # Add new chunks
        if all_chunks:
            vector_store.add_chunks(all_chunks, all_embeddings)

        return True, len(all_chunks)

    except Exception as e:
        print(f"  ✗ Error indexing work item: {e}")
        return False, 0


def _process_file(
    file_path: Path, work_id: str, workspace_path: Path
) -> tuple[list[Chunk], list[list[float]]]:
    """Process a single file into chunks with embeddings"""
    config = get_config()

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

    # Chunk content
    chunks = _chunk_content(
        body, file_path, work_id, doc_type, metadata, workspace_path
    )

    if not chunks:
        return [], []

    # Generate embeddings
    embedder = Embedder()
    chunk_texts = [chunk.content for chunk in chunks]
    embeddings = embedder.embed_batch(chunk_texts, show_progress=False)

    return chunks, embeddings


def _chunk_content(
    content: str,
    file_path: Path,
    work_id: str,
    doc_type: DocumentType,
    metadata: dict,
    workspace_path: Path,
) -> list[Chunk]:
    """Chunk content into smaller pieces"""
    config = get_config()

    chunks = []
    chunk_size = config.chunk_size
    overlap = config.chunk_overlap

    # Extract template_mode from frontmatter
    template_mode = metadata.get("template_mode", "unknown")

    # Determine artifact domain
    from ..core.models import ArtifactDomain
    artifact_domain = ArtifactDomain.from_document_type(doc_type).value

    # Simple chunking by character count
    for i in range(0, len(content), chunk_size - overlap):
        chunk_content = content[i : i + chunk_size]

        if not chunk_content.strip():
            continue

        # Skip chunks that are too small
        if len(chunk_content.strip()) < config.min_chunk_size:
            continue

        # Create chunk
        rel_path = file_path.relative_to(workspace_path)
        chunk_id = f"{rel_path}:chunk:{len(chunks)}"

        chunk = Chunk(
            id=chunk_id,
            content=chunk_content.strip(),
            source_file=str(rel_path),
            work_id=work_id,
            document_type=doc_type.value,
            chunk_index=len(chunks),
            total_chunks=0,  # Will be updated later
            title=metadata.get("title"),
            work_type=metadata.get("type"),
            priority=metadata.get("priority"),
            status=metadata.get("status"),
            tags=metadata.get("tags", []),
            template_mode=template_mode,
            artifact_domain=artifact_domain,
            indexed_at=datetime.now(),
        )

        chunks.append(chunk)

    # Update total_chunks
    for chunk in chunks:
        chunk.total_chunks = len(chunks)

    return chunks


def reindex_all() -> tuple[bool, int]:
    """
    Re-index entire workspace

    Returns:
        Tuple of (success, total_chunks)
    """
    try:
        from ..core.cli import Indexer

        indexer = Indexer()
        indexer.index_workspace()

        # Get stats
        vector_store = VectorStore()
        total = vector_store.count()

        return True, total

    except Exception as e:
        print(f"❌ Re-indexing failed: {e}")
        return False, 0
