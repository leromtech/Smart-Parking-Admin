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
                    <span>100</span>
                </div>
            </div>

            <div class="flex flex-row items-center h-[60px] bg-white w-full rounded-md shadow-md gap-4">
                <div class="bg-red-500 flex items-center justify-center h-[90%] w-[50px] mx-1 rounded-md">
                    <font-awesome-icon :icon="['fas', 'r']" class="text-white h-6 w-6"></font-awesome-icon>
                </div>
                <div class="flex flex-col items-start justify-between">
                    <span>Reserved Space</span>
                    <span>50</span>
                </div>
            </div>

            <div class="flex flex-row items-center h-[60px] bg-white w-full rounded-md shadow-md gap-4">
                <div class="bg-green-500 flex items-center justify-center h-[90%] w-[50px] mx-1 rounded-md">
                    <font-awesome-icon :icon="['fas', 'o']" class="text-white h-6 w-6"></font-awesome-icon>
                </div>
                <div class="flex flex-col items-start justify-between">
                    <span>Currently Occupied</span>
                    <span>50</span>
                </div>
            </div>

            <div class="flex flex-row items-center h-[60px] bg-white w-full rounded-md shadow-md gap-4">
                <div class="bg-yellow-500 flex items-center justify-center h-[90%] w-[50px] mx-1 rounded-md">
                    <font-awesome-icon :icon="['fas', 'users']" class="text-white h-6 w-6"></font-awesome-icon>
                </div>
                <div class="flex flex-col items-start justify-between">
                    <span>Managers</span>
                    <div class="flex flex-row items-center justify-between gap-8">
                        <span class="flex flex-row items-center gap-2">50 <Tooltip>
                                <template #content>
                                    <span class="p-[0.30rem] bg-green-500 rounded-full border"></span>
                                </template>

                                <template #tooltip>
                                    Active
                                </template>
                            </Tooltip></span>

                        <span class="flex flex-row items-center gap-2">50 <Tooltip>
                                <template #content>
                                    <span class="p-[0.30rem] bg-neutral-400 rounded-full border"></span>
                                </template>

                                <template #tooltip>
                                    Inactive
                                </template>
                            </Tooltip></span>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-row items-center bg-white p-2 rounded-md shadow-md mt-2">
            <ParkingRecordChart title="Parking Record (this month)" :data="dataP" class="w-[68%]" />
            <div class="h-full border-l-2"></div>
            <TotalVehicleMonthChart title="Vehicle Types Parked" :data="dataD" class="w-[28%]" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import useAuth from '../../scripts/auth';
import ParkingRecordChart from '../../components/OwnerDashboard/ParkingRecordChart.vue';
import TotalVehicleMonthChart from '../../components/OwnerDashboard/TotalVehicleMonthChart.vue';
import Tooltip from '../../components/tooltip.vue';

const { user } = useAuth()
const chart = ref(null)

const dataD = [
    { 'Two Wheeler': 26 },
    { 'Four Wheeler': 12 },
]

const dataP = [
    [
        { 'Aug 2025': 100 },
        { 'Sept 2025': 78 },
        { 'Oct 2025': 56 },
        { 'Nov 2025': 76 },
    ]
]
</script>