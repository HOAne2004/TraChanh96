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
  return {
    isLoginModalOpen,
    isMobileMenuOpen,
    openLoginModal,
    closeLoginModal,
    openMobileMenu,
    closeMobileMenu,
  }
})
