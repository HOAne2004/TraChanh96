<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { useOrderStore } from '@/stores/orderStore'
import { useRouter, useRoute } from 'vue-router'

// Components
import ProfileInfoForm from '@/components/customer/profile/ProfileInfoForm.vue'
import ProfileOrdersHistory from '@/components/customer/profile/ProfileOrdersHistory.vue'
import Button from '@/components/common/Button.vue'

const userStore = useUserStore()
const orderStore = useOrderStore()
const router = useRouter()
const route = useRoute()

const { user } = storeToRefs(userStore)
const { orders } = storeToRefs(orderStore)

// Quản lý tab
const activeTab = ref(route.query.tab || 'info') // 'info' | 'orders' | 'security'

watch(
  () => route.query.tab,
  (newTab) => {
    // Nếu có query param 'tab', cập nhật activeTab
    if (newTab) {
      activeTab.value = newTab
    } else {
      // Nếu query param 'tab' bị xóa (chuyển từ /profile?tab=orders về /profile)
      activeTab.value = 'info'
    }
  },
  { immediate: true },
)

// Tải dữ liệu khi vào trang
onMounted(async () => {
  // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
  if (!user.value) {
    router.replace('/login')
    return
  }
  // Tải lịch sử đơn hàng
  await orderStore.fetchOrdersAction(user.value.id)
})

const handleLogout = () => {
  userStore.logoutAction() // Cần tạo action này trong userStore
  router.push('/')
}

// Hàm chuyển tab và cập nhật URL
const setActiveTab = (tab) => {
  if (activeTab.value === tab && route.query.tab === tab) {
    return
  }
  router.push({ query: { tab: tab } })
}
</script>

<template>
  <main class="py-10 max-w-7xl mx-auto px-4 lg:px-8">
    <h1 class="text-4xl font-extrabold mb-8 text-center text-green-700 dark:text-green-400">
      Hồ Sơ Cá Nhân
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div
        class="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-fit sticky top-24"
      >
        <h2 class="text-2xl font-semibold mb-6">Chào, {{ user?.name || 'Khách' }}!</h2>

        <div class="space-y-2">
          <button
            @click="setActiveTab('info')"
            :class="[
              'w-full text-left py-2 px-4 rounded-lg transition-colors duration-200',
              activeTab === 'info'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 font-bold'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700',
            ]"
          >
            📝 Thông tin & Địa chỉ
          </button>
          <button
            @click="setActiveTab('orders')"
            :class="[
              'w-full text-left py-2 px-4 rounded-lg transition-colors duration-200',
              activeTab === 'orders'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 font-bold'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700',
            ]"
          >
            📦 Lịch sử Đơn hàng
          </button>
          <button
            @click="setActiveTab('security')"
            :class="[
              'w-full text-left py-2 px-4 rounded-lg transition-colors duration-200',
              activeTab === 'security'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 font-bold'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700',
            ]"
          >
            🔒 Bảo mật & Mật khẩu
          </button>
        </div>

        <div class="mt-8 border-t dark:border-gray-700 pt-4">
          <Button
            @click="handleLogout"
            label="Đăng Xuất"
            variant="danger"
            size="sm"
            class="w-full"
          />
        </div>
      </div>

      <div class="lg:col-span-3 space-y-8">
        <ProfileInfoForm v-if="activeTab === 'info'" :user="user" />
        <ProfileOrdersHistory
          v-else-if="activeTab === 'orders'"
          :orders="orders"
          :is-loading="orderStore.isLoading"
        />
        <div v-else class="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <p class="text-lg text-gray-500">Tính năng đang được phát triển...</p>
        </div>
      </div>
    </div>
  </main>
</template>
