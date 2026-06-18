<template>
  <div class="flex flex-col p-6 gap-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold text-gray-800">
        {{ user?.parking_zone_owned?.name || parking_zone?.name || "Parking Zone Dashboard" }}
      </h1>
      <p class="text-gray-500 text-sm">Dashboard Overview</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Parking Space" :value="totalCapacity ?? '0'" icon="pi pi-th-large" variant="primary" subtitle="Total capacity" />
      <StatCard label="Reserved for App" :value="totalReservedForApp ?? '0'" icon="pi pi-lock" variant="danger" subtitle="For app users" />
      <StatCard label="Currently Occupied" :value="occupiedSpace" icon="pi pi-car" variant="success" subtitle="Active parking" />
      <StatCard label="Managers" :value="parking_zone?.managers?.length ?? '0'" icon="pi pi-users" variant="warning" subtitle="Total managers" />
    </div>

    <!-- Analytics Section -->
    <div class="flex flex-col gap-6">
      <!-- Parking Analytics -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div class="flex flex-row items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Parking Analytics</h2>
          <div class="w-64">
            <IftaLabel>
              <DatePicker v-model="yearFilter" showIcon fluid iconDisplay="input" view="year" dateFormat="yy" />
              <label for="date">Select Year</label>
            </IftaLabel>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Parking Records Chart -->
          <div class="lg:col-span-2">
            <ParkingRecordChart
              :title="`Parking Records - ${yearFilter.getFullYear()}`"
              :data="parkingRecords || []"
              :year="yearFilter.getFullYear()"
            />
          </div>
          <!-- Vehicle Type Distribution -->
          <div class="lg:col-span-1">
            <TotalVehicleMonthChart title="Vehicle Types" :data="vehicleRecords || []" />
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <BookingChart :title="`Monthly Bookings - ${yearFilter.getFullYear()}`" :data="bookingRecords" :year="yearFilter.getFullYear()" />
          </div>

          <div class="lg:col-span-1">
            <TotalVehicleMonthChart title="Vehicle Types" :data="vehicleRecords || []" />
          </div>
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

const { user } = useAuth();
const { parking_zone, getParkingZone } = useParkingZone();
const { floors, loading, editItem, deleteItem, getFloors, deleteFloor } = useFloors();
const availability = ref(0);
const yearFilter = ref(new Date());
let echoChannel = null;

// Computed property to ensure we always display a number, never an object
const displayAvailability = computed(() => {
  const value = availability.value;
  if (typeof value === "number") {
    return value;
  } else if (typeof value === "object" && value !== null && "occupied" in value) {
    return Number(value.occupied) || 0;
  } else if (value === null || value === undefined) {
    return "...";
  }
  // Fallback: try to convert to number
  const num = Number(value);
  return isNaN(num) ? "..." : num;
});

const parkingRecords = ref([]);
const bookingRecords = ref([]);

const vehicleRecords = ref(null);

const hasRun = ref(false); // Track if it's already executed

const setupRealTimeAvailability = async () => {
  if (!parking_zone.value?.id) {
    console.warn("⚠️ Parking zone not loaded yet");
    return;
  }

  try {
    const channelName = `parking-zone.${parking_zone.value.id}`;

    // Clean up existing channel subscription if any
    if (echoChannel) {
      console.log("🧹 Cleaning up old channel subscription");
      window.Echo.leave(channelName);
      echoChannel = null;
    }

    console.log("📡 Subscribing to channel:", channelName);

    // Subscribe to real-time updates
    echoChannel = window.Echo.channel(channelName);

    // Add subscription callback
    echoChannel.subscribed(() => {
      console.log("✅ Successfully subscribed to:", channelName);
    });

    // Add error callback
    echoChannel.error((error) => {
      console.error("❌ Channel subscription error:", error);
    });

    // Listen for parking updates
    // Listen with dot prefix for custom event names
    echoChannel.listen(".parking.updated", (payload) => {
      console.log("🔥 LIVE OCCUPANCY RECEIVED:", payload);

      let occupiedCount = 0;

      if (typeof payload === "object" && payload !== null) {
        if ("occupied" in payload) {
          occupiedCount = Number(payload.occupied) || 0;
        } else if ("data" in payload && typeof payload.data === "object") {
          occupiedCount = Number(payload.data.occupied) || 0;
        }
      }

      availability.value = occupiedCount;
      console.log("📊 Updated availability to:", occupiedCount);
    });

    // Fetch initial availability data
    console.log("🔍 Fetching initial availability...");
    const { data } = await api.get(`availability/${parking_zone.value.id}`);
    console.log("📥 Availability API response:", data);

    // Handle different possible response structures
    let occupiedCount = 0;

    if (data && typeof data === "object" && !Array.isArray(data)) {
      if ("occupied" in data) {
        occupiedCount = Number(data.occupied) || 0;
      } else if ("real_time_availability" in data) {
        occupiedCount = Number(data.real_time_availability) || 0;
      } else if ("currently_occupied_spaces" in data) {
        occupiedCount = Number(data.currently_occupied_spaces) || 0;
      } else if (data.data && typeof data.data === "object" && "occupied" in data.data) {
        occupiedCount = Number(data.data.occupied) || 0;
      } else {
        console.warn("⚠️ Could not find occupied field in availability response:", data);
        occupiedCount = 0;
      }
    }

    availability.value = typeof occupiedCount === "number" ? occupiedCount : 0;
    console.log("📊 Initial availability set to:", availability.value);
  } catch (error) {
    console.error("❌ Error setting up real-time availability:", error);
    availability.value = 0;
  }
};

const getAnalytics = async () => {
  if (!parking_zone.value?.id) {
    console.warn("⚠️ Parking zone not loaded yet");
    return;
  }

  try {
    const year = yearFilter.value.getFullYear();
    const { data } = await api.get("analytics/parking-zone", {
      params: { parking_zone_id: parking_zone.value.id, year },
    });
    console.log("📊 Analytics data:", data);

    // Parking records
    if (data && data.monthly_parking_records && data.monthly_parking_records.length > 0) {
      parkingRecords.value = data.monthly_parking_records.map((item) => {
        return { [item.month]: item.count };
      });
    } else {
      parkingRecords.value = [];
    }

    // Booking records
    if (data?.monthly_bookings) {
      bookingRecords.value = data.monthly_bookings.map((m) => ({
        [m.month]: Number(m.count) || 0,
      }));
    } else {
      bookingRecords.value = [];
    }

    // Vehicle records - API returns object {type: count}, convert to array format
    if (data && data.unique_vehicles_by_type) {
      const vehicleData = data.unique_vehicles_by_type;
      if (typeof vehicleData === "object" && !Array.isArray(vehicleData)) {
        vehicleRecords.value = Object.entries(vehicleData)
          .map(([type, count]) => {
            return { [type]: count || 0 };
          })
          .filter((item) => Object.values(item)[0] > 0);
      } else if (Array.isArray(vehicleData)) {
        vehicleRecords.value = vehicleData.map((item) => {
          return { [item.type || item.name]: item.count || item.total || 0 };
        });
      } else {
        vehicleRecords.value = [];
      }
    } else {
      vehicleRecords.value = [];
    }
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);
    parkingRecords.value = [];
    vehicleRecords.value = [];
  }
};

watch(
  parking_zone,
  async (newVal) => {
    if (newVal?.id && !hasRun.value) {
      console.log("🚀 Parking zone loaded, initializing...");
      hasRun.value = true;

      await Promise.all([
        getAnalytics(),
        setupRealTimeAvailability(),
        getFloors(newVal.id), // ✅ THIS WAS MISSING
      ]);
    }
  },
  { immediate: true },
);

// Watch for year filter changes
watch(yearFilter, async () => {
  if (parking_zone.value?.id && hasRun.value) {
    await getAnalytics();
  }
});

// Cleanup Echo channel on unmount
onBeforeUnmount(() => {
  console.log("🧹 Component unmounting, cleaning up Echo channel");
  if (echoChannel) {
    const channelName = `parking-zone.${parking_zone.value?.id}`;
    window.Echo.leave(channelName);
    echoChannel = null;
  }
});

const totalCapacity = computed(() => {
  return floors.value.reduce((sum, floor) => {
    return sum + Number(floor.total_capacity ?? 0);
  }, 0);
});

const totalReservedForApp = computed(() => {
  return floors.value.reduce((sum, floor) => {
    return sum + Number(floor.reserved_for_app ?? 0);
  }, 0);
});

const totalAvailable = computed(() => {
  const occupied = Number(availability.value ?? 0);
  return Math.max(totalReservedForApp.value - occupied, 0);
});

const occupiedSpace = computed(() => {
  return Number(availability.value ?? 0);
});

onMounted(async () => {
  console.log("🎬 Component mounted");
  await getParkingZone();
});
</script>
