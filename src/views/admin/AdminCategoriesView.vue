<script setup>
import { watch, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/stores/categoryStore' 
import { useModalStore } from '@/stores/modalStore'
import AdminDataTable from '@/components/admin/ui/AdminDataTable.vue' // Bảng chung
import CategoryFormModal from '@/components/admin/categories/CategoryFormModal.vue' // Modal chỉnh sửa
import AdminActionHeader from '@/components/admin/ui/AdminActionHeader.vue'

const categoryStore = useCategoryStore()
const modalStore = useModalStore()
const { categories, isLoading } = storeToRefs(categoryStore)
const searchQuery = ref('')


// Logic tìm kiếm
watch(searchQuery, (newQuery) => {
    console.log(`Đang tìm kiếm: ${newQuery}`);
    // 💡 TODO: Gọi store action để lọc dữ liệu dựa trên newQuery
    // categoryStore.fetchCategories({ q: newQuery }) 
});

// Xử lý sự kiện khi nhấn nút "Thêm mới"
const handleCreateNew = () => {
    // Logic cũ: mở modal tạo mới
    editingCategory.value = null; 
    isModalOpen.value = true;
};

// State quản lý Modal
const isModalOpen = ref(false)
const editingCategory = ref(null) // Dữ liệu danh mục đang chỉnh sửa (hoặc null nếu tạo mới)

// 1. Định nghĩa cấu hình cột cho bảng Categories
const categoryColumns = ref([
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Tên danh mục', sortable: true },
  { key: 'slug', label: 'Slug (URL)', sortable: false },
  // Giả định: CategoryReadDto có trường ParentName (cần mapping trong C#)
  { key: 'parentName', label: 'Danh mục cha', sortable: false }, 
  { key: 'created_at', label: 'Ngày tạo' },
  { key: 'actions', label: 'Thao tác', isActions: true },
])

// 2. Xử lý sự kiện từ AdminDataTable
const handleEdit = (category) => {
  editingCategory.value = category // Load dữ liệu vào modal
  isModalOpen.value = true // Mở modal
}

const handleDelete = async (category) => {
  if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"? Thao tác này có thể ảnh hưởng đến sản phẩm liên quan.`)) {
    try {
      await categoryStore.deleteCategoryAction(category.id)
      modalStore.showToast(`Đã xóa thành công ${category.name}!`, 'success')
    } catch (error) {
      // Lỗi thường do danh mục còn sản phẩm hoặc danh mục con
      modalStore.showToast(error.message, 'error')
    }
  }
}


// 3. Tải dữ liệu khi component được gắn
onMounted(() => {
  // Tải danh sách phẳng và cây (cây được tải trong fetchCategories)
  categoryStore.fetchCategories() 
})
</script>

<template>
  <main class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Quản lý Danh mục Sản phẩm</h1>

    <AdminActionHeader
            v-model="searchQuery"
            addButtonLabel="Thêm Danh mục mới"
            @add-new="handleCreateNew" 
        />

    <AdminDataTable
      :items="categories"
      :columns="categoryColumns"
      :loading="isLoading"
      :actions="['edit', 'delete']"
      
      @edit-row="handleEdit"
      @delete-row="handleDelete"
    />
  </main>
  
  <CategoryFormModal 
    v-if="isModalOpen" 
    :category="editingCategory" 
    :is-open="isModalOpen"
    @close="isModalOpen = false"
  />
</template>