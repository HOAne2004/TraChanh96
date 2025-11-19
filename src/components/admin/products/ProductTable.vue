<script setup>
import Button from '@/components/common/Button.vue'

import { computed } from 'vue'

const props = defineProps({
  products: { type: Array, required: true }, // Danh sách sản phẩm đã được phân trang
  categories: { type: Array, default: () => [] }, // Danh sách danh mục để mapping
  loading: { type: Boolean, default: false },
  searchQuery:{type:String, default:null},
})

const emit = defineEmits(['edit', 'delete'])

// --- HELPER FUNCTIONS ---

// Tìm tên danh mục từ categoryId
const getCategoryName = (categoryId) => {
  const category = props.categories.find((c) => String(c.id) === String(categoryId))
  return category ? category.name : 'N/A'
}

// Định dạng tiền tệ
const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

// --- UX CLASSES ---

// Lấy màu nền cho trạng thái
const getRatingColor = (rating) => {
  if (rating >= 4.5) return 'bg-yellow-100 text-yellow-800'
  return 'bg-gray-100 text-gray-600'
}

// Kiểm tra nếu danh sách trống (sau khi tải)
const isEmpty = computed(() => !props.loading && props.products.length === 0)
</script>

<template>
  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
    <thead class="bg-gray-50 dark:bg-gray-800">
      <tr>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[5%]"
        >
          ID
        </th>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[20%]"
        >
          Sản phẩm
        </th>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%]"
        >
          Danh mục
        </th>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%]"
        >
          Giá bán
        </th>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[10%]"
        >
          Đã bán
        </th>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[10%]"
        >
          Đánh giá
        </th>
        <th
          class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%]"
        >
          Hành động
        </th>
      </tr>
    </thead>

    <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600">
      <tr v-if="loading">
        <td :colspan="7" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
          <div class="flex items-center justify-center py-8">
            <svg class="animate-spin h-5 w-5 mr-3 text-green-500" viewBox="0 0 24 24">...</svg>
            Đang tải danh sách sản phẩm...
          </div>
        </td>
      </tr>

      <tr v-else-if="isEmpty">
        <td
          :colspan="7"
          class="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
        >
          <div class="max-w-xs mx-auto mb-4">
            <img
            src="/images/products/notFound.png"
            alt="Không tìm thấy sản phẩm phù hợp"
            title="Không tìm thấy sản phẩm phù hợp"
            class="opacity-70 w-full h-auto dark:opacity-100"
          />
          </div>
          <span> Không tìm thấy sản phẩm nào khớp với {{ searchQuery }}.</span>
        </td>
      </tr>

      <tr
        v-else
        v-for="product in products"
        :key="product.id"
        class="hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
          {{ product.id }}
        </td>

        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <img
              class="h-10 w-10 rounded-md object-cover mr-3 border dark:border-gray-500"
              :src="product.imageUrl || '/placeholder.png'"
              :alt="product.name"
            />
            <span class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">{{
              product.name
            }}</span>
          </div>
        </td>

        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
          {{ getCategoryName(product.categoryId) }}
        </td>

        <td
          class="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400"
        >
          {{ formatCurrency(product.basePrice) }}
        </td>

        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
          {{ product.totalSSold || 0 }}
        </td>

        <td class="px-6 py-4 whitespace-nowrap text-sm">
          <span
            :class="[
              'px-2 inline-flex items-center gap-2 text-sm text-orange-400 leading-5 font-semibold rounded-full',
              getRatingColor(product.totalRating),
            ]"
          >
            <span
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span>{{ product.totalRating || 'N/A' }}</span>
          </span>
        </td>

        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
          <Button @click="$emit('edit', product)" variant="edit" title="Chỉnh sửa sản phẩm">
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
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </template>
          </Button>
          <Button @click="$emit('delete', product.id)" variant="danger" title="Xóa sản phẩm">
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
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </template>
          </Button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
