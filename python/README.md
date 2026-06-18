# Nano Banana Python SDK for RunAPI

The Nano Banana Python SDK is the language-specific package for Nano Banana on RunAPI. Use this nano banana package for text-to-image, image editing, and creative production flows when your application needs JSON request bodies, task status lookup, and consistent RunAPI errors in Python.

This nano banana README is the Python package guide inside the public `nano-banana-sdk` repository. For the repository overview, start at `../README.md`; for model details, use https://runapi.ai/models/nano-banana; for API reference, use https://runapi.ai/docs#nano-banana; for SDK docs, use https://runapi.ai/docs#sdk-nano-banana.

## Install

```bash
pip install runapi-nano-banana
```

## Quick start

```python
from runapi.nano_banana import NanoBananaClient

client = NanoBananaClient()  # reads RUNAPI_API_KEY, or pass api_key="sk-..."

task = client.text_to_image.create(
    model="nano-banana",
    prompt="A futuristic cityscape at night, cinematic",
    aspect_ratio="16:9",
    output_resolution="2k",
)
status = client.text_to_image.get(task.id)

edit = client.edit_image.create(
    model="nano-banana-edit",
    prompt="Make it golden hour",
    source_image_urls=["https://example.com/source.jpg"],
)
```

Use `create` when you want to submit a task and return quickly, `get` when you need the latest task state, and `run` when a script should create and poll until completion:

```python
result = client.text_to_image.run(
    model="nano-banana",
    prompt="A serene mountain lake at dawn",
)
print(result.images[0].url)
```

In web request handlers, prefer `create` plus webhook or later `get` polling so a worker is not held open.

RunAPI-generated file URLs are temporary. Download and store generated images, videos, audio, or other files in your own durable storage within 7 days; do not treat returned URLs as long-term assets.

## Language notes

Pass parameters as keyword arguments and catch the `runapi.nano_banana` error classes when building image jobs, workers, or scripts. The available resources are `text_to_image` and `edit_image`. Keep `RUNAPI_API_KEY` in the environment or your secret manager; never commit API keys or callback secrets.

## Links

- Model page: https://runapi.ai/models/nano-banana
- SDK docs: https://runapi.ai/docs#sdk-nano-banana
- Product docs: https://runapi.ai/docs#nano-banana
- Pricing and rate limits: https://runapi.ai/models/nano-banana/nano-banana
- Provider comparison: https://runapi.ai/providers/google
- Full catalog: https://runapi.ai/models
- Repository: https://github.com/runapi-ai/nano-banana-sdk

## License

Licensed under the Apache License, Version 2.0.
