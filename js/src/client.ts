import { BaseClient, type ClientOptions } from '@runapi.ai/core';
import { TextToImage } from './resources/text-to-image';
import { EditImage } from './resources/edit-image';

/**
 * NanoBanana image generation and editing API client.
 *
 * Generation tiers include standard, pro, v2, and v2 lite. Image editing
 * supports `nano-banana-2-lite` and the dedicated `nano-banana-edit` model.
 *
 * @example
 * ```typescript
 * const client = new NanoBananaClient({
 *   apiKey: 'your-api-key',
 *   baseUrl: 'https://runapi.ai',
 * });
 *
 * const result = await client.textToImage.run({
 *   model: 'nano-banana-pro',
 *   prompt: 'A futuristic cityscape at night',
 * });
 * ```
 */
export class NanoBananaClient extends BaseClient {
  /** Generate images from text prompts with optional reference image guidance. */
  public readonly textToImage: TextToImage;
  /** Edit existing images using text prompts and source images. */
  public readonly editImage: EditImage;

  constructor(options: ClientOptions = {}) {
    super(options);
    this.textToImage = new TextToImage(this.http);
    this.editImage = new EditImage(this.http);
  }
}
