# Nano Banana Ruby SDK for RunAPI

The Nano Banana Ruby SDK is the language-specific package for Nano Banana on RunAPI. Use this package for image generation, image editing, and creative production workflows when your application needs request bodies, task status lookup, and consistent RunAPI errors in Ruby.

This README is the Ruby package guide inside the public `nano-banana-sdk` repository. For the repository overview, start at `../README.md`; for model details, use https://runapi.ai/models/nano-banana; for API reference, use https://runapi.ai/docs#nano-banana; for SDK docs, use https://runapi.ai/docs#sdk-nano-banana.

## Install

```bash
gem install runapi-nano_banana
```

## Quick start

```ruby
require "runapi-nano_banana"

client = RunApi::NanoBanana::Client.new
task = client.text_to_image.create(
  # Pass the Nano Banana JSON request body from https://runapi.ai/docs#nano-banana.
)
status = client.text_to_image.get(task.id)
```

Use `create` when you want to submit a task and return quickly, `get` when you need the latest task state, and `run` when a script should create and poll until completion. In web request handlers, prefer `create` plus webhook or later `get` polling so a worker is not held open.

RunAPI-generated file URLs are temporary. Download and store generated images, videos, audio, or other files in your own durable storage within 7 days; do not treat returned URLs as long-term assets.

## Language notes

Use Ruby keyword arguments and the `RunApi::NanoBanana` error classes when building image jobs, Rails workers, or scripts. The available resources are `text_to_image` and `edit_image`. Keep `RUNAPI_API_KEY` in the environment or your secret manager; never commit API keys or callback secrets.

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
