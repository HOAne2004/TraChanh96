<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useUserStore } from '@/stores/userStore'
import { useAppStore } from '@/stores/appStore'
import { useOrderStore } from '@/stores/orderStore' // 🚨 Mới: Import Order Store
import { useModalStore } from '@/stores/modalStore' // 🚨 Mới: Dùng để show Toast/Notification

import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Components
import NavLink from '@/components/common/NavLink.vue'
import CheckoutAddressForm from '@/components/customer/checkout/CheckoutAddressForm.vue'
import CheckoutPaymentMethods from '@/components/customer/checkout/CheckoutPaymentMethods.vue'
import CheckoutItemList from '@/components/customer/checkout/CheckoutItemList.vue'
import CheckoutSummary from '@/components/customer/checkout/CheckoutSummary.vue'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const appStore = useAppStore()
const orderStore = useOrderStore() // Khởi tạo Order Store
const modalStore = useModalStore() // Khởi tạo Modal Store (dùng cho Toast)

const { cartItems, totalPrice } = storeToRefs(cartStore)
const { user, isLoggedIn } = storeToRefs(userStore)
const { storePolicies } = storeToRefs(appStore)

// 1. STATE FORM & PROCESS (Giữ lại trong View)
const shippingAddress = ref('')
const paymentMethod = ref('cash') // 'cash', 'transfer'
const orderLoading = ref(false)
const orderSuccess = ref(false)

// Khởi tạo địa chỉ mặc định, tải dữ liệu cần thiết
onMounted(async () => {
    await Promise.all([appStore.fetchAppData()])
    if (user.value && user.value.address) {
        shippingAddress.value = user.value.address
    }
    if (cartItems.value.length === 0) {
        router.replace('/cart')
    }
})

// 2. TÍNH TOÁN PHÍ & TỔNG CỘNG (Giữ lại trong View)
const subtotal = computed(() => Number(totalPrice.value) || 0)

const shippingFee = computed(() => {
    // Lấy phí giao hàng từ chính sách (giả định policy đầu tiên)
    return Number(storePolicies.value?.[0]?.deliveryFee) || 0
})

const total = computed(() => subtotal.value + shippingFee.value)

// 3. XỬ LÝ ĐẶT HÀNG (Refactor để gọi Store Action)
const placeOrder = async () => {
    if (shippingAddress.value.trim().length < 10) {
        modalStore.showToast('Vui lòng nhập địa chỉ giao hàng chi tiết hơn.', 'error')
        return
    }

    orderLoading.value = true

    try {
        const orderData = {
            userId: user.value?.id || 'guest',
            items: cartItems.value,
            address: shippingAddress.value,
            totalAmount: total.value,
            paymentMethod: paymentMethod.value,
            // status và createdAt nên được xử lý ở Back-end hoặc Order Store
        }

        // 🚨 Gọi Order Store Action
        await orderStore.placeOrderAction(orderData)

        // Thành công:
        cartStore.clearCart() // Xóa giỏ hàng
        orderSuccess.value = true
        modalStore.showToast('Đặt hàng thành công! Cảm ơn bạn.', 'success')

    } catch (error) {
        console.error('Lỗi đặt hàng:', error)
        modalStore.showToast('Lỗi đặt hàng. Vui lòng thử lại.', 'error')
    } finally {
        orderLoading.value = false
    }
}

// Format tiền (Giữ lại trong View nếu nó chỉ được dùng ở đây)
const formatCurrency = (val) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
</script>

<template>
    <main class="py-8 max-w-5xl mx-auto px-4 lg:px-8">
        <h1 class="text-3xl font-bold mb-8 text-center text-green-700 dark:text-green-400">
            THANH TOÁN ĐƠN HÀNG
        </h1>

        <div v-if="orderSuccess" class="text-center py-20 bg-green-50 dark:bg-gray-700 rounded-xl shadow-xl">
            <h2 class="text-3xl font-bold text-green-600 mb-4">🎉 ĐẶT HÀNG THÀNH CÔNG!</h2>
            <p class="text-lg text-gray-700 dark:text-gray-300">
                Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
            </p>
            <NavLink to="/" label="Tiếp tục mua sắm" variant="primary" class="mt-6 inline-block" />
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Bạn có thể theo dõi đơn hàng trong mục Lịch sử đơn hàng.
            </p>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
                <!-- 1. FORM ĐỊA CHỈ -->
                <CheckoutAddressForm 
                    v-model="shippingAddress" 
                    :is-logged-in="isLoggedIn"
                />

                <!-- 2. PHƯƠNG THỨC THANH TOÁN -->
                <CheckoutPaymentMethods 
                    v-model="paymentMethod" 
                />

                <!-- 3. DANH SÁCH SẢN PHẨM -->
                <CheckoutItemList 
                    :items="cartItems" 
                    :format-currency="formatCurrency"
                />
            </div>

            <!-- 4. TÓM TẮT ĐƠN HÀNG -->
            <CheckoutSummary
                class="lg:col-span-1 h-fit sticky top-24"
                :subtotal="subtotal"
                :shipping-fee="shippingFee"
                :total="total"
                :cart-is-empty="cartItems.length === 0"
                :order-loading="orderLoading"
                :format-currency="formatCurrency"
                @place-order="placeOrder"
            />
        </div>
    </main>
</template>
