import { createRouter, createWebHistory } from 'vue-router'
import { useUIStore } from '@/stores/ui'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// User
import HomeView from '@/views/customer/HomeView.vue'

const ProductsView = () => import('@/views/customer/ProductsView.vue')//lazy load

// Admin
const AdminDashboard = () => import('@/views/admin/Dashboard.vue')

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children:[
      {path: '', name: 'home', component: HomeView},
      {path: 'products', name: 'products', component: ProductsView},
    ]
  },
    {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' }, 
    children:[
      { path: '', name: 'admin.dashboard', component: AdminDashboard },
    ]
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const ui = useUIStore()

  if(to.meta.requiresAuth){
    if(!user){
      ui.showLoginModal()
      return next(false)
    }

    if(to.meta.role && to.meta.role !== user.role){
      return next({name: 'home'})
    }
  }
  next()
})

export default router
