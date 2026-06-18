"""Nano Banana model lists, enums, and response models."""

from __future__ import annotations

from runapi.core import BaseModel, TaskResponse, optional, required

GENERATION_MODELS = ["nano-banana", "nano-banana-pro", "nano-banana-2"]
EDIT_MODELS = ["nano-banana-edit"]

BASE_ASPECT_RATIOS = ["1:1", "9:16", "16:9", "3:4", "4:3", "3:2", "2:3", "5:4", "4:5", "21:9", "auto"]
ASPECT_RATIOS = ["1:1", "1:4", "1:8", "2:3", "3:2", "3:4", "4:1", "4:3", "4:5", "5:4", "8:1", "9:16", "16:9", "21:9", "auto"]
OUTPUT_RESOLUTIONS = ["1k", "2k", "4k"]
OUTPUT_FORMATS = ["png", "jpg", "jpeg"]


class Image(BaseModel):
    """A generated image reference."""

    url = optional(str)
    origin_url = optional(str)


class AsyncTaskResponse(TaskResponse):
    """Base response for an asynchronous task."""

    id = required(str)
    status = optional(str, enum=lambda: TaskResponse.Status.ALL)


class TextToImageResponse(AsyncTaskResponse):
    """Response for a text-to-image task."""

    images = optional([lambda: Image])


class EditImageResponse(AsyncTaskResponse):
    """Response for an edit-image task."""

    images = optional([lambda: Image])


class CompletedTextToImageResponse(TextToImageResponse):
    """Narrowed response from ``run()`` once polling observes completion.

    ``images`` is required so consumers never have to null-check it on a
    successful task.
    """

    images = required([lambda: Image])


class CompletedEditImageResponse(EditImageResponse):
    """Narrowed response from ``run()`` once polling observes completion."""

    images = required([lambda: Image])
