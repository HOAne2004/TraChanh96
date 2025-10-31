<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/appStore' 
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const currentIndex = ref(0)
let intervalId

const {carousel: slides} = storeToRefs(appStore)

onMounted(async() => {
  await appStore.fetchCarousel()

  if(slides.value.length > 0){
  intervalId = setInterval(() =>{
    currentIndex.value = (currentIndex.value + 1) % slides.value.length
  }, 3500)
}
})


onUnmounted(() =>{
  clearInterval(intervalId)
})
</script>

<template>
  <div class="relative max-w-full h-[300px] lg:h-[600px]  overflow-clip">
    <!-- Vòng lặp slide -->
    <div
      v-for="(s, index) in slides"
      :key="s.id"
      class="absolute inset-0 transition-opacity duration-1000"
      :class="{ 'opacity-100': currentIndex === index, 'opacity-0': currentIndex !== index }"
    >
      <!-- Ảnh -->
      <img :src="s.image" alt="" class="max-w-full h-auto object-cover" />

      <!-- Overlay text -->
      <div
        class="absolute inset-0 flex flex-col justify-end pb-12 items-center text-white text-center bg-black/40"
      >
        <h2 class="text-xl md:text-2xl font-bold drop-shadow-lg">{{ s.title }}</h2>
      </div>
    </div>

    <!-- Nút điều hướng -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      <button
        v-for="(s, index) in slides"
        :key="s.id"
        class="w-3 h-3 rounded-full"
        :class="currentIndex === index ? 'bg-white' : 'bg-gray-400'"
        @click="currentIndex = index"
      ></button>
    </div>
  </div>
</template>
