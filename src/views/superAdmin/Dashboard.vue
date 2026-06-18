<template>
  <div class="flex flex-col gap-6 p-4">
    <h1 class="text-2xl font-bold text-gray-800">Super Admin Dashboard</h1>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Parking Zones"
        :value="formatNumber(stats.total_parking_zones)"
        icon="pi pi-map"
        variant="primary"
        :trend="stats.total_parking_zones > 0 ? 12 : undefined"
      />
      <StatCard label="Total Revenue" :value="'₹ ' + formatNumber(stats.total_revenue)" icon="pi pi-money-bill" variant="success" />
      <StatCard label="Total Bookings" :value="formatNumber(stats.total_bookings)" icon="pi pi-calendar" variant="warning" />
      <StatCard label="Total Users" :value="formatNumber(stats.total_users)" icon="pi pi-users" variant="info" />
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
import { ref, onMounted, nextTick } from "vue";
import api from "../../boot/api";
import ApexCharts from "apexcharts";
import StatCard from "../../components/common/StatCard.vue";

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
  return new Intl.NumberFormat("en-IN").format(num || 0);
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
  if (!revenueChart.value) {
    return;
  }

  const categories = stats.value.monthly_revenue.map((item) => item.month);
  const seriesData = stats.value.monthly_revenue.map((item) => item.revenue);

  const options = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: true,
      },
      fontFamily: "inherit",
    },
    series: [
      {
        name: "Revenue (₹)",
        data: seriesData,
      },
    ],
    xaxis: {
      categories: categories,
      type: "category",
    },
    colors: ["#0284c7"], // sky-600
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "₹ " + formatNumber(val);
        },
      },
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
