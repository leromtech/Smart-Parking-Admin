<template>
  <div class="flex flex-col gap-6">
    <!-- Page Header -->
    <PageHeader :title="parkingZoneName" subtitle="Dashboard Overview" :breadcrumbs="['Parking Zone', 'Dashboard']" />

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Capacity" :value="totalCapacity || '0'" icon="pi pi-th-large" variant="primary" subtitle="Total parking spaces" />
      <StatCard label="Reserved for App" :value="totalReservedForApp || '0'" icon="pi pi-lock" variant="danger" subtitle="For app users" />
      <StatCard label="Currently Occupied" :value="occupiedSpace" icon="pi pi-car" variant="success" subtitle="Active parking" />
      <StatCard label="Managers" :value="parking_zone?.managers?.length ?? '0'" icon="pi pi-users" variant="warning" subtitle="Total managers" />
    </div>

    <!-- Analytics Section -->
    <div class="card p-5 md:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100">Parking Analytics</h2>
          <p class="text-sm text-surface-400 dark:text-surface-500">Detailed insights for your parking zone</p>
        </div>
        <div class="w-full sm:w-48">
          <IftaLabel>
            <DatePicker v-model="yearFilter" showIcon fluid iconDisplay="input" view="year" dateFormat="yy" class="w-full" />
            <label for="date">Select Year</label>
          </IftaLabel>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Parking Records -->
        <div class="lg:col-span-2">
          <ParkingRecordChart
            :title="`Parking Records - ${yearFilter.getFullYear()}`"
            :data="parkingRecords || []"
            :year="yearFilter.getFullYear()"
          />
        </div>
        <!-- Vehicle Types -->
        <div class="lg:col-span-1">
          <TotalVehicleMonthChart title="Vehicle Types" :data="vehicleRecords || []" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <!-- Booking Chart -->
        <div class="lg:col-span-2">
          <BookingChart :title="`Monthly Bookings - ${yearFilter.getFullYear()}`" :data="bookingRecords" :year="yearFilter.getFullYear()" />
        </div>
        <!-- Vehicle Types (repeated per original layout) -->
        <div class="lg:col-span-1">
          <TotalVehicleMonthChart title="Vehicle Types" :data="vehicleRecords || []" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from "vue";
import useAuth from "../../scripts/auth";
import ParkingRecordChart from "../../components/OwnerDashboard/ParkingRecordChart.vue";
import TotalVehicleMonthChart from "../../components/OwnerDashboard/TotalVehicleMonthChart.vue";
import { useParkingZone } from "../../scripts/parkingZone";
import api from "../../boot/api";
import BookingChart from "../../components/OwnerDashboard/BookingChart.vue";
import useFloors from "../../scripts/floors";
import StatCard from "../../components/common/StatCard.vue";
import PageHeader from "../../components/common/PageHeader.vue";

const { user } = useAuth();
const { parking_zone, getParkingZone } = useParkingZone();
const { floors, getFloors } = useFloors();
const availability = ref(0);
const yearFilter = ref(new Date());
let echoChannel = null;
const parkingRecords = ref([]);
const bookingRecords = ref([]);
const vehicleRecords = ref(null);
const hasRun = ref(false);

const parkingZoneName = computed(() => {
  return user.value?.parking_zone_owned?.name || parking_zone.value?.name || "Parking Zone Dashboard";
});

const occupiedSpace = computed(() => {
  const value = availability.value;
  if (typeof value === "number") return value;
  if (typeof value === "object" && value !== null && "occupied" in value) return Number(value.occupied) || 0;
  const num = Number(value);
  return isNaN(num) ? "..." : num;
});

const setupRealTimeAvailability = async () => {
  if (!parking_zone.value?.id) return;
  try {
    const channelName = `parking-zone.${parking_zone.value.id}`;
    if (echoChannel) {
      window.Echo.leave(channelName);
      echoChannel = null;
    }
    echoChannel = window.Echo.channel(channelName);
    echoChannel.listen(".parking.updated", (payload) => {
      let occupiedCount = 0;
      if (typeof payload === "object" && payload !== null) {
        if ("occupied" in payload) occupiedCount = Number(payload.occupied) || 0;
        else if ("data" in payload && typeof payload.data === "object") occupiedCount = Number(payload.data.occupied) || 0;
      }
      availability.value = occupiedCount;
    });
    const { data } = await api.get(`availability/${parking_zone.value.id}`);
    let occupiedCount = 0;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      if ("occupied" in data) occupiedCount = Number(data.occupied) || 0;
      else if ("real_time_availability" in data) occupiedCount = Number(data.real_time_availability) || 0;
      else if ("currently_occupied_spaces" in data) occupiedCount = Number(data.currently_occupied_spaces) || 0;
      else if (data.data && typeof data.data === "object" && "occupied" in data.data) occupiedCount = Number(data.data.occupied) || 0;
    }
    availability.value = typeof occupiedCount === "number" ? occupiedCount : 0;
  } catch (error) {
    console.error("Error setting up real-time availability:", error);
    availability.value = 0;
  }
};

const getAnalytics = async () => {
  if (!parking_zone.value?.id) return;
  try {
    const year = yearFilter.value.getFullYear();
    const { data } = await api.get("analytics/parking-zone", {
      params: { parking_zone_id: parking_zone.value.id, year },
    });
    if (data && data.monthly_parking_records && data.monthly_parking_records.length > 0) {
      parkingRecords.value = data.monthly_parking_records.map((item) => ({ [item.month]: item.count }));
    } else {
      parkingRecords.value = [];
    }
    if (data?.monthly_bookings) {
      bookingRecords.value = data.monthly_bookings.map((m) => ({ [m.month]: Number(m.count) || 0 }));
    } else {
      bookingRecords.value = [];
    }
    if (data && data.unique_vehicles_by_type) {
      const vehicleData = data.unique_vehicles_by_type;
      if (typeof vehicleData === "object" && !Array.isArray(vehicleData)) {
        vehicleRecords.value = Object.entries(vehicleData)
          .map(([type, count]) => ({ [type]: count || 0 }))
          .filter((item) => Object.values(item)[0] > 0);
      } else if (Array.isArray(vehicleData)) {
        vehicleRecords.value = vehicleData.map((item) => ({ [item.type || item.name]: item.count || item.total || 0 }));
      } else {
        vehicleRecords.value = [];
      }
    } else {
      vehicleRecords.value = [];
    }
  } catch (error) {
    console.error("Error fetching analytics:", error);
    parkingRecords.value = [];
    vehicleRecords.value = [];
  }
};

watch(
  parking_zone,
  async (newVal) => {
    if (newVal?.id && !hasRun.value) {
      hasRun.value = true;
      await Promise.all([getAnalytics(), setupRealTimeAvailability(), getFloors(newVal.id)]);
    }
  },
  { immediate: true },
);

watch(yearFilter, async () => {
  if (parking_zone.value?.id && hasRun.value) {
    await getAnalytics();
  }
});

onBeforeUnmount(() => {
  if (echoChannel) {
    const channelName = `parking-zone.${parking_zone.value?.id}`;
    window.Echo.leave(channelName);
    echoChannel = null;
  }
});

const totalCapacity = computed(() => {
  return floors.value.reduce((sum, floor) => sum + Number(floor.total_capacity ?? 0), 0);
});

const totalReservedForApp = computed(() => {
  return floors.value.reduce((sum, floor) => sum + Number(floor.reserved_for_app ?? 0), 0);
});

onMounted(async () => {
  await getParkingZone();
});
</script>
