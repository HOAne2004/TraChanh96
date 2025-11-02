<script setup>
import Button from '@/components/common/Button.vue'

defineProps({
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    total: { type: Number, required: true },
    cartIsEmpty: { type: Boolean, default: true },
    orderLoading: { type: Boolean, default: false },
    formatCurrency: { type: Function, required: true },
})

const emit = defineEmits(['placeOrder'])
</script>

<template>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 class="text-xl font-semibold mb-4 border-b pb-2">Tổng kết</h2>

        <!-- Chi tiết phí -->
        <div class="space-y-2">
            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Tạm tính:</span>
                <span class="font-medium">{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Phí giao hàng:</span>
                <span class="font-medium">{{ formatCurrency(shippingFee) }}</span>
            </div>
        </div>
        
        <div class="border-t my-3 dark:border-gray-700"></div>

        <!-- Tổng cộng -->
        <div class="flex justify-between font-bold text-xl">
            <span>TỔNG THANH TOÁN:</span>
            <span class="text-red-600 dark:text-red-400">{{ formatCurrency(total) }}</span>
        </div>

        <!-- Nút Đặt hàng -->
        <Button
            @click="emit('placeOrder')"
            :disabled="orderLoading || cartIsEmpty"
            :label="orderLoading ? 'Đang đặt hàng...' : 'HOÀN TẤT ĐẶT HÀNG'"
            variant="primary"
            size="lg"
            class="mt-6 w-full shadow-lg hover:shadow-xl"
        />
        <p v-if="cartIsEmpty" class="text-red-500 text-center mt-3 text-sm">
            Giỏ hàng trống. Không thể đặt hàng.
        </p>
    </div>
</template>
