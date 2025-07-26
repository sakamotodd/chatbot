<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">Instagram CRM</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/"
                class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                :class="{
                  'border-indigo-500 text-gray-900':
                    $route.name === 'Dashboard',
                }"
              >
                ダッシュボード
              </router-link>
              <router-link
                to="/campaigns"
                class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                :class="{
                  'border-indigo-500 text-gray-900': $route.name
                    ?.toString()
                    .includes('Campaign'),
                }"
              >
                キャンペーン
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Main layout component for the application
</script>

<style scoped>
/* Custom styles for the main layout */
</style>
