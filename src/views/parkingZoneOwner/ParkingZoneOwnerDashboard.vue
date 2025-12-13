<template>
    <div class="flex flex-col p-6 gap-6 bg-gray-50 min-h-screen">
        <!-- Header -->
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl font-bold text-gray-800">
                {{ user.parking_zone_owned.name }}
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
                        <span class="text-3xl font-bold text-gray-800">{{ availabiltiy ?? "..." }}</span>
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

        <!-- Booking Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Total Bookings Card -->
            <div
                class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                            <font-awesome-icon :icon="['fas', 'calendar-check']"
                                class="text-white text-2xl"></font-awesome-icon>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-gray-500 text-sm font-medium mb-1">Total Bookings</span>
                        <span class="text-3xl font-bold text-gray-800">{{ bookingStats?.total_bookings ?? '0' }}</span>
                        <span class="text-xs text-gray-400 mt-1">All time</span>
                    </div>
                </div>
            </div>

            <!-- Today's Bookings Card -->
            <div
                class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
                            <font-awesome-icon :icon="['fas', 'calendar-day']"
                                class="text-white text-2xl"></font-awesome-icon>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-gray-500 text-sm font-medium mb-1">Today's Bookings</span>
                        <span class="text-3xl font-bold text-gray-800">{{ bookingStats?.today_bookings ?? '0' }}</span>
                        <span class="text-xs text-gray-400 mt-1">Today</span>
                    </div>
                </div>
            </div>

            <!-- Active Bookings Card -->
            <div
                class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-md">
                            <font-awesome-icon :icon="['fas', 'clock']" class="text-white text-2xl"></font-awesome-icon>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-gray-500 text-sm font-medium mb-1">Active Bookings</span>
                        <span class="text-3xl font-bold text-gray-800">{{ bookingStats?.active_bookings ?? '0' }}</span>
                        <span class="text-xs text-gray-400 mt-1">Currently active</span>
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

            <!-- Booking Analytics -->
            <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div class="flex flex-row items-center justify-between mb-6">
                    <h2 class="text-xl font-semibold text-gray-800">Booking Analytics</h2>
                </div>

                <div class="w-full">
                    <BookingChart :title="`Monthly Bookings - ${yearFilter.getFullYear()}`" :data="bookingRecords || []"
                        :year="yearFilter.getFullYear()" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import useAuth from '../../scripts/auth';
import ParkingRecordChart from '../../components/OwnerDashboard/ParkingRecordChart.vue';
import BookingChart from '../../components/OwnerDashboard/BookingChart.vue';
import TotalVehicleMonthChart from '../../components/OwnerDashboard/TotalVehicleMonthChart.vue';
import { useParkingZone } from '../../scripts/parkingZone';
import api from '../../boot/api';

const { user } = useAuth()
const chart = ref(null)
const { parking_zone, getParkingZone } = useParkingZone()
const availabiltiy = ref(null)
const yearFilter = ref(new Date())

const parkingRecords = ref([])
const vehicleRecords = ref(null)
const bookingRecords = ref([])
const bookingStats = ref({
    total_bookings: 0,
    today_bookings: 0,
    active_bookings: 0
})

const hasRun = ref(false); // Track if it’s already executed

const setupRealTimeAvailability = async () => {
    try {
        Echo.channel('parking-zones')
            .listen('ParkingAvailabilityUpdated', (e) => { // Add the dot prefix
                console.log('Data received:', e);
                availabiltiy.value = e.real_time_availability;
            });

        // Then make the API call to trigger initial data
        const { data } = await api.get(`availability/${parking_zone.value.id}`);
        availabiltiy.value = data.currently_occupied_spaces

    } catch (error) {
        console.error('Error setting up real-time availability:', error);
    }
};


const getAnalytics = async () => {
    try {
        const year = yearFilter.value.toLocaleDateString('en-GB', { year: 'numeric' }).replace('/', '-');
        const { data } = await api.get('analytics/parking-zone', { params: { parking_zone_id: parking_zone.value.id, year } });
        console.log(data)

        // Parking records
        if (data && data.monthly_parking_records && data.monthly_parking_records.length > 0) {
            parkingRecords.value = data.monthly_parking_records.map((item) => {
                return { [item.month]: item.count }
            });
        } else {
            parkingRecords.value = [];
        }

        // Vehicle records
        if (data && data.unique_vehicle_by_type && data.unique_vehicle_by_type.length > 0) {
            vehicleRecords.value = data.unique_vehicle_by_type.map((item) => {
                return { [item.type || item.name]: item.count || item.total }
            });
        } else {
            vehicleRecords.value = [];
        }

        // Booking records
        if (data && data.monthly_booking_records && data.monthly_booking_records.length > 0) {
            bookingRecords.value = data.monthly_booking_records.map((item) => {
                return { [item.month]: item.count }
            });
        } else {
            bookingRecords.value = [];
        }

        // Booking stats
        if (data && data.booking_stats) {
            bookingStats.value = {
                total_bookings: data.booking_stats.total_bookings || 0,
                today_bookings: data.booking_stats.today_bookings || 0,
                active_bookings: data.booking_stats.active_bookings || 0
            };
        }
    } catch (error) {
        console.error('Error fetching analytics:', error);
        parkingRecords.value = [];
        bookingRecords.value = [];
        vehicleRecords.value = [];
    }
};

watch(
    parking_zone,
    async (newVal) => {
        if (newVal && !hasRun.value) {
            hasRun.value = true; // Prevent future runs
            await getAnalytics()
            await setupRealTimeAvailability(parking_zone.value.id)
            await getBookingStats()
        }
    },
    { immediate: true }
);

// Watch for year filter changes
watch(
    yearFilter,
    async () => {
        if (parking_zone.value && hasRun.value) {
            await getAnalytics()
        }
    }
);

// Fetch booking statistics (not year-dependent)
const getBookingStats = async () => {
    try {
        const { data } = await api.get('analytics/parking-zone/bookings', {
            params: { parking_zone_id: parking_zone.value.id }
        });

        if (data) {
            bookingStats.value = {
                total_bookings: data.total_bookings || 0,
                today_bookings: data.today_bookings || 0,
                active_bookings: data.active_bookings || 0
            };
        }
    } catch (error) {
        console.error('Error fetching booking stats:', error);
    }
};

onMounted(async () => {
    await getParkingZone()
})
</script>