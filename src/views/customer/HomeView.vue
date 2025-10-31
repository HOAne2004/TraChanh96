<script setup>
import Carousel from '@customer/Carousel.vue'
import TitledContainer from '@customer/TitledContainer.vue'
import ProductCard from '@customer/ProductCard.vue'
import NewsCard from '@customer/NewsCard.vue'
import StoreCard from '@customer/StoreCard.vue'
import { useProductStore } from '@/stores/productStore'
import { useNewsStore } from '@/stores/newsStore'
import { useStoreStore } from '@/stores/storeStore'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

const productStore = useProductStore()
const newsStore = useNewsStore()
const storeStore = useStoreStore()

const { products } = storeToRefs(productStore)
const { news } = storeToRefs(newsStore)
const { stores } = storeToRefs(storeStore)

onMounted(async () => {
  await Promise.all([
    productStore.fetchProduct(),
    newsStore.fetchNews(),
    storeStore.fetchStores()
  ])
})

// Sản phẩm nổi bật (theo sold)
const topProducts = computed(() => {
  return products.value.slice().sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 10)
})

// Sản phẩm mới nhất (theo createdAt)
const lastestProducts = computed(() =>
  [...products.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10),
)

// Tin tức mới nhất (theo date)
const latestNews = computed(() =>
  [...news.value].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
)

// Cửa hàng mới khai trương (theo openDate)
const latestStores = computed(() =>
  [...stores.value].sort((a, b) => new Date(b.openDate) - new Date(a.openDate)).slice(0, 5),
)
</script>

<template>
  <main>
    <Carousel />
    <TitledContainer title="Sản phẩm nổi bật" linkTo="/products">
      <ProductCard v-for="p in topProducts" :key="p.id" :product="p" />
    </TitledContainer>

    <TitledContainer title="Sản phẩm mới" linkTo="/products">
      <ProductCard v-for="p in lastestProducts" :key="p.id" :product="p" />
    </TitledContainer>

    <TitledContainer title="Tin tức nổi bật" linkTo="/news">
      <NewsCard v-for="n in latestNews" :key="n.id" :news="n" />
    </TitledContainer>

    <TitledContainer title="Hệ thống cửa hàng" linkTo="/aboutUs">
      <StoreCard v-for="s in latestStores" :key="s.id" :store="s" />
    </TitledContainer>
  </main>
</template>
