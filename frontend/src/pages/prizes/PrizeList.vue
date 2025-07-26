<template>
  <div class="prize-list">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">プライズ管理</h1>
      <p class="mt-2 text-sm text-gray-600">
        キャンペーンのプライズを管理できます。
      </p>
    </div>

    <!-- キャンペーン選択 -->
    <div class="mb-6 bg-white shadow rounded-lg p-4">
      <label for="campaign-select" class="block text-sm font-medium text-gray-700 mb-2">
        キャンペーンを選択
      </label>
      <select
        id="campaign-select"
        v-model="selectedCampaignId"
        @change="loadPrizes"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="">キャンペーンを選択してください</option>
        <option
          v-for="campaign in campaignStore.campaigns"
          :key="campaign.id"
          :value="campaign.id"
        >
          {{ campaign.name }}
        </option>
      </select>
    </div>

    <!-- アクションボタン -->
    <div class="mb-6 flex justify-between items-center">
      <div class="flex space-x-3">
        <button
          @click="loadPrizes"
          :disabled="!selectedCampaignId || prizeStore.loading"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="prizeStore.loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            読込中...
          </span>
          <span v-else>更新</span>
        </button>
      </div>
      <button
        @click="openCreateModal"
        :disabled="!selectedCampaignId"
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        新しいプライズを作成
      </button>
    </div>

    <!-- エラーメッセージ -->
    <div v-if="prizeStore.error" class="mb-4 rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            エラーが発生しました
          </h3>
          <div class="mt-2 text-sm text-red-700">
            {{ prizeStore.error }}
          </div>
        </div>
      </div>
    </div>

    <!-- プライズ一覧 -->
    <div v-if="selectedCampaignId" class="bg-white shadow overflow-hidden sm:rounded-md">
      <div v-if="prizeStore.prizes.length === 0 && !prizeStore.loading" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">プライズがありません</h3>
        <p class="mt-1 text-sm text-gray-500">最初のプライズを作成してください。</p>
        <div class="mt-6">
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            新しいプライズを作成
          </button>
        </div>
      </div>

      <ul v-else class="divide-y divide-gray-200">
        <li v-for="prize in prizeStore.prizes" :key="prize.id">
          <div class="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
            <div class="flex items-center">
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ prize.name }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ prize.description }}
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-500">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    当選率: {{ prize.winning_rate }}%
                  </span>
                  <span class="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    当選者数: {{ prize.send_winner_count }}/{{ prize.winner_count }}
                  </span>
                  <span v-if="prize.is_daily_lottery" class="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    日次抽選
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="viewStatistics(prize.id)"
                class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
              >
                統計
              </button>
              <button
                @click="editPrize(prize)"
                class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
              >
                編集
              </button>
              <button
                @click="deletePrize(prize)"
                class="text-red-600 hover:text-red-900 text-sm font-medium"
              >
                削除
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- ページネーション -->
    <div v-if="prizeStore.prizes.length > 0" class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        {{ prizeStore.pagination.total }} 件中 {{ ((prizeStore.pagination.page - 1) * prizeStore.pagination.limit) + 1 }} - 
        {{ Math.min(prizeStore.pagination.page * prizeStore.pagination.limit, prizeStore.pagination.total) }} 件を表示
      </div>
      <div class="flex space-x-2">
        <button
          @click="previousPage"
          :disabled="!prizeStore.pagination.has_prev_page"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          前へ
        </button>
        <button
          @click="nextPage"
          :disabled="!prizeStore.pagination.has_next_page"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          次へ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCampaignStore } from '../../stores/campaigns'
import { usePrizeStore } from '../../stores/prizes'
import type { Prize } from '../../types/api'

const campaignStore = useCampaignStore()
const prizeStore = usePrizeStore()

const selectedCampaignId = ref<number | ''>('')

// Load campaigns and prizes
async function loadCampaigns() {
  try {
    await campaignStore.fetchCampaigns()
  } catch (error) {
    console.error('Failed to load campaigns:', error)
  }
}

async function loadPrizes() {
  if (!selectedCampaignId.value) return
  
  try {
    await prizeStore.fetchPrizes(selectedCampaignId.value as number, {
      include_templates: true,
    })
  } catch (error) {
    console.error('Failed to load prizes:', error)
  }
}

// Pagination
function previousPage() {
  if (prizeStore.pagination.has_prev_page) {
    loadPrizesWithPage(prizeStore.pagination.page - 1)
  }
}

function nextPage() {
  if (prizeStore.pagination.has_next_page) {
    loadPrizesWithPage(prizeStore.pagination.page + 1)
  }
}

async function loadPrizesWithPage(page: number) {
  if (!selectedCampaignId.value) return
  
  try {
    await prizeStore.fetchPrizes(selectedCampaignId.value as number, {
      page,
      include_templates: true,
    })
  } catch (error) {
    console.error('Failed to load prizes:', error)
  }
}

// Prize actions
function openCreateModal() {
  // TODO: Open create modal or navigate to create page
  console.log('Open create modal for campaign:', selectedCampaignId.value)
}

function editPrize(prize: Prize) {
  // TODO: Navigate to edit page or open edit modal
  console.log('Edit prize:', prize.id)
}

function viewStatistics(prizeId: number) {
  // TODO: Navigate to statistics page or open statistics modal
  console.log('View statistics for prize:', prizeId)
}

async function deletePrize(prize: Prize) {
  if (confirm(`プライズ「${prize.name}」を削除しますか？この操作は取り消せません。`)) {
    try {
      await prizeStore.deletePrize(prize.id)
      await loadPrizes() // Reload list
    } catch (error) {
      console.error('Failed to delete prize:', error)
    }
  }
}

// Initialize
onMounted(async () => {
  await loadCampaigns()
})
</script>