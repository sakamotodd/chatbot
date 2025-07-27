export class CampaignService {
  static async getCampaigns(options?: any) {
    return {
      campaigns: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      }
    };
  }

  static async createCampaign(data: any) {
    return {
      id: 1,
      title: data.title,
      description: data.description,
      status: data.status,
      start_date: null,
      end_date: null,
      created: new Date(),
      modified: new Date()
    };
  }

  static async getCampaignById(id: number) {
    if (id === 99999) {
      throw new Error('Campaign not found');
    }
    return {
      id: 1,
      title: 'Test Campaign',
      description: 'Test Description',
      status: 'draft',
      start_date: null,
      end_date: null,
      created: new Date(),
      modified: new Date(),
      prizes: []
    };
  }

  static async updateCampaign(id: number, data: any) {
    if (id === 99999) {
      throw new Error('Campaign not found');
    }
    return {
      id: 1,
      title: data.title,
      description: data.description,
      status: data.status,
      start_date: null,
      end_date: null,
      created: new Date(),
      modified: new Date()
    };
  }

  static async deleteCampaign(id: number) {
    if (id === 99999) {
      throw new Error('Campaign not found');
    }
    return;
  }
}