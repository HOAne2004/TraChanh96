<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isSidebarOpen = ref(false)
const activeSubMenu = ref(null)

const menuItems = [
  {
    title: 'Tổng quan',
    icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
    path: '/admin',
    name: 'admin.dashboard',
  },
  {
    title: 'Sản phẩm',
    icon: 'M6.5 8 C9 6.5,15 6.5,17.5 8 M6.5 8 C8 3,16 3,17.5 8 V10 C16 9.3,8 9.3,6.5 10 Z M7 10 L8 20 C9.5 21.5,14.5 21.5,16 20 L17 10 Z M8 14 C9.5 13,14.5 13.5,16 12.5 M8 20 C9.5 21,14.5 21,16 20',
    path: '/admin/products',
    name: 'admin.products',
    subItems: [
      {
        title: 'Quản lý sản phẩm',
        path: '/admin/products',
        name: 'admin.products.list',
        icon: 'M6.5 8 C9 6.5,15 6.5,17.5 8 M6.5 8 C8 3,16 3,17.5 8 V10 C16 9.3,8 9.3,6.5 10 Z M7 10 L8 20 C9.5 21.5,14.5 21.5,16 20 L17 10 Z M8 14 C9.5 13,14.5 13.5,16 12.5 M8 20 C9.5 21,14.5 21,16 20',
      },
      {
        title: 'Danh mục',
        path: '/admin/categories',
        name: 'admin.products.categories',
        icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z',
      },
      {
        title: 'Tùy chọn',
        path: '/admin/options',
        name: 'admin.products.options',
        icon: 'M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
      },
    ],
  },
  {
    title: 'Người dùng',
    icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
    path: '/admin/users',
    name: 'admin.users',
    subItems: [
      {
        title: 'Quản lý Users',
        path: '/admin/users',
        name: 'admin.users.list',
        icon:'M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z'
      },
      {
        title: 'Cấp độ Thành viên',
        path: '/admin/memberships/levels',
        name: 'admin.memberships.levels',
        icon:'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z',
      },
      {
        title: 'Kiểm duyệt Đánh giá',
        path: '/admin/reviews',
        name: 'admin.reviews.moderation',
        icon:'M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75',
      },
    ],
  },
  {
    title: 'Đơn hàng',
    icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h11.25c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z',
    path: '/admin/orders',
    name: 'admin.orders',
  },
  {
    title: 'Khuyến mãi',
    icon: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z M6 6h.008v.008H6V6z',
    path: '/admin/vouchers', 
    name: 'admin.vouchers', 
  },
  {
    title: 'Tin tức',
    icon: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v4.5H6v-4.5z',
    path: '/admin/news',
    name: 'admin.news',
  },
  {
    title: 'Cửa hàng',
    icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
    path: '/admin/stores',
    name: 'admin.stores',
  },
  {
    title: 'Cài đặt',
    icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    path: '/admin/settings',
    name: 'admin.settings',
    subItems: [
      {
        title: 'Cấu hình chung',
        path: '/admin/settings/general',
        name: 'admin.settings.general',
        icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      },
      {
        title: 'Chính sách & Phí',
        path: '/admin/settings/policies',
        name: 'admin.settings.policies',
        icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z',
      },
      {
        title: 'Phương thức Thanh toán',
        path: '/admin/settings/payments',
        name: 'admin.settings.payments',
        icon:'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z',
      },
    ],
  },
]

const isActive = (path) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const navigateTo = (path) => {
  router.push(path)
  isSidebarOpen.value = false
}

// 💡 LOGIC MỚI: Kiểm tra xem menu cha có nên được coi là "active" không
const isParentActive = (item) => {
  // Nếu không có subItems, dùng isActive thông thường
  if (!item.subItems) {
    return isActive(item.path)
  }
  // Nếu có subItems, kiểm tra xem BẤT KỲ subItem nào có active không
  return item.subItems.some((sub) => isActive(sub.path))
}

// Toggle submenu
const toggleSubMenu = (item) => {
  if (!item.subItems) {
    // Nếu không có subItems, điều hướng trực tiếp
    navigateTo(item.path)
    return
  }
  // Nếu có subItems, toggle trạng thái mở/đóng
  if (activeSubMenu.value === item.title) {
    activeSubMenu.value = null
  } else {
    activeSubMenu.value = item.title
  }
}

// Kiểm tra xem submenu có nên được hiển thị không
const shouldShowSubMenu = (item) => {
  if (!item.subItems) return false
  // Hiển thị nếu đang được mở thủ công hoặc có subitem đang active
  return activeSubMenu.value === item.title || isParentActive(item)
}

// Tự động mở submenu khi route thay đổi và có subitem active
watch(
  () => route.path,
  () => {
    // Tìm menu item có subitem đang active
    const activeItem = menuItems.find(
      (item) => item.subItems && item.subItems.some((sub) => isActive(sub.path)),
    )
    if (activeItem) {
      activeSubMenu.value = activeItem.title
    }
  },
  { immediate: true },
)
</script>

<template>
  <button
    @click="toggleSidebar"
    class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg"
  >
    <svg
      v-if="!isSidebarOpen"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
  <div
    v-if="isSidebarOpen"
    @click="toggleSidebar"
    class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
  ></div>

  <aside
    :class="[
      'fixed left-0 top-0 h-screen bg-gray-900 text-white z-40 transform transition-transform duration-300 ease-in-out',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0 lg:static lg:z-auto',
      'w-64 border-r border-gray-800',
    ]"
  >
    <div class="flex flex-col h-full">
      <div class="p-6 border-b border-gray-800">
        <h1 class="text-2xl font-bold text-green-400">Admin Panel</h1>
        <p class="text-sm text-gray-400 mt-1">{{ user?.name || 'Administrator' }}</p>
      </div>

      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-1 px-3">
          <li v-for="item in menuItems" :key="item.title">
            <button
              @click="toggleSubMenu(item)"
              :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isParentActive(item) // Sử dụng logic kiểm tra active mới
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white',
              ]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
              </svg>
              <span class="font-medium truncate">{{ item.title }}</span>

              <svg
                v-if="item.subItems"
                :class="[
                  'w-4 h-4 ml-auto transition-transform',
                  activeSubMenu === item.title ? 'rotate-90' : '',
                ]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <Transition name="fade-slide">
              <ul v-if="shouldShowSubMenu(item)" class="pl-4 mt-1 space-y-1 overflow-hidden"
              style="overflow-y: hidden;">
                <li v-for="subItem in item.subItems" :key="subItem.path">
                  <button
                    @click="navigateTo(subItem.path)"
                    :class="[
                      'w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors',
                      isActive(subItem.path)
                        ? 'bg-green-700 text-white font-semibold'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white',
                    ]"
                  >
                    <svg
                      v-if="subItem.icon"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4 flex-shrink-0"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" :d="subItem.icon" />
                    </svg>
                    <span
                      v-else
                      :class="[
                        'w-1 h-1 rounded-full flex-shrink-0',
                        isActive(subItem.path) ? 'bg-white' : 'bg-gray-500',
                      ]"
                    ></span>
                    <span class="truncate" :title="subItem.title">{{ subItem.title }}</span>
                  </button>
                </li>
              </ul>
            </Transition>
          </li>
        </ul>
      </nav>

      <div class="p-4 border-t border-gray-800">
        <button
          @click="navigateTo('/')"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
            />
          </svg>

          <span class="font-medium">Về trang nguời dùng</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* Tùy chọn: Thêm hiệu ứng chuyển động cho Sub-Menu */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease-out;
  max-height: 200px; /* Định nghĩa chiều cao tối đa để chuyển đổi */
  overflow: hidden;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
