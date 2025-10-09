<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const props = defineProps({
  label: { type: String, default: '' },
  icon: { type: String, default: '' },
  to: { type: [String, Object], required: true },
  variant: { type: String, default: 'nav' }, // nav | profile | outline
  disabled: { type: Boolean, default: false },
})

const route = useRoute()

// Kiểm tra nếu route hiện tại khớp với "to"
const isActive = computed(() => {
  return typeof props.to === 'string'
    ? route.path === props.to
    : route.path === props.to.path
})

// Áp dụng class tùy theo variant và trạng thái
const classes = computed(() => {
  const base =
    'relative inline-flex items-center gap-2 px-4 py-2 font-medium transition-all duration-300 rounded-lg'

  const variants = {
    nav: `
      text-primary
      hover:scale-[1.05]
      after:content-[''] after:absolute after:bottom-0 after:left-0 
      after:w-0 after:h-[2px] after:bg-primary 
      after:transition-all after:duration-300 
      hover:after:w-full
    `,
    profile: `
      block text-left w-full text-gray-800 dark:text-gray-100 
      hover:bg-gray-100 dark:hover:bg-gray-700
    `,
    outline: `
      border border-gray-300 text-gray-700 dark:text-gray-200 
      hover:bg-gray-100 dark:hover:bg-gray-800
    `,
  }

  const activeClass = isActive.value
    ? 'text-primary font-semibold after:w-full after:bg-primary'
    : ''

  const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed' : ''

  return [
    base,
    variants[props.variant] || variants.nav,
    activeClass,
    disabledClass,
  ].join(' ')
})
</script>

<template>
  <RouterLink
    :to="to"
    :class="classes"
    :aria-disabled="disabled"
  >
    <span v-if="icon" class="text-lg">{{ icon }}</span>
    <slot>{{ label }}</slot>
  </RouterLink>
</template>
