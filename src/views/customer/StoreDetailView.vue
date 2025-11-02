<script setup>
import NavLink from '@/components/common/NavLink.vue'

import { computed, onMounted } from 'vue' // Bỏ ref nếu không dùng
import { useRoute } from 'vue-router'
import { useStoreStore } from '@/stores/storeStore'
import { storeToRefs } from 'pinia'

const route = useRoute()
const storeStore = useStoreStore()
const { stores } = storeToRefs(storeStore)

const routeStoreId = computed(() => route.params.id)

const storeIdNumber = computed(() => Number(routeStoreId.value))

const currentStore = computed(() => stores.value.find((s) => Number(s.id) === storeIdNumber.value))

onMounted(async () => {
  await storeStore.fetchStores()
})
</script>

<template>
  <main class="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Breadcrumb -->
    <div class="mb-4 text-gray-500">
      <NavLink to="/aboutUs" label="Về chúng tôi" variant="profile" class="hover:underline" />
      <span> &gt; {{ currentStore?.name }}</span>
    </div>
    <div v-if="currentStore" class="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl">
      <div class="mb-6 rounded-xl overflow-hidden shadow-lg">
        <img
          :src="currentStore.image"
          :alt="`Hình ảnh ${currentStore.name}`"
          class="w-full h-80 sm:h-96 object-cover"
        />
      </div>

      <h1 class="text-3xl sm:text-4xl font-extrabold mb-2 text-green-700 dark:text-green-400">
        {{ currentStore.name }}
      </h1>
      <p class="text-lg text-gray-700 dark:text-gray-300 mb-6 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 text-red-500"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
        {{ currentStore.address }}
      </p>

      <hr class="my-6 dark:border-gray-700" />

      <h2 class="text-xl font-semibold mb-3">Vị trí trên bản đồ</h2>
      <div
        class="mb-6 h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center"
      >
        <p class="p-4 text-center text-gray-500 dark:text-gray-400">
          Tính năng Bản đồ (Địa điểm giả định: {{ currentStore.address }})
        </p>
      </div>

      <h2 class="text-xl font-semibold mt-6 mb-3">Thông tin chi tiết</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
        <div class="space-y-3">
          <p class="leading-relaxed">{{ currentStore.description }}</p>
          <p v-if="currentStore.openTime" class="text-sm font-semibold text-green-600 dark:text-green-500">
            Mở cửa từ:
            <span class="font-normal text-gray-700 dark:text-gray-300">{{ currentStore.openTime }}</span>
          </p>
          <p v-if="currentStore.branchPhone" class="text-sm font-semibold text-green-600 dark:text-green-500">
            Điện thoại:
            <span class="font-normal text-gray-700 dark:text-gray-300"
              >{{ currentStore.branchPhone }} (Gọi chi nhánh)</span
            >
          </p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm border-l-4 border-green-500">
          <h3 class="font-bold mb-2">Lưu ý khi đến</h3>
          <ul class="list-disc list-inside space-y-1">
            <li>Có chỗ để xe máy miễn phí.</li>
            <li>Không phục vụ tại chỗ sau 9:30 PM.</li>
          </ul>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-red-500 py-20">
      <h1 class="text-2xl font-bold">Không tìm thấy cửa hàng!</h1>
      <p>ID cửa hàng không hợp lệ hoặc dữ liệu chưa được tải.</p>
      <router-link to="/aboutUs" class="text-green-600 hover:underline mt-4 block">
        Quay lại trang Về chúng tôi
      </router-link>
    </div>
  </main>
</template>
