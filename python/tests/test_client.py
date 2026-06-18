import pytest

from runapi.core import config
from runapi.core.errors import AuthenticationError, ValidationError
from runapi.nano_banana import NanoBananaClient
from runapi.nano_banana.resources.edit_image import EditImage
from runapi.nano_banana.resources.text_to_image import TextToImage
from runapi.nano_banana.types import (
    CompletedEditImageResponse,
    CompletedTextToImageResponse,
    EditImageResponse,
    TextToImageResponse,
)


class FakeHttp:
    def __init__(self, *responses):
        self._responses = list(responses)
        self.calls = []

    def request(self, method, path, body=None, options=None):
        self.calls.append((method, path, body))
        if self._responses:
            return self._responses.pop(0)
        return {"id": "task_1", "status": "pending"}


@pytest.fixture(autouse=True)
def reset_config(monkeypatch):
    monkeypatch.delenv("RUNAPI_API_KEY", raising=False)
    monkeypatch.setattr(config, "api_key", None)
    yield


# --- auth -----------------------------------------------------------------


def test_accepts_api_key_parameter():
    assert isinstance(NanoBananaClient(api_key="k", http_client=FakeHttp()), NanoBananaClient)


def test_falls_back_to_global(monkeypatch):
    monkeypatch.setattr(config, "api_key", "global-key")
    assert isinstance(NanoBananaClient(http_client=FakeHttp()), NanoBananaClient)


def test_falls_back_to_env(monkeypatch):
    monkeypatch.setenv("RUNAPI_API_KEY", "env-key")
    assert isinstance(NanoBananaClient(http_client=FakeHttp()), NanoBananaClient)


def test_raises_without_api_key():
    with pytest.raises(AuthenticationError, match="API key is required"):
        NanoBananaClient()


# --- injection / accessors ------------------------------------------------


def test_uses_injected_http_client():
    fake = FakeHttp()
    client = NanoBananaClient(api_key="k", http_client=fake)
    assert client.text_to_image._http is fake
    assert client.edit_image._http is fake


def test_exposes_resource_accessors():
    client = NanoBananaClient(api_key="k", http_client=FakeHttp())
    assert isinstance(client.text_to_image, TextToImage)
    assert isinstance(client.edit_image, EditImage)


# --- request shapes -------------------------------------------------------


def test_create_posts_compacted_body():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = NanoBananaClient(api_key="k", http_client=fake)
    result = client.text_to_image.create(
        model="nano-banana", prompt="hello world", aspect_ratio="1:1", output_resolution=None
    )
    assert fake.calls == [
        ("post", "/api/v1/nano_banana/text_to_image", {"model": "nano-banana", "prompt": "hello world", "aspect_ratio": "1:1"}),
    ]
    assert isinstance(result, TextToImageResponse)


def test_get_fetches_by_id():
    fake = FakeHttp({"id": "t1", "status": "processing"})
    client = NanoBananaClient(api_key="k", http_client=fake)
    client.text_to_image.get("t1")
    assert fake.calls == [("get", "/api/v1/nano_banana/text_to_image/t1", None)]


def test_edit_create_posts_compacted_body():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = NanoBananaClient(api_key="k", http_client=fake)
    result = client.edit_image.create(
        model="nano-banana-edit",
        prompt="brighten it",
        source_image_urls=["https://x/a.png"],
    )
    assert fake.calls == [
        ("post", "/api/v1/nano_banana/edit_image", {"model": "nano-banana-edit", "prompt": "brighten it", "source_image_urls": ["https://x/a.png"]}),
    ]
    assert isinstance(result, EditImageResponse)


def test_run_narrows_completed_type():
    fake = FakeHttp(
        {"id": "t1", "status": "pending"},
        {"id": "t1", "status": "completed", "images": [{"url": "https://x/y.png"}]},
    )
    client = NanoBananaClient(api_key="k", http_client=fake)
    result = client.text_to_image.run(model="nano-banana", prompt="a serene lake")
    assert isinstance(result, CompletedTextToImageResponse)
    assert result.images[0].url == "https://x/y.png"


def test_edit_run_narrows_completed_type():
    fake = FakeHttp(
        {"id": "t1", "status": "pending"},
        {"id": "t1", "status": "completed", "images": [{"url": "https://x/z.png"}]},
    )
    client = NanoBananaClient(api_key="k", http_client=fake)
    result = client.edit_image.run(
        model="nano-banana-edit", prompt="brighten", source_image_urls=["https://x/a.png"]
    )
    assert isinstance(result, CompletedEditImageResponse)
    assert result.images[0].url == "https://x/z.png"


# --- validation -----------------------------------------------------------


def test_requires_model():
    client = NanoBananaClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="model is required"):
        client.text_to_image.create(prompt="hi there")


def test_requires_prompt():
    client = NanoBananaClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="prompt is required"):
        client.text_to_image.create(model="nano-banana")


def test_rejects_unknown_model():
    client = NanoBananaClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="Invalid model: nope"):
        client.text_to_image.create(model="nope", prompt="hi there")


def test_rejects_invalid_aspect_ratio():
    client = NanoBananaClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="Invalid aspect_ratio"):
        client.text_to_image.create(model="nano-banana", prompt="hi there", aspect_ratio="7:7")


def test_rejects_invalid_output_resolution():
    client = NanoBananaClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="Invalid output_resolution"):
        client.text_to_image.create(model="nano-banana", prompt="hi there", output_resolution="8k")


def test_edit_requires_source_image_urls():
    client = NanoBananaClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="source_image_urls is required"):
        client.edit_image.create(model="nano-banana-edit", prompt="brighten it")


def test_edit_rejects_unknown_model():
    client = NanoBananaClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="Invalid model"):
        client.edit_image.create(
            model="nano-banana", prompt="brighten it", source_image_urls=["https://x/a.png"]
        )
