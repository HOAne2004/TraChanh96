<template>
  <div class="flex flex-col gap-2 mt-4">
    <button @click="loginWith('google')" class="btn btn-google">Đăng nhập với Google</button>
    <button @click="loginWith('facebook')" class="btn btn-facebook">Đăng nhập với Facebook</button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
const auth = useAuthStore();

function loginWith(provider) {
  // Giả lập tài khoản khi người dùng chọn Google/Facebook
  const mockUser = {
    id: Date.now(),
    phone: '',
    name: provider === 'google' ? 'Google User' : 'Facebook User',
    role: 'user',
    provider
  };
  localStorage.setItem('user', JSON.stringify(mockUser));
  auth.user = mockUser;
}
</script>
