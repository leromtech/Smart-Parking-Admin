<template>
    <div class="p-6 w-full h-full bg-black text-white flex flex-col">
        <p class="font-semibold text-xl">{{ user.parking_zone_managed[0].name }}</p>
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
            <input type="text" placeholder="Search by Reg No."
                class="bg-transparent py-2 rounded-lg border w-[50%] px-2">
            <input type="text" placeholder="Search by Token."
                class="bg-transparent py-2 rounded-lg border w-[50%] px-2">
        </div>
        <template v-if="data.length > 0">
            <div class="flex w-full flex-col rounded-lg items-center gap-4 mt-4">
                <div v-for="_data in data" class="w-full p-4 bg-[#242424] rounded-lg">
                    <p>{{ _data.vehicle.registration_no }}</p>
                    <p>{{ _data.vehicle_type.name }}</p>
                    <div class="flex flex-row items-center justify-between">
                        <p>{{ _data.start_time }}</p>
                        <p class="text-blue-500">{{ formatTime(_data.elapsedTime) }}</p>
                    </div>
                    <div class="flex flex-row gap-2 mt-2">
                        <button class="w-full p-1 border rounded-lg">Details</button>
                        <button class="w-full p-1 border rounded-lg" @click="() => checkOut(_data)">Check Out</button>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="w-full h-full flex items-center justify-center font-bold">
                NO ITEMS
            </div>
        </template>

        <Modal v-model="checkoutOpen" class="flex bg-[#242424] p-6 flex-col w-[95%] text-[#919191] rounded-lg">
            <p class="font-semibold text-xl mb-5 text-white">Parking Details</p>
            <div class="flex flex-row items-center justify-between w-full">
                <p>Vehicle Registration Number</p>
                <p>{{ checkOutItem.vehicle.registration_no }}</p>
            </div>
            <div class="flex flex-row items-center justify-between w-full">
                <p>Vehicle Type</p>
                <p>{{ checkOutItem.vehicle_type.name }}</p>
            </div>
            <div class="w-full border-t my-3"></div>
            <div class="flex flex-row items-center justify-between w-full">
                <p>Entry Time</p>
                <p>{{ checkOutItem.start_time }}</p>
            </div>
            <div class="flex flex-row items-center justify-between w-full">
                <p>Exit Time</p>
                <p>{{ formatDateTime(Date.now()) }}</p>
            </div>
            <div class="flex flex-row items-center justify-between w-full">
                <p>Total Time</p>
                <p>{{ formatTime(checkOutItem.elapsedTime) }}</p>
            </div>
            <div class="w-full border-t my-3"></div>
            <div class="flex flex-row items-center justify-between w-full">
                <p>Total Amount</p>
                <p> Rs. {{ totalAmount.toLocaleString() }}</p>
            </div>
            <div class="mt-4">
                <p class="font-semibold text-xl mb-2 text-white">Payment Details</p>
                <div class="flex flex-row gap-5 my-4 text-lg">
                    <input id='cash' type="radio" class="p-2" v-model="paymentMethod" value="cash">
                    <label for="cash">Cash</label>
                </div>
                <div class="flex flex-row gap-5 my-4 text-lg">
                    <input id="upi" type="radio" class="p-2" v-model="paymentMethod" value="upi">
                    <label for="upi">UPI</label>
                </div>
            </div>
            <button class="p-2 w-full rounded-2xl bg-blue-700 text-white text-lg font-semibold mt-6">Confirm
                Check-Out</button>
        </Modal>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import api from '../../boot/api';
import Modal from '../../components/Modal.vue';
import useAuth from '../../scripts/auth';

const data = ref([])

const { user } = useAuth()
const paymentMethod = ref('cash')
const totalAmount = ref()
const checkOutItem = ref({})
const checkoutOpen = ref(false)

const filters = [
    'Booking', 'In Parking', 'Completed'
]

const filter = async (val) => {
    console.log(val)
    let url
    let filters
    switch (val) {
        case 'Booking':
            url = 'bookings'
            break
        case 'In Parking':
            url = 'parking-record'
            filters = { in_parking: true }
            break
        case 'Completed':
            url = 'parking-record'
            filters = { completed: true }
    }
    const response = await api.get(url, { params: { 'filters': filters } })
    data.value = response.data.data.map((item) => {
        const startTime = new Date(item.start_time)
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000)
        return { ...item, elapsedTime }
    })

    beginInterval()
}

const selected = ref('Booking')

watch(selected, async (newFilter) => {
    await filter(newFilter)
})

let timer = null

const beginInterval = () => {
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
        data.value = data.value.map((record) => {
            return { ...record, elapsedTime: record.elapsedTime + 1 }
        })
    }, 1000)
}

const formatTime = (seconds) => {
    const days = Math.floor(seconds / 86400); // 86400 seconds in a day
    const hours = Math.floor((seconds % 86400) / 3600); // Remaining hours
    const minutes = Math.floor((seconds % 3600) / 60); // Remaining minutes
    const secs = seconds % 60; // Remaining seconds

    const dStr = days > 0 ? days.toString() : '0';
    const hStr = hours.toString().padStart(2, '0');
    const mStr = minutes.toString().padStart(2, '0');
    const sStr = secs.toString().padStart(2, '0');

    return `${dStr} D ${hStr} H ${mStr} m ${sStr} s`;
};

function formatDateTime(timestamp) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const getTotal = async () => {
    const { data } = await api.get('payments/get-total', {
        params: {
            parking_record_id: checkOutItem.value.id
        }
    })
    totalAmount.value = data
}

const checkOut = async (record) => {
    checkOutItem.value = record
    checkoutOpen.value = true
    await getTotal()
}

onMounted(async () => {
    const { data } = await api.get('bookings')
    data.value = data.data
})

onUnmounted(() => {
    clearInterval(timer)
})
</script>