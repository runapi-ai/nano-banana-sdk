import { createHttpClient, type ClientOptions } from '@runapi.ai/core';
import { TextToImage } from './resources/text-to-image';
import { EditImage } from './resources/edit-image';

/**
 * NanoBanana text-to-image API client.
 *
 * @example
 * ```typescript
 * const client = new NanoBananaClient({
 *   apiKey: 'your-api-key',
 *   baseUrl: 'https://runapi.ai',
 * });
 *
 * const result = await client.textToImage.run({
 *   model: 'flux-kontext-pro',
 *   prompt: 'A futuristic cityscape at night',
 * });
 * ```
 */
export class NanoBananaClient {
  /** Text-to-image operations. */
  public readonly textToImage: TextToImage;
  /** Image editing operations. */
  public readonly editImage: EditImage;

  constructor(options: ClientOptions = {}) {
    const http = createHttpClient(options);
    this.textToImage = new TextToImage(http);
    this.editImage = new EditImage(http);
  }
}
