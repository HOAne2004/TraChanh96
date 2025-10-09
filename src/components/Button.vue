<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  icon: { type: String, default: '' }, // Có thể là emoji, hoặc icon class
  variant: { type: String, default: 'primary' }, // primary | secondary | outline | danger
  size: { type: String, default: 'md' }, // sm | md | lg
  rounded: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition duration-200 select-none'
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary_hover',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return [
    base,
    variants[props.variant] || variants.primary,
    sizes[props.size],
    props.rounded ? 'rounded-lg' : 'rounded-none',
    props.disabled ? 'opacity-50 cursor-not-allowed' : '',
  ].join(' ')
})
</script>

<template>
  <button :class="classes" :disabled="disabled" @click="$emit('click')">
    <!-- Trường hợp có slot icon -->
    <slot name="icon">
      <!-- Nếu không dùng slot, mà dùng icon prop -->
      <span v-if="icon">{{ icon }}</span>
    </slot>

    <!-- Hiển thị label nếu có -->
    <span v-if="label"><slot>{{ label }}</slot></span>
  </button>
</template>
