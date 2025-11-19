<script setup>
import { onMounted } from 'vue'
import { useUIStore } from '@/stores/uiStore'
import LoginModal from '@/components/auth/LoginModal.vue'
import { useUserStore } from '@/stores/userStore' // 1. THÊM: Import userStore

const ui = useUIStore()
const userStore = useUserStore() // 2. THÊM: Khởi tạo userStore

onMounted(() => {
  // 3. SỬA: Thực thi hàm (thêm '()')
  ui.initTheme() 
  
  // 4. THÊM: Gọi hàm tải user khi ứng dụng khởi động
  userStore.fetchCurrentUser() 
})
</script>

<template>
  <RouterView />

  <LoginModal v-if="ui.loginModalVisible" @close="ui.hideLoginModal" />
</template>