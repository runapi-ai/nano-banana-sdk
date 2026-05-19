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
        image_urls: ['https://example.com/input.jpg'],
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/nano_banana/edit_image',
        {
          body: {
            model: 'nano-banana-edit',
            prompt: 'Transform into watercolor painting',
            image_urls: ['https://example.com/input.jpg'],
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
        image_urls: ['https://example.com/photo.jpg'],
        callback_url: 'https://example.com/callback',
        output_format: 'png',
        image_size: '16:9',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/nano_banana/edit_image',
        {
          body: {
            model: 'nano-banana-edit',
            prompt: 'Add flying cars',
            image_urls: ['https://example.com/photo.jpg'],
            callback_url: 'https://example.com/callback',
            output_format: 'png',
            image_size: '16:9',
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
        image_urls: [
          'https://example.com/photo1.jpg',
          'https://example.com/photo2.jpg',
          'https://example.com/photo3.jpg',
        ],
      });

      const callArgs = vi.mocked(mockHttp.request).mock.calls[0];
      expect(callArgs[2]?.body).toHaveProperty('image_urls');
      expect((callArgs[2]?.body as any).image_urls).toHaveLength(3);
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
        result_urls: ['https://example.com/edited.png'],
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const editImage = new EditImage(mockHttp);
      const result = await editImage.get('task-123');

      expect(result.status).toBe('completed');
      expect(result.result_urls).toEqual(['https://example.com/edited.png']);
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
        result_urls: ['https://example.com/edited.png'],
      };

      vi.mocked(mockHttp.request)
        .mockResolvedValueOnce(createResponse)
        .mockResolvedValueOnce(processingResponse)
        .mockResolvedValueOnce(completedResponse);

      const editImage = new EditImage(mockHttp);
      const result = await editImage.run({
        model: 'nano-banana-edit',
        prompt: 'Edit this image',
        image_urls: ['https://example.com/input.jpg'],
      });

      expect(result.status).toBe('completed');
      expect(result.result_urls).toEqual(['https://example.com/edited.png']);
    });
  });
});
