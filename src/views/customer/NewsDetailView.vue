<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useNewsStore } from '@/stores/newsStore'
import { storeToRefs } from 'pinia'

//component
import NavLink from '@/components/common/NavLink.vue'

const route = useRoute()
const newsStore = useNewsStore()
const { news } = storeToRefs(newsStore)

// 1. Lấy ID bài viết từ URL và chuyển sang kiểu số
const newsId = computed(() => Number(route.params.id))

// 2. Tìm bài viết tương ứng trong Store
const currentArticle = computed(() => {
  if (!news.value.length) return null
  // 🚨 Đảm bảo so sánh an toàn bằng cách ép kiểu Number cho ID trong Store
  return news.value.find((a) => Number(a.id) === newsId.value)
})

// 3. Lấy 3 bài viết liên quan (loại trừ bài hiện tại)
const relatedArticles = computed(() => {
  if (!news.value.length) return []
  // Lọc bài hiện tại và lấy 3 bài viết mới nhất/ngẫu nhiên
  return news.value
    .filter((a) => Number(a.id) !== newsId.value)
    .slice(0, 3) 
})

onMounted(async () => {
  // Đảm bảo dữ liệu tin tức đã được tải
  await newsStore.fetchNews()
  
  // Tối ưu UX: Cuộn về đầu trang
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<template>
  <main class="py-8 max-w-4xl mx-auto px-4 lg:px-8">
    <!-- Breadcrumb -->
    <div class="mb-4 text-gray-500">
      <NavLink to="/news" label="Tin tức" variant="profile" class="hover:underline" />
      <span> &gt; {{ currentArticle?.name }}</span>
    </div>
    <div v-if="!currentArticle" class="text-center py-20">
      <h1 class="text-3xl font-bold text-red-500">Tin tức không tồn tại!</h1>
      <p class="text-gray-500 mt-2">Bài viết với ID {{ newsId }} không được tìm thấy.</p>
      <RouterLink to="/news" class="text-green-600 hover:underline mt-4 block">
        Quay lại trang Tin tức
      </RouterLink>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl">
      <h1 class="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
        {{ currentArticle.name }}
      </h1>

      <div class="text-sm text-gray-500 dark:text-gray-400 mb-6 border-b pb-4">
        <span>Ngày đăng: {{ new Date(currentArticle.date).toLocaleDateString('vi-VN') }}</span>
        <span class="ml-4">| Bởi: Admin</span>
      </div>

      <div class="mb-6 rounded-lg overflow-hidden shadow-md">
        <img
          :src="currentArticle.image"
          :alt="currentArticle.name"
          class="w-full h-80 object-cover"
        />
      </div>

      <div class="prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
        <p v-for="(paragraph, index) in currentArticle.description.split('\n')" :key="index" class="mb-4">
            {{ paragraph }}
        </p>
      </div>
    </div>

    <section v-if="relatedArticles.length" class="mt-12 border-t pt-8 dark:border-gray-700">
      <h2 class="text-2xl font-bold mb-6 text-green-700 dark:text-green-400">Tin tức liên quan</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RouterLink 
          v-for="article in relatedArticles" 
          :key="article.id" 
          :to="`/news/${article.id}`"
          class="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
        >
          <img :src="article.image" class="w-full h-32 object-cover" :alt="article.name" />
          <div class="p-3">
             <h3 class="font-semibold text-sm line-clamp-2 hover:text-green-600">
                {{ article.name }}
             </h3>
             <p class="text-xs text-gray-500 mt-1">
                {{ new Date(article.date).toLocaleDateString('vi-VN') }}
             </p>
          </div>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Thêm CSS cho line-clamp nếu cần thiết */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
/* Giả định description có thể chứa các ký tự xuống dòng (\n) */
.prose {
    /* Style cơ bản cho nội dung văn bản dài */
    line-height: 1.6;
}
</style>