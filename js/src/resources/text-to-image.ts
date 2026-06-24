import type { HttpClient, RequestOptions, PollingOptions, ActionSchema } from '@runapi.ai/core';
import { compactParams, validateParams } from '@runapi.ai/core';
import { pollUntilComplete } from '@runapi.ai/core/internal';
import { contract } from '../contract_gen';
import type {
  CompletedTextToImageResponse,
  TextToImageParams,
  TextToImageResponse,
  TaskCreateResponse,
} from '../types';

const ENDPOINT = '/api/v1/nano_banana/text_to_image';

/** Generates images from text prompts with optional reference image guidance. Model tier controls prompt length, resolution, and reference image limits. */
export class TextToImage {
  constructor(private readonly http: HttpClient) {}

  /**
   * Generate an image from a text prompt and wait until complete.
   * @param params Generation parameters.
   * @param options Per-request and polling overrides.
   * @returns The completed generation with image results.
   */
  async run(params: TextToImageParams, options?: RequestOptions & PollingOptions): Promise<CompletedTextToImageResponse> {
    const { id } = await this.create(params, options);
    const response = await pollUntilComplete<TextToImageResponse>(() => this.get(id, options), {
      maxWaitMs: options?.maxWaitMs,
      pollIntervalMs: options?.pollIntervalMs,
    });
    return response as CompletedTextToImageResponse;
  }

  /**
   * Create an image generation task; returns immediately with a task id.
   * @param params Generation parameters.
   * @param options Per-request overrides.
   * @returns The task creation result with id.
   */
  async create(params: TextToImageParams, options?: RequestOptions): Promise<TaskCreateResponse> {
    const body = compactParams(params);
    validateParams(contract['text-to-image'] as ActionSchema, body as Record<string, unknown>);
    return this.http.request<TaskCreateResponse>('POST', ENDPOINT, {
      body,
      ...options,
    });
  }

  /**
   * Fetch the current status of an image generation task.
   * @param id The task id.
   * @param options Per-request overrides.
   * @returns The current image generation task status.
   */
  async get(id: string, options?: RequestOptions): Promise<TextToImageResponse> {
    return this.http.request<TextToImageResponse>('GET', `${ENDPOINT}/${id}`, {
      ...options,
    });
  }
}
