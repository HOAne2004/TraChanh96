<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useStoreStore } from '@/stores/storeStore'
import { useAppStore } from '@/stores/appStore'
import { storeToRefs } from 'pinia'

// Components
import StoreCard from '@/components/customer/card/StoreCard.vue'
import Button from '@/components/common/Button.vue'

const storeStore = useStoreStore()
const appStore = useAppStore()

// Lấy dữ liệu cần thiết
const { stores } = storeToRefs(storeStore)
const { appConfig } = storeToRefs(appStore)

onMounted(async () => {
  // Tải tất cả dữ liệu cần thiết
  await Promise.all([storeStore.fetchStores(), appStore.fetchAppConfig()])
})
//Check dữ liệu gọi từ API
// watch(
//   [appConfig],
//   () => {
//     console.log('AppConfig:', appConfig.value)
//   },
//   { deep: true },
// )

// ----- LOGIC SẮP XẾP DỰA TRÊN THỜI GIAN KHAI TRƯƠNG (openDate) -----

// 1. Lịch sử hình thành (Gom nhóm theo năm)
const yearlyHistory = computed(() => {
  if (!stores.value.length) return []

  // Tạo bản đồ Map: { "2019": [store1, store2], "2020": [store3], ... }
  const groups = stores.value.reduce((acc, store) => {
    // Lấy năm từ openDate (ví dụ: "2025-09-25" -> 2025)
    const year = new Date(store.openDate).getFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(store)
    return acc
  }, {})

  // Chuyển đổi thành mảng để hiển thị (Sắp xếp từ mới nhất)
  const sortedYears = Object.keys(groups).sort((a, b) => b - a)

  return sortedYears.map((year) => ({
    year: year,
    count: groups[year].length,
    // Lấy tên các cửa hàng, giới hạn 2-3 tên
    stores: groups[year]
      .slice(0, 3)
      .map((s) => s.name)
      .join(', '),
  }))
})

// 2. Cột mốc quan trọng (3 cửa hàng đầu tiên tại 3 khu vực/mốc thời gian quan trọng)
const sortedStores = computed(() => {
  return [...stores.value].sort((a, b) => new Date(b.openDate) - new Date(a.openDate))
})
const milestones = computed(() => {
  if (!stores.value.length) return [] // 🚨 KHẮC PHỤC: Sử dụng sortedStores.value
  // Giả lập 3 cửa hàng mới nhất làm cột mốc
  return sortedStores.value.slice(0, 3).map((store) => ({
    date: new Date(store.openDate).toLocaleDateString('vi-VN'),
    title: `Khai trương cửa hàng: ${store.name}`,
    address: store.address,
  }))
})

// 3. Hệ thống cửa hàng
// 🚨 BƯỚC MỚI: State quản lý số lượng cửa hàng hiển thị
const INITIAL_COUNT = 3 // Số bài hiển thị ban đầu
const itemsToShow = ref(INITIAL_COUNT) // State hiện tại
const visibleStore = computed(() => sortedStores.value.slice(0, itemsToShow.value))
// ----- LOGIC ĐIỀU KHIỂN XEM THÊM -----
const totalAvailable = computed(() => stores.value.length)

const hasMore = computed(() => visibleStore.value.length < totalAvailable.value)

const loadMore = () => {
  const remainingCount = totalAvailable.value - visibleStore.value.length
  const itemsToAdd = Math.min(3, remainingCount) // Số cửa hàng hiển thị thêm
  itemsToShow.value += itemsToAdd
}

// Hành động Ẩn bớt: Quay về số lượng ban đầu
const showLess = () => {
  itemsToShow.value = INITIAL_COUNT
  // Cuộn lên đầu trang (UX tốt)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <main class="py-8">
    <section class="max-w-4xl mx-auto mb-10">
      <h1 class="text-3xl font-bold text-center mb-6">Câu chuyện thương hiệu</h1>
      <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden mb-6">
        <img
          src="https://picsum.photos/1200/500?random=1"
          alt="Câu chuyện thương hiệu"
          class="w-full h-full object-cover"
        />
      </div>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-center">
        {{ appConfig?.brandStory || 'Chúng tôi cam kết mang đến những trải nghiệm tốt nhất...' }}
      </p>
    </section>

    <section
      class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl mb-10"
    >
      <div class="md:col-span-1">
        <h2 class="text-xl font-bold mb-4 border-b pb-2 text-green-600 dark:text-green-400">
          Lịch sử hình thành
        </h2>
        <div class="space-y-6">
          <div v-for="(item, index) in yearlyHistory" :key="item.year" class="relative pl-6">
            <div class="absolute left-0 top-0 h-full w-0.5 bg-green-200 dark:bg-green-700"></div>
            <div
              class="absolute left-0 top-0 w-3 h-3 bg-green-600 rounded-full transform -translate-x-1/2"
            ></div>
            <p class="text-lg font-bold">{{ item.year }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Khai trương thêm
              <span class="font-semibold text-green-700 dark:text-green-400">{{ item.count }}</span>
              cửa hàng mới.
            </p>
            <p class="text-xs italic text-gray-500">Ví dụ: {{ item.stores }}...</p>
          </div>
        </div>
      </div>

      <div class="md:col-span-2">
        <h2 class="text-xl font-bold mb-4 border-b pb-2 text-green-600 dark:text-green-400">
          Cột mốc quan trọng
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            v-for="(item, index) in milestones"
            :key="index"
            class="p-3 bg-green-50 dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <p class="text-lg font-bold text-green-700 dark:text-green-500">{{ item.date }}</p>
            <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">{{ item.title }}</p>
          </div>
          <div v-if="!milestones.length" class="col-span-3 text-center text-gray-400 italic">
            Chưa có dữ liệu cột mốc.
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto text-center my-8">
      <h2 class="text-4xl font-extrabold text-green-700 dark:text-green-400">
        {{ appConfig?.chainCount || '30' }}+ Chuỗi cửa hàng trên toàn quốc
      </h2>
      <p class="text-gray-500 mt-2">{{ appConfig?.chainCountNote || 'Liên tục mở rộng...' }}</p>
    </section>

    <!-- Thử nghiệm -->
    <section class="mt-12">
      <h2
        class="text-2xl font-bold mb-6 border-b pb-2 text-green-700 dark:text-green-400 dark:border-gray-700"
      >
        Hệ thống cửa hàng
      </h2>

      <div v-if="visibleStore?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StoreCard v-for="store in visibleStore" :key="store.id" :store="store" />
      </div>

      <div v-else class="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
    </section>

    <div v-if="totalAvailable > INITIAL_COUNT" class="mt-10 flex justify-center space-x-4">
      <Button
        v-if="itemsToShow > INITIAL_COUNT"
        @click="showLess"
        label="Ẩn bớt"
        variant="secondary"
      />

      <Button v-if="hasMore" @click="loadMore" label="Xem thêm" variant="primary" />
    </div>
  </main>
</template>
