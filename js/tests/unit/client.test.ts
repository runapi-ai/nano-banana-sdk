import { describe, it, expect } from 'vitest';
import { AuthenticationError } from '@runapi.ai/core';
import { NanoBananaClient } from '../../src';

describe('NanoBananaClient', () => {
  it('should initialize with an API key', () => {
    const client = new NanoBananaClient({ apiKey: 'test-key' });
    expect(client.textToImage).toBeDefined();
    expect(client.editImage).toBeDefined();
  });

  it('should throw if no API key is provided', () => {
    // @ts-expect-error: testing missing API key
    expect(() => new NanoBananaClient({})).toThrow(AuthenticationError);
  });

  it('should have textToImage resource accessible', () => {
    const client = new NanoBananaClient({ apiKey: 'test-key' });
    expect(client.textToImage).toBeDefined();
    expect(typeof client.textToImage.run).toBe('function');
    expect(typeof client.textToImage.create).toBe('function');
    expect(typeof client.textToImage.get).toBe('function');
  });

  it('should have editImage resource accessible', () => {
    const client = new NanoBananaClient({ apiKey: 'test-key' });
    expect(client.editImage).toBeDefined();
    expect(typeof client.editImage.run).toBe('function');
    expect(typeof client.editImage.create).toBe('function');
    expect(typeof client.editImage.get).toBe('function');
  });
});
