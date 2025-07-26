import request from 'supertest';
import { app } from '../../src/server/app';

describe('App Integration Tests', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('サーバーは正常に動作しています');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.environment).toBeDefined();
    });
  });

  describe('CORS Middleware', () => {
    it('should set CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should handle preflight requests', async () => {
      const response = await request(app)
        .options('/api/campaigns')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'POST')
        .expect(204);

      expect(response.headers['access-control-allow-methods']).toBeDefined();
    });
  });

  describe('Security Middleware', () => {
    it('should set security headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Helmet security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
    });
  });

  describe('JSON Parsing', () => {
    it('should parse JSON request bodies', async () => {
      const testData = { test: 'data' };
      
      await request(app)
        .post('/api/campaigns')
        .send(testData)
        .expect(400); // Will fail validation but should parse JSON
    });

    it('should handle large JSON payloads within limit', async () => {
      const largeData = {
        title: 'A'.repeat(1000),
        description: 'B'.repeat(5000)
      };

      await request(app)
        .post('/api/campaigns')
        .send(largeData)
        .expect(400); // Will fail validation but should accept the payload size
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('見つかりません');
    });
  });

  describe('Content-Type Headers', () => {
    it('should set UTF-8 charset for API responses', async () => {
      const response = await request(app)
        .get('/api/campaigns')
        .expect(200);

      expect(response.headers['content-type']).toContain('application/json; charset=utf-8');
    });
  });
});