"""Nano Banana model lists, enums, and response models."""

from __future__ import annotations

from runapi.core import BaseModel, TaskResponse, optional, required


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
