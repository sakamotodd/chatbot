import api from './api'
import type {
  Prize,
  PrizeCreateRequest,
  PrizeUpdateRequest,
  PrizeStatistics,
  ApiResponse,
  PaginatedResponse,
} from '../types/api'

export class PrizeService {
  private static readonly BASE_PATH = '/in_instantwin_prizes'

  // Get all prizes for a campaign
  static async getAllPrizes(
    campaignId: number,
    params?: {
      page?: number
      limit?: number
      include_templates?: boolean
      include_nodes?: boolean
      include_messages?: boolean
    }
  ): Promise<PaginatedResponse<Prize>> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.include_templates) searchParams.append('include_templates', 'true')
    if (params?.include_nodes) searchParams.append('include_nodes', 'true')
    if (params?.include_messages) searchParams.append('include_messages', 'true')

    const response = await api.get<ApiResponse<{ in_instantwin_prizes: Prize[]; pagination: any }>>(
      `/campaigns/${campaignId}${this.BASE_PATH}?${searchParams.toString()}`
    )

    return {
      items: response.data.data?.in_instantwin_prizes || [],
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

  // Get prize by ID
  static async getPrizeById(
    id: number,
    options?: {
      include_templates?: boolean
      include_nodes?: boolean
      include_messages?: boolean
    }
  ): Promise<Prize> {
    const searchParams = new URLSearchParams()
    if (options?.include_templates) searchParams.append('include_templates', 'true')
    if (options?.include_nodes) searchParams.append('include_nodes', 'true')
    if (options?.include_messages) searchParams.append('include_messages', 'true')

    const queryString = searchParams.toString()
    const url = queryString ? `${this.BASE_PATH}/${id}?${queryString}` : `${this.BASE_PATH}/${id}`

    const response = await api.get<ApiResponse<Prize>>(url)
    
    if (!response.data.data) {
      throw new Error('Prize not found')
    }
    
    return response.data.data
  }

  // Get prize statistics
  static async getPrizeStatistics(id: number): Promise<PrizeStatistics> {
    const response = await api.get<ApiResponse<PrizeStatistics>>(
      `${this.BASE_PATH}/${id}/statistics`
    )
    
    if (!response.data.data) {
      throw new Error('Prize statistics not found')
    }
    
    return response.data.data
  }

  // Create new prize
  static async createPrize(
    campaignId: number,
    prizeData: PrizeCreateRequest
  ): Promise<Prize> {
    const response = await api.post<ApiResponse<Prize>>(
      `/campaigns/${campaignId}${this.BASE_PATH}`,
      prizeData
    )
    
    if (!response.data.data) {
      throw new Error('Failed to create prize')
    }
    
    return response.data.data
  }

  // Update prize
  static async updatePrize(
    id: number,
    prizeData: PrizeUpdateRequest
  ): Promise<Prize> {
    const response = await api.put<ApiResponse<Prize>>(
      `${this.BASE_PATH}/${id}`,
      prizeData
    )
    
    if (!response.data.data) {
      throw new Error('Failed to update prize')
    }
    
    return response.data.data
  }

  // Delete prize
  static async deletePrize(id: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`)
  }
}

export default PrizeService