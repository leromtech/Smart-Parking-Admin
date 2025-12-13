<template>
    <div class="flex flex-col p-6 gap-6 bg-gray-50 min-h-screen">
        <!-- Header -->
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl font-bold text-gray-800">
                {{ user?.parking_zone_owned?.name || parking_zone?.name || 'Parking Zone Dashboard' }}
            </h1>
            <p class="text-gray-500 text-sm">Dashboard Overview</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Parking Space Card -->
            <div
                class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                            <font-awesome-icon :icon="['fas', 'square']"
                                class="text-white text-2xl"></font-awesome-icon>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-gray-500 text-sm font-medium mb-1">Parking Space</span>
                        <span class="text-3xl font-bold text-gray-800">{{ parking_zone?.capacity_total ?? '0' }}</span>
                        <span class="text-xs text-gray-400 mt-1">Total capacity</span>
                    </div>
                </div>
            </div>

            <!-- Reserved Space Card -->
            <div
                class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md">
                            <font-awesome-icon :icon="['fas', 'lock']" class="text-white text-2xl"></font-awesome-icon>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-gray-500 text-sm font-medium mb-1">Reserved Space</span>
                        <span class="text-3xl font-bold text-gray-800">{{ parking_zone?.declared_for_app ?? '0'
                            }}</span>
                        <span class="text-xs text-gray-400 mt-1">For app users</span>
                    </div>
                </div>
            </div>

            <!-- Currently Occupied Card -->
            <div
                class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                            <font-awesome-icon :icon="['fas', 'car']" class="text-white text-2xl"></font-awesome-icon>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-gray-500 text-sm font-medium mb-1">Currently Occupied</span>
                        <span class="text-3xl font-bold text-gray-800">{{ displayAvailability }}</span>
                        <span class="text-xs text-gray-400 mt-1">Active parking</span>
                    </div>
                </div>
            </div>

            <!-- Managers Card -->
            <div
                class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-md">
                            <font-awesome-icon :icon="['fas', 'users']" class="text-white text-2xl"></font-awesome-icon>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-gray-500 text-sm font-medium mb-1">Managers</span>
                        <span class="text-3xl font-bold text-gray-800">{{ parking_zone?.managers?.length ?? '0'
                            }}</span>
                        <span class="text-xs text-gray-400 mt-1">Total managers</span>
                    </div>
                </div>
            </div>
        </div>


        <!-- Analytics Section -->
        <div class="flex flex-col gap-6">
            <!-- Parking Analytics -->
            <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div class="flex flex-row items-center justify-between mb-6">
                    <h2 class="text-xl font-semibold text-gray-800">Parking Analytics</h2>
                    <div class="w-64">
                        <IftaLabel>
                            <DatePicker v-model="yearFilter" showIcon fluid iconDisplay="input" view="year"
                                dateFormat="yy" />
                            <label for="date">Select Year</label>
                        </IftaLabel>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Parking Records Chart -->
                    <div class="lg:col-span-2">
                        <ParkingRecordChart :title="`Parking Records - ${yearFilter.getFullYear()}`"
                            :data="parkingRecords || []" :year="yearFilter.getFullYear()" />
                    </div>
                    <!-- Vehicle Type Distribution -->
                    <div class="lg:col-span-1">
                        <TotalVehicleMonthChart title="Vehicle Types" :data="vehicleRecords || []" />
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue';
import useAuth from '../../scripts/auth';
import ParkingRecordChart from '../../components/OwnerDashboard/ParkingRecordChart.vue';
import TotalVehicleMonthChart from '../../components/OwnerDashboard/TotalVehicleMonthChart.vue';
import { useParkingZone } from '../../scripts/parkingZone';
import api from '../../boot/api';

const { user } = useAuth()
const { parking_zone, getParkingZone } = useParkingZone()
const availability = ref(0)
const yearFilter = ref(new Date())
let echoChannel = null

// Computed property to ensure we always display a number, never an object
const displayAvailability = computed(() => {
    const value = availability.value;
    if (typeof value === 'number') {
        return value;
    } else if (typeof value === 'object' && value !== null && 'occupied' in value) {
        return Number(value.occupied) || 0;
    } else if (value === null || value === undefined) {
        return '...';
    }
    // Fallback: try to convert to number
    const num = Number(value);
    return isNaN(num) ? '...' : num;
})

const parkingRecords = ref([])
const vehicleRecords = ref(null)

const hasRun = ref(false); // Track if it’s already executed

const setupRealTimeAvailability = async () => {
    if (!parking_zone.value?.id) {
        console.warn('Parking zone not loaded yet');
        return;
    }

    try {
        // Clean up existing channel subscription if any
        if (echoChannel) {
            window.Echo.leave('parking-zones');
        }

        // Subscribe to real-time updates
        echoChannel = window.Echo.channel('parking-zones')
            .listen('.ParkingAvailabilityUpdated', (e) => {
                console.log('Availability data received from Echo:', e);
                // Handle different possible response structures
                // API returns object with 'occupied' field
                let occupiedCount = 0;

                if (e && typeof e === 'object' && !Array.isArray(e)) {
                    // Check if e has 'occupied' property directly
                    if ('occupied' in e) {
                        occupiedCount = Number(e.occupied) || 0;
                    } else if ('real_time_availability' in e) {
                        occupiedCount = Number(e.real_time_availability) || 0;
                    } else if (e.data && typeof e.data === 'object' && 'occupied' in e.data) {
                        occupiedCount = Number(e.data.occupied) || 0;
                    } else if (e.data?.real_time_availability !== undefined) {
                        occupiedCount = Number(e.data.real_time_availability) || 0;
                    } else {
                        console.warn('Could not find occupied field in Echo event:', e);
                        occupiedCount = 0;
                    }
                }

                // Always ensure we set a number, never an object
                availability.value = typeof occupiedCount === 'number' ? occupiedCount : 0;
            });

        // Fetch initial availability data
        const { data } = await api.get(`availability/${parking_zone.value.id}`);
        console.log('Availability API response:', data);

        // Handle different possible response structures
        // API returns object: { total_capacity, available, occupied, by_vehicle_type }
        let occupiedCount = 0;

        if (data && typeof data === 'object' && !Array.isArray(data)) {
            // Check if data has 'occupied' property directly
            if ('occupied' in data) {
                occupiedCount = Number(data.occupied) || 0;
            } else if ('real_time_availability' in data) {
                occupiedCount = Number(data.real_time_availability) || 0;
            } else if ('currently_occupied_spaces' in data) {
                occupiedCount = Number(data.currently_occupied_spaces) || 0;
            } else if (data.data && typeof data.data === 'object' && 'occupied' in data.data) {
                occupiedCount = Number(data.data.occupied) || 0;
            } else {
                // If we got an object but can't find occupied, default to 0
                console.warn('Could not find occupied field in availability response:', data);
                occupiedCount = 0;
            }
        }

        // Always ensure we set a number, never an object
        availability.value = typeof occupiedCount === 'number' ? occupiedCount : 0;

    } catch (error) {
        console.error('Error setting up real-time availability:', error);
        availability.value = 0;
    }
};


const getAnalytics = async () => {
    if (!parking_zone.value?.id) {
        console.warn('Parking zone not loaded yet');
        return;
    }

    try {
        const year = yearFilter.value.getFullYear();
        const { data } = await api.get('analytics/parking-zone', { params: { parking_zone_id: parking_zone.value.id, year } });
        console.log('Analytics data:', data)

        // Parking records
        if (data && data.monthly_parking_records && data.monthly_parking_records.length > 0) {
            parkingRecords.value = data.monthly_parking_records.map((item) => {
                return { [item.month]: item.count }
            });
        } else {
            parkingRecords.value = [];
        }

        // Vehicle records - API returns object {type: count}, convert to array format
        if (data && data.unique_vehicles_by_type) {
            const vehicleData = data.unique_vehicles_by_type;
            if (typeof vehicleData === 'object' && !Array.isArray(vehicleData)) {
                // Convert object to array format expected by chart
                vehicleRecords.value = Object.entries(vehicleData).map(([type, count]) => {
                    return { [type]: count || 0 };
                }).filter(item => Object.values(item)[0] > 0); // Only include types with count > 0
            } else if (Array.isArray(vehicleData)) {
                // Handle array format if API changes
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
        console.error('Error fetching analytics:', error);
        parkingRecords.value = [];
        vehicleRecords.value = [];
    }
};

watch(
    parking_zone,
    async (newVal) => {
        if (newVal?.id && !hasRun.value) {
            hasRun.value = true; // Prevent future runs
            await Promise.all([
                getAnalytics(),
                setupRealTimeAvailability()
            ]);
        }
    },
    { immediate: true }
);

// Watch for year filter changes
watch(
    yearFilter,
    async () => {
        if (parking_zone.value?.id && hasRun.value) {
            await getAnalytics()
        }
    }
);

// Cleanup Echo channel on unmount
onBeforeUnmount(() => {
    if (echoChannel) {
        window.Echo.leave('parking-zones');
        echoChannel = null;
    }
});

onMounted(async () => {
    await getParkingZone()
})
</script>