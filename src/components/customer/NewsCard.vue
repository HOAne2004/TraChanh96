<script setup>
const props = defineProps({
  news: { type: Object, required: true },
})
</script>

<template>
  <div
    class="flex-shrink-0 w-72 snap-start bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 p-4"
  >
    <img :src="news.image" alt="" class="max-w-64 h-40 object-cover rounded-md mb-3" />
    <h4 class="font-semibold text-primary text-lg line-clamp-2">{{ news.name }}</h4>
    <p class="text-xs text-gray-500 mb-1">{{ new Date(news.date).toLocaleDateString() }}</p>
    <p class="truncate-text text-sm text-gray-600 dark:text-gray-300">
      {{ news.description }}
    </p>
  </div>
</template>

<style scoped>
.truncate-text {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Thay đổi số 3 để giới hạn số dòng */
  -webkit-box-orient: vertical;
}
</style>
