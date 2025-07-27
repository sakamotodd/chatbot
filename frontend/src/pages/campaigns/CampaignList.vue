<template>
  <div class="campaign-list">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">キャンペーン一覧</h1>
        <p class="mt-2 text-sm text-gray-700">
          作成されたすべてのインスタントウィンキャンペーンの一覧です。
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <router-link
          to="/campaigns/create"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          新しいキャンペーンを作成
        </router-link>
      </div>
    </div>

    <!-- フィルター・検索エリア -->
    <div class="mt-6 bg-white p-4 rounded-lg shadow">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700">検索</label>
          <div class="mt-1 relative">
            <input
              v-model="searchQuery"
              type="text"
              id="search"
              placeholder="キャンペーン名で検索..."
              class="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              @input="debouncedSearch"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div>
          <label for="status-filter" class="block text-sm font-medium text-gray-700">ステータス</label>
          <select
            v-model="statusFilter"
            id="status-filter"
            class="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            @change="applyFilters"
          >
            <option value="">すべて</option>
            <option :value="CampaignStatus.DRAFT">下書き</option>
            <option :value="CampaignStatus.ACTIVE">アクティブ</option>
            <option :value="CampaignStatus.PAUSED">一時停止</option>
            <option :value="CampaignStatus.COMPLETED">完了</option>
            <option :value="CampaignStatus.CANCELLED">キャンセル済み</option>
          </select>
        </div>

        <div>
          <label for="sort" class="block text-sm font-medium text-gray-700">並び順</label>
          <select
            v-model="sortBy"
            id="sort"
            class="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            @change="applyFilters"
          >
            <option value="created_desc">作成日（新しい順）</option>
            <option value="created_asc">作成日（古い順）</option>
            <option value="name_asc">名前（昇順）</option>
            <option value="name_desc">名前（降順）</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 統計情報 -->
    <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">総キャンペーン数</dt>
                <dd class="text-lg font-medium text-gray-900">{{ campaignStore.pagination.total }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">アクティブ</dt>
                <dd class="text-lg font-medium text-gray-900">{{ activeCampaignsCount }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5l-6.928-12c-.77-.833-2.694-.833-3.464 0l-6.928 12C1.436 16.333 2.398 18 3.938 18z"></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">下書き</dt>
                <dd class="text-lg font-medium text-gray-900">{{ draftCampaignsCount }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">完了済み</dt>
                <dd class="text-lg font-medium text-gray-900">{{ completedCampaignsCount }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ローディング状態 -->
    <div v-if="campaignStore.loading" class="mt-8 text-center">
      <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        読み込み中...
      </div>
    </div>

    <!-- エラーメッセージ -->
    <div v-else-if="campaignStore.error" class="mt-8 rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">エラーが発生しました</h3>
          <div class="mt-2 text-sm text-red-700">
            {{ campaignStore.error }}
          </div>
        </div>
      </div>
    </div>

    <!-- キャンペーンテーブル -->
    <div v-else class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    キャンペーン名
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    ステータス
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    期間
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    作成日
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">アクション</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="campaignStore.campaigns.length === 0">
                  <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                    キャンペーンが見つかりませんでした。
                  </td>
                </tr>
                <tr v-for="campaign in campaignStore.campaigns" :key="campaign.id" class="hover:bg-gray-50">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    <div>
                      <div class="font-medium text-gray-900">{{ campaign.name }}</div>
                      <div v-if="campaign.description" class="text-gray-500 text-xs truncate max-w-xs">
                        {{ campaign.description }}
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                      :class="getStatusClass(campaign.status)"
                    >
                      {{ getStatusText(campaign.status) }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div>
                      <div>{{ formatDate(campaign.start_date) }} 〜</div>
                      <div>{{ formatDate(campaign.end_date) }}</div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ formatDate(campaign.created) }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div class="flex justify-end space-x-2">
                      <router-link
                        :to="`/campaigns/${campaign.id}`"
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        詳細
                      </router-link>
                      <router-link
                        :to="`/campaigns/${campaign.id}/edit`"
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        編集
                      </router-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- ページネーション -->
    <div v-if="campaignStore.campaigns.length > 0" class="mt-6 flex items-center justify-between">
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          @click="goToPreviousPage"
          :disabled="!campaignStore.pagination.has_prev_page"
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          前へ
        </button>
        <button
          @click="goToNextPage"
          :disabled="!campaignStore.pagination.has_next_page"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          次へ
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            <span class="font-medium">{{ campaignStore.pagination.total }}</span> 件中
            <span class="font-medium">{{ ((campaignStore.pagination.page - 1) * campaignStore.pagination.limit) + 1 }}</span> - 
            <span class="font-medium">{{ Math.min(campaignStore.pagination.page * campaignStore.pagination.limit, campaignStore.pagination.total) }}</span> 件を表示
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              @click="goToPreviousPage"
              :disabled="!campaignStore.pagination.has_prev_page"
              class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">前へ</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <span
              class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
            >
              {{ campaignStore.pagination.page }} / {{ campaignStore.pagination.total_pages }}
            </span>
            
            <button
              @click="goToNextPage"
              :disabled="!campaignStore.pagination.has_next_page"
              class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">次へ</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCampaignStore } from '../../stores/campaigns'
import { CampaignStatus } from '../../types/api'
// import type { Campaign } from '../../types/api'

const campaignStore = useCampaignStore()

// フィルター・検索の状態
const searchQuery = ref('')
const statusFilter = ref<CampaignStatus | ''>('')
const sortBy = ref('created_desc')

// デバウンス用タイマー
let searchTimer: ReturnType<typeof setTimeout>

// 統計データ
const activeCampaignsCount = computed(() => {
  return campaignStore.campaigns.filter(c => c.status === CampaignStatus.ACTIVE).length
})

const draftCampaignsCount = computed(() => {
  return campaignStore.campaigns.filter(c => c.status === CampaignStatus.DRAFT).length
})

const completedCampaignsCount = computed(() => {
  return campaignStore.campaigns.filter(c => c.status === CampaignStatus.COMPLETED).length
})

// ステータス表示用関数
const getStatusClass = (status: CampaignStatus) => {
  switch (status) {
    case CampaignStatus.ACTIVE:
      return 'bg-green-100 text-green-800'
    case CampaignStatus.DRAFT:
      return 'bg-yellow-100 text-yellow-800'
    case CampaignStatus.PAUSED:
      return 'bg-orange-100 text-orange-800'
    case CampaignStatus.COMPLETED:
      return 'bg-gray-100 text-gray-800'
    case CampaignStatus.CANCELLED:
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: CampaignStatus) => {
  switch (status) {
    case CampaignStatus.ACTIVE:
      return 'アクティブ'
    case CampaignStatus.DRAFT:
      return '下書き'
    case CampaignStatus.PAUSED:
      return '一時停止'
    case CampaignStatus.COMPLETED:
      return '完了'
    case CampaignStatus.CANCELLED:
      return 'キャンセル済み'
    default:
      return '不明'
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 検索・フィルター機能
const debouncedSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    applyFilters()
  }, 300)
}

const applyFilters = async () => {
  const params = {
    page: 1,
    limit: 10,
    include_prizes: false,
    search: searchQuery.value || undefined,
    status: statusFilter.value || undefined,
    sort: sortBy.value || undefined
  }
  
  await campaignStore.fetchCampaigns(params)
}

// ページネーション
const goToPreviousPage = async () => {
  if (!campaignStore.pagination.has_prev_page) return
  
  const params = {
    page: campaignStore.pagination.page - 1,
    limit: campaignStore.pagination.limit,
    search: searchQuery.value || undefined,
    status: statusFilter.value || undefined,
    sort: sortBy.value || undefined
  }
  
  await campaignStore.fetchCampaigns(params)
}

const goToNextPage = async () => {
  if (!campaignStore.pagination.has_next_page) return
  
  const params = {
    page: campaignStore.pagination.page + 1,
    limit: campaignStore.pagination.limit,
    search: searchQuery.value || undefined,
    status: statusFilter.value || undefined,
    sort: sortBy.value || undefined
  }
  
  await campaignStore.fetchCampaigns(params)
}

// 初期データ読み込み
onMounted(async () => {
  await applyFilters()
})

// エラーをクリア
watch(() => campaignStore.error, (newError) => {
  if (newError) {
    setTimeout(() => {
      campaignStore.clearError()
    }, 5000)
  }
})
</script>

<style scoped>
/* Campaign list specific styles */
.campaign-list {
  @apply space-y-6;
}
</style>