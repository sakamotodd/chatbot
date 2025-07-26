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
          新しいキャンペーンを作成
        </router-link>
      </div>
    </div>

    <!-- Campaign list -->
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div
            class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
          >
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    キャンペーン名
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    ステータス
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    参加者数
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    作成日
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">アクション</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="campaign in mockCampaigns" :key="campaign.id">
                  <td
                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                  >
                    {{ campaign.title }}
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
                    {{ campaign.participants }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ formatDate(campaign.created) }}
                  </td>
                  <td
                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                  >
                    <router-link
                      :to="`/campaigns/${campaign.id}`"
                      class="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      詳細
                    </router-link>
                    <router-link
                      :to="`/campaigns/${campaign.id}/edit`"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      編集
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Mock data for demonstration
const mockCampaigns = ref([
  {
    id: 1,
    title: '春のプレゼントキャンペーン',
    status: 'active',
    participants: 1234,
    created: '2024-01-15',
  },
  {
    id: 2,
    title: '新商品発売記念キャンペーン',
    status: 'draft',
    participants: 0,
    created: '2024-01-10',
  },
  {
    id: 3,
    title: 'フォロワー感謝キャンペーン',
    status: 'ended',
    participants: 5678,
    created: '2023-12-20',
  },
]);

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    case 'ended':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'アクティブ';
    case 'draft':
      return '下書き';
    case 'ended':
      return '終了';
    default:
      return '不明';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP');
};
</script>

<style scoped>
/* Campaign list specific styles */
</style>
