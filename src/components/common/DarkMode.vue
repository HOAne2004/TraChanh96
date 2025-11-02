<script setup>
import { useUIStore } from '@/stores/uiStore'
import Button from '@/components/common/Button.vue'

const ui = useUIStore()
</script>

<template>
  <Button
    :icon="ui.isDark ? '🌙' : '🌞'"
    variant="secondary"
    size="md"
    :aria-label="ui.isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'"
    @click="ui.toggleDark"
  />
</template>
