<script setup>
import { useUIStore } from '@/stores/ui'
import Profile from '@components/Profile.vue'

const ui = useUIStore()
</script>

<template>
  <header
    class="fixed top-0 left-0 z-50 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow p-4 flex flex-col sm:grid sm:grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_3fr_1fr] items-center gap-4 md:gap-x-4 dark:shadow-white"
  >
    <!-- Logo -->
    <div class="flex justify-center sm:justify-start">
      <div class="flex flex-col items-center">
        <img class="h-10 md:h-12" src="@images/facvicon.png" alt="Logo Trà Chanh 1996" />
        <span class="text-sm md:text-base font-[cursive]">Trà chanh 1996</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex items-center gap-x-4 md:gap-x-10 justify-start">
      <RouterLink to="/" class="text-primary text-sm md:text-lg hover:underline">
        Trang chủ
      </RouterLink>
      <RouterLink to="/products" class="text-primary text-sm md:text-lg hover:underline">
        Sản phẩm
      </RouterLink>
    </nav>

    <!-- Profile -->
    <div class="flex justify-center md:justify-end">
      <Profile />
    </div>
  </header>
</template>
