<template>
  <div class="not-found text-center">
    <h1 class="text-4xl font-bold text-gray-900">404</h1>
    <p class="mt-2 text-lg text-gray-600">ページが見つかりません</p>

    <div class="mt-8">
      <router-link
        to="/"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        ダッシュボードに戻る
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Not found page component
</script>
