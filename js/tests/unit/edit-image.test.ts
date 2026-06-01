import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditImage } from '../../src/resources/edit-image';
import type { HttpClient } from '@runapi.ai/core';
import type { EditImageResponse, TaskCreateResponse } from '../../src/types';

describe('EditImage', () => {
  const mockHttp: HttpClient = {
    request: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should send correct request with required parameters', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-123' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const editImage = new EditImage(mockHttp);
      const result = await editImage.create({
        model: 'nano-banana-edit',
        prompt: 'Transform into watercolor painting',
        source_image_urls: ['https://cdn.runapi.ai/public/samples/input.jpg'],
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/nano_banana/edit_image',
        {
          body: {
            model: 'nano-banana-edit',
            prompt: 'Transform into watercolor painting',
            source_image_urls: ['https://cdn.runapi.ai/public/samples/input.jpg'],
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should include optional parameters', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-456' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const editImage = new EditImage(mockHttp);
      await editImage.create({
        model: 'nano-banana-edit',
        prompt: 'Add flying cars',
        source_image_urls: ['https://cdn.runapi.ai/public/samples/photo.jpg'],
        callback_url: 'https://example.com/callback',
        output_format: 'png',
        aspect_ratio: '16:9',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/nano_banana/edit_image',
        {
          body: {
            model: 'nano-banana-edit',
            prompt: 'Add flying cars',
            source_image_urls: ['https://cdn.runapi.ai/public/samples/photo.jpg'],
            callback_url: 'https://example.com/callback',
            output_format: 'png',
            aspect_ratio: '16:9',
          },
        }
      );
    });

    it('should handle multiple image URLs', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-789' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const editImage = new EditImage(mockHttp);
      await editImage.create({
        model: 'nano-banana-edit',
        prompt: 'Create a collage',
        source_image_urls: [
          'https://cdn.runapi.ai/public/samples/photo-1.jpg',
          'https://cdn.runapi.ai/public/samples/photo-2.jpg',
          'https://cdn.runapi.ai/public/samples/photo-3.jpg',
        ],
      });

      const callArgs = vi.mocked(mockHttp.request).mock.calls[0];
      expect(callArgs[2]?.body).toHaveProperty('source_image_urls');
      expect((callArgs[2]?.body as any).source_image_urls).toHaveLength(3);
    });
  });

  describe('get', () => {
    it('should fetch task status by ID', async () => {
      const mockResponse: EditImageResponse = {
        id: 'task-123',
        status: 'processing',
        model: 'nano-banana-edit',
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const editImage = new EditImage(mockHttp);
      const result = await editImage.get('task-123');

      expect(mockHttp.request).toHaveBeenCalledWith(
        'GET',
        '/api/v1/nano_banana/edit_image/task-123',
        {}
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return completed status with results', async () => {
      const mockResponse: EditImageResponse = {
        id: 'task-123',
        status: 'completed',
        model: 'nano-banana-edit',
        images: [{ url: 'https://cdn.runapi.ai/public/samples/result.png' }],
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const editImage = new EditImage(mockHttp);
      const result = await editImage.get('task-123');

      expect(result.status).toBe('completed');
      expect(result.images).toEqual([{ url: 'https://cdn.runapi.ai/public/samples/result.png' }]);
    });

    it('should return failed status with error', async () => {
      const mockResponse: EditImageResponse = {
        id: 'task-123',
        status: 'failed',
        model: 'nano-banana-edit',
        error: 'Failed to fetch the image',
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const editImage = new EditImage(mockHttp);
      const result = await editImage.get('task-123');

      expect(result.status).toBe('failed');
      expect(result.error).toBe('Failed to fetch the image');
    });
  });

  describe('run', () => {
    it('should create and poll until completion', async () => {
      const createResponse: TaskCreateResponse = { id: 'task-123' };
      const processingResponse: EditImageResponse = {
        id: 'task-123',
        status: 'processing',
        model: 'nano-banana-edit',
      };
      const completedResponse: EditImageResponse = {
        id: 'task-123',
        status: 'completed',
        model: 'nano-banana-edit',
        images: [{ url: 'https://cdn.runapi.ai/public/samples/result.png' }],
      };

      vi.mocked(mockHttp.request)
        .mockResolvedValueOnce(createResponse)
        .mockResolvedValueOnce(processingResponse)
        .mockResolvedValueOnce(completedResponse);

      const editImage = new EditImage(mockHttp);
      const result = await editImage.run({
        model: 'nano-banana-edit',
        prompt: 'Edit this image',
        source_image_urls: ['https://cdn.runapi.ai/public/samples/input.jpg'],
      });

      expect(result.status).toBe('completed');
      expect(result.images).toEqual([{ url: 'https://cdn.runapi.ai/public/samples/result.png' }]);
    });
  });
});
