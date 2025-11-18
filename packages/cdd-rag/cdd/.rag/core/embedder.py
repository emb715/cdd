"""
Local embedding generation using sentence-transformers
100% local, no API calls required
"""

from typing import List, Union
from sentence_transformers import SentenceTransformer
import numpy as np

from .config import get_config


class Embedder:
    """Handles text embedding generation"""

    def __init__(self, model_name: str = None, cache_dir: str = None):
        """
        Initialize embedder with specified model

        Args:
            model_name: Name of sentence-transformer model
            cache_dir: Directory to cache models
        """
        config = get_config()

        self.model_name = model_name or config.embedding_model
        self.cache_dir = cache_dir or str(config.embedding_cache_dir)
        self.batch_size = config.embedding_batch_size

        self._model = None
        self._embedding_dim = None

    def _load_model(self):
        """Lazy load the embedding model"""
        if self._model is None:
            print(f"📥 Loading embedding model: {self.model_name}")
            print(f"   (First run downloads ~80MB, then cached)")

            self._model = SentenceTransformer(
                self.model_name, cache_folder=self.cache_dir
            )
            self._embedding_dim = self._model.get_sentence_embedding_dimension()

            print(f"✅ Model loaded! Dimension: {self._embedding_dim}")

    def embed(self, texts: Union[str, List[str]]) -> Union[List[float], List[List[float]]]:
        """
        Generate embeddings for text(s)

        Args:
            texts: Single text or list of texts

        Returns:
            Single embedding or list of embeddings
        """
        self._load_model()

        # Handle single string
        if isinstance(texts, str):
            embedding = self._model.encode([texts], batch_size=1)[0]
            return embedding.tolist()

        # Handle list of strings
        if not texts:
            return []

        embeddings = self._model.encode(
            texts, batch_size=self.batch_size, show_progress_bar=len(texts) > 10
        )

        return embeddings.tolist()

    def embed_batch(
        self, texts: List[str], show_progress: bool = False
    ) -> List[List[float]]:
        """
        Generate embeddings for a batch of texts

        Args:
            texts: List of texts to embed
            show_progress: Show progress bar

        Returns:
            List of embeddings
        """
        if not texts:
            return []

        self._load_model()

        embeddings = self._model.encode(
            texts, batch_size=self.batch_size, show_progress_bar=show_progress
        )

        return embeddings.tolist()

    def similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """
        Calculate cosine similarity between two embeddings

        Args:
            embedding1: First embedding
            embedding2: Second embedding

        Returns:
            Similarity score (0-1, higher = more similar)
        """
        # Convert to numpy arrays
        vec1 = np.array(embedding1)
        vec2 = np.array(embedding2)

        # Cosine similarity
        similarity = np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

        return float(similarity)

    @property
    def embedding_dimension(self) -> int:
        """Get embedding dimension"""
        if self._embedding_dim is None:
            self._load_model()
        return self._embedding_dim

    def is_loaded(self) -> bool:
        """Check if model is loaded"""
        return self._model is not None
