<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const props = defineProps({
  label: { type: String, default: '' },
  to: { type: [String, Object], required: true },
  variant: { type: String, default: 'nav' },
  disabled: { type: Boolean, default: false },
  badge: { type: [String, Number], default: null }, // Thêm prop badge
})

const route = useRoute()

const isActive = computed(() => {
  return typeof props.to === 'string' ? route.path === props.to : route.path === props.to.path
})

const classes = computed(() => {
  const base =
    'relative inline-flex items-center gap-2 px-4 py-2 font-medium transition-all duration-300 rounded-lg'

  const variants = {
    nav: `
      text-primary
      hover:scale-[1.05]
      after:content-[''] after:absolute after:bottom-1 after:left-0 
      after:w-0 after:h-[2px] after:bg-primary 
      after:transition-all after:duration-300 
      hover:after:w-full
    `,
    profile: `
      block text-left text-gray-800 dark:text-gray-100 
      hover:bg-gray-100 dark:hover:bg-gray-700
    `,
    outline: `
      border border-green-600 text-green-500 p-2 rounded-full 
      hover:bg-green-50 transition-colors duration-200
    `,
  }

  const activeClass = isActive.value
    ? props.variant === 'outline'
      ? 'bg-green-100 border-green-700 text-green-700'
      : 'text-primary font-semibold after:w-full after:bg-primary'
    : ''

  const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed' : ''

  return [base, variants[props.variant] || variants.nav, activeClass, disabledClass].join(' ')
})
</script>

<template>
  <div class="relative inline-flex">
    <RouterLink :to="to" :class="classes" :aria-disabled="disabled">
      <slot name="icon"></slot>
      <slot>{{ label }}</slot>
    </RouterLink>

    <!-- Badge -->
    <span
      v-if="badge && badge > 0"
      class="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center z-10"
    >
      {{ badge }}
    </span>
  </div>
</template>
