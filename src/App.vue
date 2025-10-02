<script setup>
import { onMounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import LoginModal from '@/components/auth/LoginModal.vue'

const ui = useUIStore()
onMounted (() => ui.initTheme)
</script>

<template>
  <RouterView />

  <LoginModal v-if="ui.loginModalVisible" @close="ui.hideLoginModal" />
</template>
