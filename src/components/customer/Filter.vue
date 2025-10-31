<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore' 

const emit = defineEmits(['update:selected'])
const productStore = useProductStore()
const selectedCategories = ref([])

onMounted(async () => {
  await productStore.fetchProduct()
})

const categories = computed(() => productStore.categories)

const toggleCategory = (id) => {
  id = String(id)
  if (selectedCategories.value.includes(id)) {
    selectedCategories.value = selectedCategories.value.filter((c) => c !== id)
  } else {
    selectedCategories.value.push(id)
  }

  emit('update:selected', selectedCategories.value)
}
</script>

<template>
  <div class="mt-4 p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 shadow-md border border-green-200 dark:border-gray-600">
    <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center tracking-wide flex items-center justify-center gap-2">
    
      Lọc theo danh mục
    </h2>

    <div class="flex flex-wrap justify-center gap-2 sm:gap-3">
      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        @click="toggleCategory(cat.id)"
        class="transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        :class="[
          'px-4 py-2 rounded-full border font-medium text-sm sm:text-base shadow-sm',
          selectedCategories.includes(String(cat.id)) 
            ? 'bg-green-600 border-green-600 text-white shadow-lg scale-105 ring-2 ring-green-300 ring-opacity-50' 
            : 'border-green-400 text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 hover:bg-green-500 hover:text-white hover:shadow-md hover:border-green-500'
        ]"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Hiển thị số lượng đã chọn -->
    <div 
      v-if="selectedCategories.length > 0"
      class="mt-4 text-center text-sm text-gray-600 dark:text-gray-300"
    >
      Đã chọn {{ selectedCategories.length }} danh mục
    </div>
  </div>
</template>