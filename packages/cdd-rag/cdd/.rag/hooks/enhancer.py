"""
Smart auto-enhancement hooks for CDD commands
Injects relevant context into AI prompts
"""

from typing import Optional, Dict, Any

from ..core.config import get_config
from ..core.query_engine import QueryEngine
from .utils import (
    should_enhance_command,
    get_similar_work_items,
    format_context_for_ai,
    format_similar_items_display,
)


def enhance_create_work(work_title: str, work_description: Optional[str] = None) -> Optional[str]:
    """
    Enhance /cdd:create-work by showing similar existing work items

    Args:
        work_title: Title of the new work item
        work_description: Optional description

    Returns:
        Context string to inject into prompt, or None
    """
    if not should_enhance_command("create-work"):
        return None

    try:
        config = get_config()

        # Build search query
        query = work_title
        if work_description:
            query += f" {work_description}"

        # Search for similar work items
        results = get_similar_work_items(
            query=query,
            n_results=5,
            min_score=config.min_score,
            status="completed",  # Only show completed work
        )

        if not results:
            return None

        # Format for display
        display = format_similar_items_display(results, max_items=5)

        # Build context for AI
        context = f"""
{display}

The user is creating a new work item: "{work_title}"

Before proceeding, you should:
1. Show the similar work items listed above
2. Ask if the user wants to review any of these before creating new work
3. Suggest if this might be related to or duplicate of existing work

Only proceed with creation if the user confirms after seeing similar items.
"""

        if config.cite_sources:
            # Add source references
            sources = [f"  - {r.chunk.source_file}" for r in results[:3]]
            context += f"\n\nRelevant sources:\n" + "\n".join(sources)

        return context

    except Exception as e:
        if config.verbose:
            print(f"⚠️  Enhancement failed: {e}")
        return None


def enhance_plan_work(work_id: str, work_context: Optional[Dict[str, Any]] = None) -> Optional[str]:
    """
    Enhance /cdd:plan-work by injecting relevant implementation patterns

    Args:
        work_id: Work item ID being planned
        work_context: Optional context about the work item (title, type, etc.)

    Returns:
        Context string to inject into prompt, or None
    """
    if not should_enhance_command("plan-work"):
        return None

    try:
        config = get_config()

        # Build search query from work context
        if work_context:
            query_parts = []
            if work_context.get("title"):
                query_parts.append(work_context["title"])
            if work_context.get("description"):
                query_parts.append(work_context["description"])
            query = " ".join(query_parts)
        else:
            # Fallback: search by work_id
            query = f"work item {work_id}"

        # Search for similar implementations
        results = get_similar_work_items(
            query=query,
            n_results=config.max_chunks,
            min_score=config.min_score,
            status="completed",  # Only completed work has proven patterns
        )

        if not results:
            return None

        # Format context for AI
        context_text = format_context_for_ai(results, max_chunks=config.max_chunks)

        # Build prompt injection
        context = f"""
📚 Relevant Context from Past Work:

{context_text}

When planning work item {work_id}, reference the above implementations where relevant:
- Use proven technical approaches
- Follow established patterns
- Note any lessons learned
- Maintain consistency with past decisions

You should naturally integrate insights from these past work items into the implementation plan.
"""

        return context

    except Exception as e:
        if config.verbose:
            print(f"⚠️  Enhancement failed: {e}")
        return None


def enhance_complete_work(work_id: str, summary: Optional[str] = None) -> Optional[str]:
    """
    Enhance /cdd:complete-work by auto-indexing the completed work

    Note: This is primarily for indexing, not prompt injection

    Args:
        work_id: Work item ID being completed
        summary: Optional completion summary

    Returns:
        None (indexing happens as side effect)
    """
    if not should_enhance_command("complete-work"):
        return None

    try:
        from .indexer import auto_index_work_item

        # Auto-index the completed work item
        config = get_config()
        auto_index_work_item(work_id, async_mode=config.auto_index_async)

        # No prompt injection needed for completion
        return None

    except Exception as e:
        if config.verbose:
            print(f"⚠️  Auto-indexing failed: {e}")
        return None


def enhance_custom_query(query: str, use_ai: bool = False) -> Optional[str]:
    """
    Enhance custom /cdd:query commands

    Args:
        query: User's query
        use_ai: Whether AI answer is requested

    Returns:
        AI-ready context if use_ai=True, else formatted results
    """
    try:
        query_engine = QueryEngine()

        # Search
        result = query_engine.search(query)

        if not result.results:
            return None

        if use_ai:
            # Format for AI answer
            from ..core.llm_client import LLMClient

            llm = LLMClient()
            result = llm.enhance_query_result(result)

            return f"""
💡 Answer:

{result.answer}

📚 Sources:
{chr(10).join(f"  {i}. {r.chunk.source_file}" for i, r in enumerate(result.results, 1))}

📊 Cost: ${result.answer_cost:.4f} | Tokens: {result.answer_tokens}
"""
        else:
            # Format search results only
            lines = [f"\n💭 Search Results for: '{query}'"]
            lines.append(f"📊 Found {len(result.results)} results\n")

            for i, search_result in enumerate(result.results, 1):
                chunk = search_result.chunk

                # Header
                lines.append(
                    f"{i}. {chunk.source_file} (score: {search_result.score:.2f})"
                )

                # Metadata
                meta_parts = []
                if chunk.work_id:
                    meta_parts.append(f"Work ID: {chunk.work_id}")
                if chunk.work_type:
                    meta_parts.append(f"Type: {chunk.work_type}")
                if chunk.status:
                    meta_parts.append(f"Status: {chunk.status}")
                if meta_parts:
                    lines.append(f"   {' | '.join(meta_parts)}")

                # Content preview
                preview = chunk.content[:300]
                if len(chunk.content) > 300:
                    preview += "..."
                lines.append(f"\n   {preview}\n")

            return "\n".join(lines)

    except Exception as e:
        print(f"⚠️  Query failed: {e}")
        return None


def get_enhancement_stats() -> Dict[str, Any]:
    """
    Get statistics about enhancement usage

    Returns:
        Dictionary with enhancement statistics
    """
    try:
        from ..core.vector_store import VectorStore

        vector_store = VectorStore()
        stats = vector_store.get_stats()

        config = get_config()

        return {
            "enabled": config.smart_enhancement_enabled,
            "total_chunks": stats.total_chunks,
            "total_work_items": stats.total_work_items,
            "last_indexed": stats.last_indexed,
            "enhance_create_work": config.enhance_create_work,
            "enhance_plan_work": config.enhance_plan_work,
            "enhance_complete_work": config.enhance_complete_work,
        }

    except:
        return {"enabled": False, "error": "Failed to load stats"}
