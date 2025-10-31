<script setup>
import { ref, onMounted, computed } from 'vue'
import Filter from '@/components/customer/Filter.vue'
import TitledContainer from '@/components/customer/TitledContainer.vue'
import ProductCard from '@/components/customer/ProductCard.vue'
import { useProductStore } from '@/stores/productStore'
import { storeToRefs } from 'pinia'

const store = useProductStore()
// lấy refs từ store (tránh ref-in-ref)
const { products: productsRef, categories: categoriesRef } = storeToRefs(store)

const selectedCategories = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    await store.fetchProduct()
  } finally {
    isLoading.value = false
  }
})

/** computed unwrap .value trực tiếp để dùng trong template dễ dàng */
const categories = computed(() => categoriesRef.value || [])
const products = computed(() => productsRef.value || [])

// Khi Filter thay đổi, cập nhật selectedCategories (chuỗi để dễ so sánh)
const handleFilterChange = (ids) => {
  selectedCategories.value = ids.map((id) => String(id))
}

// Hàm lấy sản phẩm theo danh mục — ép kiểu an toàn
const productsByCategory = (categoryId) =>
  products.value.filter((p) => String(p.categoryId) === String(categoryId))
</script>

<template>
  <main>
    <div class="grid grid-cols-12 gap-4">
      <!-- Bộ lọc -->
      <div class="col-span-2 sticky h-fit top-16">
        <Filter @update:selected="handleFilterChange" />
      </div>

      <!-- Nội dung sản phẩm -->
      <div class="col-span-10">
        <div v-if="isLoading" class="py-12 text-center text-gray-500">Đang tải dữ liệu...</div>

        <div v-else>
          <!-- Nếu chưa chọn danh mục nào: hiển thị tất cả -->
          <div v-if="!selectedCategories.length">
            <TitledContainer
              v-for="cat in categories"
              :key="cat.id"
              :title="cat.name"
              :items="productsByCategory(cat.id)"
            >
              <template #default="{ items }">
                <p v-if="!items.length" class="text-gray-400 italic">Không có sản phẩm nào</p>
                <ProductCard v-for="p in items" :key="p.id" :product="p" />
              </template>
            </TitledContainer>
          </div>

          <!-- Nếu đã chọn danh mục -->
          <div v-else>
            <TitledContainer
              v-for="cat in categories.filter(c => selectedCategories.includes(String(c.id)))"
              :key="cat.id"
              :title="cat.name"
              :items="productsByCategory(cat.id)"
            >
              <template #default="{ items }">
                <p v-if="!items.length" class="text-gray-400 italic">Không có sản phẩm nào</p>
                <ProductCard v-for="p in items" :key="p.id" :product="p" />
              </template>
            </TitledContainer>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
