"""
Utility functions for RAG hooks
"""

from pathlib import Path
from typing import List, Dict, Any, Optional

from ..core.config import get_config
from ..core.query_engine import QueryEngine
from ..core.models import SearchResult


def is_rag_enabled() -> bool:
    """
    Check if RAG system is available and enabled

    Returns:
        True if RAG can be used, False otherwise
    """
    try:
        config = get_config()
        return config.smart_enhancement_enabled
    except:
        return False


def get_rag_directory() -> Optional[Path]:
    """
    Get the .rag directory path if it exists

    Returns:
        Path to .rag directory or None
    """
    # Try to find .rag directory
    current = Path.cwd()

    # Look in current directory and parent directories
    for _ in range(5):  # Check up to 5 levels up
        rag_dir = current / "cdd" / ".rag"
        if rag_dir.exists():
            return rag_dir

        rag_dir = current / ".rag"
        if rag_dir.exists():
            return rag_dir

        current = current.parent

    return None


def get_similar_work_items(
    query: str, n_results: int = 5, min_score: float = 0.7, status: Optional[str] = None
) -> List[SearchResult]:
    """
    Find similar work items for a query

    Args:
        query: Search query (e.g., feature description)
        n_results: Number of results to return
        min_score: Minimum similarity score
        status: Optional filter by status (e.g., 'completed')

    Returns:
        List of SearchResult objects
    """
    if not is_rag_enabled():
        return []

    try:
        query_engine = QueryEngine()

        # Search
        result = query_engine.search(
            query=query, n_results=n_results, min_score=min_score, status=status
        )

        return result.results
    except Exception as e:
        print(f"⚠️  RAG search failed: {e}")
        return []


def format_context_for_ai(results: List[SearchResult], max_chunks: int = 5) -> str:
    """
    Format search results as context for AI injection

    Args:
        results: List of SearchResult objects
        max_chunks: Maximum number of chunks to include

    Returns:
        Formatted context string
    """
    if not results:
        return ""

    # Limit results
    limited_results = results[:max_chunks]

    # Group by work item
    by_work_item = {}
    for result in limited_results:
        work_id = result.chunk.work_id or "unknown"
        if work_id not in by_work_item:
            by_work_item[work_id] = []
        by_work_item[work_id].append(result)

    # Format context
    context_parts = []

    for work_id, work_results in by_work_item.items():
        # Get work item info from first chunk
        first_chunk = work_results[0].chunk

        # Build header
        header = f"Work Item {work_id}"
        if first_chunk.title:
            header += f": {first_chunk.title}"
        if first_chunk.work_type:
            header += f" ({first_chunk.work_type})"

        # Build content
        work_parts = [header, "=" * len(header)]

        for result in work_results:
            chunk = result.chunk
            source = f"Source: {chunk.source_file}"
            if chunk.section:
                source += f" > {chunk.section}"
            work_parts.append(f"\n{source} (score: {result.score:.2f})")
            work_parts.append(f"{chunk.content[:500]}...")  # Truncate for context

        context_parts.append("\n".join(work_parts))

    return "\n\n" + ("-" * 80) + "\n\n".join(context_parts)


def format_similar_items_display(results: List[SearchResult], max_items: int = 5) -> str:
    """
    Format similar work items for display to user

    Args:
        results: List of SearchResult objects
        max_items: Maximum number of items to display

    Returns:
        Formatted display string
    """
    if not results:
        return ""

    # Group by work item
    by_work_item = {}
    for result in results:
        work_id = result.chunk.work_id or "unknown"
        if work_id not in by_work_item:
            by_work_item[work_id] = {
                "work_id": work_id,
                "title": result.chunk.title,
                "work_type": result.chunk.work_type,
                "status": result.chunk.status,
                "score": result.score,
                "source": result.chunk.source_file,
            }
        else:
            # Keep highest score for this work item
            if result.score > by_work_item[work_id]["score"]:
                by_work_item[work_id]["score"] = result.score

    # Sort by score
    items = sorted(by_work_item.values(), key=lambda x: x["score"], reverse=True)

    # Limit
    items = items[:max_items]

    # Format display
    lines = ["📋 Similar Work Items:"]

    for i, item in enumerate(items, 1):
        title = item["title"] or item["source"]
        work_type = f" ({item['work_type']})" if item["work_type"] else ""
        status = f" [{item['status']}]" if item["status"] else ""
        score = f" (score: {item['score']:.2f})"

        lines.append(f"{i}. {item['work_id']}: {title}{work_type}{status}{score}")

    return "\n".join(lines)


def should_enhance_command(command_name: str) -> bool:
    """
    Check if a specific command should be enhanced

    Args:
        command_name: Name of the command (e.g., 'create-work')

    Returns:
        True if command should be enhanced
    """
    if not is_rag_enabled():
        return False

    try:
        config = get_config()

        command_flags = {
            "create-work": config.enhance_create_work,
            "plan-work": config.enhance_plan_work,
            "complete-work": config.enhance_complete_work,
            "save-session": config.enhance_save_session,
        }

        return command_flags.get(command_name, False)
    except:
        return False


def extract_work_id_from_path(path: Path) -> Optional[str]:
    """
    Extract work ID from a file path

    Args:
        path: Path to a file in a work item directory

    Returns:
        Work ID (e.g., '0001') or None
    """
    for part in path.parts:
        # Look for pattern like "0001-feature" or "0001"
        if part and len(part) >= 4 and part[:4].isdigit():
            return part[:4]
    return None


def get_work_item_directory(work_id: str) -> Optional[Path]:
    """
    Find the directory for a work item by ID

    Args:
        work_id: Work item ID (e.g., '0001')

    Returns:
        Path to work item directory or None
    """
    try:
        config = get_config()
        workspace = config.workspace_path

        # Look for directories matching work_id
        for item in workspace.iterdir():
            if item.is_dir() and item.name.startswith(work_id):
                return item

        return None
    except:
        return None


def get_cost_summary(cost: float, monthly_budget: Optional[float] = None) -> str:
    """
    Format cost information with budget awareness

    Args:
        cost: Cost in USD
        monthly_budget: Monthly budget limit

    Returns:
        Formatted cost string
    """
    cost_str = f"${cost:.4f}"

    if monthly_budget and cost > monthly_budget / 10:  # More than 10% of budget
        return f"⚠️  {cost_str} (significant portion of ${monthly_budget} budget)"

    return f"${cost:.4f}"
