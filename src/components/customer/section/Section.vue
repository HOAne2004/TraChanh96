<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useProductStore } from '@/stores/apiStore'
import { storeToRefs } from 'pinia'

import ProductCard from '@customer/ProductCard.vue'
import StoreCard from '@customer/StoreCard.vue'
import NewsCard from '@customer/NewsCard.vue'

const props = defineProps({
  categoryId: Number,
  storeId: Number,
  newsId: Number,
  type: { type: String, default: 'product' }, // product | store | news
  title: { type: String, default: '' },
})

const apiStore = useProductStore()
const { products, stores, news, categories } = storeToRefs(apiStore)

// Fetch dữ liệu theo loại section
onMounted(async () => {
  if (props.type === 'store') {
    await apiStore.fetchStores()
  } else if (props.type === 'news') {
    await apiStore.fetchNews()
  } else {
    await apiStore.fetchProducts()
    await apiStore.fetchCategories()
  }
})

// ----- State hiển thị -----
const visibleCount = ref(10)
const loadMore = () => {
  visibleCount.value += 10
}

// ----- Thông tin section -----
const sectionInfo = computed(() => {
  if (props.type === 'store' && props.storeId) {
    return stores.value.find((s) => s.id === props.storeId) || null
  }
  if (props.type === 'news' && props.newsId) {
    return news.value.find((n) => n.id === props.newsId) || null
  }
  if (props.type === 'product' && props.categoryId) {
    return categories.value.find((c) => c.id === props.categoryId) || null
  }
  return null
})

// ----- Dữ liệu hiển thị -----
const filteredItems = computed(() => {
  if (props.type === 'store') {
    return stores.value.slice(0, visibleCount.value)
  }
  if (props.type === 'news') {
    return news.value.slice(0, visibleCount.value)
  }
  return products.value
  .filter((p) =>
    Array.isArray(p.categoryId)
      ? p.categoryId.includes(Number(props.categoryId))
      : p.categoryId === Number(props.categoryId),
  )
  .slice(0, visibleCount.value)
})

// ----- Scroll / Drag logic -----
const scrollContainer = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

let isDown = false
let startX = 0
let scrollLeft = 0

const onMouseDown = (e) => {
  const el = scrollContainer.value
  if (!el) return
  isDown = true
  el.classList.add('cursor-grabbing')
  startX = e.pageX - el.offsetLeft
  scrollLeft = el.scrollLeft
}

const onMouseUp = () => {
  isDown = false
  scrollContainer.value?.classList.remove('cursor-grabbing')
}

const onMouseMove = (e) => {
  if (!isDown) return
  e.preventDefault()
  const el = scrollContainer.value
  if (!el) return
  const x = e.pageX - el.offsetLeft
  const walk = x - startX
  el.scrollLeft = scrollLeft - walk
}

const scroll = (direction) => {
  if (!scrollContainer.value) return
  const scrollAmount = 300
  scrollContainer.value.scrollBy({
    left: direction === 'next' ? scrollAmount : -scrollAmount,
    behavior: 'smooth',
  })
}

const checkScroll = () => {
  const el = scrollContainer.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 0
  canScrollRight.value =
    Math.round(el.scrollLeft + el.clientWidth) < el.scrollWidth
}

onMounted(() => {
  const el = scrollContainer.value
  if (el) {
    el.addEventListener('scroll', checkScroll)
    el.addEventListener('mousedown', onMouseDown)
    el.addEventListener('mouseup', onMouseUp)
    el.addEventListener('mouseleave', onMouseUp)
    el.addEventListener('mousemove', onMouseMove)
  }
  window.addEventListener('resize', checkScroll)
  checkScroll()
})

onUnmounted(() => {
  const el = scrollContainer.value
  if (el) {
    el.removeEventListener('scroll', checkScroll)
    el.removeEventListener('mousedown', onMouseDown)
    el.removeEventListener('mouseup', onMouseUp)
    el.removeEventListener('mouseleave', onMouseUp)
    el.removeEventListener('mousemove', onMouseMove)
  }
  window.removeEventListener('resize', checkScroll)
})

watch(filteredItems, async () => {
  await nextTick()
  checkScroll()
})
</script>

<template>
  <div
    class="relative container mx-auto my-8 px-4 bg-slate-50 pt-16 rounded-3xl shadow dark:bg-gray-800 dark:shadow-slate-300"
  >
    <!-- Title -->
    <div class="absolute -top-6 left-1/2 -translate-x-1/2 mb-6 flex justify-center">
      <span
        class="px-10 py-3 rounded-full text-lg lg:text-2xl font-bold bg-gray-100 dark:bg-gray-900 text-primary_hover dark:text-white whitespace-nowrap"
      >
        {{ props.title || sectionInfo?.name }}
      </span>
    </div>

    <!-- Row 1: Info -->
    <div
      v-if="
        (type === 'store' &&
          (sectionInfo?.image || sectionInfo?.description || sectionInfo?.address)) ||
        (type === 'news' && (sectionInfo?.image || sectionInfo?.description))
      "
      class="grid grid-cols-1 xl:grid-cols-5 xl:gap-6 mb-8"
    >
      <div class="col-span-2">
        <img
          v-if="sectionInfo?.image"
          :src="sectionInfo.image"
          alt="image"
          class="rounded-xl p-2 shadow-md w-full h-80 object-contain dark:bg-dark"
        />
      </div>
      <div class="flex flex-col justify-center col-span-3">
        <h2 class="text-3xl font-bold text-primary mb-2">{{ sectionInfo?.name }}</h2>
        <h3 v-if="type === 'store'" class="text-xl font-bold text-gray-800 dark:text-white mb-2">
          {{ sectionInfo?.address }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300" v-html="sectionInfo?.description"></p>
      </div>
    </div>

    <!-- Row 2: Cards -->
    <div class="relative">
      <div
        ref="scrollContainer"
        class="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory cursor-grab select-none px-2 py-1"
        @mousemove="onMouseMove"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
      >
        <template v-if="type === 'product'">
          <ProductCard v-for="p in filteredItems" :key="p.id" :product="p" />
        </template>
        <template v-else-if="type === 'news'">
          <NewsCard v-for="n in filteredItems" :key="n.id" :news="n" />
        </template>
        <template v-else>
          <StoreCard v-for="s in filteredItems" :key="s.id" :store="s" />
        </template>
      </div>

      <!-- Buttons scroll -->
      <button
        class="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 rounded-full p-3 text-primary transition disabled:opacity-40"
        @click="scroll('prev')"
        :disabled="!canScrollLeft"
      >
        ‹
      </button>
      <button
        class="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 rounded-full p-3 text-primary transition disabled:opacity-40"
        @click="scroll('next')"
        :disabled="!canScrollRight"
      >
        ›
      </button>
    </div>

    <!-- Nút Xem thêm -->
    <div class="mt-6 flex justify-center">
      <button
        class="px-4 p-2 mb-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
        @click="loadMore"
      >
        Xem thêm
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.cursor-grab {
  cursor: grab;
}
.cursor-grabbing {
  cursor: grabbing;
}
</style>
