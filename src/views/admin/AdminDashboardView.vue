<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useOrderStore } from '@/stores/orderStore'
import { useUserStore } from '@/stores/userStore'
import { useProductStore } from '@/stores/productStore'

// Components
import StatCard from '@/components/admin/dashboard/StatCard.vue'
import DashboardOrderChart from '@/components/admin/dashboard/DashboardOrderChart.vue' // Giả định component biểu đồ
import DashboardLatestOrders from '@/components/admin/dashboard/DashboardLatestOrders.vue' // Giả định component đơn hàng mới nhất

const orderStore = useOrderStore()
const userStore = useUserStore()
const productStore = useProductStore()

const { allOrders, totalOrdersCount, isLoading: ordersLoading } = storeToRefs(orderStore)
const { allUsers, usersLoading } = storeToRefs(userStore)
const { products } = storeToRefs(productStore)

// --- STATE CỤC BỘ ---
const statsLoading = computed(() => ordersLoading.value || usersLoading.value)

// --- TÍNH TOÁN KPI ---

// Tính tổng doanh thu (chỉ tính các đơn hàng đã hoàn thành)
const totalRevenue = computed(() => {
  // ⭐️ FIX: Đảm bảo allOrders.value không phải là null/undefined
  const orders = allOrders.value || []
  if (ordersLoading.value) return 0

  // Áp dụng logic trên mảng đã kiểm tra
  return orders
    .filter((order) => order.status === 'Delivered' || order.status === 'Completed')
    .reduce((sum, order) => sum + order.grandTotal, 0) // Giả định dùng grandTotal
})

// Đếm số đơn hàng mới (Pending)
const newOrdersCount = computed(() => {
  const orders = allOrders.value || [] // ⭐️ FIX
  if (ordersLoading.value) return 0
  return orders.filter((order) => order.status === 'Pending').length
})

// Đếm tổng số khách hàng (loại bỏ admin)
const customerCount = computed(() => {
  const users = allUsers.value || [] // ⭐️ FIX
  if (usersLoading.value) return 0
  // Áp dụng logic trên mảng đã kiểm tra
  return users.filter((user) => user.role !== 'admin').length
})

// --- FORMAT HELPER ---
const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

// --- TẢI DỮ LIỆU ---
onMounted(async () => {
  // 💡 Tải tất cả đơn hàng (không phân trang) để tính toán KPI.
  // Nếu dữ liệu quá lớn, cần tạo API endpoint tính toán tổng hợp ở backend.
  await Promise.all([
    orderStore.fetchAllOrdersAction(), // Lấy TẤT CẢ đơn hàng
    userStore.fetchUsersForAdmin(), // Lấy TẤT CẢ người dùng
    productStore.fetchProduct(), // Tải dữ liệu sản phẩm (để lấy danh mục/topping nếu cần)
  ])
})
</script>

<template>
  <main class="p-6 md:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Tổng quan Quản trị</h1>

    <div
      v-if="statsLoading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse"
    >
      <div v-for="i in 4" :key="i" class="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Tổng Doanh thu"
        :value="formatCurrency(totalRevenue)"
        icon-path="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
        color="green"
      />

      <StatCard
        title="Đơn hàng mới"
        :value="newOrdersCount"
        subtitle="Đang chờ xử lý"
        icon-path="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        color="yellow"
      />

      <StatCard
        title="Tổng Khách hàng"
        :value="customerCount"
        subtitle="Tài khoản đã đăng ký"
        icon-path="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        color="blue"
      />

      <StatCard
        title="Tổng Sản phẩm"
        :value="products.length"
        subtitle="Đang bán trên hệ thống"
        icon-path="M6.5 8 C9 6.5,15 6.5,17.5 8 M6.5 8 C8 3,16 3,17.5 8 V10 C16 9.3,8 9.3,6.5 10 Z M7 10 L8 20 C9.5 21.5,14.5 21.5,16 20 L17 10 Z M8 14 C9.5 13,14.5 13.5,16 12.5 M8 20 C9.5 21,14.5 21,16 20"
        color="red"
      />
    </div>

    <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 bg-white dark:bg-gray-700 p-6 rounded-xl shadow">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Biến động Đơn hàng (7 ngày gần nhất)
        </h2>
        <DashboardOrderChart :orders="allOrders" :is-loading="ordersLoading" />
      </div>

      <div class="lg:col-span-1 bg-white dark:bg-gray-700 p-6 rounded-xl shadow">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Đơn hàng Mới nhất</h2>
        <DashboardLatestOrders :orders="allOrders" :is-loading="ordersLoading" />
      </div>
    </div>
  </main>
</template>
