<script setup>
import { computed } from 'vue';
// 💡 Cần import các component biểu đồ từ vue-chartjs
 import { Line } from 'vue-chartjs'; 
 import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

// ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const props = defineProps({
    orders: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
});

// --- LOGIC XỬ LÝ DỮ LIỆU ĐỂ HIỂN THỊ TRÊN BIỂU ĐỒ ---
const chartData = computed(() => {
    if (props.isLoading || props.orders.length === 0) {
        return { labels: [], datasets: [] };
    }

    // 1. Lấy dữ liệu 7 ngày gần nhất
    const today = new Date();
    const dateMap = new Map();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        dateMap.set(dateKey, { revenue: 0, count: 0 });
    }

    // 2. Tổng hợp dữ liệu từ đơn hàng
    props.orders.forEach(order => {
        // Giả định createdAt là ISO string
        const dateKey = order.createdAt ? order.createdAt.split('T')[0] : null;

        if (dateMap.has(dateKey)) {
            // Chỉ tính đơn hàng đã hoàn thành cho doanh thu
            if (order.status === 'Delivered' || order.status === 'Completed') {
                dateMap.get(dateKey).revenue += order.totalAmount;
            }
            dateMap.get(dateKey).count += 1;
        }
    });

    // 3. Chuẩn bị dữ liệu cho Chart.js
    const labels = Array.from(dateMap.keys()).map(date => {
        // Format ngày tháng cho biểu đồ
        return new Date(date).toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' });
    });
    
    const revenueData = Array.from(dateMap.values()).map(data => data.revenue);
    const countData = Array.from(dateMap.values()).map(data => data.count);

    return {
        labels: labels,
        datasets: [
            {
                label: 'Doanh thu',
                backgroundColor: 'rgba(52, 211, 153, 0.5)', // Màu xanh lá cây (Tailwind green-400)
                borderColor: '#34d399',
                tension: 0.3,
                data: revenueData,
                yAxisID: 'revenue', // Trục y bên trái
            },
            {
                label: 'Số lượng đơn hàng',
                backgroundColor: 'rgba(59, 130, 246, 0.5)', // Màu xanh dương (Tailwind blue-500)
                borderColor: '#3b82f6',
                tension: 0.3,
                data: countData,
                yAxisID: 'count', // Trục y bên phải
            }
        ],
    };
});
</script>

<template>
    <div v-if="isLoading" class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        Đang tải dữ liệu biểu đồ...
    </div>
    <div v-else class="h-80">
        <div v-if="!chartData.labels.length" class="h-full flex items-center justify-center text-gray-500">
            Không có đủ dữ liệu đơn hàng trong 7 ngày qua.
        </div>
        <div v-else class="text-center text-sm text-gray-500">
            [PLACEHOLDER] Biểu đồ Doanh thu và Số lượng đơn hàng (Cần cài đặt thư viện Chart.js)
        </div>
    </div>
</template>