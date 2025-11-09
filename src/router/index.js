import { createRouter, createWebHistory } from 'vue-router'
import { useUIStore } from '@/stores/uiStore'
import { useUserStore } from '@/stores/userStore'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// User
import HomeView from '@/views/customer/HomeView.vue'
import OrderDetailView from '@/views/customer/OrderDetailView.vue'

const ProductsView = () => import('@/views/customer/ProductsView.vue') //lazy load
const AboutUsView = () => import('@/views/customer/AboutUsView.vue')
const NewsView = () => import('@/views/customer/NewsView.vue')
const CartView = () => import('@/views/customer/CartView.vue')
const RegisterView = () => import('@/views/customer/RegisterView.vue')
const ForgotPasswordView = () => import('@/views/customer/ForgotPasswordView.vue')
const CheckoutView = () => import('@/views/customer/CheckoutView.vue')
const ProfileView = () => import('@/views/customer/ProfileView.vue')

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
        component: () => import('@/views/customer/ProductDetailView.vue'),
        props: true,
      },

      { path: 'aboutUs', name: 'aboutUs', component: AboutUsView },
      {
        path: 'aboutUs/:id',
        name: 'store-detail',
        component: () => import('@/views/customer/StoreDetailView.vue'),
        props: true,
      },

      { path: 'cart', name: 'cart', component: CartView },
      { path: 'news', name: 'news', component: NewsView },
      {
        path: 'news/:id',
        name: 'news-detail',
        component: () => import('@/views/customer/NewsDetailView.vue'),
        props: true,
      },

      { path: 'checkout', name: 'checkout', component: CheckoutView },

      {
        path: '/orders/:id',
        name: 'OrderDetail',
        component: () => import('@/views/customer/OrderDetailView.vue'),
        props: true,
      },

      {path: 'profile', name:'profile', component: ProfileView},

      // 🚨 ROUTES XÁC THỰC MỚI
      { path: 'register', name: 'register', component: RegisterView }, // Đăng ký
      { path: 'forgot-password', name: 'forgot-password', component: ForgotPasswordView }, // Quên mật khẩu
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
  },
})

router.beforeEach((to, from, next) => {
  const auth = useUserStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    if (to.path.startsWith('/admin')) {
      return next('/') // Chuyển về Home
    }
  } else if (to.meta.role && auth.user?.role !== to.meta.role) {
    // sai role => quay về home
    next('/')
  }

  next()
})

export default router
