"""Nano Banana image editing resource."""

from __future__ import annotations

from typing import Any, Dict

from runapi.core import Resource, ValidationError

from ..types import (
    BASE_ASPECT_RATIOS,
    EDIT_MODELS,
    OUTPUT_FORMATS,
    CompletedEditImageResponse,
    EditImageResponse,
)


class EditImage(Resource):
    """Edit existing images using text prompts and reference images."""

    ENDPOINT = "/api/v1/nano_banana/edit_image"

    RESPONSE_CLASS = EditImageResponse
    COMPLETED_RESPONSE_CLASS = CompletedEditImageResponse

    def run(self, **params: Any) -> Any:
        """Create an edit-image task and poll until it completes.

        Args:
            **params: Edit-image parameters (model, prompt, source_image_urls, ...).

        Returns:
            The completed (narrowed) response.
        """
        task = self.create(**params)
        return self._poll_until_complete(lambda: self.get(task.id))

    def create(self, **params: Any) -> Any:
        """Create an edit-image task and return immediately with an ``id``.

        Args:
            **params: Edit-image parameters (model, prompt, source_image_urls, ...).

        Returns:
            The task creation result with an id.
        """
        compacted = self._compact_params(params)
        self._validate_params(compacted)
        return self._request("post", self.ENDPOINT, body=compacted)

    def get(self, id: str) -> Any:
        """Fetch the current status of an edit-image task.

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
        if not params.get("source_image_urls"):
            raise ValidationError("source_image_urls is required")

        model = params.get("model")
        if model not in EDIT_MODELS:
            raise ValidationError(f"Invalid model: {model}. Must be one of: {', '.join(EDIT_MODELS)}")

        self._validate_optional(params, "output_format", OUTPUT_FORMATS)
        self._validate_optional(params, "aspect_ratio", BASE_ASPECT_RATIOS)
