<script setup>
// Sử dụng v-model để đồng bộ giá trị với component cha
const model = defineModel()
</script>

<template>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 class="text-xl font-semibold mb-4 border-b pb-2">Phương thức thanh toán</h2>
        <div class="space-y-3">
            <label class="flex items-center space-x-3 cursor-pointer">
                <input
                    type="radio"
                    :value="'cash'"
                    :checked="model === 'cash'"
                    @change="model = 'cash'"
                    class="form-radio text-green-600 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-green-500"
                />
                <span>Thanh toán khi nhận hàng (COD)</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
                <input
                    type="radio"
                    :value="'transfer'"
                    :checked="model === 'transfer'"
                    @change="model = 'transfer'"
                    class="form-radio text-green-600 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-green-500"
                />
                <span>Chuyển khoản ngân hàng</span>
                <span class="text-xs text-blue-500">(Cần tích hợp API)</span>
            </label>
        </div>
    </div>
</template>
