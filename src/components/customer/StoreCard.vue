<script setup>

const props = defineProps({
  store: { type: Object, required: true }
})
</script>

<template>
  <div class="flex-shrink-0 w-72 snap-start bg-white dark:bg-gray-700 rounded-lg shadow p-4">
    <img :src="store.image" alt="" class="max-w-64 h-auto object-cover rounded-md mb-3" />
    <h4 class="font-semibold text-primary text-lg">{{ store.name }}</h4>
    <p class="text-sm text-gray-600 dark:text-gray-300">{{ store.address }}</p>
  </div>
</template>
