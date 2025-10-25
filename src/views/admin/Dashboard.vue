<script setup>
import { ref } from 'vue'

const stats = ref({
  products: 42,
  orders: 17,
  users: 9
})
</script>
<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">🏠 Admin Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Card 1 -->
      <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md">
        <h2 class="font-semibold text-lg mb-2">Tổng sản phẩm</h2>
        <p class="text-2xl font-bold text-blue-600">{{ stats.products }}</p>
      </div>

      <!-- Card 2 -->
      <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md">
        <h2 class="font-semibold text-lg mb-2">Tổng đơn hàng</h2>
        <p class="text-2xl font-bold text-green-600">{{ stats.orders }}</p>
      </div>

      <!-- Card 3 -->
      <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md">
        <h2 class="font-semibold text-lg mb-2">Người dùng</h2>
        <p class="text-2xl font-bold text-purple-600">{{ stats.users }}</p>
      </div>
    </div>

    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-3">🧭 Điều hướng nhanh</h2>
      <div class="flex gap-3 flex-wrap">
        <RouterLink
          to="/"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition"
        >
          Về trang chủ
        </RouterLink>
        <RouterLink
          to="/admin/products"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition"
        >
          Quản lý sản phẩm
        </RouterLink>
        <RouterLink
          to="/admin/users"
          class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow transition"
        >
          Quản lý người dùng
        </RouterLink>
      </div>
    </div>
  </div>
</template>