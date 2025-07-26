import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import PrizeService from '../services/prizes'
import type {
  Prize,
  PrizeCreateRequest,
  PrizeUpdateRequest,
  PrizeStatistics,
  PaginationInfo,
} from '../types/api'

export const usePrizeStore = defineStore('prizes', () => {
  // State
  const prizes = ref<Prize[]>([])
  const currentPrize = ref<Prize | null>(null)
  const prizeStatistics = ref<PrizeStatistics | null>(null)
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
  const getPrizeById = computed(() => {
    return (id: number) => prizes.value.find(p => p.id === id)
  })

  const activePrizes = computed(() => {
    return prizes.value.filter(p => p.is_daily_lottery)
  })

  const totalPrizes = computed(() => pagination.value.total)

  // Actions
  async function fetchPrizes(
    campaignId: number,
    params?: {
      page?: number
      limit?: number
      include_templates?: boolean
      include_nodes?: boolean
      include_messages?: boolean
    }
  ) {
    loading.value = true
    error.value = null

    try {
      const result = await PrizeService.getAllPrizes(campaignId, params)
      prizes.value = result.items
      pagination.value = result.pagination
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch prizes'
      console.error('Error fetching prizes:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchPrizeById(
    id: number,
    options?: {
      include_templates?: boolean
      include_nodes?: boolean
      include_messages?: boolean
    }
  ) {
    loading.value = true
    error.value = null

    try {
      const prize = await PrizeService.getPrizeById(id, options)
      currentPrize.value = prize

      // Update in prizes list if exists
      const index = prizes.value.findIndex(p => p.id === id)
      if (index !== -1) {
        prizes.value[index] = prize
      }

      return prize
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch prize'
      console.error('Error fetching prize:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchPrizeStatistics(id: number) {
    loading.value = true
    error.value = null

    try {
      const statistics = await PrizeService.getPrizeStatistics(id)
      prizeStatistics.value = statistics
      return statistics
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch prize statistics'
      console.error('Error fetching prize statistics:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createPrize(
    campaignId: number,
    prizeData: PrizeCreateRequest
  ) {
    loading.value = true
    error.value = null

    try {
      const newPrize = await PrizeService.createPrize(campaignId, prizeData)
      prizes.value.unshift(newPrize)
      return newPrize
    } catch (err: any) {
      error.value = err.message || 'Failed to create prize'
      console.error('Error creating prize:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePrize(
    id: number,
    prizeData: PrizeUpdateRequest
  ) {
    loading.value = true
    error.value = null

    try {
      const updatedPrize = await PrizeService.updatePrize(id, prizeData)
      
      // Update in prizes list
      const index = prizes.value.findIndex(p => p.id === id)
      if (index !== -1) {
        prizes.value[index] = updatedPrize
      }

      // Update current prize if it's the same
      if (currentPrize.value?.id === id) {
        currentPrize.value = updatedPrize
      }

      return updatedPrize
    } catch (err: any) {
      error.value = err.message || 'Failed to update prize'
      console.error('Error updating prize:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePrize(id: number) {
    loading.value = true
    error.value = null

    try {
      await PrizeService.deletePrize(id)
      
      // Remove from prizes list
      const index = prizes.value.findIndex(p => p.id === id)
      if (index !== -1) {
        prizes.value.splice(index, 1)
      }

      // Clear current prize if it's the same
      if (currentPrize.value?.id === id) {
        currentPrize.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete prize'
      console.error('Error deleting prize:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function clearCurrentPrize() {
    currentPrize.value = null
  }

  function clearStatistics() {
    prizeStatistics.value = null
  }

  return {
    // State
    prizes,
    currentPrize,
    prizeStatistics,
    pagination,
    loading,
    error,

    // Getters
    getPrizeById,
    activePrizes,
    totalPrizes,

    // Actions
    fetchPrizes,
    fetchPrizeById,
    fetchPrizeStatistics,
    createPrize,
    updatePrize,
    deletePrize,
    clearError,
    clearCurrentPrize,
    clearStatistics,
  }
})