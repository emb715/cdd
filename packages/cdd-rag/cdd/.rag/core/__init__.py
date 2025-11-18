"""
CDD-RAG Core Package
Provides semantic search and AI-powered context retrieval for CDD workspaces
"""

__version__ = "1.0.0"
__author__ = "EMB (Ezequiel M. Benitez)"

from .models import (
    DocumentType,
    WorkItemType,
    Document,
    Chunk,
    SearchResult,
    QueryResult,
    IndexStats,
)
from .config import load_config, get_config
from .embedder import Embedder
from .vector_store import VectorStore
from .query_engine import QueryEngine
from .llm_client import LLMClient

__all__ = [
    # Data models
    "DocumentType",
    "WorkItemType",
    "Document",
    "Chunk",
    "SearchResult",
    "QueryResult",
    "IndexStats",
    # Core components
    "load_config",
    "get_config",
    "Embedder",
    "VectorStore",
    "QueryEngine",
    "LLMClient",
]
