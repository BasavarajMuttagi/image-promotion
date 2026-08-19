import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import app from '../src/api.js';

const request = supertest(app);

describe('API Tests', () => {
  describe('GET /', () => {
    it('should return server running message', async () => {
      const response = await request.get('/');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Server is running' });
    });
  });

  describe('GET /health', () => {
    it('should return health status with uptime and timestamp', async () => {
      const response = await request.get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.uptime).toBeDefined();
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.timestamp).toBeDefined();
      expect(typeof response.body.timestamp).toBe('string');
      expect(new Date(response.body.timestamp).toISOString()).toBe(
        response.body.timestamp,
      );
    });
  });

  describe('POST /api/images', () => {
    it('should create a new image', async () => {
      const response = await request
        .post('/api/images')
        .send({ name: 'test-image', url: 'https://example.com/image.jpg' });
      expect(response.status).toBe(201);
      expect(response.body.name).toBe('test-image');
      expect(response.body.url).toBe('https://example.com/image.jpg');
      expect(response.body.environment).toBe('dev');
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    it('should return 400 when name is missing', async () => {
      const response = await request
        .post('/api/images')
        .send({ url: 'https://example.com/image.jpg' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('name and url are required');
    });

    it('should return 400 when url is missing', async () => {
      const response = await request
        .post('/api/images')
        .send({ name: 'test-image' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('name and url are required');
    });

    it('should accept custom environment', async () => {
      const response = await request.post('/api/images').send({
        name: 'test-image',
        url: 'https://example.com/image.jpg',
        environment: 'production',
      });
      expect(response.status).toBe(201);
      expect(response.body.environment).toBe('production');
    });
  });

  describe('GET /api/images', () => {
    it('should return empty array when no images exist', async () => {
      const response = await request.get('/api/images');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return list of images', async () => {
      await request
        .post('/api/images')
        .send({ name: 'image-1', url: 'https://example.com/1.jpg' });
      await request
        .post('/api/images')
        .send({ name: 'image-2', url: 'https://example.com/2.jpg' });
      const response = await request.get('/api/images');
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(
        response.body.some((img: { name: string }) => img.name === 'image-1'),
      ).toBe(true);
      expect(
        response.body.some((img: { name: string }) => img.name === 'image-2'),
      ).toBe(true);
    });
  });

  describe('Non-existent route', () => {
    it('should return 404 for non-existent route', async () => {
      const response = await request.get('/nonexistent');
      expect(response.status).toBe(404);
    });
  });
});
