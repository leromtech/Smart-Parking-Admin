<template>
    <div class="p-6 w-full h-full bg-black text-white flex flex-col">
        <p class="font-semibold text-xl">Parking Details & History</p>
        <div class="w-full flex flex-row overflow-x-scroll gap-2 mt-2">
            <div class="rounded-full min-w-[33%] flex items-center justify-center p-2"
                :class="selected === filter ? 'bg-[#F0E573] text-black' : 'bg-[#1D1D1D] text-white'"
                v-for="filter in filters" :key="filter" @click="() => { selected = filter }">
                {{ filter }}
            </div>
        </div>
        <!-- Search -->
        <div class="w-full flex flex-row gap-2 mt-4">
            <input type="text" placeholder="Search by Reg No." class="bg-transparent py-2 rounded-lg border w-[50%]">
            <input type="text" placeholder="Search by Token." class="bg-transparent py-2 rounded-lg border w-[50%]">
        </div>
        <template v-if="data.length > 0">
            <div class="flex w-full flex-col rounded-lg">
                <div v-for="_data in data">
                    {{ _data }}
                </div>
            </div>
        </template>
        <template v-else>
            <div class="w-full h-full flex items-center justify-center font-bold">
                NO ITEMS
            </div>
        </template>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '../../boot/api';

const data = ref([])

const filters = [
    'Booking', 'In Parking', 'Completed'
]

const filter = async (val) => {
    const { data } = await api
}

const selected = ref('Booking')

watch(selected, (newFilter) => {
    filter(newFilter)
})

onMounted(async () => {
    const { data } = await api.get('bookings')
    data.value = data.data
})
</script>