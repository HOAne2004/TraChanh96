<script setup>
import Footer from '@/components/customer/Footer.vue'
import Header from '@/components/customer/Header.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Header -->
    <Header />

    <!-- Nội dung chính -->
    <main class="flex-grow px-4 md:px-12 xl:px-40 pt-20">
      <!-- pt-20 = chừa khoảng cho header fixed (thay cho mt-16) -->
      <RouterView />
    </main>

    <!-- Footer -->
    <Footer class="mt-auto" />
  </div>
</template>
