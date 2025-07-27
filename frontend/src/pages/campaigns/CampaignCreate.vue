<template>
  <div class="campaign-create">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">新しいキャンペーンを作成</h1>
      <p class="mt-2 text-sm text-gray-600">
        キャンペーン情報を入力してください。
      </p>
    </div>

    <div class="bg-white shadow rounded-lg">
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

        <!-- ステータス -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">
            ステータス
          </label>
          <select
            v-model="form.status"
            id="status"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            :class="{ 'border-red-500': errors.status }"
          >
            <option :value="CampaignStatus.DRAFT">下書き</option>
            <option :value="CampaignStatus.ACTIVE">アクティブ</option>
            <option :value="CampaignStatus.PAUSED">一時停止</option>
          </select>
          <p v-if="errors.status" class="mt-1 text-sm text-red-600">
            {{ errors.status }}
          </p>
          <p class="mt-1 text-sm text-gray-500">
            下書きで保存後、後から設定を変更できます
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
              作成中...
            </span>
            <span v-else>キャンペーンを作成</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCampaignStore } from '../../stores/campaigns'
import type { CampaignCreateRequest } from '../../types/api'
import { CampaignStatus } from '../../types/api'

const router = useRouter()
const campaignStore = useCampaignStore()

// フォームデータ
const form = reactive<CampaignCreateRequest & { status: CampaignStatus }>({
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  status: CampaignStatus.DRAFT,
})

// バリデーションエラー
const errors = ref<Record<string, string>>({})

// バリデーション関数
function validateForm(): boolean {
  errors.value = {}

  if (!form.name.trim()) {
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
    const newCampaign = await campaignStore.createCampaign(form)
    router.push(`/campaigns/${newCampaign.id}`)
  } catch (error) {
    console.error('Campaign creation failed:', error)
  }
}

// キャンセル処理
function handleCancel() {
  router.push('/campaigns')
}

// 初期化時の処理
onMounted(() => {
  campaignStore.clearError()
  
  // デフォルトの開始日を現在時刻に設定
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  
  form.start_date = `${year}-${month}-${day}T${hours}:${minutes}`
  
  // デフォルトの終了日を1ヶ月後に設定
  const endDate = new Date(now)
  endDate.setMonth(endDate.getMonth() + 1)
  const endYear = endDate.getFullYear()
  const endMonth = String(endDate.getMonth() + 1).padStart(2, '0')
  const endDay = String(endDate.getDate()).padStart(2, '0')
  
  form.end_date = `${endYear}-${endMonth}-${endDay}T${hours}:${minutes}`
})
</script>
