<script setup>
import { ref, computed, watch } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useModalStore } from '@/stores/modalStore'
import uploadApi from '@/api/uploadApi' // ⭐️ 1. Import API Tải ảnh
import http from '@/api' // ⭐️ 2. Import http để lấy Base URL cho ảnh preview

// Components
import Button from '@/components/common/Button.vue'
import AppModal from '@/components/common/AppModal.vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  productData: { type: Object, default: null }, // Dữ liệu ProductReadDto (C#)
  categories: { type: Array, required: true },
  // ⭐️ THAY ĐỔI: Props này không còn cần thiết
  // toppings: { type: Array, required: true },
  sizes: { type: Array, required: true }, // ⭐️ Giờ là mảng SizeDto: [{ id, label, ... }]
  sugarLevels: { type: Array, required: true },
  iceLevels: { type: Array, required: true },
})

const emit = defineEmits(['close', 'success'])
const productStore = useProductStore()
const modalStore = useModalStore()

// --- TRẠNG THÁI FORM ---
const isSubmitting = ref(false)
const isUploadingImage = ref(false) // ⭐️ Trạng thái tải ảnh
const formError = ref(null)

// ⭐️ 3. Dữ liệu mặc định (Khớp ProductCreateDto + C# Model)
const defaultForm = {
  id: null,
  name: '',
  basePrice: 0,
  imageUrl: '/images/products/default.png', // ⭐️ Đổi tên
  description: '',
  ingredient: '', // ⭐️ Thêm mới
  launchDateTime: null, // ⭐️ Thêm mới
  categoryId: '',
  productType: 'Beverage', // ⭐️ Thêm mới
  status: 'Active', // ⭐️ Thêm mới
  // ⭐️ THAY ĐỔI: Chuyển sang mảng ID
  sizeIds: [],
  sugarLevelIds: [],
  iceLevelIds: [],
}
const form = ref({ ...defaultForm })

// --- COMPUTED PROPERTIES ---
const isEditMode = computed(() => !!props.productData)
const modalTitle = computed(() => (isEditMode.value ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm mới'))
const submitButtonLabel = computed(() => (isEditMode.value ? 'Lưu Thay đổi' : 'Tạo Sản phẩm'))

// ⭐️ 4. URL Preview (Xử lý base URL)
const imagePreviewUrl = computed(() => {
  if (!form.value.imageUrl) return '/images/products/default.png'
  // Nếu là URL đầy đủ (https://...)
  if (form.value.imageUrl.startsWith('http')) return form.value.imageUrl
  // Nếu là URL tương đối (đã tải lên /uploads/...)
  // Lấy base URL từ axios (ví dụ: https://localhost:7001)
  const baseUrl = http.defaults.baseURL.replace('/api', '')
  return baseUrl + form.value.imageUrl
})

// --- WATCHER ---

// ⭐️ 5. Đồng bộ hóa (Khớp ProductReadDto (C#) -> Form)
watch(
  () => props.productData,
  (newVal) => {
    if (newVal) {
      // Chế độ Sửa
      form.value = {
        id: newVal.id,
        name: newVal.name,
        basePrice: newVal.basePrice,
        imageUrl: newVal.imageUrl,
        description: newVal.description || '',
        ingredient: newVal.ingredient || '', // ⭐️ THÊM MỚI
        // ⭐️ THÊM MỚI (Xử lý định dạng input datetime-local)
        launchDateTime: newVal.launchDateTime
          ? new Date(newVal.launchDateTime).toISOString().slice(0, 16)
          : null,
        categoryId: newVal.categoryId,
        productType: newVal.productType,
        status: newVal.status,
        sizeIds: newVal.allowedSizeIds || [],
        sugarLevelIds: newVal.allowedSugarLevelIds || [],
        iceLevelIds: newVal.allowedIceLevelIds || [],
      }
    } else {
      // Chế độ Thêm mới
      form.value = { ...defaultForm }
    }
  },
  { immediate: true },
)

// Reset form khi modal mở (nếu là chế độ thêm mới)
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      if (!props.productData) {
        form.value = { ...defaultForm }
      }
      formError.value = null
      isSubmitting.value = false
      isUploadingImage.value = false
    }
  },
)

// --- ⭐️ 6. HÀM TẢI ẢNH (ĐÃ NÂNG CẤP) ---
const fileInput = ref(null)

const processImageUpload = async (file) => {
  if (!file) return
  isUploadingImage.value = true
  formError.value = null
  try {
    // Gọi API upload (uploadApi đã được định nghĩa)
    const url = await uploadApi.uploadImage(file)
    form.value.imageUrl = url // Gán URL trả về từ C#
  } catch (err) {
    formError.value = err.message
  } finally {
    isUploadingImage.value = false
  }
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  processImageUpload(file)
}

const handlePasteImage = (e) => {
  const items = e.clipboardData.items
  for (const item of items) {
    if (item.type.indexOf('image') !== -1) {
      const file = item.getAsFile()
      processImageUpload(file)
      break
    }
  }
}

// ⭐️ 7. HÀM XỬ LÝ SUBMIT (ĐÃ NÂNG CẤP) ---
const handleSubmit = async (e) => {
  e.preventDefault()
  formError.value = null

  // Validate
  if (!form.value.name.trim()) return (formError.value = 'Vui lòng nhập tên sản phẩm.')
  if (form.value.basePrice <= 0) return (formError.value = 'Vui lòng nhập giá bán hợp lệ.')
  if (!form.value.categoryId) return (formError.value = 'Vui lòng chọn danh mục.')

  // ⭐️ Validate các tùy chọn (Chỉ bắt buộc cho Đồ uống)
  if (form.value.productType === 'Beverage') {
    if (form.value.sizeIds.length === 0) return (formError.value = 'Vui lòng chọn ít nhất 1 Size.')
    if (form.value.sugarLevelIds.length === 0)
      return (formError.value = 'Vui lòng chọn ít nhất 1 Mức đường.')
    if (form.value.iceLevelIds.length === 0)
      return (formError.value = 'Vui lòng chọn ít nhất 1 Mức đá.')
  }

  isSubmitting.value = true

  try {
    // ⭐️ Xây dựng DTO (Khớp ProductCreateDto C#)
    const dataToSubmit = {
      name: form.value.name,
      basePrice: form.value.basePrice,
      imageUrl: form.value.imageUrl,
      description: form.value.description,
      ingredient: form.value.ingredient, // ⭐️ THÊM MỚI
      // ⭐️ THÊM MỚI (Gửi null nếu rỗng)
      launchDateTime: form.value.launchDateTime ? new Date(form.value.launchDateTime) : null,
      categoryId: form.value.categoryId,
      productType: form.value.productType,
      status: form.value.status,
      sizeIds: form.value.sizeIds,
      sugarLevelIds: form.value.sugarLevelIds,
      iceLevelIds: form.value.iceLevelIds,
    }

    if (isEditMode.value) {
      // ⭐️ Sửa: props.productData.id (phải là 'int')
      await productStore.updateProductAction(props.productData.id, dataToSubmit)
    } else {
      await productStore.createProductAction(dataToSubmit)
    }

    emit('success')
  } catch (e) {
    formError.value = e?.message || 'Lỗi xử lý. Vui lòng kiểm tra lại dữ liệu nhập.'
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  emit('close')
}

// Định dạng tiền tệ (Helper)
const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
</script>

<template>
  <AppModal :is-open="isOpen" @close="handleClose" :title="modalTitle" :max-width="'max-w-4xl'">
    <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
      <div
        v-if="formError"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900/50 dark:border-red-600 dark:text-red-300"
        role="alert"
      >
        <span class="block sm:inline">{{ formError }}</span>
      </div>

      <div v-if="isUploadingImage" class="text-center p-4 bg-green-50 text-green-700 rounded-lg">
        Đang tải ảnh lên...
      </div>

      <h3 class="text-xl font-semibold border-b pb-2 dark:text-white">Thông tin cơ bản</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tên sản phẩm (*)
          </label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label for="basePrice" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Giá bán (VND) (*)
          </label>
          <input
            type="number"
            id="basePrice"
            v-model.number="form.basePrice"
            required
            min="0"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label for="ingredient" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Thành phần (Ngăn cách bởi dấu phẩy)
        </label>
        <input
          type="text"
          id="ingredient"
          v-model="form.ingredient"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Mô tả ngắn
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Ảnh sản phẩm
        </label>
        <div
          class="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
          @click="fileInput.click()"
          @paste="handlePasteImage"
        >
          <input
            type="file"
            accept="image/*"
            class="hidden"
            ref="fileInput"
            @change="handleFileUpload"
          />
          <div v-if="form.imageUrl" class="w-32 h-32 overflow-hidden rounded-lg border mt-2">
            <img :src="imagePreviewUrl" alt="Preview" class="w-full h-full object-cover" />
          </div>
          <p v-else class="text-sm text-gray-500 dark:text-gray-400 text-center">
            Kéo & thả, chọn file hoặc Ctrl + V để dán hình
          </p>
        </div>
      </div>

      <div>
        <label
          for="launchDateTime"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Ngày ra mắt (Tùy chọn)
        </label>
        <input
          type="datetime-local"
          id="launchDateTime"
          v-model="form.launchDateTime"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <h3 class="text-xl font-semibold border-b pb-2 dark:text-white pt-4">Phân loại & Tùy chọn</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Danh mục (*)
          </label>
          <select
            id="category"
            v-model="form.categoryId"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="" disabled>Chọn danh mục</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
        <div>
          <label
            for="productType"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Loại sản phẩm (*)
          </label>
          <select
            id="productType"
            v-model="form.productType"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="Beverage">Đồ uống (Beverage)</option>
            <option value="Topping">Topping</option>
          </select>
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Trạng thái (*)
          </label>
          <select
            id="status"
            v-model="form.status"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="Active">Hoạt động (Active)</option>
            <option value="Draft">Bản nháp (Draft)</option>
            <option value="Archived">Lưu trữ (Archived)</option>
          </select>
        </div>
      </div>

      <div v-if="form.productType === 'Beverage'" class="space-y-4">
        <div class="pt-2">
          <p class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Size có sẵn (*):
          </p>
          <div class="flex flex-wrap gap-4">
            <div v-for="size in sizes" :key="size.id" class="flex items-center space-x-2">
              <input
                type="checkbox"
                :id="`size-${size.id}`"
                :value="size.id"
                v-model="form.sizeIds"
                class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label :for="`size-${size.id}`" class="text-sm text-gray-700 dark:text-gray-300">
                {{ size.label }} ({{ formatCurrency(size.priceModifier) }})
              </label>
            </div>
          </div>
        </div>

        <div class="pt-2">
          <p class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mức đường có sẵn (*):
          </p>
          <div class="flex flex-wrap gap-4">
            <div v-for="level in sugarLevels" :key="level.id" class="flex items-center space-x-2">
              <input
                type="checkbox"
                :id="`sugar-${level.id}`"
                :value="level.id"
                v-model="form.sugarLevelIds"
                class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label :for="`sugar-${level.id}`" class="text-sm text-gray-700 dark:text-gray-300">
                {{ level.label }} ({{ level.value }}%)
              </label>
            </div>
          </div>
        </div>

        <div class="pt-2">
          <p class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mức đá có sẵn (*):
          </p>
          <div class="flex flex-wrap gap-4">
            <div v-for="level in iceLevels" :key="level.id" class="flex items-center space-x-2">
              <input
                type="checkbox"
                :id="`ice-${level.id}`"
                :value="level.id"
                v-model="form.iceLevelIds"
                class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label :for="`ice-${level.id}`" class="text-sm text-gray-700 dark:text-gray-300">
                {{ level.label }} ({{ level.value }}%)
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-6 border-t dark:border-gray-700 flex justify-end space-x-3">
        <Button
          @click="handleClose"
          type="button"
          label="Hủy"
          variant="secondary"
          :disabled="isSubmitting || isUploadingImage"
        />
        <button
          type="submit"
          :disabled="isSubmitting || isUploadingImage"
          :class="[
            'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed',
            isSubmitting || isUploadingImage ? 'opacity-70 cursor-not-allowed' : '',
          ]"
        >
          {{
            isSubmitting
              ? 'Đang xử lý...'
              : isUploadingImage
                ? 'Đang tải ảnh...'
                : submitButtonLabel
          }}
        </button>
      </div>
    </form>
  </AppModal>
</template>
