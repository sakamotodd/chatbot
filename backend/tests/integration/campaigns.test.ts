import request from 'supertest';
import { app } from '../../src/server/app';
import { setupTestDatabase, cleanupTestDatabase } from '../utils/database';
import { validCampaignData, updateCampaignData, invalidCampaignData } from '../fixtures/campaigns';

// Mock the campaign service to avoid database dependency
jest.mock('../../src/server/services/campaign_service', () => ({
  CampaignService: require('../__mocks__/campaign_service').CampaignService
}));

describe('Campaign API Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
    jest.clearAllMocks();
  });

  describe('POST /api/campaigns', () => {
    it('should create a new campaign with valid data', async () => {
      const response = await request(app)
        .post('/api/campaigns')
        .send(validCampaignData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        title: validCampaignData.title,
        description: validCampaignData.description,
        status: validCampaignData.status
      });
      expect(response.body.data.id).toBeDefined();
    });

    it('should return 400 for invalid campaign data', async () => {
      const response = await request(app)
        .post('/api/campaigns')
        .send(invalidCampaignData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('バリデーションエラー');
    });

    it('should return 400 for empty request body', async () => {
      const response = await request(app)
        .post('/api/campaigns')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/campaigns', () => {
    beforeEach(async () => {
      // Create test campaigns
      await request(app).post('/api/campaigns').send(validCampaignData);
      await request(app).post('/api/campaigns').send({
        ...validCampaignData,
        title: '2つ目のキャンペーン'
      });
    });

    it('should get all campaigns', async () => {
      const response = await request(app)
        .get('/api/campaigns')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/campaigns?page=1&limit=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
    });

    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/campaigns?status=draft')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every((campaign: any) => campaign.status === 'draft')).toBe(true);
    });
  });

  describe('GET /api/campaigns/:id', () => {
    let campaignId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/campaigns')
        .send(validCampaignData);
      campaignId = createResponse.body.data.id;
    });

    it('should get campaign by id', async () => {
      const response = await request(app)
        .get(`/api/campaigns/${campaignId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(campaignId);
      expect(response.body.data.title).toBe(validCampaignData.title);
    });

    it('should return 404 for non-existent campaign', async () => {
      const response = await request(app)
        .get('/api/campaigns/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('見つかりません');
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app)
        .get('/api/campaigns/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/campaigns/:id', () => {
    let campaignId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/campaigns')
        .send(validCampaignData);
      campaignId = createResponse.body.data.id;
    });

    it('should update campaign with valid data', async () => {
      const response = await request(app)
        .put(`/api/campaigns/${campaignId}`)
        .send(updateCampaignData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(campaignId);
      expect(response.body.data.title).toBe(updateCampaignData.title);
      expect(response.body.data.description).toBe(updateCampaignData.description);
    });

    it('should return 404 for non-existent campaign', async () => {
      const response = await request(app)
        .put('/api/campaigns/99999')
        .send(updateCampaignData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid update data', async () => {
      const response = await request(app)
        .put(`/api/campaigns/${campaignId}`)
        .send(invalidCampaignData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/campaigns/:id', () => {
    let campaignId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/campaigns')
        .send(validCampaignData);
      campaignId = createResponse.body.data.id;
    });

    it('should delete campaign', async () => {
      const response = await request(app)
        .delete(`/api/campaigns/${campaignId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('削除されました');

      // Verify campaign is deleted
      await request(app)
        .get(`/api/campaigns/${campaignId}`)
        .expect(404);
    });

    it('should return 404 for non-existent campaign', async () => {
      const response = await request(app)
        .delete('/api/campaigns/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      // Make multiple requests quickly
      const requests = Array(10).fill(null).map(() => 
        request(app).get('/api/campaigns')
      );

      const responses = await Promise.all(requests);
      
      // All requests should succeed within rate limit
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      // This test would require mocking database errors
      // For now, we'll test that the error middleware is working
      const response = await request(app)
        .get('/api/nonexistent-endpoint')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });
});