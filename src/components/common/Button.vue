<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  icon: { type: String, default: '' }, // Icon prop (dùng cho emoji/chuỗi)
  type: { type: String, default: 'button' }, // 🚨 Tối ưu: Đặt type mặc định là 'button'
  variant: { type: String, default: 'primary' }, // primary | secondary | outline | danger
  size: { type: String, default: 'md' }, // sm | md | lg
  rounded: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition duration-200 select-none' // 🚨 Thêm items-center, justify-center
  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700', // Sửa ví dụ màu primary
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white',
    outline: 'border border-green-600 text-green-600 hover:bg-green-600 hover:text-white', // Sửa ví dụ màu outline
    danger: 'bg-red-500 text-white hover:bg-red-600',
    faded: 'bg-gray-300 dark:bg-gray-700 text-dark dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-400',
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
  <button :type="props.type" :class="classes" :disabled="disabled" @click="$emit('click')">
    
    <slot name="icon">
      <span v-if="icon" class="leading-none">{{ icon }}</span> 
    </slot>

    <slot>{{ label }}</slot>
  </button>
</template>