import { CampaignService } from '../../../src/server/services/campaign_service';
import { Campaign } from '../../../database/models/campaigns';
import { InInstantwinPrize } from '../../../database/models/in_instantwin_prizes';

// Mock the models
jest.mock('../../../database/models/campaigns');
jest.mock('../../../database/models/in_instantwin_prizes');
jest.mock('../../../src/server/utils/logger');

const MockedCampaign = Campaign as jest.Mocked<typeof Campaign>;
const MockedInInstantwinPrize = InInstantwinPrize as jest.Mocked<typeof InInstantwinPrize>;

describe('CampaignService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCampaigns', () => {
    const mockCampaigns = [
      {
        id: 1,
        title: 'Test Campaign 1',
        description: 'Description 1',
        status: 'active',
        prizes: []
      },
      {
        id: 2,
        title: 'Test Campaign 2',
        description: 'Description 2',
        status: 'draft',
        prizes: []
      }
    ];

    it('should return paginated campaigns with default options', async () => {
      MockedCampaign.findAndCountAll.mockResolvedValue({
        count: [{ count: 2 }] as any,
        rows: mockCampaigns as any[]
      });

      const result = await CampaignService.getAllCampaigns({});

      expect(MockedCampaign.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        include: [{
          model: InInstantwinPrize,
          as: 'prizes',
          attributes: ['id', 'name', 'winning_rate']
        }],
        order: [['created', 'DESC']],
        limit: 20,
        offset: 0
      });

      expect(result).toEqual({
        campaigns: mockCampaigns,
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1
        }
      });
    });

    it('should apply search filter', async () => {
      MockedCampaign.findAndCountAll.mockResolvedValue({
        count: [{ count: 1 }] as any,
        rows: [mockCampaigns[0]] as any[]
      });

      await CampaignService.getAllCampaigns({ search: 'Test' });

      expect(MockedCampaign.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            [Symbol.for('or')]: expect.any(Array)
          })
        })
      );
    });

    it('should apply status filter', async () => {
      MockedCampaign.findAndCountAll.mockResolvedValue({
        count: [{ count: 1 }] as any,
        rows: [mockCampaigns[0]] as any[]
      });

      await CampaignService.getAllCampaigns({ status: 'active' });

      expect(MockedCampaign.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'active' }
        })
      );
    });

    it('should handle pagination correctly', async () => {
      MockedCampaign.findAndCountAll.mockResolvedValue({
        count: [{ count: 25 }] as any,
        rows: mockCampaigns as any[]
      });

      const result = await CampaignService.getAllCampaigns({ page: 2, limit: 10 });

      expect(MockedCampaign.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 10
        })
      );

      expect(result.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3
      });
    });

    it('should throw error when database query fails', async () => {
      const dbError = new Error('Database connection failed');
      MockedCampaign.findAndCountAll.mockRejectedValue(dbError);

      await expect(CampaignService.getAllCampaigns({})).rejects.toThrow(dbError);
    });
  });

  describe('getCampaignById', () => {
    const mockCampaign = {
      id: 1,
      title: 'Test Campaign',
      description: 'Test Description',
      status: 'active',
      prizes: []
    };

    it('should return campaign when found', async () => {
      MockedCampaign.findByPk.mockResolvedValue(mockCampaign as any);

      const result = await CampaignService.getCampaignById(1);

      expect(MockedCampaign.findByPk).toHaveBeenCalledWith(1, {
        include: [{
          model: InInstantwinPrize,
          as: 'prizes'
        }]
      });
      expect(result).toEqual(mockCampaign);
    });

    it('should throw 404 error when campaign not found', async () => {
      MockedCampaign.findByPk.mockResolvedValue(null);

      await expect(CampaignService.getCampaignById(999)).rejects.toMatchObject({
        message: 'キャンペーンが見つかりません',
        statusCode: 404
      });
    });

    it('should throw error when database query fails', async () => {
      const dbError = new Error('Database error');
      MockedCampaign.findByPk.mockRejectedValue(dbError);

      await expect(CampaignService.getCampaignById(1)).rejects.toThrow(dbError);
    });
  });

  describe('createCampaign', () => {
    const campaignData = {
      title: 'New Campaign',
      description: 'New Description',
      status: 'draft' as const
    };

    const mockCreatedCampaign = {
      id: 1,
      ...campaignData
    };

    it('should create campaign successfully', async () => {
      MockedCampaign.create.mockResolvedValue(mockCreatedCampaign as any);

      const result = await CampaignService.createCampaign(campaignData);

      expect(MockedCampaign.create).toHaveBeenCalledWith(campaignData);
      expect(result).toEqual(mockCreatedCampaign);
    });

    it('should throw error when creation fails', async () => {
      const createError = new Error('Creation failed');
      MockedCampaign.create.mockRejectedValue(createError);

      await expect(CampaignService.createCampaign(campaignData)).rejects.toThrow(createError);
    });
  });

  describe('updateCampaign', () => {
    const mockCampaign = {
      id: 1,
      title: 'Original Title',
      description: 'Original Description',
      status: 'draft',
      update: jest.fn()
    };

    const updateData = {
      title: 'Updated Title',
      status: 'active' as const
    };

    it('should update campaign successfully', async () => {
      MockedCampaign.findByPk.mockResolvedValue(mockCampaign as any);
      mockCampaign.update.mockResolvedValue(undefined);

      const result = await CampaignService.updateCampaign(1, updateData);

      expect(MockedCampaign.findByPk).toHaveBeenCalledWith(1);
      expect(mockCampaign.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(mockCampaign);
    });

    it('should throw 404 error when campaign not found', async () => {
      MockedCampaign.findByPk.mockResolvedValue(null);

      await expect(CampaignService.updateCampaign(999, updateData)).rejects.toMatchObject({
        message: 'キャンペーンが見つかりません',
        statusCode: 404
      });
    });

    it('should throw error when update fails', async () => {
      MockedCampaign.findByPk.mockResolvedValue(mockCampaign as any);
      const updateError = new Error('Update failed');
      mockCampaign.update.mockRejectedValue(updateError);

      await expect(CampaignService.updateCampaign(1, updateData)).rejects.toThrow(updateError);
    });
  });

  describe('deleteCampaign', () => {
    const mockCampaign = {
      id: 1,
      title: 'Campaign to Delete',
      destroy: jest.fn()
    };

    it('should delete campaign successfully', async () => {
      MockedCampaign.findByPk.mockResolvedValue(mockCampaign as any);
      mockCampaign.destroy.mockResolvedValue(undefined);

      const result = await CampaignService.deleteCampaign(1);

      expect(MockedCampaign.findByPk).toHaveBeenCalledWith(1);
      expect(mockCampaign.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw 404 error when campaign not found', async () => {
      MockedCampaign.findByPk.mockResolvedValue(null);

      await expect(CampaignService.deleteCampaign(999)).rejects.toMatchObject({
        message: 'キャンペーンが見つかりません',
        statusCode: 404
      });
    });

    it('should throw error when deletion fails', async () => {
      MockedCampaign.findByPk.mockResolvedValue(mockCampaign as any);
      const deleteError = new Error('Delete failed');
      mockCampaign.destroy.mockRejectedValue(deleteError);

      await expect(CampaignService.deleteCampaign(1)).rejects.toThrow(deleteError);
    });
  });

  describe('getCampaignStats', () => {
    const mockCampaignWithPrizes = {
      id: 1,
      title: 'Campaign with Stats',
      prizes: [
        { id: 1, name: 'Prize 1', winner_count: 10, winning_rate: 0.1 },
        { id: 2, name: 'Prize 2', winner_count: 20, winning_rate: 0.2 }
      ]
    };

    it('should return campaign stats successfully', async () => {
      MockedCampaign.findByPk.mockResolvedValue(mockCampaignWithPrizes as any);

      const result = await CampaignService.getCampaignStats(1);

      expect(result).toEqual({
        campaign: mockCampaignWithPrizes,
        stats: {
          totalPrizes: 2,
          totalWinners: 30,
          averageWinningRate: 0.15
        }
      });
    });

    it('should handle campaign with no prizes', async () => {
      const campaignNoPrizes = { ...mockCampaignWithPrizes, prizes: [] };
      MockedCampaign.findByPk.mockResolvedValue(campaignNoPrizes as any);

      const result = await CampaignService.getCampaignStats(1);

      expect(result.stats).toEqual({
        totalPrizes: 0,
        totalWinners: 0,
        averageWinningRate: 0
      });
    });

    it('should throw 404 error when campaign not found', async () => {
      MockedCampaign.findByPk.mockResolvedValue(null);

      await expect(CampaignService.getCampaignStats(999)).rejects.toMatchObject({
        message: 'キャンペーンが見つかりません',
        statusCode: 404
      });
    });
  });
});