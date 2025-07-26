<template>
  <div class="dashboard">
    <div class="bg-white shadow">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          ダッシュボード
        </h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>Instagram インスタントウィンキャンペーンツールへようこそ</p>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Active campaigns -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center"
              >
                <span class="text-white text-sm font-medium">C</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  アクティブキャンペーン
                </dt>
                <dd class="text-lg font-medium text-gray-900">12</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Total participants -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center"
              >
                <span class="text-white text-sm font-medium">P</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  総参加者数
                </dt>
                <dd class="text-lg font-medium text-gray-900">1,234</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Prizes awarded -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center"
              >
                <span class="text-white text-sm font-medium">🏆</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  賞品提供数
                </dt>
                <dd class="text-lg font-medium text-gray-900">89</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="mt-8">
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            クイックアクション
          </h3>
          <div class="mt-5">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <router-link
                to="/campaigns/create"
                class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div>
                  <span
                    class="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100"
                  >
                    <span class="text-xl">➕</span>
                  </span>
                </div>
                <div class="mt-8">
                  <h3 class="text-lg font-medium">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    新しいキャンペーンを作成
                  </h3>
                  <p class="mt-2 text-sm text-gray-500">
                    新しいインスタントウィンキャンペーンを作成します
                  </p>
                </div>
              </router-link>

              <router-link
                to="/campaigns"
                class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div>
                  <span
                    class="rounded-lg inline-flex p-3 bg-green-50 text-green-600 group-hover:bg-green-100"
                  >
                    <span class="text-xl">📊</span>
                  </span>
                </div>
                <div class="mt-8">
                  <h3 class="text-lg font-medium">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    キャンペーン管理
                  </h3>
                  <p class="mt-2 text-sm text-gray-500">
                    既存のキャンペーンを管理・編集します
                  </p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Dashboard component - main overview page
</script>

<style scoped>
/* Dashboard specific styles */
</style>
