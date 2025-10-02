<script setup>
import Carousel from '@/components/customer/Carousel.vue'
import Section from '@customer/section/Section.vue'
</script>

<template>
  <main>
    <Carousel />
    <Section type="product" :categoryId="5"></Section>
    <Section type="product" :categoryId="6"></Section>
    <Section type="news" title="Tin tức nổi bật"></Section>
    <Section type="store" title="Hệ thống cửa hàng"></Section>
  </main>
</template>
