<template>
    <div class="flex flex-col gap-6 p-4">
        <h1 class="text-2xl font-bold text-gray-800">Super Admin Dashboard</h1>

        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between transition-transform hover:scale-105">
                <div>
                    <p class="text-sm font-medium text-gray-500 mb-1">Total Parking Zones</p>
                    <h3 class="text-3xl font-bold text-gray-800">{{ stats.total_parking_zones }}</h3>
                </div>
                <div class="p-3 bg-sky-100 rounded-lg text-sky-600">
                    <i class="pi pi-map text-2xl"></i>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between transition-transform hover:scale-105">
                <div>
                    <p class="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                    <h3 class="text-3xl font-bold text-gray-800">₹ {{ formatNumber(stats.total_revenue) }}</h3>
                </div>
                <div class="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                    <i class="pi pi-money-bill text-2xl"></i>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between transition-transform hover:scale-105">
                <div>
                    <p class="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
                    <h3 class="text-3xl font-bold text-gray-800">{{ formatNumber(stats.total_bookings) }}</h3>
                </div>
                <div class="p-3 bg-amber-100 rounded-lg text-amber-600">
                    <i class="pi pi-calendar text-2xl"></i>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between transition-transform hover:scale-105">
                <div>
                    <p class="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                    <h3 class="text-3xl font-bold text-gray-800">{{ formatNumber(stats.total_users) }}</h3>
                </div>
                <div class="p-3 bg-purple-100 rounded-lg text-purple-600">
                    <i class="pi pi-users text-2xl"></i>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 gap-6">
            <Panel header="Monthly Revenue (All Zones)" class="w-full">
                <div v-if="loading" class="flex justify-center items-center h-80">
                    <i class="pi pi-spin pi-spinner text-4xl text-sky-600"></i>
                </div>
                <div v-else ref="revenueChart" class="w-full h-96"></div>
            </Panel>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import api from '../../boot/api';
import ApexCharts from 'apexcharts';

const stats = ref({
    total_parking_zones: 0,
    total_bookings: 0,
    total_parking_records: 0,
    total_users: 0,
    total_revenue: 0,
    monthly_revenue: []
});

const loading = ref(true);
const revenueChart = ref(null);
let chartInstance = null;

const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
};

const fetchAnalytics = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('analytics/super-admin');
        stats.value = data;
        await nextTick();
        renderChart();
    } catch (error) {
        console.error('Error fetching super admin analytics:', error);
    } finally {
        loading.value = false;
    }
};

const renderChart = () => {
    if (!revenueChart.value) {
        return;
    }

    const categories = stats.value.monthly_revenue.map(item => item.month);
    const seriesData = stats.value.monthly_revenue.map(item => item.revenue);

    const options = {
        chart: {
            type: 'area',
            height: 350,
            toolbar: {
                show: true
            },
            fontFamily: 'inherit'
        },
        series: [{
            name: 'Revenue (₹)',
            data: seriesData
        }],
        xaxis: {
            categories: categories,
            type: 'category'
        },
        colors: ['#0284c7'], // sky-600
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            }
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return "₹ " + formatNumber(val);
                }
            }
        }
    };

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new ApexCharts(revenueChart.value, options);
    chartInstance.render();
};

onMounted(() => {
    fetchAnalytics();
});
</script>