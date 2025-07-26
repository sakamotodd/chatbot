import api from './api'
import type {
  Campaign,
  CampaignCreateRequest,
  CampaignUpdateRequest,
  ApiResponse,
  PaginatedResponse,
} from '../types/api'

export class CampaignService {
  private static readonly BASE_PATH = '/campaigns'

  // Get all campaigns
  static async getAllCampaigns(params?: {
    page?: number
    limit?: number
    include_prizes?: boolean
  }): Promise<PaginatedResponse<Campaign>> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.include_prizes) searchParams.append('include_prizes', 'true')

    const response = await api.get<ApiResponse<{ campaigns: Campaign[]; pagination: any }>>(
      `${this.BASE_PATH}?${searchParams.toString()}`
    )

    return {
      items: response.data.data?.campaigns || [],
      pagination: response.data.data?.pagination || {
        total: 0,
        page: 1,
        limit: 10,
        total_pages: 0,
        has_next_page: false,
        has_prev_page: false,
      },
    }
  }

  // Get campaign by ID
  static async getCampaignById(
    id: number,
    options?: { include_prizes?: boolean }
  ): Promise<Campaign> {
    const searchParams = new URLSearchParams()
    if (options?.include_prizes) searchParams.append('include_prizes', 'true')

    const queryString = searchParams.toString()
    const url = queryString ? `${this.BASE_PATH}/${id}?${queryString}` : `${this.BASE_PATH}/${id}`

    const response = await api.get<ApiResponse<Campaign>>(url)
    
    if (!response.data.data) {
      throw new Error('Campaign not found')
    }
    
    return response.data.data
  }

  // Create new campaign
  static async createCampaign(campaignData: CampaignCreateRequest): Promise<Campaign> {
    const response = await api.post<ApiResponse<Campaign>>(
      this.BASE_PATH,
      campaignData
    )
    
    if (!response.data.data) {
      throw new Error('Failed to create campaign')
    }
    
    return response.data.data
  }

  // Update campaign
  static async updateCampaign(
    id: number,
    campaignData: CampaignUpdateRequest
  ): Promise<Campaign> {
    const response = await api.put<ApiResponse<Campaign>>(
      `${this.BASE_PATH}/${id}`,
      campaignData
    )
    
    if (!response.data.data) {
      throw new Error('Failed to update campaign')
    }
    
    return response.data.data
  }

  // Delete campaign
  static async deleteCampaign(id: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`)
  }
}

export default CampaignService