import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const isLoginModalOpen = ref(false)
  const isMobileMenuOpen = ref(false)

  function openLoginModal() {
    isLoginModalOpen.value = true
  }

  function closeLoginModal() {
    isLoginModalOpen.value = false
  }

  const openMobileMenu = () => {
    isMobileMenuOpen.value = true
  }
  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
  }

  const toastMessage = ref(null)
  const isToastVisible = ref(false)
  const toastType = ref('success') // 'success', 'error', 'info'

  const showToast = (message, type = 'success', duration = 3000) => {
    toastMessage.value = message
    toastType.value = type
    isToastVisible.value = true

    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      isToastVisible.value = false
      toastMessage.value = null
    }, duration)
  }

  return {
    isLoginModalOpen,
    isMobileMenuOpen,
    openLoginModal,
    closeLoginModal,
    openMobileMenu,
    closeMobileMenu,
    toastMessage,
    isToastVisible,
    toastType,
    showToast,
  }
})
