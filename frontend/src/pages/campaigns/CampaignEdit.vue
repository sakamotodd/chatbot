<template>
  <div class="campaign-edit">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">キャンペーン編集</h1>
      <p class="mt-2 text-sm text-gray-600">
        キャンペーン情報を更新してください。
      </p>
    </div>

    <!-- ローディング中 -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- キャンペーンが見つからない場合 -->
    <div v-else-if="!campaign" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            キャンペーンが見つかりません
          </h3>
          <div class="mt-2">
            <button
              @click="router.push('/campaigns')"
              class="text-sm text-red-700 underline hover:text-red-600"
            >
              キャンペーン一覧に戻る
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 編集フォーム -->
    <div v-else class="bg-white shadow rounded-lg">
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- キャンペーン名 -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">
            キャンペーン名 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            :class="{ 'border-red-500': errors.name }"
            placeholder="キャンペーン名を入力してください"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">
            {{ errors.name }}
          </p>
        </div>

        <!-- 説明 -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">
            説明
          </label>
          <textarea
            v-model="form.description"
            id="description"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            :class="{ 'border-red-500': errors.description }"
            placeholder="キャンペーンの説明を入力してください"
          />
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">
            {{ errors.description }}
          </p>
        </div>

        <!-- 開始日・終了日 -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="start_date" class="block text-sm font-medium text-gray-700">
              開始日 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.start_date"
              type="datetime-local"
              id="start_date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              :class="{ 'border-red-500': errors.start_date }"
            />
            <p v-if="errors.start_date" class="mt-1 text-sm text-red-600">
              {{ errors.start_date }}
            </p>
          </div>

          <div>
            <label for="end_date" class="block text-sm font-medium text-gray-700">
              終了日 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.end_date"
              type="datetime-local"
              id="end_date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              :class="{ 'border-red-500': errors.end_date }"
            />
            <p v-if="errors.end_date" class="mt-1 text-sm text-red-600">
              {{ errors.end_date }}
            </p>
          </div>
        </div>

        <!-- ステータス -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">
            ステータス
          </label>
          <select
            v-model="form.status"
            id="status"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option :value="0">下書き</option>
            <option :value="1">有効</option>
            <option :value="2">一時停止</option>
            <option :value="3">完了</option>
            <option :value="4">キャンセル</option>
          </select>
        </div>

        <!-- エラーメッセージ -->
        <div v-if="campaignStore.error" class="rounded-md bg-red-50 p-4">
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
                {{ campaignStore.error }}
              </div>
            </div>
          </div>
        </div>

        <!-- アクションボタン -->
        <div class="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            @click="handleCancel"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            キャンセル
          </button>
          <button
            type="submit"
            :disabled="campaignStore.loading"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="campaignStore.loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              更新中...
            </span>
            <span v-else>キャンペーンを更新</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCampaignStore } from '../../stores/campaigns'
import type { CampaignUpdateRequest, CampaignStatus } from '../../types/api'

const router = useRouter()
const route = useRoute()
const campaignStore = useCampaignStore()

const campaignId = computed(() => parseInt(route.params.id as string))
const campaign = computed(() => campaignStore.currentCampaign)
const loading = ref(true)

// フォームデータ
const form = reactive<CampaignUpdateRequest & { status: CampaignStatus }>({
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  status: 0,
})

// バリデーションエラー
const errors = ref<Record<string, string>>({})

// キャンペーンデータをフォームに設定
function populateForm() {
  if (!campaign.value) return

  form.name = campaign.value.name
  form.description = campaign.value.description || ''
  form.status = campaign.value.status

  // ISO 8601 形式の日時を datetime-local input 用の形式に変換
  const startDate = new Date(campaign.value.start_date)
  const endDate = new Date(campaign.value.end_date)
  
  form.start_date = formatDateTimeLocal(startDate)
  form.end_date = formatDateTimeLocal(endDate)
}

// datetime-local input 用の形式に変換
function formatDateTimeLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// バリデーション関数
function validateForm(): boolean {
  errors.value = {}

  if (!form.name?.trim()) {
    errors.value.name = 'キャンペーン名は必須です'
  } else if (form.name.length > 255) {
    errors.value.name = 'キャンペーン名は255文字以内で入力してください'
  }

  if (form.description && form.description.length > 1000) {
    errors.value.description = '説明は1000文字以内で入力してください'
  }

  if (!form.start_date) {
    errors.value.start_date = '開始日は必須です'
  }

  if (!form.end_date) {
    errors.value.end_date = '終了日は必須です'
  }

  if (form.start_date && form.end_date) {
    const startDate = new Date(form.start_date)
    const endDate = new Date(form.end_date)
    
    if (endDate <= startDate) {
      errors.value.end_date = '終了日は開始日より後の日時を設定してください'
    }
  }

  return Object.keys(errors.value).length === 0
}

// フォーム送信処理
async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  try {
    await campaignStore.updateCampaign(campaignId.value, form)
    router.push(`/campaigns/${campaignId.value}`)
  } catch (error) {
    console.error('Campaign update failed:', error)
  }
}

// キャンセル処理
function handleCancel() {
  router.push(`/campaigns/${campaignId.value}`)
}

// 初期化時の処理
onMounted(async () => {
  campaignStore.clearError()
  
  try {
    await campaignStore.fetchCampaignById(campaignId.value)
    populateForm()
  } catch (error) {
    console.error('Failed to fetch campaign:', error)
  } finally {
    loading.value = false
  }
})
</script>
