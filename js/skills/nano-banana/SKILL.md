---
name: nano-banana
description: Generate and edit images (Nano Banana base / pro text-to-image and image-to-image, Nano Banana Edit) through RunAPI.ai using the @runapi.ai/nano-banana Node/TypeScript SDK. Use when the user asks to add Nano Banana image generation or editing, or writes against @runapi.ai/nano-banana. Triggers on "nano banana", "nano-banana", "image generation", "image edit", "生成图片", "图片编辑", "@runapi.ai/nano-banana".
documentation: https://runapi.ai/models/nano-banana
provider_page: https://runapi.ai/providers/google
catalog: https://runapi.ai/models
---
# @runapi.ai/nano-banana — RunAPI.ai Nano Banana image generation

Build Node / TypeScript integrations that generate and edit images through RunAPI.ai.

## Setup

Requires **Node 18+** (global `fetch`).

```bash
npm install @runapi.ai/nano-banana
```

Set your API key in the environment:

```dotenv
# .env
RUNAPI_API_KEY=runapi_xxx   # get one at https://runapi.ai/settings/api_keys
```

```ts
import { NanoBananaClient } from '@runapi.ai/nano-banana';

// The SDK reads RUNAPI_API_KEY from the environment automatically.
const client = new NanoBananaClient();
```

Pass `{ apiKey }` explicitly if you manage secrets differently. `baseUrl` defaults to `https://runapi.ai`; override only for local development.

## Core recipe — text to image

```ts
const result = await client.textToImage.run({
  model: 'nano-banana',
  prompt: 'A bowl of fruit on a wooden table, soft daylight',
  image_size: '16:9',
});

const url = result.result_urls[0];
```

`run()` creates the task, auto-polls, and resolves only when the task completes — `result_urls[0]` is guaranteed on the resolved value. On failure it throws `TaskFailedError`; on polling timeout it throws `TaskTimeoutError`. Use `run()` for scripts and short-lived processes. For request handlers, split it:

```ts
const { id } = await client.textToImage.create({ model: 'nano-banana', prompt: '...' });
// return 202 immediately; fetch later:
const status = await client.textToImage.get(id);
if (status.status === 'completed') { /* ... */ }
```

Do not hold a web worker open waiting on `run()`. Split + webhook is the production pattern.

`run()` polls every 2 s for up to 15 min by default. Tune when needed:

```ts
await client.textToImage.run(params, { maxWaitMs: 5 * 60_000, pollIntervalMs: 2_000 });
```

If `TaskTimeoutError` fires, the task is still running server-side — resume with `textToImage.get(id)` or finish via webhook.

## Pro model — higher fidelity + resolution

```ts
const result = await client.textToImage.run({
  model: 'nano-banana-pro',
  prompt: 'A futuristic city skyline at dusk',
  aspect_ratio: '16:9',   // pro uses aspect_ratio, not image_size
  resolution: '2K',        // 1K | 2K | 4K
  output_format: 'jpeg',
});
```

You can also pass `image_input: string[]` on any text-to-image model for image-guided generation.

## V2 model — long prompts + wider aspect ratios

```ts
const result = await client.textToImage.run({
  model: 'nano-banana-2',
  prompt: '...up to 20,000 characters, with up to 14 reference images...',
  aspect_ratio: '1:8',    // v2 adds extreme ratios 1:4, 1:8, 4:1, 8:1
  resolution: '2K',        // 1K | 2K | 4K (billed 16¢ / 24¢ / 36¢)
  output_format: 'jpg',
});
```

## EditImage — transform an existing image

```ts
const edited = await client.editImage.run({
  model: 'nano-banana-edit',
  prompt: 'Make it look like a watercolor painting',
  image_urls: ['https://cdn.example.com/source.jpg'],
  image_size: '1:1',
});

console.log(edited.result_urls[0]);
```

## Models

| `model` | Params | Use case |
|---|---|---|
| `nano-banana` | `image_size`, `image_input?` | Base text-to-image / image-guided. |
| `nano-banana-pro` | `aspect_ratio`, `resolution`, `image_input?` | Higher fidelity, 1K/2K/4K. |
| `nano-banana-2` | `aspect_ratio`, `resolution`, `image_input?` | V2: long prompts (≤20k chars), ≤14 reference images, extra aspect ratios. |
| `nano-banana-edit` | `image_urls`, `image_size` | Prompt-driven edit of a source image. |

`image_size` / `aspect_ratio` values (base / pro): `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`, `auto`. V2 adds `1:4`, `1:8`, `4:1`, `8:1`. `output_format`: `png` / `jpg` / `jpeg`.

Exact credit costs per model are shown at https://runapi.ai/pricing and in the dashboard — do not hardcode prices in application code.

## Callbacks (webhooks)

Pass `callback_url` on `create()` (or any `run()` call) and RunAPI will POST the final payload to you:

```ts
await client.textToImage.create({
  model: 'nano-banana',
  prompt: '...',
  callback_url: 'https://your.app/webhooks/runapi/nano-banana',
});
```

Payload shape:

```ts
{ id: string; status: 'completed' | 'failed'; result_urls?: string[]; error?: string }
```

**Always verify the signature before trusting the body.** RunAPI signs every callback with your account's Callback Secret (rotate at `/accounts/callback_secret`). Headers:

- `X-Callback-Id` — UUID, store to make handler idempotent
- `X-Callback-Timestamp` — unix seconds, reject if `|now - ts| > 300`
- `X-Callback-Signature` — base64 HMAC-SHA256 over `` `${id}.${ts}.${rawBody}` `` using the base64-decoded secret

```ts
import crypto from 'node:crypto';

function verify(raw: string, id: string, ts: string, sig: string, secret: string) {
  const key = Buffer.from(secret, 'base64');
  const mac = crypto.createHmac('sha256', key)
    .update(`${id}.${ts}.${raw}`)
    .digest('base64');
  return crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(sig));
}
```

Reply `2xx` within 10s; any non-2xx triggers retries.

## Errors

All errors are re-exported from `@runapi.ai/core`. Always `instanceof` — never string-match messages.

| Error | Status | Action |
|---|---|---|
| `AuthenticationError` | 401 | abort; surface "reconnect your API key" |
| `InsufficientCreditsError` | 402 | prompt user to top up at runapi.ai/billing |
| `ValidationError` | 400 / 422 | fix params; do not retry |
| `RateLimitError` | 429 | sleep `err.retryAfterMs`, then retry |
| `ServiceUnavailableError` | 503 / 455 | retry with backoff; transient service issue |
| `TaskFailedError` | — | show `err.details` to user; do not auto-retry |
| `TaskTimeoutError` | — | re-poll with `<resource>.get(id)` |

```ts
import { InsufficientCreditsError, TaskFailedError } from '@runapi.ai/nano-banana';

try {
  await client.textToImage.run({ model: 'nano-banana', prompt: '...' });
} catch (err) {
  if (err instanceof InsufficientCreditsError) { /* surface top-up CTA */ }
  else if (err instanceof TaskFailedError)       { /* show err.details */ }
  else throw err;
}
```

## Gotchas

- `model` is required on every call.
- The base model uses **`image_size`**; pro and v2 use **`aspect_ratio`**. They are different fields — do not substitute one for the other.
- `resolution` (`1K` / `2K` / `4K`) applies to `nano-banana-pro` and `nano-banana-2`.
- EditImage (`editImage.run`) require `image_urls` (an array), not `image_input`.
- Response uses `result_urls` (an array of URL strings), not `images` or `videos`.
- `callback_url` must be reachable from the public internet. `localhost` / `127.0.0.1` URLs will never fire — use a tunnel (cloudflared, ngrok, tailscale funnel) when developing locally.

## Dig deeper

Package README (full API surface, all params): `node_modules/@runapi.ai/nano-banana/README.md`. Types: `@runapi.ai/nano-banana/dist/types.d.ts`. Product docs: https://runapi.ai/docs.

## RunAPI public routing

nano banana api public links use the API-379 catalog route map. The main nano banana api page is https://runapi.ai/models/nano-banana. SDK docs live at https://runapi.ai/docs#sdk-nano-banana and product docs live at https://runapi.ai/docs#nano-banana.

Pricing, rate limits, and commercial usage for nano banana api should point to the most specific variant page:
- [Standard](https://runapi.ai/models/nano-banana/nano-banana)
- [Pro](https://runapi.ai/models/nano-banana/pro)
- [Edit](https://runapi.ai/models/nano-banana/edit)
- [Nano Banana 2](https://runapi.ai/models/nano-banana/2)

Compare Nano Banana with other Google models at https://runapi.ai/providers/google. Browse every RunAPI model and skill at https://runapi.ai/models. SDK repository: https://github.com/runapi-ai/nano-banana-sdk. Skill repository: https://github.com/runapi-ai/nano-banana.
