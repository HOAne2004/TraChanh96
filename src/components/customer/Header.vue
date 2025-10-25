<script setup>
import DarkMode from '@components/DarkMode.vue'
import SearchBar from './SearchBar.vue'
import NavLink from '@components/NavLink.vue'
import { useCartStore } from '@/stores/cartStore'
import { useModalStore } from '@/stores/modalStore'
import { useAuthStore } from '@/stores/authStore'
import LoginModal from '@/components/auth/LoginModal.vue'

const cartStore = useCartStore()
const modal = useModalStore()
const auth = useAuthStore()
</script>

<template>
  <header
    class="fixed top-0 left-0 z-50 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md px-4 py-3 flex flex-col gap-3 sm:grid sm:grid-cols-[auto_3fr_2fr_auto] items-center"
  >
    <!-- 🌿 Logo -->
    <RouterLink to="/" class="flex justify-center sm:justify-start items-center gap-2">
      <img class="h-9 sm:h-10 md:h-12" src="@images/favicon.png" alt="Logo Trà Chanh 1996" />
      <span class="hidden md:inline text-lg font-[cursive] tracking-wide">Trà chanh 1996</span>
    </RouterLink>

    <!-- 🧭 Navigation -->
    <nav
      class="flex items-center justify-center gap-3 sm:gap-x-8 overflow-x-auto whitespace-nowrap scrollbar-hide text-sm md:text-base order-3 sm:order-none"
    >
      <NavLink to="/" label="Trang chủ" />
      <NavLink to="/products" label="Sản phẩm" />
      <NavLink to="/aboutUs" label="Về chúng tôi" />
      <NavLink to="/news" label="Tin tức" />
    </nav>

    <!-- 🔍 Search -->
    <div class="w-full sm:w-auto order-2 sm:order-none">
      <SearchBar />
    </div>

    <!-- 🛒 Cart + Dark Mode + Login -->
    <div class="flex justify-end items-center w-full sm:w-auto gap-2 sm:gap-3">
      <NavLink to="/cart" variant="outline" :badge="cartStore.totalItems">
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 inline-block"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0
               00-3 3h15.75m-12.75-3h11.218
               c1.121-2.3 2.1-4.684 2.924-7.138
               a60.114 60.114 0 00-16.536-1.84M7.5
               14.25L5.106 5.272M6 20.25a.75.75
               0 11-1.5 0 .75.75 0 011.5 0zm12.75
               0a.75.75 0 11-1.5 0 .75.75
               0 011.5 0z"
            />
          </svg>
        </template>
      </NavLink>

      <DarkMode />

      <!-- 🔑 Nút mở modal -->
      <div>
      <template v-if="auth.isAuthenticated">
        <span class="mr-4">Xin chào, {{ auth.user.name }}!</span>
        <button
          @click="auth.logout"
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Đăng xuất
        </button>
      </template>

      <template v-else>
        <button
          @click="modal.openLoginModal"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Đăng nhập
        </button>
      </template>
    </div>

      <!-- 🪟 Modal đăng nhập -->
      <LoginModal />
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