<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/stores/productStore'
import productApi from '@/apis/productApi'

import AdminDataTable from '@/components/admin/ui/AdminDataTable.vue'
import AdminActionHeader from '@/components/admin/ui/AdminActionHeader.vue'
import AdminDataContainer from '@/components/admin/ui/AdminDataContainer.vue'
import OptionsFormModal from '@/components/admin/options/OptionsFormModal.vue'

const productStore = useProductStore()
const { sizes, sugarLevels, iceLevels, productLoading } = storeToRefs(productStore)

const activeType = ref('size')
const isModalOpen = ref(false)
const editingItem = ref(null)
const searchQuery = ref('')

// 1. CẤU HÌNH DỮ LIỆU
const dataMap = {
  size: {
    itemsRef: sizes,
    columns: [
      { key: 'id', label: 'ID', width: '50px' },
      { key: 'label', label: 'Tên kích cỡ' },
      { key: 'priceModifier', label: 'Phụ thu (VNĐ)', isCurrency: true },
    ],
    createLabel: 'Tạo Kích cỡ mới',
    labelName: 'Kích cỡ',
  },
  sugar: {
    itemsRef: sugarLevels,
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'label', label: 'Nhãn Mức đường' },
      { key: 'value', label: 'Phần trăm (%)' },
    ],
    createLabel: 'Tạo Mức đường mới',
    labelName: 'Mức đường',
  },
  ice: {
    itemsRef: iceLevels,
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'label', label: 'Nhãn Mức đá' },
      { key: 'value', label: 'Phần trăm (%)' },
    ],
    createLabel: 'Tạo Mức đá mới',
    labelName: 'Mức đá',
  },
}

const currentConfig = computed(() => dataMap[activeType.value])

// 2. LOGIC LỌC DỮ LIỆU (Client-side Search)
// Vì danh sách Option thường ngắn, ta lọc trực tiếp ở Client thay vì gọi API tìm kiếm
const filteredItems = computed(() => {
  // Lấy dữ liệu gốc từ Ref
  const rawItems = currentConfig.value.itemsRef ? currentConfig.value.itemsRef.value : []

  // Nếu không có từ khóa tìm kiếm -> Trả về toàn bộ
  if (!searchQuery.value) return rawItems

  // Lọc theo Label (Tên hiển thị)
  const query = searchQuery.value.toLowerCase()
  return rawItems.filter((item) => item.label.toLowerCase().includes(query))
})

const currentColumns = computed(() => currentConfig.value.columns)

// Reset tìm kiếm khi chuyển tab
watch(activeType, () => {
  searchQuery.value = ''
})

// 3. XỬ LÝ HÀNH ĐỘNG
const handleCreateNew = () => {
  editingItem.value = null
  isModalOpen.value = true
}

// Hàm xóa thông minh
const handleDelete = async (item) => {
    // 1. Xác định Controller Name cho API (Sizes, SugarLevels...)
    // activeType đang là: 'size', 'sugar', 'ice'
    let controllerName = ''
    let labelName = ''

    if (activeType.value === 'size') { controllerName = 'Sizes'; labelName = 'Kích cỡ'; }
    else if (activeType.value === 'sugar') { controllerName = 'SugarLevels'; labelName = 'Mức đường'; }
    else { controllerName = 'IceLevels'; labelName = 'Mức đá'; }

    // 2. Gọi API đếm số lượng sản phẩm đang dùng
    productStore.productLoading = true // Bật loading nhẹ
    const count = await productApi.checkOptionUsage(controllerName, item.id)
    productStore.productLoading = false

    // 3. Tạo nội dung thông báo
    let message = `Bạn có chắc chắn muốn xóa ${labelName} "${item.label}"?`
    if (count > 0) {
        message += `\n\n⚠️ CẢNH BÁO: Hiện có ${count} sản phẩm đang sử dụng tùy chọn này.\n- Nếu xóa, tùy chọn này sẽ biến mất khỏi các sản phẩm đó.`
    }

    // 4. Hỏi người dùng
    if (confirm(message)) {
        // Gọi Action Xóa (Logic cũ)
        const typeCapitalized = activeType.value.charAt(0).toUpperCase() + activeType.value.slice(1)
        const actionName = `delete${typeCapitalized}Action`
        if (productStore[actionName]) {
            await productStore[actionName](item.id)
        }
    }
}

// Hàm sửa (Tương tự nếu muốn cảnh báo)
const handleEdit = async (item) => {
    // Logic mở modal...
    // Nếu muốn cảnh báo trước khi mở modal thì làm tương tự logic trên.
    // Nhưng thường Update ít nguy hiểm hơn Delete nên có thể bỏ qua hoặc cảnh báo nhẹ trong Modal.
    editingItem.value = item
    isModalOpen.value = true
}

onMounted(() => {
  productStore.fetchProduct()
})
</script>

<template>
  <main class="p-6">
    <h1 class="text-3xl font-bold mb-6">Quản lý Tùy chọn Sản phẩm</h1>

    <AdminActionHeader
      v-model="searchQuery"
      :add-button-label="currentConfig.createLabel"
      :search-placeholder="`Tìm kiếm ${currentConfig.labelName}...`"
      @add-new="handleCreateNew"
    />

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 min-h-[400px]">
      <div class="border-b border-gray-200 dark:border-gray-700 mb-4">
        <nav class="flex space-x-4">
          <button
            v-for="type in Object.keys(dataMap)"
            :key="type"
            @click="activeType = type"
            :class="[
              'px-4 py-2 font-medium text-sm border-b-2 capitalize transition-colors',
              activeType === type
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400',
            ]"
          >
            {{ dataMap[type].labelName }} ({{ type }})
          </button>
        </nav>
      </div>

      <div class="mt-4">
        <AdminDataContainer
          :items="filteredItems"
          :loading="productLoading"
          :search-query="searchQuery"
          :data-type="currentConfig.labelName"
        >
          <template #empty-state>
            <div class="flex flex-col items-center">
              <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Chưa có {{ currentConfig.labelName }} nào.
              </p>
              <button
                @click="handleCreateNew"
                class="mt-2 text-green-600 hover:text-green-800 font-medium underline"
              >
                Tạo {{ currentConfig.labelName }} đầu tiên ngay
              </button>
            </div>
          </template>

          <AdminDataTable
            :items="filteredItems"
            :columns="currentColumns"
            :loading="productLoading"
            :actions="['edit', 'delete']"
            @edit-row="handleEdit"
            @delete-row="handleDelete"
          >
            <template #cell-priceModifier="{ value }">
              <span class="font-medium text-gray-900 dark:text-white">
                {{ new Intl.NumberFormat('vi-VN').format(value) }} ₫
              </span>
            </template>

            <template #cell-value="{ value }">
              <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">
                {{ value }}%
              </span>
            </template>
          </AdminDataTable>
        </AdminDataContainer>
      </div>
    </div>
  </main>

  <OptionsFormModal
    :type="activeType"
    :item-data="editingItem"
    :is-open="isModalOpen"
    @created="productStore.fetchProduct()"
    @updated="productStore.fetchProduct()"
    @close="((isModalOpen = false), (editingItem = null))"
  />
</template>
