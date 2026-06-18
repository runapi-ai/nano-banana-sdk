import type { AsyncTaskStatus } from '@runapi.ai/core';

/** Generation model tiers: standard (fast), pro (higher resolution + more refs), v2 (longest prompts + extreme ratios). */
export type TextToImageModel = 'nano-banana' | 'nano-banana-pro' | 'nano-banana-2';
/** Dedicated editing model. Requires source images to transform. */
export type EditImageModel = 'nano-banana-edit';

/** Aspect ratio options for the standard model. */
export type BaseAspectRatio =
  | '1:1'
  | '9:16'
  | '16:9'
  | '3:4'
  | '4:3'
  | '3:2'
  | '2:3'
  | '5:4'
  | '4:5'
  | '21:9'
  | 'auto';

/** Aspect ratio options for the pro model. */
export type AspectRatio =
  | '1:1'
  | '2:3'
  | '3:2'
  | '3:4'
  | '4:3'
  | '4:5'
  | '5:4'
  | '9:16'
  | '16:9'
  | '21:9'
  | 'auto';

/**
 * V2 model aspect ratio options. Superset of pro ratios, adding extreme
 * panoramic/tall ratios (1:4, 1:8, 4:1, 8:1). Default is 'auto'.
 */
export type AspectRatioV2 =
  | AspectRatio
  | '1:4'
  | '1:8'
  | '4:1'
  | '8:1';

/** Output resolution tier. Pro and v2 default to 1k; higher tiers increase generation time. */
export type OutputResolution = '1k' | '2k' | '4k';

/** Output image encoding format. */
export type OutputFormat = 'png' | 'jpg' | 'jpeg';

/** Standard tier generation. Up to 8 reference images, max 5000-char prompt. */
export interface GenerationBaseParams {
  model: 'nano-banana';
  prompt: string;
  callback_url?: string;
  output_format?: OutputFormat;
  aspect_ratio?: BaseAspectRatio;
  /** Optional visual guidance images (up to 8, max 30 MB each). */
  reference_image_urls?: string[];
}

/** Pro tier generation. Adds output resolution control and wider aspect ratio set. */
export interface GenerationProParams {
  model: 'nano-banana-pro';
  prompt: string;
  callback_url?: string;
  output_format?: OutputFormat;
  aspect_ratio?: AspectRatio;
  output_resolution?: OutputResolution;
  /** Optional visual guidance images (up to 8, max 30 MB each). */
  reference_image_urls?: string[];
}

/** V2 tier generation. Longest prompts (up to 20000 chars), extreme aspect ratios, up to 14 reference images. */
export interface GenerationV2Params {
  model: 'nano-banana-2';
  prompt: string;
  callback_url?: string;
  output_format?: OutputFormat;
  aspect_ratio?: AspectRatioV2;
  output_resolution?: OutputResolution;
  /** Optional visual guidance images (up to 14, max 30 MB each). */
  reference_image_urls?: string[];
}

/**
 * Text-to-image parameters. A discriminated union on `model`: the accepted
 * aspect ratios, prompt length, resolution, and reference image count differ per tier.
 */
export type TextToImageParams =
  | GenerationBaseParams
  | GenerationProParams
  | GenerationV2Params;

/**
 * Edit image parameters. Requires source images to modify according to the prompt.
 * Up to 10 source images, max 10 MB each.
 */
export interface EditImageParams {
  model: 'nano-banana-edit';
  /** Edit instruction describing the desired changes (up to 5000 chars). */
  prompt: string;
  /** Source images to edit (up to 10 images, max 10 MB each). */
  source_image_urls: string[];
  callback_url?: string;
  output_format?: OutputFormat;
  aspect_ratio?: BaseAspectRatio;
}

export interface TaskCreateResponse {
  id: string;
}

/** A single generated or edited image result. */
export interface Image {
  /** CDN-delivered image URL. */
  url: string;
  /** Pre-CDN original location, when available. */
  origin_url?: string;
}

/** Task result for a text-to-image generation request. */
export interface TextToImageResponse {
  id: string;
  status: AsyncTaskStatus;
  /** Output images, populated once the task completes successfully. */
  images?: Image[];
  /** Error message when the task has failed. */
  error?: string;
  [key: string]: unknown;
}

/** Task result for an image editing request. */
export interface EditImageResponse {
  id: string;
  status: AsyncTaskStatus;
  /** Output images, populated once the task completes successfully. */
  images?: Image[];
  /** Error message when the task has failed. */
  error?: string;
  [key: string]: unknown;
}

/**
 * Resolved responses returned by the `run()` methods after polling sees
 * `status: 'completed'`. Narrows the base response so `images` is
 * guaranteed non-optional in user code.
 */
export type CompletedTextToImageResponse = TextToImageResponse & {
  status: 'completed';
  images: Image[];
};

export type CompletedEditImageResponse = EditImageResponse & {
  status: 'completed';
  images: Image[];
};
