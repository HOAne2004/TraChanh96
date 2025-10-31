<script setup>
import { useStoreStore } from '@/stores/storeStore'
// Không cần import RouterLink vì đã có sẵn trong template

const props = defineProps({
  store: { type: Object, required: true },
})

</script>

<template>
  <div
    class="flex-shrink-0 w-72 snap-start bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 p-4"
  >
    <router-link :to="`/aboutUs/${store.id}`" class="block">
      <img
        :src="store.image"
        :alt="store.name"
        class="max-w-64 h-40 object-cover rounded-md mb-3"
      />
      <h4 class="font-semibold text-green-600 dark:text-green-400 text-lg">{{ store.name }}</h4>
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">{{ store.address }}</p>
      <p class="text-xs text-gray-500">
        Mở ngày: {{ new Date(store.openDate).toLocaleDateString('vi-VN') }}
      </p>
    </router-link>
  </div>
</template>
