import type { AsyncTaskStatus } from '@runapi.ai/core';

// Model types
export type TextToImageModel = 'nano-banana' | 'nano-banana-pro' | 'nano-banana-2';
export type EditImageModel = 'nano-banana-edit';

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
 * V2 model aspect ratio options. Superset of Pro, adding extreme ratios
 * (1:4, 1:8, 4:1, 8:1). Default is 'auto'.
 */
export type AspectRatioV2 =
  | AspectRatio
  | '1:4'
  | '1:8'
  | '4:1'
  | '8:1';

export type OutputResolution = '1k' | '2k' | '4k';

// Output format
export type OutputFormat = 'png' | 'jpg' | 'jpeg';

// Base generation params
export interface GenerationBaseParams {
  model: 'nano-banana';
  prompt: string;
  callback_url?: string;
  output_format?: OutputFormat;
  aspect_ratio?: BaseAspectRatio;
  reference_image_urls?: string[];
}

// Pro generation params
export interface GenerationProParams {
  model: 'nano-banana-pro';
  prompt: string;
  callback_url?: string;
  output_format?: OutputFormat;
  aspect_ratio?: AspectRatio;
  output_resolution?: OutputResolution;
  reference_image_urls?: string[];
}

// V2 generation params
export interface GenerationV2Params {
  model: 'nano-banana-2';
  prompt: string;
  callback_url?: string;
  output_format?: OutputFormat;
  aspect_ratio?: AspectRatioV2;
  output_resolution?: OutputResolution;
  reference_image_urls?: string[];
}

export type TextToImageParams =
  | GenerationBaseParams
  | GenerationProParams
  | GenerationV2Params;

// Edit params
export interface EditImageParams {
  model: 'nano-banana-edit';
  prompt: string;
  source_image_urls: string[];
  callback_url?: string;
  output_format?: OutputFormat;
  aspect_ratio?: BaseAspectRatio;
}

// Response types
export interface TaskCreateResponse {
  id: string;
}

export interface Image {
  url: string;
  origin_url?: string;
}

export interface TextToImageResponse {
  id: string;
  status: AsyncTaskStatus;
  images?: Image[];
  error?: string;
  [key: string]: unknown;
}

export interface EditImageResponse {
  id: string;
  status: AsyncTaskStatus;
  images?: Image[];
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
