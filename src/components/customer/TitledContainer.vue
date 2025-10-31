<script setup>
import NavLink from '@common/NavLink.vue'

import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

const props = defineProps({
  title: String,
  items: Array,
  controls: {
    type: String,
    default: '',
  },
  linkTo: {
    type: String,
    default: '',
  },
  linkText: {
    type: String,
    default: 'Xem thêm',
  },
})

// ----- Scroll / Drag logic -----
const scrollContainer = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

let isDown = false
let startX = 0
let scrollLeft = 0

const onMouseDown = (e) => {
  const el = scrollContainer.value
  if (!el) return
  isDown = true
  el.classList.add('cursor-grabbing')
  startX = e.pageX - el.offsetLeft
  scrollLeft = el.scrollLeft
}

const onMouseUp = () => {
  isDown = false
  scrollContainer.value?.classList.remove('cursor-grabbing')
}

const onMouseMove = (e) => {
  if (!isDown) return
  e.preventDefault()
  const el = scrollContainer.value
  const x = e.pageX - el.offsetLeft
  el.scrollLeft = scrollLeft - (x - startX)
}

const scroll = (direction) => {
  const el = scrollContainer.value
  if (!el) return
  const scrollAmount = 300
  el.scrollBy({ left: direction === 'next' ? scrollAmount : -scrollAmount, behavior: 'smooth' })
}

const checkScroll = () => {
  const el = scrollContainer.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 0
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth
}

onMounted(() => {
  const el = scrollContainer.value
  if (el) {
    el.addEventListener('scroll', checkScroll)
    el.addEventListener('mousedown', onMouseDown)
    el.addEventListener('mouseup', onMouseUp)
    el.addEventListener('mouseleave', onMouseUp)
    el.addEventListener('mousemove', onMouseMove)
  }
  window.addEventListener('resize', checkScroll)
  nextTick(checkScroll)
})

onUnmounted(() => {
  const el = scrollContainer.value
  if (el) {
    el.removeEventListener('scroll', checkScroll)
    el.removeEventListener('mousedown', onMouseDown)
    el.removeEventListener('mouseup', onMouseUp)
    el.removeEventListener('mouseleave', onMouseUp)
    el.removeEventListener('mousemove', onMouseMove)
  }
  window.removeEventListener('resize', checkScroll)
})
</script>

<template>
  <div
    class="relative container mx-auto my-8 p-4 bg-slate-50 pt-16 rounded-3xl shadow dark:bg-gray-800 dark:shadow-slate-300"
  >
    <!-- Title -->
    <div class="absolute -top-6 left-1/2 -translate-x-1/2 mb-6 flex justify-center">
      <span
        class="px-10 py-3 rounded-full text-lg lg:text-2xl font-bold bg-gray-100 dark:bg-gray-900 text-primary_hover dark:text-white whitespace-nowrap"
      >
        {{ title }}
      </span>
    </div>

    <!-- Scrollable row -->
    <div class="relative">
      <div
        ref="scrollContainer"
        class="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory cursor-grab select-none px-2 py-1 scroll-smooth"
      >
        <slot :items="items"></slot>
      </div>

      <!-- Scroll buttons -->
      <template v-if="controls !== 'hidden'">
        <button
          class="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 rounded-full p-3 text-primary transition disabled:opacity-40"
          @click="scroll('prev')"
          :disabled="!canScrollLeft"
        >
          ‹
        </button>
        <button
          class="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 rounded-full p-3 text-primary transition disabled:opacity-40"
          @click="scroll('next')"
          :disabled="!canScrollRight"
        >
          ›
        </button>
      </template>
    </div>

    <div v-if="controls !== 'hidden'" class="mt-6 flex justify-center">
      <NavLink :label="linkText" :to="linkTo" variant="primary"> </NavLink>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.cursor-grab {
  cursor: grab;
}
.cursor-grabbing {
  cursor: grabbing;
}
</style>
