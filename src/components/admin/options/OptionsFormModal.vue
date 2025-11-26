<script setup>
import { ref, computed, watch } from 'vue'
import { useProductStore } from '@/stores/productStore'

const props = defineProps({
  isOpen: Boolean,
  type: String, // 'size', 'sugar', 'ice'
  // ⭐️ THÊM PROP NÀY: Nhận dữ liệu cần sửa (nếu có)
  itemData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'created', 'updated'])
const productStore = useProductStore()

// State
const isLoading = ref(false)
const label = ref('')
const valueData = ref(0)

// ⭐️ CHECK MODE: Có dữ liệu => Đang sửa
const isEditMode = computed(() => !!props.itemData)

// Tiêu đề động
const title = computed(() => {
  const action = isEditMode.value ? 'Cập nhật' : 'Thêm mới'
  if (props.type === 'size') return `${action} Kích cỡ (Size)`
  if (props.type === 'sugar') return `${action} Mức Đường`
  return `${action} Mức Đá`
})

const valueLabel = computed(() => {
  if (props.type === 'size') return 'Giá thêm (VNĐ)'
  return 'Giá trị (%)'
})

// ⭐️ WATCHER QUAN TRỌNG: Đồng bộ dữ liệu khi mở modal
watch(() => props.itemData, (newItem) => {
  if (newItem) {
    // --- CHẾ ĐỘ SỬA ---
    label.value = newItem.label
    // Size dùng 'priceModifier', Sugar/Ice dùng 'value'
    if (props.type === 'size') {
        valueData.value = newItem.priceModifier
    } else {
        valueData.value = newItem.value
    }
  } else {
    // --- CHẾ ĐỘ TẠO MỚI (Reset form) ---
    label.value = ''
    valueData.value = 0
  }
}, { immediate: true })

const handleSubmit = async () => {
  isLoading.value = true
  try {
    const numberValue = Number(valueData.value) || 0
    let result = null

    // 1. LOGIC CHO SIZE
    if (props.type === 'size') {
      const payload = { label: label.value, priceModifier: numberValue }
      if (isEditMode.value) {
        result = await productStore.updateSizeAction(props.itemData.id, payload)
      } else {
        result = await productStore.createSizeAction(payload)
      }
    }
    // 2. LOGIC CHO SUGAR
    else if (props.type === 'sugar') {
      const payload = { label: label.value, value: numberValue }
      if (isEditMode.value) {
        result = await productStore.updateSugarLevelAction(props.itemData.id, payload)
      } else {
        result = await productStore.createSugarLevelAction(payload)
      }
    }
    // 3. LOGIC CHO ICE
    else {
      const payload = { label: label.value, value: numberValue }
      if (isEditMode.value) {
        result = await productStore.updateIceLevelAction(props.itemData.id, payload)
      } else {
        result = await productStore.createIceLevelAction(payload)
      }
    }

    // Emit sự kiện tương ứng
    if (isEditMode.value) {
        emit('updated', { type: props.type, data: result })
    } else {
        emit('created', { type: props.type, data: result })
    }

    emit('close')
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-sm shadow-xl border dark:border-gray-700 animate-fade-in-up">
      <h3 class="text-lg font-bold mb-4 dark:text-white">{{ title }}</h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1 dark:text-gray-300">Tên hiển thị</label>
          <input
            v-model="label"
            required
            placeholder="VD: Lớn, 50%..."
            class="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 dark:text-gray-300">{{ valueLabel }}</label>
          <input
            v-model="valueData"
            type="number"
            required
            class="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div class="flex justify-end gap-2 pt-2">
           <button
             type="button"
             @click="$emit('close')"
             class="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 transition"
           >
             Hủy
           </button>
           <button
             type="submit"
             :disabled="isLoading"
             class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center"
           >
             <span v-if="isLoading" class="mr-2">...</span>
             {{ isEditMode ? 'Lưu thay đổi' : 'Tạo mới' }}
           </button>
        </div>
      </form>
    </div>
  </div>
</template>
