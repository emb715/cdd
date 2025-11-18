"""
Data models for RAG-CDD system
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Dict, List, Optional, Any


class DocumentType(Enum):
    """Types of CDD documents"""

    # Standard artifacts (all modes)
    DECISIONS = "DECISIONS"
    SESSION_NOTES = "SESSION_NOTES"
    IMPLEMENTATION_PLAN = "IMPLEMENTATION_PLAN"
    IMPLEMENTATION_SUMMARY = "IMPLEMENTATION_SUMMARY"

    # Comprehensive mode modular artifacts
    PROBLEM_BRIEF = "PROBLEM_BRIEF"
    TECHNICAL_RFC = "TECHNICAL_RFC"
    RISK_REGISTER = "RISK_REGISTER"
    VALIDATION_PLAN = "VALIDATION_PLAN"

    # Meta documents
    PRD = "PRD"
    README = "README"
    TEMPLATE = "TEMPLATE"
    META = "META"
    UNKNOWN = "UNKNOWN"

    @classmethod
    def from_filename(cls, filename: str) -> "DocumentType":
        """Detect document type from filename"""
        filename_upper = filename.upper()

        # Comprehensive mode artifacts (check first for specificity)
        if "PROBLEM_BRIEF" in filename_upper:
            return cls.PROBLEM_BRIEF
        elif "TECHNICAL_RFC" in filename_upper or ("RFC" in filename_upper and "TECHNICAL" in filename_upper):
            return cls.TECHNICAL_RFC
        elif "RISK_REGISTER" in filename_upper or ("RISK" in filename_upper and "REGISTER" in filename_upper):
            return cls.RISK_REGISTER
        elif "VALIDATION_PLAN" in filename_upper or ("VALIDATION" in filename_upper and "PLAN" in filename_upper):
            return cls.VALIDATION_PLAN

        # Standard artifacts
        elif "DECISIONS" in filename_upper:
            return cls.DECISIONS
        elif "SESSION_NOTES" in filename_upper or "SESSION" in filename_upper:
            return cls.SESSION_NOTES
        elif "IMPLEMENTATION_PLAN" in filename_upper:
            return cls.IMPLEMENTATION_PLAN
        elif "IMPLEMENTATION_SUMMARY" in filename_upper:
            return cls.IMPLEMENTATION_SUMMARY

        # Meta documents
        elif "PRD" in filename_upper:
            return cls.PRD
        elif "README" in filename_upper:
            return cls.README
        elif "TEMPLATE" in filename_upper or ".meta" in filename:
            return cls.TEMPLATE

        return cls.UNKNOWN


class WorkItemType(Enum):
    """CDD work item types"""

    FEATURE = "feature"
    BUG = "bug"
    REFACTOR = "refactor"
    DOCS = "docs"
    CHORE = "chore"
    SPIKE = "spike"
    EPIC = "epic"
    UNKNOWN = "unknown"


class WorkItemStatus(Enum):
    """CDD work item statuses"""

    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ARCHIVED = "archived"
    UNKNOWN = "unknown"


class TemplateMode(Enum):
    """CDD template modes"""

    SOLO_DEV = "solo-dev"
    MINIMAL = "minimal"
    COMPREHENSIVE = "comprehensive"
    UNKNOWN = "unknown"

    @classmethod
    def from_string(cls, mode: str) -> "TemplateMode":
        """Parse template mode from frontmatter"""
        if not mode:
            return cls.UNKNOWN

        mode_lower = mode.lower().replace("_", "-")
        for tm in cls:
            if tm.value == mode_lower:
                return tm
        return cls.UNKNOWN


class ArtifactDomain(Enum):
    """Artifact classification by domain"""

    PRODUCT = "product"          # PROBLEM_BRIEF, PRD
    ENGINEERING = "engineering"  # TECHNICAL_RFC, IMPLEMENTATION_PLAN
    RISK = "risk"               # RISK_REGISTER
    QA = "qa"                   # VALIDATION_PLAN
    PROGRESS = "progress"       # SESSION_NOTES, IMPLEMENTATION_SUMMARY
    GENERAL = "general"         # DECISIONS
    META = "meta"              # Templates, README

    @classmethod
    def from_document_type(cls, doc_type: DocumentType) -> "ArtifactDomain":
        """Map document type to domain"""
        mapping = {
            DocumentType.PROBLEM_BRIEF: cls.PRODUCT,
            DocumentType.PRD: cls.PRODUCT,
            DocumentType.TECHNICAL_RFC: cls.ENGINEERING,
            DocumentType.IMPLEMENTATION_PLAN: cls.ENGINEERING,
            DocumentType.RISK_REGISTER: cls.RISK,
            DocumentType.VALIDATION_PLAN: cls.QA,
            DocumentType.SESSION_NOTES: cls.PROGRESS,
            DocumentType.IMPLEMENTATION_SUMMARY: cls.PROGRESS,
            DocumentType.DECISIONS: cls.GENERAL,
            DocumentType.README: cls.META,
            DocumentType.TEMPLATE: cls.META,
            DocumentType.META: cls.META,
        }
        return mapping.get(doc_type, cls.GENERAL)


@dataclass
class Document:
    """Represents a document to be indexed"""

    path: Path
    content: str
    doc_type: DocumentType
    metadata: Dict[str, Any] = field(default_factory=dict)

    # Extracted from frontmatter
    work_id: Optional[str] = None
    title: Optional[str] = None
    work_type: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    tags: List[str] = field(default_factory=list)

    # File metadata
    created_at: Optional[datetime] = None
    modified_at: Optional[datetime] = None
    file_size: int = 0

    def __post_init__(self):
        """Convert path to Path object if it's a string"""
        if isinstance(self.path, str):
            self.path = Path(self.path)


@dataclass
class Chunk:
    """A chunk of a document for indexing"""

    id: str  # Unique identifier
    content: str  # Text content
    embedding: Optional[List[float]] = None  # Vector representation

    # Source information
    source_file: str = ""
    work_id: Optional[str] = None
    document_type: Optional[str] = None

    # Section information
    section: Optional[str] = None
    section_path: Optional[str] = None  # e.g., "Work Item 0001 > Solution"

    # Chunk metadata
    chunk_index: int = 0
    total_chunks: int = 1

    # Work item metadata (from frontmatter)
    title: Optional[str] = None
    work_type: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    template_mode: Optional[str] = None  # "solo-dev", "minimal", "comprehensive"
    artifact_domain: Optional[str] = None  # "product", "engineering", "risk", "qa", "progress"

    # Indexing metadata
    indexed_at: Optional[datetime] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for storage"""
        return {
            "id": self.id,
            "content": self.content,
            "source_file": self.source_file,
            "work_id": self.work_id,
            "document_type": self.document_type,
            "section": self.section,
            "section_path": self.section_path,
            "chunk_index": self.chunk_index,
            "total_chunks": self.total_chunks,
            "title": self.title,
            "work_type": self.work_type,
            "priority": self.priority,
            "status": self.status,
            "tags": self.tags,
            "template_mode": self.template_mode,
            "artifact_domain": self.artifact_domain,
            "indexed_at": self.indexed_at.isoformat() if self.indexed_at else None,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Chunk":
        """Create from dictionary"""
        # Convert datetime strings back to datetime
        if data.get("indexed_at"):
            try:
                data["indexed_at"] = datetime.fromisoformat(data["indexed_at"])
            except (ValueError, TypeError):
                data["indexed_at"] = None

        # Remove embedding if present (handled separately)
        data.pop("embedding", None)

        return cls(**data)


@dataclass
class SearchResult:
    """A single search result"""

    chunk: Chunk
    distance: float  # Similarity distance (lower = more similar for cosine)
    score: float  # Relevance score (0-1, higher = more relevant)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def similarity(self) -> float:
        """Get similarity score (0-1, higher = more similar)"""
        # Convert distance to similarity (for cosine distance)
        return 1 - self.distance


@dataclass
class QueryResult:
    """Complete query result"""

    query: str
    results: List[SearchResult]
    total_results: int
    search_time_ms: float

    # Optional AI-generated answer
    answer: Optional[str] = None
    answer_model: Optional[str] = None
    answer_tokens: Optional[int] = None
    answer_cost: Optional[float] = None

    def get_top_k(self, k: int) -> List[SearchResult]:
        """Get top K results"""
        return self.results[:k]

    def filter_by_score(self, min_score: float) -> List[SearchResult]:
        """Filter results by minimum relevance score"""
        return [r for r in self.results if r.score >= min_score]

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "query": self.query,
            "results": [
                {
                    "content": r.chunk.content[:200] + "..."
                    if len(r.chunk.content) > 200
                    else r.chunk.content,
                    "source": r.chunk.source_file,
                    "section": r.chunk.section,
                    "score": round(r.score, 3),
                    "work_id": r.chunk.work_id,
                    "work_type": r.chunk.work_type,
                    "status": r.chunk.status,
                }
                for r in self.results
            ],
            "total_results": self.total_results,
            "search_time_ms": round(self.search_time_ms, 2),
            "answer": self.answer,
            "answer_model": self.answer_model,
            "answer_tokens": self.answer_tokens,
            "answer_cost": self.answer_cost,
        }


@dataclass
class IndexStats:
    """Statistics about the indexed knowledge base"""

    total_documents: int = 0
    total_chunks: int = 0
    total_work_items: int = 0

    by_type: Dict[str, int] = field(default_factory=dict)
    by_status: Dict[str, int] = field(default_factory=dict)
    by_priority: Dict[str, int] = field(default_factory=dict)

    last_indexed: Optional[datetime] = None
    index_size_mb: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "total_documents": self.total_documents,
            "total_chunks": self.total_chunks,
            "total_work_items": self.total_work_items,
            "by_type": self.by_type,
            "by_status": self.by_status,
            "by_priority": self.by_priority,
            "last_indexed": self.last_indexed.isoformat()
            if self.last_indexed
            else None,
            "index_size_mb": round(self.index_size_mb, 2),
        }


@dataclass
class UsageStats:
    """Track API usage and costs"""

    timestamp: datetime
    query: str
    model: str
    input_tokens: int
    output_tokens: int
    cost: float
    search_time_ms: float
    metadata: Dict[str, Any] = field(default_factory=dict)
