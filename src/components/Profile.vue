<script setup>
import { useUIStore } from '@/stores/ui'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'

const ui = useUIStore()

const user = ref(null)
const showDropdown = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const logout = () => {
  user.value = null
  showDropdown.value = false
}

const fakeLogin = () => {
  user.value = { name: 'Nguyen Van A' }
}

// --- Đóng dropdown khi click ngoài ---
const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Menu dropdown (dễ mở rộng)
const menuItems = [
  { label: '👤 Xem thông tin', to: '/profile' },
  { label: '📍 Sửa địa chỉ', to: '/address' }
]
</script>

<template>
  <div class="col-span-1 flex items-center justify-end gap-4 relative">
    <!-- Nếu chưa đăng nhập -->
    <button
      v-if="!user"
      @click="fakeLogin"
      class="hidden md:block px-4 py-2 bg-primary text-white rounded hover:bg-primary_hover"
    >
      Đăng nhập
    </button>

    <!-- Mobile: hiện icon user -->
    <button v-if="!user" @click="fakeLogin" class="md:hidden text-primary hover:text-primary_hover">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
        fill="currentColor" class="size-6">
        <path fill-rule="evenodd"
          d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 
             .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7
             a.75.75 0 0 1-.437-.695Z"
          clip-rule="evenodd"/>
      </svg>
    </button>

    <!-- Nếu đã đăng nhập -->
    <div v-else ref="dropdownRef" class="relative">
      <button
        @click="toggleDropdown"
        class="px-4 py-2 rounded bg-gray-200 dark:bg-dark dark:text-white"
      >
        {{ user.name }}
      </button>

      <!-- Dropdown -->
      <transition name="fade">
        <div
          v-if="showDropdown"
          class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden"
        >
          <RouterLink
            v-for="item in menuItems"
            :key="item.to"
            :to="item.to"
            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="showDropdown = false"
          >
            {{ item.label }}
          </RouterLink>
          <button
            @click="logout"
            class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            🚪 Đăng xuất
          </button>
        </div>
      </transition>
    </div>

    <!-- Dark mode -->
    <button
      @click="ui.toggleDark"
      class="px-3 py-2 rounded bg-gray-200 dark:bg-dark dark:text-white"
    >
      {{ ui.isDark ? '🌙' : '🌞' }}
    </button>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>