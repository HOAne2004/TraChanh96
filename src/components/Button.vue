<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: { type: String, default: '' },
  to: { type: String, required: true },
})

const router = useRouter()
const navigate = () => {
  router.push(props.to)
}
</script>

<template>
  <div
    class="inline-flex items-center gap-2 p-4 rounded-lg cursor-pointer dark:bg-primary hover:bg-primary-hover text-primary dark:text-white"
    @click="navigate"
  >
    <slot name="icon"></slot>
    <span>{{ props.title }}</span>
  </div>
</template>
