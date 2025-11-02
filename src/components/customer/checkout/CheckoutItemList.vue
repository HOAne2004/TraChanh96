<script setup>
defineProps({
    items: { type: Array, required: true },
    formatCurrency: { type: Function, required: true },
})
</script>

<template>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 class="text-xl font-semibold mb-4 border-b pb-2">
            Sản phẩm ({{ items.length }})
        </h2>
        <div
            v-for="item in items"
            :key="item.id"
            class="flex justify-between text-sm py-2 border-b dark:border-gray-700"
        >
            <span class="w-2/3 truncate text-gray-700 dark:text-gray-300">{{ item.name }} (x{{ item.quantity }})</span>
            <span class="w-1/3 text-right font-medium text-gray-900 dark:text-white">{{ formatCurrency(item.price * item.quantity) }}</span>
        </div>
        <div v-if="items.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
            Giỏ hàng của bạn đang trống.
        </div>
    </div>
</template>
