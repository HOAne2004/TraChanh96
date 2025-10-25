<script setup>
import Carousel from '@/components/customer/Carousel.vue'
import TitledContainer from '@customer/TitledContainer.vue'
import ProductCard from '@/components/customer/ProductCard.vue'
import NewsCard from '@/components/customer/NewsCard.vue'
import StoreCard from '@/components/customer/StoreCard.vue'
import { useApiStore } from '@/stores/apiStore'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

const apiStore = useApiStore()
const { products, news, stores } = storeToRefs(apiStore)

onMounted(async () => {
  await Promise.all([apiStore.fetchProducts(), apiStore.fetchNews(), apiStore.fetchStores()])
})

const topProducts = computed(() => {
  return products.value.slice().sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 10)
})

const lastestProducts = computed(() =>
  [...products.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10),
)
//Tạo shallow copy:
// Cách 1: return products.value.slice()
// Cách 2: [...products.value] => Spread operator

const latestNews = computed(() =>
  [...news.value].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
)

const latestStores = computed(() =>
  [...stores.value].sort((a, b) => new Date(b.openDate) - new Date(a.openDate)).slice(0, 5),
)
</script>

<template>
  <main>
    <Carousel />
    <TitledContainer title="Sản phẩm nổi bật">
        <ProductCard v-for="p in topProducts" :key="p.id" :product="p" />
    </TitledContainer>

    <TitledContainer title="Sản phẩm mới">
        <ProductCard v-for="p in lastestProducts" :key="p.id" :product="p" /> 
    </TitledContainer>

    <TitledContainer title="Tin tức nổi bật">
      <NewsCard v-for="n in latestNews" :key="n.id" :news="n" />
    </TitledContainer>

    <TitledContainer title="Hệ thống cửa hàng">
      <StoreCard v-for="s in latestStores" :key="s.id" :store="s" />
    </TitledContainer>
  </main>
</template>
