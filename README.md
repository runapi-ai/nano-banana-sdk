# Nano Banana API SDK for RunAPI

The nano banana api SDK packages JavaScript, Ruby, and Go clients for Nano Banana image generation on RunAPI. Use this nano banana api SDK for text-to-image, image-to-image, pro model, and image editing workflows.

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
  image_size: '16:9',
});

console.log('Image URLs:', result.result_urls);
```

## Features

- **Text-to-Image**: Generate images from prompts
- **Image-to-Image**: Provide reference images with `image_input`
- **Pro Model**: Higher fidelity with aspect ratio + resolution controls
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
  image_size: '4:3', // or 'auto'
  image_input: ['https://example.com/reference.png'], // optional
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
  resolution: '2K', // optional: 1K | 2K | 4K
  image_input: ['https://example.com/reference.png'], // optional
  output_format: 'jpeg', // optional
});
```

#### V2 Model (nano-banana-2)

```typescript
const result = await client.textToImage.run({
  model: 'nano-banana-2',
  prompt: 'A futuristic city skyline at dusk', // up to 20,000 characters
  aspect_ratio: '16:9', // adds 1:4, 1:8, 4:1, 8:1 vs pro
  resolution: '2K', // optional: 1K | 2K | 4K
  image_input: ['https://example.com/reference.png'], // optional, up to 14
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
  image_urls: ['https://example.com/source.jpg'],
  image_size: '1:1',
});
```

## Models

| Model | Description | Use Case |
|-------|-------------|----------|
| `nano-banana` | Base model | Fast, cost-efficient generation |
| `nano-banana-pro` | Pro model | Higher fidelity + resolution control |
| `nano-banana-2` | V2 model | Long prompts (≤20k chars), ≤14 reference images, extra aspect ratios |
| `nano-banana-edit` | Edit model | Prompt-based image editing |

## Aspect Ratios and Sizes

### Base Model (`image_size`)

- `1:1`, `9:16`, `16:9`, `3:4`, `4:3`, `3:2`, `2:3`, `5:4`, `4:5`, `21:9`, `auto`

### Pro Model (`aspect_ratio`)

- `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`, `auto`

### Pro Model Resolution

- `1K`, `2K`, `4K`

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
  result_urls?: string[];
  error?: string;
}
```

For full nano banana api documentation including all parameters and response formats, visit https://runapi.ai/docs#nano-banana.

## License

MIT
