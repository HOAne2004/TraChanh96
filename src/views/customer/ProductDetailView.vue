<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@stores/productStore'
import { useAppStore } from '@stores/appStore'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@stores/cartStore'

import Notification from '@common/Notification.vue'
import NavLink from '@common/NavLink.vue'
import TitledContainer from '@customer/TitledContainer.vue'

const route = useRoute()
const productStore = useProductStore()
const appStore = useAppStore()
const { products, toppings, sizes, sugarLevels, iceLevels } = storeToRefs(productStore)
const { storePolicies } = storeToRefs(appStore)

const isLoading = ref(true)
const selectedSize = ref(null)
const selectedSugar = ref(null)
const selectedIce = ref(null)
const selectedToppings = ref([])
const quantity = ref(1)

const productId = computed(() => Number(route.params.id))

// Lấy sản phẩm theo ID
const product = computed(() => products.value.find((p) => p.id == productId.value))

// Lấy chính sách cửa hàng đầu tiên (nếu có)
const storePolicy = computed(() => storePolicies.value?.[0] || null)

// Khi component được mount, đảm bảo dữ liệu đã có
onMounted(async () => {
  try {
    await Promise.all([productStore.fetchProduct(), appStore.fetchStorePolicies()])

    // Thiết lập lựa chọn mặc định sau khi data loaded
    setDefaultSelections()
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error)
  } finally {
    isLoading.value = false
  }
})

// Các nhóm size / đường / đá
const sizeGroup = computed(() => {
  if (!sizes.value.length) return []
  return sizes.value[0]?.sizes || []
})

const sugarGroup = computed(() => {
  if (!sugarLevels.value.length) return []
  return sugarLevels.value[0]?.levels || []
})

const iceGroup = computed(() => {
  if (!iceLevels.value.length) return []
  return iceLevels.value[0]?.levels || []
})

// Hàm chọn size nhỏ nhất (extraPrice thấp nhất)
const selectSmallestSize = () => {
  if (sizeGroup.value.length > 0) {
    const smallestSize = sizeGroup.value.reduce((min, size) =>
      size.extraPrice < min.extraPrice ? size : min,
    )
    selectedSize.value = smallestSize
    console.log('Đã chọn size mặc định:', smallestSize.label)
  }
}

// Hàm chọn đường 100%
const selectFullSugar = () => {
  if (sugarGroup.value.length > 0) {
    const fullSugar = sugarGroup.value.find((sugar) => sugar.value === 100) || sugarGroup.value[0]
    selectedSugar.value = fullSugar
    console.log('Đã chọn đường mặc định:', fullSugar.label)
  }
}

// Hàm chọn đá 100%
const selectFullIce = () => {
  if (iceGroup.value.length > 0) {
    const fullIce = iceGroup.value.find((ice) => ice.value === 100) || iceGroup.value[0]
    selectedIce.value = fullIce
    console.log('Đã chọn đá mặc định:', fullIce.label)
  }
}

// Hàm thiết lập tất cả giá trị mặc định
const setDefaultSelections = () => {
  selectSmallestSize()
  selectFullSugar()
  selectFullIce()
}

// Watch để tự động chọn mặc định khi data thay đổi
watch([sizeGroup, sugarGroup, iceGroup], () => {
  // Chỉ thiết lập mặc định nếu chưa có giá trị nào được chọn
  if (!selectedSize.value || !selectedSugar.value || !selectedIce.value) {
    setDefaultSelections()
  }
})

// const productToppings = computed(() =>
//   toppings.value.filter((t) => product.value?.toppingIds?.includes(t.id)),
// )

// Tính tổng giá
const totalPrice = computed(() => {
  if (!product.value) return 0
  const base = Number(product.value.price) || 0
  const sizeExtra = selectedSize.value?.extraPrice || 0
  const toppingTotal = selectedToppings.value.reduce((sum, t) => sum + Number(t.price), 0)
  return (base + sizeExtra + toppingTotal) * quantity.value
})

// Bật/tắt topping
function toggleTopping(topping) {
  const idx = selectedToppings.value.findIndex((t) => t.id === topping.id)
  if (idx > -1) selectedToppings.value.splice(idx, 1)
  else selectedToppings.value.push(topping)
}

//Thêm giỏ hàng
const cartStore = useCartStore()

const showNotification = ref(false)
const addToCart = () => {
  if (!product.value) return

  const itemToAdd = {
    id: Date.now(), // Tạo ID duy nhất để phân biệt các item có options khác nhau
    productId: product.value.id, // Giữ nguyên ID sản phẩm gốc
    name: product.value.name,
    price: product.value.price, // Giá gốc
    sizePrice: selectedSize.value?.extraPrice || 0, // Thêm giá size
    toppingPrice: selectedToppings.value.reduce((sum, t) => sum + Number(t.price), 0), // Tổng giá topping
    image: product.value.image,
    quantity: quantity.value,
    size: selectedSize.value?.label || 'Mặc định',
    sugar: selectedSugar.value?.label || '100%',
    ice: selectedIce.value?.label || '100%',
    toppings: selectedToppings.value.map((t) => ({
      id: t.id,
      name: t.name,
      price: t.price,
    })),
  }

  console.log('🟢 Item thêm vào giỏ:', itemToAdd)

  cartStore.addToCart(itemToAdd)

  // Hiển thị thông báo
  showNotification.value = false
  setTimeout(() => (showNotification.value = true), 10)

  // Reset số lượng
  quantity.value = 1
}

// debug (tạm): bỏ hoặc comment khi đã ok
watch(
  [sizes, sugarLevels, iceLevels, product],
  () => {
    console.log('Product:', product.value)
    console.log('Sizes:', sizes.value)
    console.log('Sugar:', sugarLevels.value)
    console.log('Ice:', iceLevels.value)
    console.log('🧩 Options hiện tại:', {
      size: selectedSize.value?.label,
      sugar: selectedSugar.value?.label,
      ice: selectedIce.value?.label,
      toppings: selectedToppings.value.map((t) => t.name),
    })
  },
  { deep: true },
)
// Test gửi đi
</script>

<template>
  <main class="p-6 max-w-6xl mx-auto">
    <!-- Trạng thái đang tải -->
    <div v-if="isLoading" class="text-center text-gray-500">Đang tải thông tin sản phẩm...</div>

    <!-- Nếu không tìm thấy -->
    <div v-else-if="!product" class="text-center text-red-500">
      Không tìm thấy sản phẩm với ID {{ productId }}
    </div>

    <!-- Breadcrumb -->
    <div class="mb-4 text-gray-500">
      <NavLink to="/products" label="Sản phẩm" variant="profile" class="hover:underline" />
      <span> &gt; {{ product?.name }}</span>
    </div>
    <!-- Nội dung sản phẩm -->
    <div v-if="product" class="grid grid-cols-12 gap-8">
      <!-- Left: Hình ảnh -->
      <div class="col-span-5 flex justify-center items-center p-6">
        <div class="relative group">
          <div
            class="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <img
            :src="product.image"
            :alt="product.name"
            class="relative w-full max-w-md rounded-xl shadow-2xl object-contain transform group-hover:scale-105 transition-all duration-500 ease-out z-10"
          />
          <div
            class="absolute inset-0 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all duration-300 z-0"
          ></div>
        </div>
      </div>
      <!-- Right: Thông tin -->
      <div class="col-span-7 space-y-5">
        <h1 class="text-3xl font-bold">{{ product.name }}</h1>
        <div class="flex items-center gap-1 text-yellow-500">
          <span v-for="i in 5" :key="i">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5"
            >
              <path
                fill-rule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527 c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </div>

        <!-- Size, Đường, Đá -->
        <div class="space-y-3">
          <!-- Size -->
          <div class="flex items-center gap-6">
            <h3 class="font-semibold w-16">Size</h3>
            <div class="flex gap-3 flex-1">
              <button
                v-for="size in sizeGroup"
                :key="size.label"
                @click="selectedSize = size"
                :class="[
                  'px-4 py-2 rounded-lg border transition',
                  selectedSize?.label === size.label
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-gray-300 hover:border-green-400',
                ]"
              >
                {{ size.label }}
              </button>
            </div>
          </div>

          <!-- Đường -->
          <div class="flex items-center gap-6">
            <h3 class="font-semibold w-16">Đường</h3>
            <div class="flex gap-3 flex-wrap flex-1">
              <button
                v-for="sugar in sugarGroup"
                :key="sugar.label"
                @click="selectedSugar = sugar"
                :class="[
                  'px-4 py-2 rounded-lg border transition',
                  selectedSugar?.label === sugar.label
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-gray-300 hover:border-green-400',
                ]"
              >
                {{ sugar.label }}
              </button>
            </div>
          </div>

          <!-- Đá -->
          <div class="flex items-center gap-6">
            <h3 class="font-semibold w-16">Đá</h3>
            <div class="flex gap-3 flex-wrap flex-1">
              <button
                v-for="ice in iceGroup"
                :key="ice.label"
                @click="selectedIce = ice"
                :class="[
                  'px-4 py-2 rounded-lg border transition',
                  selectedIce?.label === ice.label
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-gray-300 hover:border-green-400',
                ]"
              >
                {{ ice.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Topping -->
        <div>
          <h3 class="font-semibold mb-2">Topping</h3>
          <div class="flex gap-3 flex-wrap">
            <div
              v-for="t in toppings"
              :key="t.id"
              class="border rounded-lg p-2 w-32 cursor-pointer hover:shadow-md transition"
              :class="
                selectedToppings.some((s) => s.id === t.id) ? 'border-green-600' : 'border-gray-300'
              "
              @click="toggleTopping(t)"
            >
              <img :src="t.image" :alt="t.name" class="rounded-md mb-2 h-16 w-full object-cover" />
              <p class="text-sm font-semibold text-center">{{ t.name }}</p>
              <p class="text-xs text-gray-500 text-center">
                {{ Number(t.price).toLocaleString() }}đ
              </p>
            </div>
          </div>
        </div>
        <!-- Số lượng + Giá -->
        <div class="flex items-center gap-6 mt-4">
          <div class="flex items-center border rounded-lg">
            <button @click="quantity = Math.max(1, quantity - 1)" class="px-3 py-1 text-lg">
              −
            </button>
            <span class="px-4">{{ quantity }}</span>
            <button @click="quantity++" class="px-3 py-1 text-lg">+</button>
          </div>
          <p class="text-2xl font-bold text-green-700 dark:text-yellow-500">
            {{ totalPrice.toLocaleString() }}đ
          </p>
        </div>
        <!-- Nút mua -->
        <div class="flex gap-4 mt-4">
          <button class="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700">
            Mua ngay
          </button>
          <button
            @click="addToCart"
            class="border border-green-600 text-green-600 px-4 py-3 rounded-lg hover:bg-green-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 inline-block"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <!-- Chi tiết sản phẩm -->
    <TitledContainer title="Chi tiết sản phẩm" controls="hidden" v-if="product">
      <p class="text-gray-600 dark:text-gray-200 leading-relaxed">{{ product.description }}</p>
    </TitledContainer>

    <!-- Thông tin giao hàng -->
    <TitledContainer title="Thông tin giao hàng" controls="hidden" v-if="storePolicy">
      <ul class="text-gray-700 space-y-1 leading-relaxed">
        <li>
          ⏰ <strong>Thời gian chuẩn bị:</strong> {{ storePolicy.prepareTime || 'Đang cập nhật' }}
        </li>
        <li>
          🚚 <strong>Thời gian giao hàng ước tính:</strong>
          {{ storePolicy.deliveryTimeEstimate || 'Đang cập nhật' }}
        </li>
        <li>
          📍 <strong>Phạm vi giao hàng:</strong> Bán kính {{ storePolicy.deliveryRadius || '—' }} –
          <span class="italic">{{
            storePolicy.deliveryAreas?.join(', ') || 'Chưa có thông tin'
          }}</span>
        </li>
        <li v-if="storePolicy.deliveryFee !== undefined">
          💰 <strong>Phí giao hàng:</strong> {{ Number(storePolicy.deliveryFee).toLocaleString() }}đ
          <span v-if="storePolicy.freeShipThreshold">
            (Miễn phí với đơn từ {{ Number(storePolicy.freeShipThreshold).toLocaleString() }}đ)
          </span>
        </li>
        <li v-if="storePolicy.extraFeePerKm !== undefined">
          ➕ <strong>Phụ phí thêm mỗi km:</strong>
          {{ Number(storePolicy.extraFeePerKm).toLocaleString() }}đ/km
        </li>
        <li>💸 <strong>Chính sách hoàn tiền:</strong> {{ storePolicy.refundPolicy || '—' }}</li>
        <li>↩️ <strong>Thời hạn đổi trả:</strong> {{ storePolicy.returnWindow || '—' }}</li>
        <li>❌ <strong>Chính sách hủy:</strong> {{ storePolicy.cancelPolicy || '—' }}</li>
        <li>
          📞 <strong>Hỗ trợ:</strong> {{ storePolicy.supportPhone || '—' }} –
          {{ storePolicy.supportEmail || '—' }}
        </li>
        <li v-if="storePolicy.note">🕐 <strong>Lưu ý:</strong> {{ storePolicy.note }}</li>
        <li class="text-sm text-gray-500">
          Cập nhật lần cuối:
          {{
            storePolicy.lastUpdated
              ? new Date(storePolicy.lastUpdated).toLocaleString('vi-VN')
              : 'Chưa có dữ liệu'
          }}
        </li>
      </ul>
    </TitledContainer>

    <Notification :show="showNotification" :message="`Đã thêm ${product.name} vào giỏ hàng`" />
  </main>
</template>
