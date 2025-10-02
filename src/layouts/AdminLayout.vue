<script setup>
import Footer from '@/components/customer/Footer.vue'
import Header from '@/components/customer/Header.vue'
</script>
<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <Header></Header>

    <!-- Nội dung chính -->
    <main class="flex-1 container mx-auto p-4">
      <RouterView />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>
