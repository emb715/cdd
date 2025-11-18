"""
LLM client for AI-powered answers using OpenAI-compatible APIs
Works with OpenAI, Fuelix AI, and other compatible providers
Supports multiple models with cost tracking
"""

from typing import Optional, Dict, Any
from datetime import datetime
from openai import OpenAI

from .config import get_config
from .models import UsageStats, QueryResult


class LLMClient:
    """Client for LLM interactions via OpenAI-compatible API (works with Fuelix AI, OpenAI, etc.)"""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        """
        Initialize LLM client

        Args:
            api_key: OpenAI-compatible API key (uses config if None)
            model: Model name (uses config default if None)
        """
        self.config = get_config()

        self.api_key = api_key or self.config.openai_api_key
        self.api_base = self.config.openai_api_base
        self.default_model = model or self.config.default_model
        self.temperature = self.config.temperature
        self.system_prompt = self.config.system_prompt

        self._client = None

    def _get_client(self) -> OpenAI:
        """Get or create OpenAI client"""
        if self._client is None:
            if not self.api_key:
                raise ValueError(
                    "OPENAI_API_KEY not set. Add to .env or pass to LLMClient constructor."
                )

            self._client = OpenAI(api_key=self.api_key, base_url=self.api_base)

        return self._client

    def generate_answer(
        self,
        question: str,
        context: str,
        model: Optional[str] = None,
        temperature: Optional[float] = None,
    ) -> Dict[str, Any]:
        """
        Generate AI answer from context

        Args:
            question: User's question
            context: Retrieved context from search
            model: Model to use (uses default if None)
            temperature: Temperature setting (uses config if None)

        Returns:
            Dictionary with answer, model, tokens, and cost
        """
        model = model or self.default_model
        temperature = temperature if temperature is not None else self.temperature

        client = self._get_client()

        # Build messages
        messages = [
            {"role": "system", "content": self.system_prompt},
            {
                "role": "user",
                "content": f"# Context from CDD Documentation\n\n{context}\n\n# Question\n\n{question}\n\nPlease answer based on the context above. Cite sources when possible.",
            },
        ]

        try:
            # Call API
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=2000,  # Reasonable default for answers
            )

            # Extract results
            answer = response.choices[0].message.content
            tokens_in = response.usage.prompt_tokens
            tokens_out = response.usage.completion_tokens

            # Calculate cost
            model_config = self.config.get_model_config(model)
            if model_config:
                cost = (tokens_in / 1000 * model_config.cost_per_1k_input) + (
                    tokens_out / 1000 * model_config.cost_per_1k_output
                )
            else:
                # Fallback cost estimate
                cost = (tokens_in / 1000 * 0.0001) + (tokens_out / 1000 * 0.0003)

            # Check cost warning
            if self.config.enable_cost_tracking and cost > self.config.cost_warning_threshold:
                print(
                    f"\n⚠️  High cost query: ${cost:.4f} (threshold: ${self.config.cost_warning_threshold})"
                )

            return {
                "answer": answer,
                "model": model,
                "tokens_input": tokens_in,
                "tokens_output": tokens_out,
                "tokens_total": tokens_in + tokens_out,
                "cost": cost,
            }

        except Exception as e:
            raise RuntimeError(f"Failed to generate answer: {e}")

    def enhance_query_result(
        self, query_result: QueryResult, model: Optional[str] = None
    ) -> QueryResult:
        """
        Enhance a QueryResult with AI-generated answer

        Args:
            query_result: QueryResult from search
            model: Model to use (uses default if None)

        Returns:
            Enhanced QueryResult with answer
        """
        if not query_result.results:
            return query_result

        # Build context from results
        context_parts = []
        for i, result in enumerate(query_result.results, 1):
            chunk = result.chunk
            source = f"Source {i}: {chunk.source_file}"
            if chunk.work_id:
                source += f" (Work ID: {chunk.work_id})"
            context_parts.append(f"{source}\n{'-' * 40}\n{chunk.content}")

        context = "\n\n".join(context_parts)

        # Generate answer
        result = self.generate_answer(query_result.query, context, model)

        # Update query result
        query_result.answer = result["answer"]
        query_result.answer_model = result["model"]
        query_result.answer_tokens = result["tokens_total"]
        query_result.answer_cost = result["cost"]

        return query_result

    def track_usage(
        self, query: str, model: str, tokens_in: int, tokens_out: int, cost: float, search_time_ms: float
    ) -> UsageStats:
        """
        Track API usage for cost monitoring

        Args:
            query: The query that was asked
            model: Model used
            tokens_in: Input tokens
            tokens_out: Output tokens
            cost: Total cost in USD
            search_time_ms: Search time in milliseconds

        Returns:
            UsageStats object
        """
        return UsageStats(
            timestamp=datetime.now(),
            query=query,
            model=model,
            input_tokens=tokens_in,
            output_tokens=tokens_out,
            cost=cost,
            search_time_ms=search_time_ms,
        )

    def estimate_cost(self, tokens_in: int, tokens_out: int, model: Optional[str] = None) -> float:
        """
        Estimate cost for given token counts

        Args:
            tokens_in: Input tokens
            tokens_out: Output tokens
            model: Model name (uses default if None)

        Returns:
            Estimated cost in USD
        """
        model = model or self.default_model
        model_config = self.config.get_model_config(model)

        if model_config:
            return (tokens_in / 1000 * model_config.cost_per_1k_input) + (
                tokens_out / 1000 * model_config.cost_per_1k_output
            )

        # Fallback
        return (tokens_in / 1000 * 0.0001) + (tokens_out / 1000 * 0.0003)
