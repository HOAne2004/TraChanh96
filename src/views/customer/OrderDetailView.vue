<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOrderStore } from '@/stores/orderStore'
import { useUserStore } from '@/stores/userStore'
import NavLink from '@/components/common/NavLink.vue'

// Stores & Router
const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const userStore = useUserStore()

// State
const { orders, isLoading, error } = storeToRefs(orderStore)
const { user } = storeToRefs(userStore)

// Lấy orderId từ URL
const orderId = computed(() => route.params.id)

// Tìm đơn hàng cụ thể trong danh sách
// Nếu danh sách rỗng, onMounted sẽ trigger fetch
const order = computed(() => {
  return orders.value.find((o) => String(o.id) === orderId.value)
})

// Fetch data on mount
onMounted(() => {
  // Nếu đơn hàng chưa có trong store (ví dụ: F5 trang),
  // và store cũng chưa tải, thì fetch toàn bộ đơn hàng của user
  if (orders.value.length === 0 && user.value?.id) {
    orderStore.fetchOrdersAction(user.value.id)
  }
})

// --- Helpers (Copy từ OrderHistoryView để đồng bộ) ---
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

const getStatusInfo = (status) => {
  const lowerStatus = status?.toLowerCase()
  switch (lowerStatus) {
    case 'pending':
      return {
        text: 'Đang xử lý',
        class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      }
    case 'completed':
      return {
        text: 'Hoàn thành',
        class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      }
    case 'cancelled':
      return { text: 'Đã hủy', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
    default:
      return {
        text: status || 'Không rõ',
        class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      }
  }
}

// Helper hiển thị toppings
const getToppingsDisplay = (toppings) => {
  if (!toppings || !Array.isArray(toppings) || toppings.length === 0) {
    return ''
  }
  return toppings.map((t) => t.name || '').join(', ')
}
</script>

<template>
  <main class="max-w-4xl mx-auto py-10 px-4">
    <!-- Breadcrumb -->
    <div class="mb-4">
      <NavLink
        to="/profile?tab=orders"
        label="&larr; Quay lại Lịch sử đơn hàng"
        variant="secondary"
      />
    </div>

    <!-- Trạng thái Loading -->
    <div v-if="isLoading" class="text-center py-20">
      <p class="text-gray-500 dark:text-gray-400">Đang tải chi tiết đơn hàng...</p>
    </div>

    <!-- Trạng thái Lỗi -->
    <div v-else-if="error" class="text-center py-20 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
      <h3 class="text-xl font-semibold text-red-600 dark:text-red-300">Đã xảy ra lỗi</h3>
      <p class="text-red-500 dark:text-red-400 mt-2">{{ error }}</p>
    </div>

    <!-- Không tìm thấy đơn hàng -->
    <div vfor="order in orders" v-else-if="!order" class="text-center py-20">
      <h2 class="text-2xl font-bold text-red-600 dark:text-red-400">Không tìm thấy đơn hàng</h2>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        Không thể tìm thấy đơn hàng với mã #{{ orderId }}.
      </p>
    </div>

    <!-- Hiển thị chi tiết đơn hàng -->
    <div v-else class="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
      <!-- Header đơn hàng -->
      <div class="p-6 border-b dark:border-gray-700">
        <div class="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Chi tiết Đơn hàng #{{ order.id }}
            </h1>
            <p class="text-gray-500 dark:text-gray-400">
              Đặt lúc: {{ formatDate(order.createdAt) }}
            </p>
          </div>
          <span
            :class="getStatusInfo(order.status).class"
            class="text-sm font-medium px-4 py-1.5 rounded-full"
          >
            {{ getStatusInfo(order.status).text }}
          </span>
        </div>
      </div>

      <!-- Nội dung đơn hàng -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Cột thông tin giao hàng -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold border-b pb-2 dark:border-gray-700">
            Thông tin người nhận
          </h3>
          <div class="text-sm space-y-1">
            <p class="text-gray-500 dark:text-gray-400">Tên người nhận:</p>
            <p class="font-medium text-gray-800 dark:text-gray-200">{{ user.name || 'Khách' }}</p>
          </div>
          <div class="text-sm space-y-1">
            <p class="text-gray-500 dark:text-gray-400">Điện thoại:</p>
            <p class="font-medium text-gray-800 dark:text-gray-200">{{ user.phone || 'Khách' }}</p>
          </div>
          <div class="text-sm space-y-1">
            <p class="text-gray-500 dark:text-gray-400">Địa chỉ giao hàng:</p>
            <p class="font-medium text-gray-800 dark:text-gray-200">{{ order.address }}</p>
          </div>
          <div class="text-sm space-y-1">
            <p class="text-gray-500 dark:text-gray-400">Phương thức thanh toán:</p>
            <p class="font-medium text-gray-800 dark:text-gray-200">
              {{
                order.paymentMethod === 'cash' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản'
              }}
            </p>
          </div>
        </div>

        <!-- Cột tổng kết -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold border-b pb-2 dark:border-gray-700">
            Tổng kết thanh toán
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400"
                >Tạm tính ({{ order.items.length }} sản phẩm):</span
              >
              <span class="font-medium dark:text-gray-200">{{
                formatCurrency(order.totalAmount - (storePolicies?.[0]?.deliveryFee || 0))
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Phí giao hàng:</span>
              <span class="font-medium dark:text-gray-200">{{
                formatCurrency(storePolicies?.[0]?.deliveryFee || 0)
              }}</span>
            </div>
            <div
              class="flex justify-between text-lg font-bold border-t pt-2 dark:border-gray-700 mt-2"
            >
              <span class="text-gray-900 dark:text-white">Tổng cộng:</span>
              <span class="text-green-600 dark:text-green-400">{{
                formatCurrency(order.totalAmount)
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Danh sách sản phẩm -->
      <div class="p-6 border-t dark:border-gray-700">
        <h3 class="text-lg font-semibold mb-4">Các sản phẩm đã đặt</h3>
        <div class="space-y-4">
          <div v-for="item in order.items" :key="item.id" class="flex items-start gap-4">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-20 h-20 object-cover rounded-lg border dark:border-gray-700"
            />
            <div class="flex-1">
              <p class="font-semibold text-gray-800 dark:text-gray-100">{{ item.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Số lượng: {{ item.quantity }}</p>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-0.5">
                <p v-if="item.size && item.size !== 'Mặc định'">Size: {{ item.size }}</p>
                <p v-if="item.sugar">Đường: {{ item.sugar }}</p>
                <p v-if="item.ice">Đá: {{ item.ice }}</p>
                <p v-if="item.toppings && item.toppings.length > 0">
                  Topping: {{ getToppingsDisplay(item.toppings) }}
                </p>
              </div>
            </div>
            <div class="text-right font-medium text-gray-700 dark:text-gray-300">
              {{
                formatCurrency((item.price + item.sizePrice + item.toppingPrice) * item.quantity)
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
