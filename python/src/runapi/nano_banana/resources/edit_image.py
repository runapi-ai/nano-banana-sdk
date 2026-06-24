"""Nano Banana image editing resource."""

from __future__ import annotations

from typing import Any, Dict

from runapi.core import Resource, ValidationError

from ..contract_gen import CONTRACT
from ..types import (
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
        self._validate_contract(CONTRACT["edit-image"], params)

        if not params.get("prompt"):
            raise ValidationError("prompt is required")
        if not params.get("source_image_urls"):
            raise ValidationError("source_image_urls is required")
