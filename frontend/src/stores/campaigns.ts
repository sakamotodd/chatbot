import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import CampaignService from '../services/campaigns'
import type {
  Campaign,
  CampaignCreateRequest,
  CampaignUpdateRequest,
  PaginationInfo,
} from '../types/api'

export const useCampaignStore = defineStore('campaigns', () => {
  // State
  const campaigns = ref<Campaign[]>([])
  const currentCampaign = ref<Campaign | null>(null)
  const pagination = ref<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 0,
    has_next_page: false,
    has_prev_page: false,
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getCampaignById = computed(() => {
    return (id: number) => campaigns.value.find(c => c.id === id)
  })

  const activeCampaigns = computed(() => {
    return campaigns.value.filter(c => c.is_active)
  })

  const totalCampaigns = computed(() => pagination.value.total)

  // Actions
  async function fetchCampaigns(params?: {
    page?: number
    limit?: number
    include_prizes?: boolean
  }) {
    loading.value = true
    error.value = null

    try {
      const result = await CampaignService.getAllCampaigns(params)
      campaigns.value = result.items
      pagination.value = result.pagination
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch campaigns'
      console.error('Error fetching campaigns:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchCampaignById(
    id: number,
    options?: { include_prizes?: boolean }
  ) {
    loading.value = true
    error.value = null

    try {
      const campaign = await CampaignService.getCampaignById(id, options)
      currentCampaign.value = campaign

      // Update in campaigns list if exists
      const index = campaigns.value.findIndex(c => c.id === id)
      if (index !== -1) {
        campaigns.value[index] = campaign
      }

      return campaign
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch campaign'
      console.error('Error fetching campaign:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createCampaign(campaignData: CampaignCreateRequest) {
    loading.value = true
    error.value = null

    try {
      const newCampaign = await CampaignService.createCampaign(campaignData)
      campaigns.value.unshift(newCampaign)
      return newCampaign
    } catch (err: any) {
      error.value = err.message || 'Failed to create campaign'
      console.error('Error creating campaign:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCampaign(
    id: number,
    campaignData: CampaignUpdateRequest
  ) {
    loading.value = true
    error.value = null

    try {
      const updatedCampaign = await CampaignService.updateCampaign(id, campaignData)
      
      // Update in campaigns list
      const index = campaigns.value.findIndex(c => c.id === id)
      if (index !== -1) {
        campaigns.value[index] = updatedCampaign
      }

      // Update current campaign if it's the same
      if (currentCampaign.value?.id === id) {
        currentCampaign.value = updatedCampaign
      }

      return updatedCampaign
    } catch (err: any) {
      error.value = err.message || 'Failed to update campaign'
      console.error('Error updating campaign:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCampaign(id: number) {
    loading.value = true
    error.value = null

    try {
      await CampaignService.deleteCampaign(id)
      
      // Remove from campaigns list
      const index = campaigns.value.findIndex(c => c.id === id)
      if (index !== -1) {
        campaigns.value.splice(index, 1)
      }

      // Clear current campaign if it's the same
      if (currentCampaign.value?.id === id) {
        currentCampaign.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete campaign'
      console.error('Error deleting campaign:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function clearCurrentCampaign() {
    currentCampaign.value = null
  }

  return {
    // State
    campaigns,
    currentCampaign,
    pagination,
    loading,
    error,

    // Getters
    getCampaignById,
    activeCampaigns,
    totalCampaigns,

    // Actions
    fetchCampaigns,
    fetchCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    clearError,
    clearCurrentCampaign,
  }
})