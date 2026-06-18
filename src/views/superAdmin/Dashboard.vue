<template>
  <div class="flex flex-col gap-6">
    <!-- Page Header -->
    <PageHeader
      title="Super Admin Dashboard"
      subtitle="Overview of all parking zones, revenue, and system metrics"
      :breadcrumbs="['Super Admin', 'Dashboard']"
    />

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Parking Zones"
        :value="formatNumber(stats.total_parking_zones)"
        icon="pi pi-map"
        variant="primary"
        :trend="stats.total_parking_zones > 0 ? 12 : undefined"
        :loading="loading"
      />
      <StatCard label="Total Revenue" :value="'₹' + formatNumber(stats.total_revenue)" icon="pi pi-money-bill" variant="success" :loading="loading" />
      <StatCard label="Total Bookings" :value="formatNumber(stats.total_bookings)" icon="pi pi-calendar" variant="warning" :loading="loading" />
      <StatCard label="Total Users" :value="formatNumber(stats.total_users)" icon="pi pi-users" variant="info" :loading="loading" />
    </div>

    <!-- Chart Section -->
    <div class="card p-5 md:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100">Monthly Revenue</h2>
          <p class="text-sm text-surface-400 dark:text-surface-500">All parking zones combined</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center h-80">
        <div class="flex flex-col items-center gap-3">
          <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p class="text-sm text-surface-400 dark:text-surface-500">Loading chart data...</p>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="!stats.monthly_revenue?.length" class="flex items-center justify-center h-80">
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <p class="empty-state-title">No revenue data</p>
          <p class="empty-state-desc">Revenue data will appear here once available</p>
        </div>
      </div>

      <!-- Chart -->
      <div v-else ref="revenueChart" class="w-full h-80"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import api from "../../boot/api";
import ApexCharts from "apexcharts";
import StatCard from "../../components/common/StatCard.vue";
import PageHeader from "../../components/common/PageHeader.vue";

const stats = ref({
  total_parking_zones: 0,
  total_bookings: 0,
  total_parking_records: 0,
  total_users: 0,
  total_revenue: 0,
  monthly_revenue: [],
});

const loading = ref(true);
const revenueChart = ref(null);
let chartInstance = null;

const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};

const fetchAnalytics = async () => {
  loading.value = true;
  try {
    const { data } = await api.get("analytics/super-admin");
    stats.value = data;
    await nextTick();
    renderChart();
  } catch (error) {
    console.error("Error fetching super admin analytics:", error);
  } finally {
    loading.value = false;
  }
};

const renderChart = () => {
  if (!revenueChart.value) return;

  const isDark = document.documentElement.classList.contains("my-app-dark");
  const categories = stats.value.monthly_revenue.map((item) => item.month);
  const seriesData = stats.value.monthly_revenue.map((item) => item.revenue);

  const options = {
    chart: {
      type: "area",
      height: 320,
      toolbar: { show: false },
      fontFamily: "Inter, system-ui, sans-serif",
      foreColor: isDark ? "#94a3b8" : "#64748b",
    },
    series: [
      {
        name: "Revenue (₹)",
        data: seriesData,
      },
    ],
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { fontSize: "12px" },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => "₹" + formatNumber(val),
        style: { fontSize: "12px" },
      },
    },
    grid: {
      borderColor: isDark ? "#334155" : "#e2e8f0",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    colors: ["#2563eb"],
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.25,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val) => "₹ " + formatNumber(val),
      },
    },
    markers: {
      size: 4,
      strokeColors: "#2563eb",
      strokeWidth: 2,
      hover: { size: 6 },
    },
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
