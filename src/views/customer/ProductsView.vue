<script setup>
import { ref, onMounted, computed } from 'vue'
import Filter from '@/components/customer/Filter.vue'
import Section from '@/components/customer/section/Section.vue'
import { useProductStore } from '@/stores/apiStore'

const store = useProductStore()
const selectedCategories = ref([])

onMounted(async () => {
  await store.fetchCategories()
  await store.fetchProducts()
})

const categories = computed(() => store.categories)

// Khi Filter thay đổi, cập nhật selectedCategories
const handleFilterChange = (ids) => {
  selectedCategories.value = ids
}
</script>

<template>
  <main class="p-6">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-2">
        <Filter @update:selected="handleFilterChange" />
      </div>

      <div class="col-span-10">
        <!-- Nếu chưa chọn gì: hiển thị tất cả -->
        <div v-if="!selectedCategories.length">
          <Section
            v-for="cat in categories"
            :key="cat.id"
            type="product"
            :categoryId="cat.id"
            :title="cat.name"
          />
        </div>

        <!-- Nếu đã chọn: chỉ hiển thị danh mục đó -->
        <div v-else>
          <Section
            v-for="cat in categories.filter((c) => selectedCategories.includes(String(c.id)))"
            :key="cat.id"
            type="product"
            :categoryId="cat.id"
            :title="cat.name"
          />
        </div>
      </div>
    </div>
  </main>
</template>
