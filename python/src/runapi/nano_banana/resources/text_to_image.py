"""Nano Banana text-to-image resource."""

from __future__ import annotations

from typing import Any, Dict

from runapi.core import Resource, ValidationError

from ..types import (
    ASPECT_RATIOS,
    GENERATION_MODELS,
    OUTPUT_FORMATS,
    OUTPUT_RESOLUTIONS,
    CompletedTextToImageResponse,
    TextToImageResponse,
)


class TextToImage(Resource):
    """Generate images from text prompts with various models and options."""

    ENDPOINT = "/api/v1/nano_banana/text_to_image"

    RESPONSE_CLASS = TextToImageResponse
    COMPLETED_RESPONSE_CLASS = CompletedTextToImageResponse

    def run(self, **params: Any) -> Any:
        """Create a text-to-image task and poll until it completes.

        Args:
            **params: Text-to-image parameters (model, prompt, ...).

        Returns:
            The completed (narrowed) response.
        """
        task = self.create(**params)
        return self._poll_until_complete(lambda: self.get(task.id))

    def create(self, **params: Any) -> Any:
        """Create a text-to-image task and return immediately with an ``id``.

        Args:
            **params: Text-to-image parameters (model, prompt, ...).

        Returns:
            The task creation result with an id.
        """
        compacted = self._compact_params(params)
        self._validate_params(compacted)
        return self._request("post", self.ENDPOINT, body=compacted)

    def get(self, id: str) -> Any:
        """Fetch the current status of a text-to-image task.

        Args:
            id: The task id.

        Returns:
            The current status.
        """
        return self._request("get", f"{self.ENDPOINT}/{id}")

    def _validate_params(self, params: Dict[str, Any]) -> None:
        if not params.get("model"):
            raise ValidationError("model is required")
        if not params.get("prompt"):
            raise ValidationError("prompt is required")

        model = params.get("model")
        if model not in GENERATION_MODELS:
            raise ValidationError(f"Invalid model: {model}. Must be one of: {', '.join(GENERATION_MODELS)}")

        self._validate_optional(params, "aspect_ratio", ASPECT_RATIOS)
        self._validate_optional(params, "output_resolution", OUTPUT_RESOLUTIONS)
        self._validate_optional(params, "output_format", OUTPUT_FORMATS)
