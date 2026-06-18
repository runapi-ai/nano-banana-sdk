import type { HttpClient, RequestOptions, PollingOptions } from '@runapi.ai/core';
import { compactParams } from '@runapi.ai/core';
import { pollUntilComplete } from '@runapi.ai/core/internal';
import type { CompletedEditImageResponse, EditImageParams, EditImageResponse, TaskCreateResponse } from '../types';

const ENDPOINT = '/api/v1/nano_banana/edit_image';

/** Modifies existing images based on text prompts. Requires source images to edit. */
export class EditImage {
  constructor(private readonly http: HttpClient) {}

  /**
   * Edit an image using text prompts and reference images and wait until complete.
   * @param params Edit parameters.
   * @param options Per-request and polling overrides.
   * @returns The completed edit with image results.
   */
  async run(params: EditImageParams, options?: RequestOptions & PollingOptions): Promise<CompletedEditImageResponse> {
    const { id } = await this.create(params, options);
    const response = await pollUntilComplete<EditImageResponse>(() => this.get(id, options), {
      maxWaitMs: options?.maxWaitMs,
      pollIntervalMs: options?.pollIntervalMs,
    });
    return response as CompletedEditImageResponse;
  }

  /**
   * Create an image edit task; returns immediately with a task id.
   * @param params Edit parameters.
   * @param options Per-request overrides.
   * @returns The task creation result with id.
   */
  async create(params: EditImageParams, options?: RequestOptions): Promise<TaskCreateResponse> {
    return this.http.request<TaskCreateResponse>('POST', ENDPOINT, {
      body: compactParams(params),
      ...options,
    });
  }

  /**
   * Fetch the current status of an image edit task.
   * @param id The task id.
   * @param options Per-request overrides.
   * @returns The current image edit task status.
   */
  async get(id: string, options?: RequestOptions): Promise<EditImageResponse> {
    return this.http.request<EditImageResponse>('GET', `${ENDPOINT}/${id}`, {
      ...options,
    });
  }
}
