<script setup>
// Sử dụng v-model để đồng bộ giá trị với component cha
const model = defineModel()

defineProps({
    isLoggedIn: { type: Boolean, default: false },
})
</script>

<template>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 class="text-xl font-semibold mb-4 border-b pb-2">Thông tin giao hàng</h2>
        <div v-if="!isLoggedIn" class="text-red-500 mb-3 text-sm">
            Bạn đang thanh toán với tư cách Khách. Vui lòng đăng nhập để lưu địa chỉ.
        </div>
        <label for="address" class="block text-sm font-medium mb-1">Địa chỉ nhận hàng (*)</label>
        <textarea
            id="address"
            :value="model"
            @input="model = $event.target.value"
            rows="3"
            required
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
            class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-300 outline-none dark:bg-gray-700 dark:text-white"
        ></textarea>
    </div>
</template>
