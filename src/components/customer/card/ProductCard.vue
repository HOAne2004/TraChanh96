<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cartStore'
import { useProductStore } from '@/stores/productStore'
import Notification from '@/components/common/Notification.vue'
import { formatPrice } from '@/utils/formatters' // Sử dụng hàm format chung

import defaultDrink from '@/assets/images/others/default-drink.png'

const props = defineProps({
  product: { type: Object, required: true },
})

const cartStore = useCartStore()
const productStore = useProductStore()
const { sizes, sugarLevels, iceLevels } = storeToRefs(productStore)

const showNotification = ref(false)
const quantity = ref(1)

// 1. XỬ LÝ ẢNH (Ghép domain nếu cần)
const fullImageUrl = computed(() => {
  const url = props.product.imageUrl
  if (!url) return defaultDrink
  if (url.startsWith('http')) return url
  return `https://trachanh96-be-production.up.railway.app${url}`
})

// 2. TÍNH TOÁN DEFAULT OPTIONS (Dựa trên mảng phẳng từ Store)
const defaultSize = computed(() => {
  if (!sizes.value || sizes.value.length === 0) return { id: null, label: 'Mặc định', priceModifier: 0 }
  // Ưu tiên size có giá thêm = 0 (Size nhỏ nhất/chuẩn)
  return sizes.value.find((s) => s.priceModifier === 0) || sizes.value[0]
})

const defaultSugar = computed(() => {
  if (!sugarLevels.value || sugarLevels.value.length === 0) return { id: null, label: '100%', value: 100 }
  // Ưu tiên mức 100% (Bình thường)
  return sugarLevels.value.find((s) => s.value === 100) || sugarLevels.value[0]
})

const defaultIce = computed(() => {
  if (!iceLevels.value || iceLevels.value.length === 0) return { id: null, label: '100%', value: 100 }
  // Ưu tiên mức 100% (Bình thường)
  return iceLevels.value.find((i) => i.value === 100) || iceLevels.value[0]
})

// 3. THÊM VÀO GIỎ
const addToCart = () => {
  // Ngăn chặn nổi bọt sự kiện click (để không nhảy vào trang chi tiết)
  event.preventDefault();

  const itemToAdd = {
    id: `${props.product.id}_${Date.now()}`, // ID duy nhất cho item trong giỏ
    productId: props.product.id,
    name: props.product.name,
    // ⭐️ Backend dùng 'basePrice'
    price: Number(props.product.basePrice),
    image: fullImageUrl.value,
    quantity: quantity.value,

    // Gán Options mặc định
    sizeId: defaultSize.value.id,
    size: defaultSize.value.label,
    sizePrice: defaultSize.value.priceModifier,

    sugarId: defaultSugar.value.id,
    sugar: defaultSugar.value.label,

    iceId: defaultIce.value.id,
    ice: defaultIce.value.label,

    toppings: [],
    toppingPrice: 0,
  }

  // console.log('🟢 Thêm nhanh:', itemToAdd)
  cartStore.addToCart(itemToAdd)

  // Hiển thị thông báo
  showNotification.value = false
  setTimeout(() => (showNotification.value = true), 50)

  // Reset số lượng
  quantity.value = 1
}
</script>

<template>
  <div
    class="group flex-shrink-0 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full"
  >
    <router-link :to="`/products/${product.id}`" class="block flex-1 flex flex-col">
      <div class="relative w-full aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900">
        <img
          :src="fullImageUrl"
          :alt="product.name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        <div class="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-orange-500 shadow-sm flex items-center gap-1">
           <span>{{ product.totalRating || 5.0 }}</span>
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
              <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
            </svg>
        </div>
      </div>

      <div class="p-4 flex flex-col flex-1">
        <h3 class="font-bold text-gray-800 dark:text-white text-lg mb-1 line-clamp-2 min-h-[3.5rem] group-hover:text-green-600 transition-colors">
          {{ product.name }}
        </h3>

        <div class="mt-auto flex items-end justify-between">
          <div class="flex flex-col">
             <span class="text-xs text-gray-400 dark:text-gray-500">Giá chỉ từ</span>
             <span class="font-extrabold text-primary text-xl">{{ formatPrice(product.basePrice) }}</span>
          </div>

          <button
            @click.stop="addToCart"
            class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-95"
            title="Thêm vào giỏ"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </router-link>
  </div>

  <Notification :show="showNotification" :message="`Đã thêm ${product?.name} vào giỏ hàng`" />
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
