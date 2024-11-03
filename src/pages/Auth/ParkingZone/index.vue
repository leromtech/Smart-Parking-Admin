<template>
    <div class="flex flex-col gap-2">
        <div v-if="form" class="flex flex-row gap-4 items-center">
            <p class="font-semibold text-xl" v-if="!editing_name">
                {{ form.name }}
            </p>
            <input type="text" v-model="form.name" v-else class="p-2 border">
            <font-awesome-icon :icon="['fas', 'pen-to-square']" class="w-5 h-5 hover:text-neutral-700 cursor-pointer"
                @click="() => editing_name = !editing_name" v-if="!editing_name" />
            <div v-else>
                <font-awesome-icon :icon="['fas', 'check']" class="w-5 h-5 hover:text-neutral-700 cursor-pointer"
                    @click="saveParkingZone" />
                <font-awesome-icon :icon="['fas', 'close']" class="w-5 h-5 text-red-700 cursor-pointer"
                    @click="() => editing_name = false" />
            </div>
        </div>
        <div class="border flex flex-col">
            <div class="flex flex-col p-2">
                <div class="flex flex-row justify-between">
                    <p class="font-semibold">RATES</p>
                    <button class="border bg-blue-400 hover:bg-blue-500 text-white rounded-md px-2 py-1"
                        @click="createRate">ADD</button>
                </div>
                <div class="border m-2 bg-stone-200">
                    <div v-for="rate, rateIndex in rates" :key="rate.id" class="p-2 border m-2 bg-white">
                        <div class="border-b flex flex-row justify-between items-center pb-2">
                            <p>
                                {{ rate.vehicle_type.name.toUpperCase() }}
                            </p>
                            <div class="flex gap-2">
                                <button class="border bg-blue-400 hover:bg-blue-500 text-white rounded-md px-2 py-1"
                                    @click="updateInterval">SAVE</button>
                                <font-awesome-icon :icon="['far', 'trash-can']"
                                    class="text-red-700 w-5 h-5 mt-2 hover:text-red-500 "
                                    @click="() => openDeleteRate(rate.id)" />
                            </div>
                        </div>
                        <div class="b-2 p-1">
                            <div class="justify-between flex font-normal text-stone-500">
                                <p>DURATION</p>
                                <p>INTERVAL</p>
                                <p>RATE AMOUNT</p>
                            </div>
                        </div>
                        <div v-for="(interval, intervalIndex) in rate.intervals" :key="interval.id || intervalIndex"
                            class="p-1 justify-between flex gap-4">
                            <input type="text" v-model="rates[rateIndex].intervals[intervalIndex].duration"
                                class="border rounded-sm p-1 w-full text-center">
                            <select v-model="rates[rateIndex].intervals[intervalIndex].interval"
                                class="border rounded-sm p-1 w-full text-center">
                                <option v-for="interval_option in interval_options" :key="interval_option.label"
                                    :value="interval_option.label">
                                    {{ interval_option.label }}
                                </option>
                            </select>
                            <input type="text" v-model="rates[rateIndex].intervals[intervalIndex].rate_amount"
                                class="border rounded-sm p-1 w-full text-center">
                            <font-awesome-icon :icon="['far', 'trash-can']"
                                class="text-red-700 w-5 h-5 mt-2 hover:text-red-500"
                                @click="interval.isNew ? discardInterval(rate.id, intervalIndex) : openDeleteInterval(interval.id)" />
                        </div>

                        <div class="border p-2 w-full flex items-center justify-center hover:bg-slate-200"
                            @click="() => createNewInterval(rate.id)">
                            <font-awesome-icon :icon="['fas', 'fa-plus']" class="text-gray-700 w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- PAYMENT SETTINGS -->

        <div class="p-2 border">
            <div class="flex flex-row justify-between border-b">
                <p class="font-semibold">PAYMENT SETTINGS</p>
            </div>
            <div class="flex flex-col items-center justify-center p-2">
                <div class="w-[300px] h-[300px] bg-slate-200">
                    <img :src="qr_code" alt="QR CODE" class="text-center w-full h-full">
                </div>
                <input type="file" accept="image/*" class="mt-2">
            </div>
        </div>

        <!-- MODALS -->
        <Modal v-model:open="openCreateRate">
            <create_rate :parking-zone-id="parking_zone_id"
                @close="async () => { await getRates(); openCreateRate = !openCreateRate }"></create_rate>
        </Modal>

        <Modal v-model:open="open_delete_rate">
            <div class="bg-white p-6">
                <p>DELETE</p>
                <p>Are you sure you want to delete the rate?</p>
                <div class="w-full flex items-center justify-end mt-4">
                    <button @click="confirmDeleteRate" class="bg-red-500 text-white p-2 px-4">Confirm</button>
                </div>
            </div>
        </Modal>

        <Modal v-model:open="open_delete_interval">
            <div class="bg-white p-6">
                <p>DELETE</p>
                <p>Are you sure you want to delete the rate interval?</p>
                <div class="w-full flex items-center justify-end mt-4">
                    <button @click="confirmDeleteInterval" class="bg-red-500 text-white p-2 px-4">Confirm</button>
                </div>
            </div>
        </Modal>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../../../boot/api';
import useAuth from '../../../scripts/auth';
import Modal from '../../../components/Modal.vue';
import create_rate from './create_rate.vue';
import useNotification from '../../../scripts/notification';

const { parking_zone_id } = useAuth()

const { notify } = useNotification()

const openCreateRate = ref(false)
const open_delete_rate = ref(false)
const open_delete_interval = ref(false)

const qr_code = ref(null)

const interval_options = ref(null)

const form = ref(null)

const rates = ref(null)

const rateToDelete = ref(null)
const intervalToDelete = ref(null)

const editing_name = ref(false)

const createRate = () => {
    openCreateRate.value = !openCreateRate.value
}

const openDeleteRate = (id) => {
    rateToDelete.value = id
    open_delete_rate.value = true
}

const confirmDeleteRate = async () => {
    const fd = new FormData()
    fd.append('_method', 'DELETE');
    const { data } = await api.delete(`rates/${rateToDelete.value}`)

    notify({ type: 'success', message: data.message })
    rateToDelete.value = null
    await getRates()
}

const openDeleteInterval = (id) => {
    open_delete_interval.value = true
    intervalToDelete.value = id
}

const confirmDeleteInterval = async () => {
    const fd = new FormData()
    fd.append('_method', 'DELETE');
    const { data } = await api.delete(`rate-intervals/${intervalToDelete.value}`)

    notify({ type: 'success', message: data.message })
    intervalToDelete.value = null
    await getRates()
}

const discardInterval = (rateId, intervalIndex) => {
    const rate = rates.value.find(r => r.id === rateId);
    if (rate && rate.intervals[intervalIndex].isNew) {
        rate.intervals.splice(intervalIndex, 1);
    }
};

const createNewInterval = (rateId) => {
    const rate = rates.value.find(r => r.id === rateId);
    if (rate) {
        rate.intervals.push({
            duration: '',
            interval: '',
            rate_amount: '',
            id: null, // No ID means it hasn't been saved to the server
            rate_id: rateId,
            isNew: true, // This helps identify unsaved intervals
        });
    }
};


const updateInterval = async () => {
    for (let rate of rates.value) {
        for (let interval of rate.intervals) {
            if (interval.id === null) {
                // Handle the addition of new intervals
                const { data } = await api.post('rate-intervals', {
                    rate_id: interval.rate_id,
                    duration: interval.duration,
                    interval: interval.interval,
                    rate_amount: interval.rate_amount,
                    parking_zone_id: parking_zone_id.value
                });
                console.log(data)
            } else {
                // Update existing intervals
                const fd = new FormData();
                for (let key in interval) {
                    fd.append(key, interval[key]);
                }
                fd.append('_method', 'PATCH');
                await api.post(`rate-intervals/${interval.id}`, fd);
            }
        }
    }
    notify({ type: 'success', message: 'Intervals updated successfully' });
    await getRates();
};

const saveParkingZone = async () => {
    const fd = new FormData()
    for (let key in form.value) {
        fd.append(key, form.value[key])
    }
    fd.append('_method', 'PATCH')
    const { data } = await api.post(`parking-zones/${parking_zone_id.value}`, fd);
}

const getRates = async () => {
    const { data } = await api.get('rates', {
        params: {
            'parking_zone_id': parking_zone_id.value
        }
    })
    rates.value = data
}

const getIntervalSettings = async () => {
    const { data } = await api.get('settings', {
        params: {
            key: "intervals"
        }
    })
    interval_options.value = Object.keys(data.value).map(item => {
        return { label: item, value: data.value[item] }
    })
}

onMounted(async () => {
    const { data } = await api.get(`parking-zones/${parking_zone_id.value}`)
    form.value = data
    await getRates()
    await getIntervalSettings()
})
</script>