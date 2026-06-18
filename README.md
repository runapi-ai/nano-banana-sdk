<p align="center">
  <a href="https://runapi.ai"><img src="https://runapi.ai/icon.svg" height="56" alt="RunAPI"></a>
</p>

<h3 align="center">
  <a href="https://github.com/runapi-ai/nano-banana-sdk">Nano Banana API SDK for RunAPI</a>
</h3>

<p align="center">
  Nano Banana API SDKs for JavaScript, Ruby, and Go on RunAPI.
</p>

<div align="center">

[![npm](https://img.shields.io/npm/v/@runapi.ai/nano-banana)](https://www.npmjs.com/package/@runapi.ai/nano-banana)
[![RubyGems](https://img.shields.io/gem/v/runapi-nano-banana)](https://rubygems.org/gems/runapi-nano-banana)
[![Go Reference](https://pkg.go.dev/badge/github.com/runapi-ai/nano-banana-sdk/go.svg)](https://pkg.go.dev/github.com/runapi-ai/nano-banana-sdk/go)
[![License](https://img.shields.io/github/license/runapi-ai/nano-banana-sdk)](https://github.com/runapi-ai/nano-banana-sdk/blob/main/LICENSE)

</div>
<br/>

The nano banana api SDK packages JavaScript, Ruby, and Go clients for Nano Banana image generation on RunAPI. Use this nano banana api SDK for text-to-image, reference-image, pro model, and image editing workflows.

## Installation

```bash
npm install @runapi.ai/nano-banana
# or
pnpm add @runapi.ai/nano-banana
# or
yarn add @runapi.ai/nano-banana
```

## Quick Start

```typescript
import { NanoBananaClient } from '@runapi.ai/nano-banana';

const client = new NanoBananaClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://runapi.ai', // optional
});

const result = await client.textToImage.run({
  model: 'nano-banana',
  prompt: 'A bowl of fruit on a wooden table, soft daylight',
  aspect_ratio: '16:9',
});

console.log('Image URLs:', result.images?.map((image) => image.url));
```

## Features

- **Text-to-Image**: Generate images from prompts
- **Reference Images**: Provide guidance images with `reference_image_urls`
- **Pro Model**: Higher fidelity with aspect ratio + output resolution controls
- **Image Editing**: Transform images with prompts
- **Automatic Polling**: Built-in polling for async tasks
- **Full TypeScript Support**: Complete type definitions for all endpoints
- **Error Handling**: Comprehensive error types from @runapi.ai/core

## API Reference

### Client Initialization

```typescript
const client = new NanoBananaClient({
  apiKey: string;      // Required: Your RunAPI.ai API key
  baseUrl?: string;    // Optional: API base URL (defaults to production)
});
```

### Image Generation

#### Base Model (nano-banana)

```typescript
const result = await client.textToImage.run({
  model: 'nano-banana',
  prompt: 'A modern desk setup with a laptop and coffee',
  aspect_ratio: '4:3', // or 'auto'
  reference_image_urls: ['https://cdn.runapi.ai/public/samples/image.jpg'], // optional
  output_format: 'png', // optional
  callback_url: 'https://your-domain.com/webhook', // optional
});
```

#### Pro Model (nano-banana-pro)

```typescript
const result = await client.textToImage.run({
  model: 'nano-banana-pro',
  prompt: 'A futuristic city skyline at dusk',
  aspect_ratio: '16:9',
  output_resolution: '2k', // optional: 1k | 2k | 4k
  reference_image_urls: ['https://cdn.runapi.ai/public/samples/image.jpg'], // optional
  output_format: 'jpeg', // optional
});
```

#### V2 Model (nano-banana-2)

```typescript
const result = await client.textToImage.run({
  model: 'nano-banana-2',
  prompt: 'A futuristic city skyline at dusk', // up to 20,000 characters
  aspect_ratio: '16:9', // adds 1:4, 1:8, 4:1, 8:1 vs pro
  output_resolution: '2k', // optional: 1k | 2k | 4k
  reference_image_urls: ['https://cdn.runapi.ai/public/samples/image.jpg'], // optional, up to 14
  output_format: 'jpg', // optional: png | jpg (default jpg)
});
```

#### Manual Control (Create + Poll)

```typescript
const task = await client.textToImage.create({
  model: 'nano-banana',
  prompt: 'A tranquil forest path',
});

const status = await client.textToImage.get(task.id);
console.log('Status:', status.status);
```

### Image Editing

```typescript
const result = await client.editImage.run({
  model: 'nano-banana-edit',
  prompt: 'Make it look like a watercolor painting',
  source_image_urls: ['https://cdn.runapi.ai/public/samples/image.jpg'],
  aspect_ratio: '1:1',
});
```

## Models

| Model | Description | Use Case |
|-------|-------------|----------|
| `nano-banana` | Base model | Fast, cost-efficient generation |
| `nano-banana-pro` | Pro model | Higher fidelity + output resolution control |
| `nano-banana-2` | V2 model | Long prompts (≤20k chars), ≤14 reference images, extra aspect ratios |
| `nano-banana-edit` | Edit model | Prompt-based image editing |

## Aspect Ratios and Sizes

### Base/Edit Aspect Ratio

- `1:1`, `9:16`, `16:9`, `3:4`, `4:3`, `3:2`, `2:3`, `5:4`, `4:5`, `21:9`, `auto`

### Pro Model (`aspect_ratio`)

- `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`, `auto`

### Pro/V2 Output Resolution

- `1k`, `2k`, `4k`

## Output Formats

- `png`, `jpg`, `jpeg`

## Error Handling

```typescript
import {
  NanoBananaClient,
  AuthenticationError,
  InsufficientCreditsError,
  ValidationError,
  TaskFailedError,
} from '@runapi.ai/nano-banana';

try {
  const result = await client.textToImage.run({
    model: 'nano-banana',
    prompt: 'A warm sunrise over the ocean',
  });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof InsufficientCreditsError) {
    console.error('Not enough creditImage');
  } else if (error instanceof ValidationError) {
    console.error('Invalid parameters');
  } else if (error instanceof TaskFailedError) {
    console.error('Generation failed');
  }
}
```

## Advanced Usage

### Callbacks

```typescript
const result = await client.textToImage.create({
  model: 'nano-banana',
  prompt: 'A cozy cabin in snowy mountains',
  callback_url: 'https://your-domain.com/webhook',
});
```

Webhook payload on completion:
```typescript
{
  id: string;
  status: 'completed' | 'failed';
  images?: Array<{ url: string; origin_url?: string }>;
  error?: string;
}
```

For full nano banana api documentation including all parameters and response formats, visit https://runapi.ai/docs#nano-banana.

## Generated file storage

RunAPI-generated file URLs are temporary. Download and store generated images, videos, audio, or other files in your own durable storage within 7 days; do not treat returned URLs as long-term assets.

## License

MIT
