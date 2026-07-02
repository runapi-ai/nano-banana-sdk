# Nano Banana JavaScript SDK for RunAPI

The Nano Banana JavaScript SDK is the language-specific package for Nano Banana on RunAPI. Use this package for image generation, image editing, and creative production workflows when your application needs request bodies, task status lookup, and consistent RunAPI errors in JavaScript.

This README is the JavaScript package guide inside the public `nano-banana-sdk` repository. For the repository overview, start at `../README.md`; for model details, use https://runapi.ai/models/nano-banana; for API reference, use https://runapi.ai/docs#nano-banana; for SDK docs, use https://runapi.ai/docs#sdk-nano-banana.

## Install

```bash
npm install @runapi.ai/nano-banana
```

## Quick start

```typescript
import { NanoBananaClient } from '@runapi.ai/nano-banana';

const client = new NanoBananaClient();
const task = await client.textToImage.create({
  // Pass the Nano Banana JSON request body from https://runapi.ai/docs#nano-banana.
});
const status = await client.textToImage.get(task.id);
```

Use `create` when you want to submit a task and return quickly, `get` when you need the latest task state, and `run` when a script should create and poll until completion. In web request handlers, prefer `create` plus webhook or later `get` polling so a worker is not held open.

RunAPI-generated file URLs are temporary. Download and store generated images, videos, audio, or other files in your own durable storage within 7 days; do not treat returned URLs as long-term assets.

## Language notes

Use the TypeScript types in `src/types.ts` and the resource classes under `src/resources` when building image applications. The available resources are `textToImage` and `editImage`. Keep `RUNAPI_API_KEY` in the environment or your secret manager; never commit API keys or callback secrets.

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
