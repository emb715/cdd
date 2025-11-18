"""
CDD-RAG Hooks Package
Integration hooks for CDD commands
"""

__version__ = "1.0.0"

from .indexer import auto_index_work_item, index_work_item
from .enhancer import enhance_create_work, enhance_plan_work, enhance_complete_work
from .utils import is_rag_enabled, get_similar_work_items, format_context_for_ai

__all__ = [
    # Indexing hooks
    "auto_index_work_item",
    "index_work_item",
    # Enhancement hooks
    "enhance_create_work",
    "enhance_plan_work",
    "enhance_complete_work",
    # Utilities
    "is_rag_enabled",
    "get_similar_work_items",
    "format_context_for_ai",
]
