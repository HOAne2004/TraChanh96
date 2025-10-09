<script setup>
import { useUIStore } from '@/stores/ui'
import Profile from '@components/Profile.vue'
import SearchBar from './SearchBar.vue'
import NavLink from '@components/NavLink.vue'
const ui = useUIStore()
</script>

<template>
  <header
    class="fixed top-0 left-0 z-50 w-full bg-white dark:bg-gray-800 
           text-gray-900 dark:text-gray-100 shadow-md 
           px-4 py-3 flex flex-col gap-3 
           sm:grid sm:grid-cols-[1fr_2fr_2fr_1fr] md:grid-cols-[1fr_3fr_2fr_1fr]
           items-center dark:shadow-white"
  >
    <!-- Logo -->
    <div class="flex justify-center sm:justify-start items-center">
      <div class="flex items-center gap-2">
        <img class="h-9 md:h-12" src="@images/facvicon.png" alt="Logo Trà Chanh 1996" />
        <span class="hidden sm:inline text-sm md:text-base font-[cursive]">Trà chanh 1996</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav
      class="flex items-center justify-center gap-3 md:gap-x-8 overflow-x-auto 
             scrollbar-hide text-sm md:text-base"
    >
      <NavLink to="/" label="Trang chủ" />
      <NavLink to="/products" label="Sản phẩm" />
      <NavLink to="/aboutUs" label="Về chúng tôi" />
    </nav>

    <!-- Search -->
    <div class="order-3 sm:order-none w-full sm:w-auto">
      <SearchBar />
    </div>

    <!-- Profile -->
    <div class="flex justify-end w-full sm:w-auto">
      <Profile />
    </div>
  </header>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

