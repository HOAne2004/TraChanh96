import { createRouter, createWebHistory } from 'vue-router'
import { useUIStore } from '@/stores/ui'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// User
import HomeView from '@/views/customer/HomeView.vue'

import { useAuthStore } from '@/stores/authStore';

const ProductsView = () => import('@/views/customer/ProductsView.vue') //lazy load
const AboutUsView = () => import('@/views/customer/AboutUsView.vue')
const NewsView = () => import('@/views/customer/NewsView.vue')
const CartView = () => import('@/views/customer/CartView.vue')

// Admin
const AdminDashboard = () => import('@/views/admin/Dashboard.vue')

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'products', name: 'products', component: ProductsView },
      {
        path: 'products/:id',
        name: 'product-detail',
        component: () => import('@/views/customer/ProductDetail.vue'),
        props: true,
      },
      { path: 'aboutUs', name: 'aboutUs', component: AboutUsView },
      { path: 'cart', name: 'cart', component: CartView },
      { path: 'news', name: 'news', component: NewsView },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [{ path: '', name: 'admin.dashboard', component: AdminDashboard }],
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, //KHÔNG ĐƯỢC BỎ DÒNG NÀY
  scrollBehavior(to, from, savedPosition) {
    // Luôn scroll về đầu trang khi chuyển route
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    // chưa đăng nhập => về trang login
    next('/login')
  } else if (to.meta.role && auth.user?.role !== to.meta.role) {
    // sai role => quay về home
    next('/')
  } else {
    next()
  }
})

export default router
