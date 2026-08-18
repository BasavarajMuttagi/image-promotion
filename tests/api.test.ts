import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import app from '../src/api.ts';

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

  describe('Non-existent route', () => {
    it('should return 404 for non-existent route', async () => {
      const response = await request.get('/nonexistent');
      expect(response.status).toBe(404);
    });
  });
});
