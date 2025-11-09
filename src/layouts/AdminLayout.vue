<script setup>
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
</script>
<template>
  <div class="flex min-h-screen">
    <!-- Header -->
    <AdminSidebar></AdminSidebar>

    <!-- Nội dung chính -->
    <main class="flex-1 container mx-auto p-4">
      <RouterView />
    </main>
  </div>
</template>
