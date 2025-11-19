<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    orders: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
})

const router = useRouter()

// Số lượng đơn hàng mới nhất cần hiển thị
const LIMIT = 5

// --- LOGIC XỬ LÝ DỮ LIỆU ---

// 1. Lọc và Sắp xếp đơn hàng mới nhất (Pending)
const latestPendingOrders = computed(() => {
    if (props.isLoading) return []
    
    // Giả định đơn hàng đã được fetch và sắp xếp theo `createdAt` giảm dần (mới nhất lên đầu)
    // Nếu chưa được sắp xếp, cần sắp xếp tại đây:
    // const sortedOrders = [...props.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return props.orders
        .filter(order => order.status === 'Pending') // Chỉ lấy đơn hàng đang chờ xử lý
        .slice(0, LIMIT) // Giới hạn số lượng
})

// 2. Format Helper
const formatCurrency = (val) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    // Hiển thị thời gian ngắn gọn: HH:MM Ngày/Tháng
    return new Date(dateStr).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'numeric'
    })
}

// 3. Điều hướng
const goToOrderDetail = (orderId) => {
    // Chuyển hướng đến trang chi tiết đơn hàng admin
    router.push(`/admin/orders/${orderId}`)
}
</script>

<template>
    <div class="space-y-4">
        <div v-if="isLoading" class="space-y-4">
            <div v-for="i in LIMIT" :key="i" class="h-12 bg-gray-100 dark:bg-gray-600 rounded"></div>
        </div>

        <div v-else-if="latestPendingOrders.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>🎉 Không có đơn hàng mới nào cần xử lý!</p>
        </div>

        <div v-else>
            <div
                v-for="order in latestPendingOrders"
                :key="order.id"
                @click="goToOrderDetail(order.id)"
                class="flex justify-between items-center p-3 border-b dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-150 rounded"
            >
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-800 dark:text-white truncate">
                        #{{ order.id }} - {{ order.items.length }} sản phẩm
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {{ formatDate(order.createdAt) }}
                    </p>
                </div>

                <div class="text-right ml-4">
                    <span class="text-sm font-bold text-red-600 dark:text-red-400">
                        {{ formatCurrency(order.totalAmount) }}
                    </span>
                    <svg class="w-4 h-4 text-gray-400 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </div>
            </div>
        </div>
        
        <div v-if="latestPendingOrders.length > 0" class="text-center pt-4">
            <button 
                @click="router.push('/admin/orders')"
                class="text-sm font-medium text-green-600 dark:text-green-400 hover:underline"
            >
                Xem tất cả đơn hàng &rarr;
            </button>
        </div>
    </div>
</template>