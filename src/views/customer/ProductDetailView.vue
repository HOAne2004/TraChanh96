<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { useAppStore } from '@/stores/appStore'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/utils/formatters' // Import hàm format

import Notification from '@/components/common/Notification.vue'
import NavLink from '@/components/common/NavLink.vue'
import TitledContainer from '@/components/customer/TitledContainer.vue'
import Button from '@/components/common/Button.vue'
import DeliveryInfor from '@/components/customer/DeliveryInfor.vue'

// Import ảnh mặc định
import defaultImage from '@/assets/images/others/default-drink.png'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const appStore = useAppStore()
const cartStore = useCartStore()

const { products, toppings, sizes, sugarLevels, iceLevels } = storeToRefs(productStore)
const { storePolicies } = storeToRefs(appStore)

const isLoading = ref(true)
const selectedSize = ref(null)
const selectedSugar = ref(null)
const selectedIce = ref(null)
const selectedToppings = ref([])
const quantity = ref(1)
const showNotification = ref(false)

const productId = computed(() => route.params.id)

// 1. Lấy sản phẩm (Đổi == thành === String() để an toàn)
const product = computed(() => products.value.find((p) => String(p.id) === String(productId.value)))

// 2. Xử lý ảnh (Ghép domain)
const fullImageUrl = computed(() => {
  if (!product.value) return ''
  const url = product.value.imageUrl
  if (!url) return defaultImage
  if (url.startsWith('http')) return url
  return `https://trachanh96-be-production.up.railway.app${url}`
})

const storePolicy = computed(() => storePolicies.value?.[0] || null)

onMounted(async () => {
  try {
    // Tải song song cả 2 để tiết kiệm thời gian
    await Promise.all([
        productStore.fetchProduct(), // Hàm này tải cả options
        appStore.fetchStorePolicies()
    ])
    setDefaultSelections()
  } catch (error) {
    console.error('Lỗi tải dữ liệu:', error)
  } finally {
    isLoading.value = false
  }
})

// 3. Logic chọn mặc định (Dựa trên mảng phẳng)
const setDefaultSelections = () => {
  // Size: Chọn size giá thấp nhất (thường là Nhỏ/Vừa)
  if (sizes.value.length > 0) {
    selectedSize.value = sizes.value.reduce((min, s) => (s.priceModifier < min.priceModifier ? s : min), sizes.value[0])
  }
  // Sugar: Chọn 100%
  if (sugarLevels.value.length > 0) {
    selectedSugar.value = sugarLevels.value.find(s => s.value === 100) || sugarLevels.value[0]
  }
  // Ice: Chọn 100%
  if (iceLevels.value.length > 0) {
    selectedIce.value = iceLevels.value.find(i => i.value === 100) || iceLevels.value[0]
  }
}

// Watch data thay đổi (quan trọng khi F5 trang)
watch([sizes, sugarLevels, iceLevels], () => {
    if (!selectedSize.value) setDefaultSelections()
})

// 4. Tính tổng tiền (Cập nhật tên biến)
const totalPrice = computed(() => {
  if (!product.value) return 0
  const base = Number(product.value.basePrice) || 0
  const sizeExtra = Number(selectedSize.value?.priceModifier) || 0
  const toppingTotal = selectedToppings.value.reduce((sum, t) => sum + Number(t.basePrice), 0) // Topping cũng có basePrice

  return (base + sizeExtra + toppingTotal) * quantity.value
})

// Toggle topping
function toggleTopping(topping) {
  const idx = selectedToppings.value.findIndex((t) => t.id === topping.id)
  if (idx > -1) selectedToppings.value.splice(idx, 1)
  else selectedToppings.value.push(topping)
}

// 5. Thêm vào giỏ (Mapping chuẩn)
const addToCart = () => {
  if (!product.value || !selectedSize.value) return

  // Topping DTO
  const toppingsDto = selectedToppings.value.map(t => ({
      productId: t.id,
      quantity: 1,
      name: t.name, // Lưu thêm để hiện thị UI giỏ hàng
      price: t.basePrice
  }))

  const itemDto = {
    id: `${product.value.id}_${Date.now()}`, // ID frontend unique
    productId: product.value.id,
    name: product.value.name,
    image: fullImageUrl.value,
    price: Number(product.value.basePrice),
    quantity: quantity.value,

    // Options
    sizeId: selectedSize.value.id,
    size: selectedSize.value.label,
    sizePrice: selectedSize.value.priceModifier,

    sugarId: selectedSugar.value?.id,
    sugar: selectedSugar.value?.label,

    iceId: selectedIce.value?.id,
    ice: selectedIce.value?.label,

    toppings: toppingsDto,
    // Tổng giá topping để tiện tính toán frontend
    toppingPrice: selectedToppings.value.reduce((sum, t) => sum + Number(t.basePrice), 0)
  }

  cartStore.addToCart(itemDto)

  showNotification.value = false
  setTimeout(() => (showNotification.value = true), 50)
  quantity.value = 1
  selectedToppings.value = [] // Reset topping
}

const checkout = () => {
    addToCart()
    router.push('/checkout')
}
</script>

<template>
  <main class="p-6 max-w-6xl mx-auto min-h-screen">
    <div v-if="isLoading" class="flex justify-center py-20">
       <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
    </div>

    <div v-else-if="!product" class="text-center py-20">
       <h3 class="text-xl font-bold text-gray-700">Không tìm thấy sản phẩm</h3>
       <Button label="Quay lại Menu" class="mt-4" @click="$router.push('/products')" />
    </div>

    <div v-else>
        <div class="mb-6 text-sm text-gray-500 flex items-center gap-2">
          <NavLink to="/products" label="Thực đơn" variant="secondary" />
          <span>/</span>
          <span class="font-semibold text-gray-800 dark:text-gray-200">{{ product.name }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <div class="md:col-span-5 flex justify-center">
            <div class="relative group w-full max-w-sm aspect-square bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <img
                :src="fullImageUrl"
                :alt="product.name"
                class="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                @error="(e) => e.target.src = defaultImage"
              />
            </div>
          </div>

          <div class="md:col-span-7 space-y-6">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ product.name }}</h1>
                <p class="text-2xl font-extrabold text-green-600">{{ formatPrice(product.basePrice) }}</p>
            </div>

            <div class="space-y-4">
              <div v-if="sizes.length">
                <span class="block text-sm font-semibold mb-2">Chọn Size</span>
                <div class="flex flex-wrap gap-3">
                  <button
                    v-for="size in sizes"
                    :key="size.id"
                    @click="selectedSize = size"
                    :class="[
                      'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                      selectedSize?.id === size.id
                        ? 'bg-green-600 text-white border-green-600 shadow-md'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-green-500'
                    ]"
                  >
                    {{ size.label }}
                    <span v-if="size.priceModifier > 0" class="text-xs ml-1 opacity-80">(+{{ formatPrice(size.priceModifier) }})</span>
                  </button>
                </div>
              </div>

              <div v-if="sugarLevels.length">
                <span class="block text-sm font-semibold mb-2">Độ ngọt</span>
                <div class="flex flex-wrap gap-3">
                  <button
                    v-for="level in sugarLevels"
                    :key="level.id"
                    @click="selectedSugar = level"
                    :class="[
                      'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                      selectedSugar?.id === level.id
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-green-500'
                    ]"
                  >
                    {{ level.label }}
                  </button>
                </div>
              </div>

              <div v-if="iceLevels.length">
                <span class="block text-sm font-semibold mb-2">Lượng đá</span>
                <div class="flex flex-wrap gap-3">
                  <button
                    v-for="level in iceLevels"
                    :key="level.id"
                    @click="selectedIce = level"
                    :class="[
                      'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                      selectedIce?.id === level.id
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-green-500'
                    ]"
                  >
                    {{ level.label }}
                  </button>
                </div>
              </div>

              <div v-if="toppings.length">
                 <span class="block text-sm font-semibold mb-2">Thêm Topping</span>
                 <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div
                      v-for="t in toppings"
                      :key="t.id"
                      @click="toggleTopping(t)"
                      class="flex items-center p-2 rounded-lg border cursor-pointer transition-all hover:shadow-sm"
                      :class="selectedToppings.some(s => s.id === t.id) ? 'border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-600'"
                    >
                       <div class="w-10 h-10 rounded overflow-hidden mr-3 bg-gray-200 flex-shrink-0">
                          <img
                            :src="`https://trachanh96-be-production.up.railway.app${t.imageUrl}`"
                            class="w-full h-full object-cover"
                            @error="(e) => e.target.src = defaultImage"
                          />
                       </div>
                       <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium truncate">{{ t.name }}</p>
                          <p class="text-xs text-gray-500">+{{ formatPrice(t.basePrice) }}</p>
                       </div>
                       <div class="w-5 h-5 rounded-full border flex items-center justify-center"
                            :class="selectedToppings.some(s => s.id === t.id) ? 'bg-green-600 border-green-600' : 'border-gray-300'">
                            <svg v-if="selectedToppings.some(s => s.id === t.id)" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            <div class="pt-6 border-t dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center">
               <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button @click="quantity = Math.max(1, quantity - 1)" class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition">-</button>
                  <span class="px-4 font-bold min-w-[3rem] text-center">{{ quantity }}</span>
                  <button @click="quantity++" class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition">+</button>
               </div>

               <div class="flex-1 text-center sm:text-left">
                  <span class="block text-xs text-gray-500">Tạm tính</span>
                  <span class="text-2xl font-bold text-green-700">{{ formatPrice(totalPrice) }}</span>
               </div>

               <div class="flex gap-3 w-full sm:w-auto">
                  <Button label="Thêm vào giỏ" variant="outline" class="flex-1" @click="addToCart">
                     <template #icon>🛒</template>
                  </Button>
                  <Button label="Mua ngay" variant="primary" class="flex-1" @click="checkout" />
               </div>
            </div>
          </div>
        </div>

        <TitledContainer title="Mô tả sản phẩm" controls="hidden">
           <div class="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
              <p>{{ product.description || 'Đang cập nhật mô tả...' }}</p>
           </div>
        </TitledContainer>

        <DeliveryInfor v-if="storePolicy" :policy="storePolicy" class="mt-8" />
    </div>

    <Notification :show="showNotification" :message="`Đã thêm ${product?.name} vào giỏ hàng`" />
  </main>
</template>
