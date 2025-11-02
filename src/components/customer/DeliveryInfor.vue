<script setup>
import TitledContainer from '@/components/customer/TitledContainer.vue'

defineProps({
  policy: {
    type: Object,
    default: () => null,
  },
})

// Helper để format an toàn, tránh lỗi
const formatNum = (val) => (val !== undefined && val !== null ? Number(val).toLocaleString() : '—')
const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleString('vi-VN') : 'Chưa có dữ liệu'
</script>

<template>
  <TitledContainer title="Thông tin giao hàng" controls="hidden" v-if="policy">
    <ul class="text-gray-700 dark:text-gray-300 space-y-1 leading-relaxed">
      <li>
        ⏰ <strong>Thời gian chuẩn bị:</strong> {{ policy.prepareTime || 'Đang cập nhật' }}
      </li>
      <li>
        🚚 <strong>Thời gian giao hàng ước tính:</strong>
        {{ policy.deliveryTimeEstimate || 'Đang cập nhật' }}
      </li>
      <li>
        📍 <strong>Phạm vi giao hàng:</strong> Bán kính {{ policy.deliveryRadius || '—' }} –
        <span class="italic">{{ policy.deliveryAreas?.join(', ') || 'Chưa có thông tin' }}</span>
      </li>
      <li v-if="policy.deliveryFee !== undefined">
        💰 <strong>Phí giao hàng:</strong> {{ formatNum(policy.deliveryFee) }}đ
        <span v-if="policy.freeShipThreshold">
          (Miễn phí với đơn từ {{ formatNum(policy.freeShipThreshold) }}đ)
        </span>
      </li>
      <li v-if="policy.extraFeePerKm !== undefined">
        ➕ <strong>Phụ phí thêm mỗi km:</strong>
        {{ formatNum(policy.extraFeePerKm) }}đ/km
      </li>
      <li>💸 <strong>Chính sách hoàn tiền:</strong> {{ policy.refundPolicy || '—' }}</li>
      <li>↩️ <strong>Thời hạn đổi trả:</strong> {{ policy.returnWindow || '—' }}</li>
      <li>❌ <strong>Chính sách hủy:</strong> {{ policy.cancelPolicy || '—' }}</li>
      <li>
        📞 <strong>Hỗ trợ:</strong> {{ policy.supportPhone || '—' }} –
        {{ policy.supportEmail || '—' }}
      </li>
      <li v-if="policy.note">🕐 <strong>Lưu ý:</strong> {{ policy.note }}</li>
      <li class="text-sm text-gray-500 pt-2">
        Cập nhật lần cuối:
        {{ formatDate(policy.lastUpdated) }}
      </li>
    </ul>
  </TitledContainer>
</template>
