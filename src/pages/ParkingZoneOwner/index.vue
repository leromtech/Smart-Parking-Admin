<template>
    <div class="flex flex-col p-2 gap-3">
        <p class="text-xl font-bold text-neutral-600">
            {{ user.parking_zone_owned.name }}
        </p>

        <div class="grid grid-cols-4  items-center justify-evenly gap-4">
            <div class="flex flex-row items-center h-[60px] bg-white w-full rounded-md shadow-md gap-4">
                <div class="bg-blue-500 flex items-center justify-center h-[90%] w-[50px] mx-1 rounded-md">
                    <font-awesome-icon :icon="['fas', 'p']" class="text-white h-6 w-6"></font-awesome-icon>
                </div>
                <div class="flex flex-col items-start justify-between">
                    <span>Parking Space</span>
                    <span>{{ parking_zone?.capacity_total }}</span>
                </div>
            </div>

            <div class="flex flex-row items-center h-[60px] bg-white w-full rounded-md shadow-md gap-4">
                <div class="bg-red-500 flex items-center justify-center h-[90%] w-[50px] mx-1 rounded-md">
                    <font-awesome-icon :icon="['fas', 'r']" class="text-white h-6 w-6"></font-awesome-icon>
                </div>
                <div class="flex flex-col items-start justify-between">
                    <span>Reserved Space</span>
                    <span>{{ parking_zone?.declared_for_app }}</span>
                </div>
            </div>

            <div class="flex flex-row items-center h-[60px] bg-white w-full rounded-md shadow-md gap-4">
                <div class="bg-green-500 flex items-center justify-center h-[90%] w-[50px] mx-1 rounded-md">
                    <font-awesome-icon :icon="['fas', 'o']" class="text-white h-6 w-6"></font-awesome-icon>
                </div>
                <div class="flex flex-col items-start justify-between">
                    <span>Currently Occupied</span>
                    <span>{{ (availabiltiy) ?? "Loading..."
                        }}</span>
                </div>
            </div>

            <div class="flex flex-row items-center h-[60px] bg-white w-full rounded-md shadow-md gap-4">
                <div class="bg-yellow-500 flex items-center justify-center h-[90%] w-[50px] mx-1 rounded-md">
                    <font-awesome-icon :icon="['fas', 'users']" class="text-white h-6 w-6"></font-awesome-icon>
                </div>
                <div class="flex flex-col items-start justify-between">
                    <span>Managers</span>
                    <span>{{ parking_zone?.managers?.length }}</span>
                </div>
            </div>
        </div>

        <div class="flex flex-row gap-4 w-full">
            <IftaLabel>
                <DatePicker v-model="monthFilter" showIcon fluid iconDisplay="input" view="year" dateFormat="yy" />
                <label for="date">Year</label>
            </IftaLabel>
        </div>

        <div class="flex flex-row items-center bg-white p-2 rounded-md shadow-md mt-2" v-if="parkingRecords">
            <ParkingRecordChart :title="`Parking Record ${yearFilter.getFullYear()}`" :data="parkingRecords"
                class="w-[68%]" v-if="parkingRecords" />
            <div class="h-full border-l-2"></div>
            <!-- <TotalVehicleMonthChart title="Vehicle Types Parked" :data="vehicleRecords" class="w-[28%]" /> -->
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import useAuth from '../../scripts/auth';
import ParkingRecordChart from '../../components/OwnerDashboard/ParkingRecordChart.vue';
import { useParkingZone } from '../../scripts/parkingZone';
import api from '../../boot/api';

const { user } = useAuth()
const chart = ref(null)
const { parking_zone } = useParkingZone()
const availabiltiy = ref(null)
const yearFilter = ref(new Date())

const parkingRecords = ref(null)
const vehicleRecords = ref(null)

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


const getEarnings = async () => {
    try {
        const year = yearFilter.value.toLocaleDateString('en-GB', { year: 'numeric' }).replace('/', '-');
        const { data } = await api.get('analytics/parking-zone', { params: { parking_zone_id: parking_zone.value.id, year } });
        console.log(data)
        parkingRecords.value = data.monthly_parking_records.map((item) => {
            return { [item.month]: item.count }
        });
        vehicleRecords.value = data.unique_vehicle_by_type
    } catch (error) {
        console.error('Error fetching earnings:', error);
    }
};

watch(
    parking_zone,
    async (newVal) => {
        if (newVal && !hasRun.value) {
            hasRun.value = true; // Prevent future runs
            await getEarnings()
            await setupRealTimeAvailability(parking_zone.value.id)
        }
    },
    { immediate: true }
);
</script>