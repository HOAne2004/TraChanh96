<script setup>
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useOrderStore } from '@/stores/orderStore'
import { useUserStore } from '@/stores/userStore'
import { RouterLink } from 'vue-router'
import NavLink from '@/components/common/NavLink.vue' // Import NavLink

// Stores
const orderStore = useOrderStore()
const userStore = useUserStore()

// State
const { orders, isLoading, error } = storeToRefs(orderStore)
const { user } = storeToRefs(userStore)

// Fetch data on mount
onMounted(() => {
  if (user.value?.id) {
    orderStore.fetchOrdersAction(user.value.id)
  } else {
    // Điều này không nên xảy ra nếu route có guard, nhưng là một biện pháp bảo vệ
    console.warn('User not logged in, cannot fetch orders.')
    error.value = "Bạn phải đăng nhập để xem lịch sử đơn hàng."
  }
})

// Computed
const hasOrders = computed(() => orders.value.length > 0)

// Helpers
const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Helper để tạo class và text cho trạng thái đơn hàng
const getStatusInfo = (status) => {
  const lowerStatus = status?.toLowerCase()
  switch (lowerStatus) {
    case 'pending':
      return { text: 'Đang xử lý', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' }
    case 'completed':
      return { text: 'Hoàn thành', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' }
    case 'cancelled':
      return { text: 'Đã hủy', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
    default:
      return { text: status || 'Không rõ', class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }
  }
}
</script>

<template>
  <main class="max-w-4xl mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold text-center mb-8 text-green-700 dark:text-green-400">
      Lịch Sử Đơn Hàng
    </h1>

    <!-- Trạng thái Loading -->
    <div v-if="isLoading" class="text-center py-20">
      <p class="text-gray-500 dark:text-gray-400">Đang tải lịch sử đơn hàng...</p>
      <!-- Bạn có thể thêm một component spinner ở đây -->
    </div>

    <!-- Trạng thái Lỗi -->
    <div v-else-if="error" class="text-center py-20 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
      <h3 class="text-xl font-semibold text-red-600 dark:text-red-300">Đã xảy ra lỗi</h3>
      <p class="text-red-500 dark:text-red-400 mt-2">{{ error }}</p>
    </div>

    <!-- Không có đơn hàng -->
    <div v-else-if="!hasOrders" class="text-center py-20">
      <p class="text-lg text-gray-500 dark:text-gray-400">Bạn chưa có đơn hàng nào.</p>
      <NavLink
        to="/products"
        label="Bắt đầu mua sắm ngay!"
        variant="primary"
        class="mt-6 inline-block"
      />
    </div>

    <!-- Hiển thị danh sách đơn hàng -->
    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 transition hover:shadow-lg"
      >
        <div class="flex flex-wrap justify-between items-center gap-4">
          <!-- Thông tin chính -->
          <div class="flex-1 min-w-[200px]">
            <p class="text-sm text-gray-500 dark:text-gray-400">Mã đơn: #{{ order.id }}</p>
            <p class="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Ngày đặt: {{ formatDate(order.createdAt) }}
            </p>
          </div>

          <!-- Trạng thái -->
          <div class="flex-shrink-0">
            <span
              :class="getStatusInfo(order.status).class"
              class="text-xs font-medium px-3 py-1 rounded-full"
            >
              {{ getStatusInfo(order.status).text }}
            </span>
          </div>

          <!-- Tổng tiền -->
          <div class="flex-shrink-0 text-right">
            <p class="text-sm text-gray-500 dark:text-gray-400">Tổng tiền</p>
            <p class="text-lg font-bold text-green-600 dark:text-green-400">
              {{ formatCurrency(order.totalAmount) }}
            </p>
          </div>

          <!-- Nút Xem -->
          <div class="flex-shrink-0">
            <RouterLink
              :to="`/orders/${order.id}`"
              class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Xem chi tiết
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
