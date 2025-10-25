<script setup>
import { useCartStore } from '@/stores/cartStore'
import { ref } from 'vue'
import Notification from '../Notification.vue'

const props = defineProps({
  product: { type: Object, required: true },
})

const cartStore = useCartStore()
const showNotification = ref(false)
const quantity = ref(1)

const addToCart = () => {
  // Tạo item với cấu trúc giống với ProductDetail
  const itemToAdd = {
    id: Date.now(), // ID duy nhất cho mỗi lần thêm
    productId: props.product.id, // Giữ productId để so sánh
    name: props.product.name,
    price: props.product.price,
    image: props.product.image,
    quantity: quantity.value,
    size: 'Nhỏ',
    sugar: '100%', 
    ice: '100%',
    toppings: [],
    sizePrice: 0,
    toppingPrice: 0
  }

  console.log('🟢 Thêm từ ProductCard:', itemToAdd)

  cartStore.addToCart(itemToAdd)

  showNotification.value = false
  setTimeout(() => (showNotification.value = true), 10)
  quantity.value = 1
}
</script>

<template>
  <div
    class="flex-shrink-0 w-60 snap-start bg-white dark:bg-gray-700 dark:shadow-slate-300 rounded-lg shadow hover:shadow-lg transition p-6 text-xl flex flex-col"
  >
    <router-link :to="`/products/${product.id}`" class="block">
      <!-- Hình ảnh -->
      <div class="flex justify-center items-center h-40 mb-4">
        <img
          :src="product.image"
          class="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-110"
        />
      </div>

      <!-- Tên sản phẩm -->
      <div class="min-h-[3.5rem] flex items-center mb-4">
        <h3 class="font-semibold text-gray-800 dark:text-white text-center line-clamp-2">
          {{ product.name }}
        </h3>
      </div>

      <!-- Giá + đánh giá -->
      <div class="flex items-center justify-between mb-4">
        <p class="font-bold text-primary text-lg">{{ product.price.toLocaleString() }}đ</p>
        <div class="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full">
          <span class="font-semibold text-orange-600 text-lg">{{ product.rating }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="w-5 h-5 text-orange-500"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093
              1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964
              2.033-1.96 1.425L12 18.354 7.373
              21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434
              2.082-5.005Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </router-link>
    
    <!-- Nút giỏ hàng -->
    <div class="flex justify-center mt-auto">
      <button
        @click="addToCart"
        class="bg-primary hover:bg-primary_hover text-white p-2 rounded-full transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343
                1.087.835l.383 1.437M7.5 14.25a3 3 0
                00-3 3h15.75m-12.75-3h11.218c1.121-2.3
                2.1-4.684 2.924-7.138a60.114
                60.114 0 00-16.536-1.84M7.5
                14.25L5.106 5.272M6
                20.25a.75.75 0 11-1.5 0 .75.75 0
                011.5 0zm12.75 0a.75.75 0 11-1.5 0
                .75.75 0 011.5 0z"
          />
        </svg>
      </button>
    </div>
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