<script setup>
import { ref, computed, onMounted } from 'vue'
import SearchBar from './SearchBar.vue'
import Section from './section/Section.vue'
import { useProductStore } from '@/stores/apiStore'

const store = useProductStore()
const selectedCategories = ref([])

onMounted(async () => {
  await store.fetchCategories()
  await store.fetchProducts()
})

const categories = computed(() => store.categories)

const toggleCategory = (id) => {
  id = String(id)
  if (selectedCategories.value.includes(id)) {
    selectedCategories.value = selectedCategories.value.filter((c) => c !== id)
  } else {
    selectedCategories.value.push(id)
  }
}
</script>

<template>
  <div class="p-6 grid">
    <!-- Bộ lọc danh mục (checkbox) -->
    <div class="flex gap-4 mb-6 flex-wrap">
      <label
        v-for="cat in categories"
        :key="cat.id"
        class="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          class="w-4 h-4"
          :value="cat.id"
          :checked="selectedCategories.includes(String(cat.id))"
          @change="toggleCategory(cat.id)"
        />
        {{ cat.name }}
      </label>
    </div>

    <SearchBar />

    <!-- Nếu chưa chọn gì => hiển thị tất cả section -->
    <div v-if="!selectedCategories.length">
      <Section
        v-for="cat in categories"
        :key="cat.id"
        type="product"
        :categoryId="cat.id"
        :title="cat.name"
      />
    </div>

    <!-- Nếu chọn danh mục => chỉ hiển thị section của danh mục đó -->
    <div v-else>
      <Section
        v-for="cat in categories.filter(c => selectedCategories.includes(String(c.id)))"
        :key="cat.id"
        type="product"
        :categoryId="cat.id"
        :title="cat.name"
      />
    </div>
  </div>
</template>
