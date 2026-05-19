import type { AsyncTaskStatus } from '@runapi.ai/core';

// Model types
export type TextToImageModel = 'nano-banana' | 'nano-banana-pro' | 'nano-banana-2';
export type EditImageModel = 'nano-banana-edit';

/**
 * Base model aspect ratio options.
 * Note: Base model uses 'image_size' parameter which includes 'auto' option.
 */
export type ImageSize =
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

/**
 * Pro model aspect ratio options.
 * Note: Pro model uses 'aspect_ratio' parameter (includes 'auto' option).
 */
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

// Resolution (Pro and V2)
export type Resolution = '1K' | '2K' | '4K';

// Output format
export type OutputFormat = 'png' | 'jpg' | 'jpeg';

// Base generation params
export interface GenerationBaseParams {
  model: 'nano-banana';
  prompt: string;
  callback_url?: string;
  output_format?: OutputFormat;
  image_size?: ImageSize;
  image_input?: string[];
}

// Pro generation params
export interface GenerationProParams {
  model: 'nano-banana-pro';
  prompt: string;
  callback_url?: string;
  output_format?: OutputFormat;
  aspect_ratio?: AspectRatio;
  resolution?: Resolution;
  image_input?: string[];
}

// V2 generation params
export interface GenerationV2Params {
  model: 'nano-banana-2';
  prompt: string;
  callback_url?: string;
  output_format?: OutputFormat;
  aspect_ratio?: AspectRatioV2;
  resolution?: Resolution;
  image_input?: string[];
}

export type TextToImageParams =
  | GenerationBaseParams
  | GenerationProParams
  | GenerationV2Params;

// Edit params
export interface EditImageParams {
  model: 'nano-banana-edit';
  prompt: string;
  image_urls: string[];
  callback_url?: string;
  output_format?: OutputFormat;
  image_size?: ImageSize;
}

// Response types
export interface TaskCreateResponse {
  id: string;
}

export interface TextToImageResponse {
  id: string;
  status: AsyncTaskStatus;
  result_urls?: string[];
  error?: string;
  [key: string]: unknown;
}

export interface EditImageResponse {
  id: string;
  status: AsyncTaskStatus;
  result_urls?: string[];
  error?: string;
  [key: string]: unknown;
}

/**
 * Resolved responses returned by the `run()` methods after polling sees
 * `status: 'completed'`. Narrows the base response so `result_urls` is
 * guaranteed non-optional in user code.
 */
export type CompletedTextToImageResponse = TextToImageResponse & {
  status: 'completed';
  result_urls: string[];
};

export type CompletedEditImageResponse = EditImageResponse & {
  status: 'completed';
  result_urls: string[];
};
