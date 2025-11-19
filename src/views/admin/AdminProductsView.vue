<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/stores/productStore'

// Components
import ProductTable from '@/components/admin/products/ProductTable.vue'
import ProductFormModal from '@/components/admin/products/ProductFormModal.vue' // Modal Thêm/Sửa
import Button from '@/components/common/Button.vue' // Button của bạn
import { useModalStore } from '@/stores/modalStore' // Để quản lý modal/toast

const productStore = useProductStore()
const modalStore = useModalStore()

const { products, productLoading, categories, toppings, sizes, sugarLevels, iceLevels } =
  storeToRefs(productStore)

// --- TRẠNG THÁI QUẢN LÝ DANH SÁCH ---
const currentPage = ref(1)
const itemsPerPage = 10 // Số sản phẩm hiển thị trên mỗi trang
const searchQuery = ref('')
const selectedProduct = ref(null) // Dữ liệu sản phẩm đang được chỉnh sửa
const isModalOpen = ref(false)

// --- TÍNH TOÁN DỮ LIỆU ---

// Lọc sản phẩm theo tìm kiếm
const filteredProducts = computed(() => {
  if (!searchQuery.value) {
    return products.value
  }
  const query = searchQuery.value.toLowerCase()
  return products.value.filter(
    (product) => product.name.toLowerCase().includes(query) || String(product.id).includes(query),
  )
})

// Phân trang
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage)
})

// --- ACTIONS VÀ SỰ KIỆN ---

// Tải dữ liệu cần thiết khi vào trang
onMounted(() => {
  // 💡 Tải tất cả dữ liệu Product và Options cần thiết cho Form/Table
  productStore.fetchProduct()
})

// Mở modal thêm mới
const handleAddProduct = () => {
  selectedProduct.value = null // Thiết lập null để biết là chế độ 'Thêm mới'
  isModalOpen.value = true
}

// Mở modal chỉnh sửa
const handleEditProduct = (product) => {
  console.log('Edit product received:', product)
  selectedProduct.value = product // Truyền dữ liệu sản phẩm để chỉnh sửa
  isModalOpen.value = true
}

// Xử lý xóa sản phẩm
const handleDeleteProduct = async (id) => {
  if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm ID #${id} này không?`)) {
    return
  }
  try {
    await productStore.deleteProductAction(id)
    // Sau khi xóa, nếu trang hiện tại không còn sản phẩm nào, quay lại trang trước
    if (paginatedProducts.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
  } catch (e) {
    // Lỗi đã được xử lý trong Store
  }
}

// Xử lý đóng modal
const closeModal = () => {
  isModalOpen.value = false
  selectedProduct.value = null
}

// Xử lý khi submit thành công
const handleSubmitSuccess = async () => {
  // Force reload products to get the latest data
  // Clear the products array first to force reload
  productStore.products = []
  await productStore.fetchProduct()
  closeModal()
}
</script>

<template>
  <main class="md:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Quản lý Sản phẩm</h1>

    <div
      class="bg-white dark:bg-gray-700 p-4 rounded-xl shadow mb-6 flex justify-between items-center flex-wrap gap-4"
    >
      <Button @click="handleAddProduct" label="Thêm Sản phẩm mới" variant="primary" size="md">
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </template>
      </Button>

      <div class="w-full sm:w-64">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm theo tên hoặc ID..."
          class="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
        />
      </div>
    </div>

    <div class="bg-white dark:bg-gray-700 rounded-xl shadow overflow-x-auto">
      <ProductTable
        :products="paginatedProducts"
        :loading="productLoading"
        :categories="categories"
        :searchQuery="searchQuery"
        @edit="handleEditProduct"
        @delete="handleDeleteProduct"
      />
    </div>

    <div
      v-if="totalPages > 1 && !productLoading"
      class="flex justify-center items-center space-x-2 mt-6"
    >
      <Button @click="currentPage--" :disabled="currentPage === 1" variant="secondary" size="sm">
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg> </template
      ></Button>

      <span class="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
        Trang {{ currentPage }} / {{ totalPages }} ({{ filteredProducts.length }} sản phẩm)
      </span>

      <Button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        icon="→"
        variant="secondary"
        size="sm"
        class="flex-row-reverse"
      >
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg> </template
      ></Button>
    </div>

    <ProductFormModal
      :is-open="isModalOpen"
      :product-data="selectedProduct"
      :categories="categories"
      :toppings="toppings"
      :sizes="sizes"
      :sugar-levels="sugarLevels"
      :ice-levels="iceLevels"
      @close="closeModal"
      @success="handleSubmitSuccess"
    />
  </main>
</template>
