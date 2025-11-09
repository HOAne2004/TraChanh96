<script setup>
import { ref, watch } from 'vue'

// v-model từ cha
const model = defineModel()

defineProps({
  isLoggedIn: { type: Boolean, default: false },
})

// Thêm biến theo dõi lỗi cục bộ
const showError = ref(false)

// Theo dõi khi người dùng nhập -> nếu đã nhập thì ẩn lỗi
watch(model, (newVal) => {
  if (newVal && newVal.trim().length >= 10) {
    showError.value = false
  }
})

// Hàm validate thủ công (nếu cần gọi từ cha sau này)
const validateAddress = () => {
  if (!model.value || model.value.trim().length < 10) {
    showError.value = true
    return false
  }
  return true
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
    <h2 class="text-xl font-semibold mb-4 border-b pb-2">Thông tin giao hàng</h2>

    <div v-if="!isLoggedIn" class="text-red-500 mb-3 text-sm">
      Bạn đang thanh toán với tư cách Khách. Vui lòng đăng nhập để lưu địa chỉ.
    </div>

    <label for="address" class="block text-sm font-medium mb-1">
      Địa chỉ nhận hàng <span class="text-red-500">*</span>
    </label>

    <textarea
      id="address"
      :value="model"
      @input="model = $event.target.value"
      rows="3"
      required
      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
      class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none dark:bg-gray-700 dark:text-white"
      :class="{ 'border-red-500 focus:ring-red-300': showError }"
    ></textarea>

    <!-- Thông báo lỗi -->
    <p v-if="showError" class="text-red-500 text-sm mt-2">
      ⚠️ Vui lòng nhập địa chỉ giao hàng chi tiết hơn (ít nhất 10 ký tự).
    </p>
  </div>
</template>
