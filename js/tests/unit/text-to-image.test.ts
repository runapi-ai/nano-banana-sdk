import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TextToImage } from '../../src/resources/text-to-image';
import type { HttpClient } from '@runapi.ai/core';
import type { TextToImageResponse, TaskCreateResponse, TextToImageParams } from '../../src/types';

describe('TextToImage', () => {
  const mockHttp: HttpClient = {
    request: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should send correct request for base model', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-123' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToImage = new TextToImage(mockHttp);
      const result = await textToImage.create({
        model: 'nano-banana',
        prompt: 'A beautiful landscape',
        aspect_ratio: '16:9',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/nano_banana/text_to_image',
        {
          body: {
            model: 'nano-banana',
            prompt: 'A beautiful landscape',
            aspect_ratio: '16:9',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should send correct request for pro model', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-456' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToImage = new TextToImage(mockHttp);
      const result = await textToImage.create({
        model: 'nano-banana-pro',
        prompt: 'Ultra-detailed cityscape',
        aspect_ratio: '16:9',
        output_resolution: '4k',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/nano_banana/text_to_image',
        {
          body: {
            model: 'nano-banana-pro',
            prompt: 'Ultra-detailed cityscape',
            aspect_ratio: '16:9',
            output_resolution: '4k',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should include optional parameters', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-789' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToImage = new TextToImage(mockHttp);
      await textToImage.create({
        model: 'nano-banana',
        prompt: 'Test image',
        callback_url: 'https://your-domain.com/api/callback',
        output_format: 'png',
        reference_image_urls: ['https://cdn.runapi.ai/public/samples/image.jpg'],
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/nano_banana/text_to_image',
        {
          body: {
            model: 'nano-banana',
            prompt: 'Test image',
            callback_url: 'https://your-domain.com/api/callback',
            output_format: 'png',
            reference_image_urls: ['https://cdn.runapi.ai/public/samples/image.jpg'],
          },
        }
      );
    });

    it('should send correct request for lite model', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-lite' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToImage = new TextToImage(mockHttp);
      await textToImage.create({
        model: 'nano-banana-2-lite',
        prompt: 'A cinematic meadow scene',
        aspect_ratio: 'auto',
        reference_image_urls: ['https://cdn.runapi.ai/public/samples/image.jpg'],
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/nano_banana/text_to_image',
        {
          body: {
            model: 'nano-banana-2-lite',
            prompt: 'A cinematic meadow scene',
            aspect_ratio: 'auto',
            reference_image_urls: ['https://cdn.runapi.ai/public/samples/image.jpg'],
          },
        }
      );
    });

    it('creates a v2.1 reference-guided task and reads its image', async () => {
      const params = {
        model: 'nano-banana-2.1',
        prompt: 'Replace the background with a meadow',
        reference_image_urls: ['https://cdn.runapi.ai/public/samples/image.jpg'],
        output_resolution: '2k',
        output_format: 'jpg',
      } satisfies TextToImageParams;
      vi.mocked(mockHttp.request)
        .mockResolvedValueOnce({ id: 'task-v21' })
        .mockResolvedValueOnce({ id: 'task-v21', status: 'completed', images: [{ url: 'https://cdn.runapi.ai/public/samples/result.png' }] });
      const textToImage = new TextToImage(mockHttp);

      const task = await textToImage.create(params);
      const result = await textToImage.get(task.id);

      expect(task.id).toBe('task-v21');
      expect(mockHttp.request).toHaveBeenNthCalledWith(1, 'POST', '/api/v1/nano_banana/text_to_image', { body: params });
      expect(mockHttp.request).toHaveBeenNthCalledWith(2, 'GET', '/api/v1/nano_banana/text_to_image/task-v21', {});
      expect(result.images?.[0]?.url).toBe('https://cdn.runapi.ai/public/samples/result.png');
    });

    it('should default model to nano-banana-2-lite', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-default-lite' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToImage = new TextToImage(mockHttp);
      await textToImage.create({
        prompt: 'A cinematic meadow scene',
        aspect_ratio: 'auto',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/nano_banana/text_to_image',
        {
          body: {
            model: 'nano-banana-2-lite',
            prompt: 'A cinematic meadow scene',
            aspect_ratio: 'auto',
          },
        }
      );
    });
  });

  describe('get', () => {
    it('should fetch task status by ID', async () => {
      const mockResponse: TextToImageResponse = {
        id: 'task-123',
        status: 'processing',
        model: 'nano-banana',
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToImage = new TextToImage(mockHttp);
      const result = await textToImage.get('task-123');

      expect(mockHttp.request).toHaveBeenCalledWith(
        'GET',
        '/api/v1/nano_banana/text_to_image/task-123',
        {}
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return completed status with results', async () => {
      const mockResponse: TextToImageResponse = {
        id: 'task-123',
        status: 'completed',
        model: 'nano-banana-pro',
        images: [{ url: 'https://cdn.runapi.ai/public/samples/result.png' }],
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToImage = new TextToImage(mockHttp);
      const result = await textToImage.get('task-123');

      expect(result.status).toBe('completed');
      expect(result.images).toEqual([{ url: 'https://cdn.runapi.ai/public/samples/result.png' }]);
    });

    it('should return failed status with error', async () => {
      const mockResponse: TextToImageResponse = {
        id: 'task-123',
        status: 'failed',
        model: 'nano-banana',
        error: 'Content policy violation',
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToImage = new TextToImage(mockHttp);
      const result = await textToImage.get('task-123');

      expect(result.status).toBe('failed');
      expect(result.error).toBe('Content policy violation');
    });
  });

  describe('run', () => {
    it('should create and poll until completion', async () => {
      const createResponse: TaskCreateResponse = { id: 'task-123' };
      const processingResponse: TextToImageResponse = {
        id: 'task-123',
        status: 'processing',
        model: 'nano-banana',
      };
      const completedResponse: TextToImageResponse = {
        id: 'task-123',
        status: 'completed',
        model: 'nano-banana',
        images: [{ url: 'https://cdn.runapi.ai/public/samples/result.png' }],
      };

      vi.mocked(mockHttp.request)
        .mockResolvedValueOnce(createResponse)
        .mockResolvedValueOnce(processingResponse)
        .mockResolvedValueOnce(completedResponse);

      const textToImage = new TextToImage(mockHttp);
      const result = await textToImage.run({
        model: 'nano-banana',
        prompt: 'Test image',
      });

      expect(result.status).toBe('completed');
      expect(result.images).toEqual([{ url: 'https://cdn.runapi.ai/public/samples/result.png' }]);
    });
  });
});
