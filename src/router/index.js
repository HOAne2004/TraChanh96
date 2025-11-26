import { createRouter, createWebHistory } from 'vue-router'
//import { useUIStore } from '@/stores/uiStore'
import { useUserStore } from '@/stores/userStore'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// User
import HomeView from '@/views/customer/HomeView.vue'
const ProductsView = () => import('@/views/customer/ProductsView.vue') //lazy load
const AboutUsView = () => import('@/views/customer/AboutUsView.vue')
const NewsView = () => import('@/views/customer/NewsView.vue')
const CartView = () => import('@/views/customer/CartView.vue')
const RegisterView = () => import('@/views/customer/RegisterView.vue')
const ForgotPasswordView = () => import('@/views/customer/ForgotPasswordView.vue')
const CheckoutView = () => import('@/views/customer/CheckoutView.vue')
const ProfileView = () => import('@/views/customer/ProfileView.vue')

// Admin
const AdminDashboard = () => import('@/views/admin/AdminDashboardView.vue')
const AdminProductsView = () => import('@/views/admin/AdminProductsView.vue')
const AdminCategoriesView = () => import('@/views/admin/AdminCategoriesView.vue')
const AdminOptionsView = () => import('@/views/admin/AdminOptionsManagementView.vue')
const AdminUsersView = () => import('@/views/admin/AdminUsersView.vue')
const AdminOrdersView = () => import('@/views/admin/AdminOrdersView.vue')
const AdminVouchersView = () => import('@/views/admin/AdminVouchersView.vue')
const AdminStoresView = () => import('@/views/admin/AdminStoresView.vue')
const AdminNewsView = () => import('@/views/admin/AdminNewsView.vue')
const AdminMembershipLevelsView = () => import('@/views/admin/AdminMembershipLevelsView.vue')
const AdminReviewsView = () => import('@/views/admin/AdminReviewsView.vue')
const AdminGeneralSettingsView = () => import('@/views/admin/AdminGeneralSettingsView.vue')
const AdminPoliciesView = () => import('@/views/admin/AdminPoliciesView.vue')
const AdminPaymentsView = () => import('@/views/admin/AdminPaymentsView.vue')

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

      { path: 'profile', name: 'profile', component: ProfileView },

      // 🚨 ROUTES XÁC THỰC MỚI
      { path: 'register', name: 'register', component: RegisterView }, // Đăng ký
      { path: 'forgot-password', name: 'forgot-password', component: ForgotPasswordView }, // Quên mật khẩu
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', name: 'admin.dashboard', component: AdminDashboard },
      // Sản phẩm & Danh mục
      { path: 'products', name: 'admin.products.list', component: AdminProductsView },
      { path: 'categories', name: 'admin.categories', component: AdminCategoriesView },
      { path: 'options', name: 'admin.options', component: AdminOptionsView },
      { path: 'vouchers', name: 'admin.vouchers', component: AdminVouchersView },

      // Vận hành
      { path: 'orders', name: 'admin.orders', component: AdminOrdersView },
      { path: 'stores', name: 'admin.stores', component: AdminStoresView },
      { path: 'news', name: 'admin.news', component: AdminNewsView },
      { path: 'reviews', name: 'admin.reviews.moderation', component: AdminReviewsView },
      { path: 'users', name: 'admin.users.list', component: AdminUsersView },

      // Cấu hình
      {
        path: 'memberships/levels',
        name: 'admin.memberships.levels',
        component: AdminMembershipLevelsView,
      },
      {
        path: 'settings/general',
        name: 'admin.settings.general',
        component: AdminGeneralSettingsView,
      },
      { path: 'settings/policies', name: 'admin.settings.policies', component: AdminPoliciesView },
      { path: 'settings/payments', name: 'admin.settings.payments', component: AdminPaymentsView },
    ],
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('@/views/customer/NotFoundView.vue'),
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
  } else if (to.meta.role && auth.user?.role) {
    const requiredRole = String(to.meta.role).toLowerCase()
    const userRole = String(auth.user.role).toLowerCase()

    if (userRole !== requiredRole) {
      // Sai role => quay về home
      console.warn(
        `Redirecting: User role (${userRole}) does not match required role (${requiredRole})`,
      )
      return next('/')
    }
  }

  next()
})

export default router
