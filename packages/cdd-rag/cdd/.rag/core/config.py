"""
Configuration management for RAG-CDD system
Loads from config.yaml and .env files
"""

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Any, Optional, List
import yaml
from dotenv import load_dotenv

# Load environment variables from .env
_env_path = Path(__file__).parent.parent / ".env"
if _env_path.exists():
    load_dotenv(_env_path)


@dataclass
class ModelConfig:
    """Configuration for an LLM model"""

    name: str
    provider: str
    context_window: int
    cost_per_1k_input: float
    cost_per_1k_output: float
    best_for: str
    max_tokens: int = 2000


# Pre-configured LLM models (OpenAI-compatible, works with Fuelix AI, OpenAI, etc.)
AVAILABLE_MODELS = {
    # OpenAI Models
    "gpt-4o": ModelConfig(
        name="gpt-4o",
        provider="openai",
        context_window=128000,
        cost_per_1k_input=0.005,
        cost_per_1k_output=0.015,
        best_for="Complex reasoning, code generation",
        max_tokens=4096,
    ),
    "gpt-4o-mini": ModelConfig(
        name="gpt-4o-mini",
        provider="openai",
        context_window=128000,
        cost_per_1k_input=0.00015,
        cost_per_1k_output=0.0006,
        best_for="Fast, cost-effective queries",
        max_tokens=16384,
    ),
    "gpt-3.5-turbo": ModelConfig(
        name="gpt-3.5-turbo",
        provider="openai",
        context_window=16385,
        cost_per_1k_input=0.0005,
        cost_per_1k_output=0.0015,
        best_for="Simple queries, very fast",
        max_tokens=4096,
    ),
    # Anthropic Claude
    "claude-3-opus": ModelConfig(
        name="claude-3-opus-20240229",
        provider="anthropic",
        context_window=200000,
        cost_per_1k_input=0.015,
        cost_per_1k_output=0.075,
        best_for="Highest quality, deep analysis",
        max_tokens=4096,
    ),
    "claude-3-sonnet": ModelConfig(
        name="claude-3-sonnet-20240229",
        provider="anthropic",
        context_window=200000,
        cost_per_1k_input=0.003,
        cost_per_1k_output=0.015,
        best_for="Balanced quality and speed",
        max_tokens=4096,
    ),
    "claude-3-haiku": ModelConfig(
        name="claude-3-haiku-20240307",
        provider="anthropic",
        context_window=200000,
        cost_per_1k_input=0.00025,
        cost_per_1k_output=0.00125,
        best_for="Fast, economical responses",
        max_tokens=4096,
    ),
    # Meta Llama
    "llama-3-70b": ModelConfig(
        name="meta-llama/llama-3-70b-instruct",
        provider="meta",
        context_window=8192,
        cost_per_1k_input=0.0007,
        cost_per_1k_output=0.0009,
        best_for="Open source, good performance",
        max_tokens=2048,
    ),
    "llama-3-8b": ModelConfig(
        name="meta-llama/llama-3-8b-instruct",
        provider="meta",
        context_window=8192,
        cost_per_1k_input=0.0002,
        cost_per_1k_output=0.0002,
        best_for="Very fast, economical",
        max_tokens=2048,
    ),
}


class Config:
    """Main configuration for RAG-CDD"""

    def __init__(self, config_path: Optional[Path] = None):
        """
        Initialize configuration from YAML file and environment variables

        Args:
            config_path: Path to config.yaml (defaults to ../config.yaml)
        """
        if config_path is None:
            config_path = Path(__file__).parent.parent / "config.yaml"

        self.config_path = config_path
        self._config_data = {}

        # Load YAML configuration
        if config_path.exists():
            with open(config_path, "r") as f:
                self._config_data = yaml.safe_load(f) or {}

        # Extract configuration sections
        self._load_all_config()

    def _load_all_config(self):
        """Load all configuration sections"""
        # Operation mode
        self.mode = self._get("mode", "hybrid")

        # Workspace
        workspace_path = self._get("workspace_path", "../")
        self.workspace_path = (
            Path(__file__).parent.parent / workspace_path
        ).resolve()

        # Smart enhancement
        smart_enh = self._get("smart_enhancement", {})
        self.smart_enhancement_enabled = smart_enh.get("enabled", True)
        self.enhance_create_work = smart_enh.get("enhance_create_work", True)
        self.enhance_plan_work = smart_enh.get("enhance_plan_work", True)
        self.enhance_complete_work = smart_enh.get("enhance_complete_work", True)
        self.enhance_save_session = smart_enh.get("enhance_save_session", False)
        self.min_score = smart_enh.get("min_score", 0.7)
        self.max_chunks = smart_enh.get("max_chunks", 5)
        self.cite_sources = smart_enh.get("cite_sources", True)
        self.verbose = smart_enh.get("verbose", False)

        # Auto-indexing
        auto_idx = self._get("auto_index", {})
        self.auto_index_on_complete = auto_idx.get("on_complete", True)
        self.auto_index_async = auto_idx.get("async", True)
        self.auto_index_notify = auto_idx.get("notify", True)
        self.index_summary_only = auto_idx.get("summary_only", False)
        self.incremental_indexing = auto_idx.get("incremental", True)

        # Query settings
        query_cfg = self._get("query", {})
        self.default_results = query_cfg.get("default_results", 5)
        self.min_similarity = query_cfg.get("min_similarity", 0.3)
        self.enable_reranking = query_cfg.get("enable_reranking", True)
        self.max_context_tokens = query_cfg.get("max_context_tokens", 3000)

        # Chunking
        chunking = self._get("chunking", {})
        self.chunk_size = chunking.get("chunk_size", 800)
        self.chunk_overlap = chunking.get("overlap", 100)
        self.respect_sections = chunking.get("respect_sections", True)
        self.min_chunk_size = chunking.get("min_chunk_size", 100)

        # Embedding
        embedding = self._get("embedding", {})
        self.embedding_model = embedding.get("model", "all-MiniLM-L6-v2")
        self.embedding_batch_size = embedding.get("batch_size", 32)
        cache_dir = embedding.get("cache_dir", "./models")
        self.embedding_cache_dir = (
            Path(__file__).parent.parent / cache_dir
        ).resolve()

        # Storage
        storage = self._get("storage", {})
        persist_dir = storage.get("persist_dir", "./.chroma")
        self.persist_dir = (Path(__file__).parent.parent / persist_dir).resolve()
        self.collection_name = storage.get("collection_name", "cdd_knowledge")
        self.distance_metric = storage.get("distance_metric", "cosine")

        # Privacy & Security
        self.exclude_patterns = self._get("exclude_patterns", [])
        self.sanitize_content = self._get("sanitize_content", True)

        # LLM integration
        llm_cfg = self._get("llm", {})
        self.default_model = llm_cfg.get("default_model", "gpt-4o-mini")
        self.llm_models = llm_cfg.get("models", {})
        self.temperature = llm_cfg.get("temperature", 0.7)
        self.system_prompt = llm_cfg.get(
            "system_prompt",
            "You are a helpful CDD assistant with deep knowledge of this project.",
        )

        # From environment (.env)
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "")
        self.openai_api_base = os.getenv(
            "OPENAI_API_BASE", "https://api.fuelix.ai/v1"
        )

        # Local LLM
        self.use_local_llm = os.getenv("USE_LOCAL_LLM", "false").lower() == "true"
        self.local_model = os.getenv("LOCAL_MODEL", "llama3")
        self.ollama_api_base = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")

        # Cost management
        cost_cfg = self._get("cost", {})
        self.enable_cost_tracking = cost_cfg.get("enable_tracking", True)
        self.cost_warning_threshold = cost_cfg.get("warning_threshold", 0.01)
        self.monthly_budget = cost_cfg.get("monthly_budget", 10.0)
        self.auto_switch_cheap = cost_cfg.get("auto_switch_cheap", True)

        # Performance
        perf_cfg = self._get("performance", {})
        self.enable_cache = perf_cfg.get("enable_cache", True)
        self.cache_size = perf_cfg.get("cache_size", 100)
        self.cache_ttl = perf_cfg.get("cache_ttl", 3600)
        self.num_workers = perf_cfg.get("num_workers", 4)
        self.batch_processing = perf_cfg.get("batch_processing", True)

        # CDD-specific
        cdd_cfg = self._get("cdd", {})
        self.type_weights = cdd_cfg.get(
            "type_weights",
            {
                "DECISIONS": 1.2,
                "IMPLEMENTATION_SUMMARY": 1.1,
                "SESSION_NOTES": 0.9,
                "IMPLEMENTATION_PLAN": 1.0,
            },
        )
        self.status_weights = cdd_cfg.get(
            "status_weights",
            {"completed": 1.1, "in_progress": 1.0, "draft": 0.8},
        )
        self.index_relationships = cdd_cfg.get("index_relationships", True)
        self.metadata_fields = cdd_cfg.get(
            "metadata_fields",
            [
                "id",
                "title",
                "type",
                "status",
                "priority",
                "tags",
                "context_files",
                "dependencies",
            ],
        )

        # Logging
        logging_cfg = self._get("logging", {})
        self.log_level = logging_cfg.get("level", "INFO")
        log_file = logging_cfg.get("file", "./logs/rag.log")
        self.log_file = (Path(__file__).parent.parent / log_file).resolve()
        self.max_log_size_mb = logging_cfg.get("max_size_mb", 10)
        self.log_backup_count = logging_cfg.get("backup_count", 3)

        # Advanced
        advanced = self._get("advanced", {})
        self.hnsw_space = advanced.get("hnsw_space", "cosine")
        self.hnsw_ef_construction = advanced.get("hnsw_ef_construction", 100)
        self.hnsw_ef_search = advanced.get("hnsw_ef_search", 10)
        self.hnsw_m = advanced.get("hnsw_m", 16)
        self.embedding_timeout = advanced.get("embedding_timeout", 300)
        self.llm_timeout = advanced.get("llm_timeout", 60)
        self.index_timeout = advanced.get("index_timeout", 600)

        # Experimental
        experimental = self._get("experimental", {})
        self.experimental_enabled = experimental.get("enabled", False)

        # Ensure directories exist
        self._ensure_directories()

    def _get(self, key: str, default: Any = None) -> Any:
        """Get value from config with default"""
        return self._config_data.get(key, default)

    def _ensure_directories(self):
        """Ensure required directories exist"""
        self.persist_dir.mkdir(parents=True, exist_ok=True)
        self.embedding_cache_dir.mkdir(parents=True, exist_ok=True)
        self.log_file.parent.mkdir(parents=True, exist_ok=True)

    def get_model_config(
        self, model_name: Optional[str] = None
    ) -> Optional[ModelConfig]:
        """Get configuration for a specific model"""
        model_name = model_name or self.default_model
        return AVAILABLE_MODELS.get(model_name)

    def list_models(self, provider: Optional[str] = None) -> Dict[str, ModelConfig]:
        """List available models, optionally filtered by provider"""
        if provider:
            return {
                k: v for k, v in AVAILABLE_MODELS.items() if v.provider == provider
            }
        return AVAILABLE_MODELS

    def get_model_for_task(self, task: str) -> str:
        """Get recommended model for specific task from config"""
        return self.llm_models.get(task, self.default_model)

    def validate(self) -> List[str]:
        """Validate configuration and return warnings/errors"""
        warnings = []

        # Check workspace
        if not self.workspace_path.exists():
            warnings.append(
                f"⚠️  Workspace not found: {self.workspace_path}\n"
                f"    Update 'workspace_path' in {self.config_path}"
            )

        # Check API key if using AI features
        if self.mode in ["hybrid", "cloud"] and not self.openai_api_key:
            if not self.use_local_llm:
                warnings.append(
                    "⚠️  OPENAI_API_KEY not set. AI features will not work.\n"
                    "    Add OPENAI_API_KEY to .env or set USE_LOCAL_LLM=true"
                )

        # Check local LLM
        if self.use_local_llm:
            warnings.append(
                "ℹ️  Using local LLM (Ollama). Ensure Ollama is running:\n"
                f"    {self.ollama_api_base}"
            )

        return warnings

    def to_dict(self) -> Dict[str, Any]:
        """Export current config as dictionary"""
        return {
            "mode": self.mode,
            "workspace_path": str(self.workspace_path),
            "embedding_model": self.embedding_model,
            "default_model": self.default_model,
            "collection_name": self.collection_name,
            "chunk_size": self.chunk_size,
            "default_results": self.default_results,
            # Add more as needed
        }


# Global config instance
_global_config: Optional[Config] = None


def load_config(config_path: Optional[Path] = None) -> Config:
    """Load or reload configuration"""
    global _global_config
    _global_config = Config(config_path)
    return _global_config


def get_config() -> Config:
    """Get global config instance, loading if needed"""
    global _global_config
    if _global_config is None:
        _global_config = load_config()
    return _global_config
