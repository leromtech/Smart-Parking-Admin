<template>
    <div class="flex flex-col gap-2" v-if="form">
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

        <!-- GENERAL -->

        <div class="border flex flex-col p-2">
            <div class="flex flex-row justify-between items-center border-b py-2">
                <p class="font-semibold">GENERAL</p>
                <button class="border bg-blue-400 hover:bg-blue-500 text-white rounded-md px-2 py-1"
                    @click="saveParkingZone">SAVE</button>
            </div>
            <div class="flex flex-col">
                <div class="flex items-center py-2 gap-4">
                    <p>CAPACITY :</p>
                    <input type="text" v-model="form.capacity_total" class="p-1 border">
                </div>
                <div class="flex items-center py-2 gap-4">
                    <p>RESERVED:</p>
                    <input type="text" v-model="form.capacity_total" class="p-1 border">
                </div>
            </div>
        </div>

        <!-- BOOKING RATES -->
        <div class="border flex flex-col">
            <div class="flex flex-row justify-between">
                <p class="font-semibold">BOOKING RATES</p>
                <button class="border bg-blue-400 hover:bg-blue-500 text-white rounded-md px-2 py-1"
                    @click="createBookingRate">ADD</button>
            </div>
            <div class="border m-2 bg-stone-200" v-if="bookingRates.length > 0">
                <div class="b-2 p-1 bg-white px-8">
                    <div class="justify-between flex font-normal text-stone-500">
                        <p>FROM</p>
                        <p>TO</p>
                        <p>RATE AMOUNT</p>
                    </div>
                </div>
                <div v-for="rate, rateIndex in bookingRates" :key="rate.id" class="p-2 border m-2 bg-white">

                    <div class="p-1 justify-between flex gap-4">
                        <p class="w-full text-center border py-2">{{ rate.from }}</p>
                        <p class="w-full text-center border py-2">{{ rate.to }}</p>
                        <p class="w-full text-center border py-2">{{ rate.rate_amount }}</p>
                        <font-awesome-icon :icon="['far', 'trash-can']"
                            class="text-red-700 w-5 h-5 mt-2 hover:text-red-500"
                            @click="() => deleteBookingRate(rate.id)" />
                    </div>
                </div>
            </div>
            <div class="border m-2 bg-stone-200 pl-4" v-else>
                NO ITEMS
            </div>
        </div>

        <!--PARKING RATES -->
        <div class="border flex flex-col">
            <div class="flex flex-col p-2">
                <div class="flex flex-row justify-between">
                    <p class="font-semibold">PARKING RATES</p>
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
            <div class="flex flex-row items-center justify-between border-b">
                <p class="font-semibold">PAYMENT SETTINGS</p>
                <button class="border bg-blue-400 hover:bg-blue-500 text-white rounded-md px-2 py-1"
                    @click="saveParkingZone">SAVE</button>
            </div>
            <div class="flex flex-col items-start justify-evenly p-2 gap-4">
                <dInput label="UPI ID" placeholder="xyz@iciciok" v-model="form.upi_id" class="w-[300px]" />

                <div class="w-[300px] h-[300px] bg-slate-200" v-if="qr_code">
                    <img :src="qr_code" alt="QR CODE" class="text-center w-full h-full">
                    <!-- <input type="file" accept="image/*" class="mt-2" @change="setFile"> -->
                </div>

            </div>
        </div>

        <!-- MANAGERS -->

        <div class="p-2 border">
            <div class="flex flex-row items-center justify-between border-b">
                <p class="font-semibold">MANAGERS</p>
                <button class="border bg-blue-400 hover:bg-blue-500 text-white rounded-md px-2 py-1"
                    @click="addManager">ADD</button>
            </div>
            <d-table :columns="manager_columns" :rows="form.managers" :pagination="pagination">
                <template #actions="{ row }">
                    <td align="right" class="py-4">
                        <div class="flex flex-row items-center justify-end pr-2 gap-2">
                            <button @click="() => deleteManager(row.laravel_through_key)"
                                class="rounded-full hover:bg-slate-100">
                                <font-awesome-icon :icon="['far', 'trash-can']"
                                    class="text-red-700 w-5 h-5 hover:text-red-500 " />
                            </button>
                        </div>
                    </td>
                </template>
            </d-table>
        </div>

        <!-- MODALS -->
        <Modal v-model="openCreateRate">
            <create_rate :parking-zone-id="parking_zone_id"
                @close="async () => { await getRates(); openCreateRate = !openCreateRate }"></create_rate>
        </Modal>

        <Modal v-model="open_create_manager">
            <create_manager :parking-zone-id="parking_zone_id"
                @close="async () => { await getParkingZone(); open_create_manager = !open_create_manager }">
            </create_manager>
        </Modal>

        <Modal v-model="open_delete_capacity">
            <div class="bg-white p-6">
                <p>DELETE</p>
                <p>Are you sure you want to delete the capacity?</p>
                <div class="w-full flex items-center justify-end mt-4">
                    <button @click="confirmDeleteCapacity" class="bg-red-500 text-white p-2 px-4">Confirm</button>
                </div>
            </div>
        </Modal>

        <Modal v-model="open_delete_rate">
            <div class="bg-white p-6">
                <p>DELETE</p>
                <p>Are you sure you want to delete the rate?</p>
                <div class="w-full flex items-center justify-end mt-4">
                    <button @click="confirmDeleteRate" class="bg-red-500 text-white p-2 px-4">Confirm</button>
                </div>
            </div>
        </Modal>

        <Modal v-model="open_delete_interval">
            <div class="bg-white p-6">
                <p>DELETE</p>
                <p>Are you sure you want to delete the rate interval?</p>
                <div class="w-full flex items-center justify-end mt-4">
                    <button @click="confirmDeleteInterval" class="bg-red-500 text-white p-2 px-4">Confirm</button>
                </div>
            </div>
        </Modal>

        <Modal v-model="open_delete_manager">
            <div class="bg-white p-6">
                <p>DELETE</p>
                <p>Are you sure you want to delete the manager?</p>
                <div class="w-full flex items-center justify-end mt-4">
                    <button @click="confirmDeleteManager" class="bg-red-500 text-white p-2 px-4">Confirm</button>
                </div>
            </div>
        </Modal>

        <Modal v-model="open_booking_rate_add">
            <div class="bg-white p-6 flex gap-4 flex-col">
                <p>ADD BOOKING RATE</p>
                <div class="flex flex-col">
                    <label for="from">From</label>
                    <div class="flex flex-row gap-2">
                        <input type="time" v-model="booking_rate_form.from" class="p-2 border w-full">
                    </div>
                </div>
                <div class="flex flex-col">
                    <label for="to">To</label>
                    <div class="flex flex-row gap-2">
                        <input type="time" v-model="booking_rate_form.to" class="p-2 border w-full">
                    </div>
                </div>
                <div class="flex flex-col">
                    <label for="rate-amount">Rate Amount</label>
                    <div class="flex flex-row gap-2 items-center relative">
                        <p
                            class="border border-slate-300 absolute bg-slate-50 h-full flex items-center justify-center px-2">
                            ₹
                        </p>
                        <input type="text" id="rate-amount" class="p-2 border pl-8"
                            v-model="booking_rate_form.rate_amount">
                    </div>
                </div>
                <button class="p-2 w-full bg-blue-600 text-white rounded-md" @click="submitBookingRate">SUBMIT</button>
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
import dInput from '../../../components/d-input.vue';
import useNotification from '../../../scripts/notification';
import Create_manager from './create_manager.vue';

const { parking_zone_id } = useAuth()

const { notify } = useNotification()

const manager_columns = [
    { name: 'name', label: 'NAME', field: 'name' },
    { name: 'email', label: 'EMAIL', field: 'email' },
    { name: 'phone', label: 'PHONE', field: 'phone' },
]

const openCreateRate = ref(false)
const open_delete_rate = ref(false)
const open_delete_interval = ref(false)
const open_create_manager = ref(false)
const open_delete_manager = ref(false)
const open_delete_capacity = ref(false)
const open_booking_rate_add = ref(false)

const qr_code = ref(null)

const interval_options = ref(null)

const form = ref(null)

const rates = ref(null)

const rateToDelete = ref(null)
const intervalToDelete = ref(null)
const managerToDelete = ref(null)
const capacityToDelete = ref(null)

const bookingRates = ref([])
const bookingRateForm = ref()

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

const getVehicleTypeLabel = (vehicleTypeId) => {
    const type = vehicle_types.value.find(vt => vt.value === vehicleTypeId);
    return type ? type.label : 'Unknown';
};

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

    notify({ type: 'success', message: data.message })
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


const addCapacity = () => {
    form.value.parking_capacity.push({
        id: null,
        parking_zone: parking_zone_id.value,
        vehicle_type_id: '',
        capacity: '',
        reserved: false
    })
}

const vehicle_types = ref(null)

const getVehicleTypes = async () => {
    const { data } = await api.get('vehicle-types')
    vehicle_types.value = data.vehicle_types.data.map((element) => {
        return { value: element.id, label: element.name }
    })
}

const saveCapacity = async () => {
    for (let capacity of form.value.parking_capacity) {
        console.log(capacity)
        if (capacity.id == null) {
            const { data } = await api.post(`parking-zone/${parking_zone_id.value}/parking-capacity`, {
                parking_zone_id: parking_zone_id.value,
                vehicle_type_id: capacity.vehicle_type_id,
                capacity: capacity.capacity,
                reserved: capacity.reserved
            })
            notify({ type: 'error', message: data.message })
        } else {
            const fd = new FormData()
            for (let key in capacity) {
                fd.append(key, capacity[key])
            }
            fd.append('_method', 'PATCH')
            const { data } = await api.post(`parking-zone/${parking_zone_id.value}/parking-capacity/${capacity.id}`, fd)

            notify({ type: 'success', message: data.message })
        }
    }
    await getParkingZone()
}

const setFile = (e) => {
    const file = e.target.files[0];
    if (file) {
        qr_code.value = URL.createObjectURL(file);
        const fd = new FormData();
        fd.append('qr_code', file);
        api.post(`payment-qr/${parking_zone_id.value}`, fd);
    }
};

const getQrCode = async () => {
    const { data } = await api.get('payment-qr', { params: { parking_zone_id: parking_zone_id.value } })
    qr_code.value = data
}

const addManager = () => {
    open_create_manager.value = true
}

const getParkingZone = async () => {
    const { data } = await api.get(`parking-zones/${parking_zone_id.value}`)
    form.value = data
}

const deleteManager = (id) => {
    open_delete_manager.value = true
    managerToDelete.value = id
}

const confirmDeleteManager = async () => {
    const fd = new FormData()
    fd.append('_method', "DELETE")
    const { data } = await api.post(`managers/${managerToDelete.value}`, fd)

    notify({ type: 'success', message: data.message })
    await getParkingZone()
}

const openDeleteCapacity = (id) => {
    capacityToDelete.value = id
    open_delete_capacity.value = true
}

const confirmDeleteCapacity = async () => {
    const fd = new FormData()
    fd.append('_method', "DELETE")
    const { data } = await api.post(`parking-zone/${parking_zone_id.value}/parking-capacity/${capacityToDelete.value}`, fd)

    notify({ type: 'success', message: data.message })
    await getParkingZone()
}

const booking_rate_form = ref({
    id: null,
    from: '',
    to: '',
    rate_amount: 0,
})

const getBookingRates = async () => {
    const { data } = await api.get(`booking-rates`)
    bookingRates.value = data
}

const createBookingRate = () => {
    open_booking_rate_add.value = true
}

const submitBookingRate = async () => {
    const fd = new FormData()
    if (booking_rate_form.value.id !== null) {
        fd.append('_METHOD', 'PATCH')
    }
    fd.append('from', booking_rate_form.value.from)
    fd.append('to', booking_rate_form.value.to)
    fd.append('rate_amount', booking_rate_form.value.rate_amount)
    const { data } = await api.post('booking-rates', fd)
    notify({ type: data.success, message: data.message })
    await getBookingRates()
}

const deleteBookingRate = async (id) => {
    const fd = new FormData()
    fd.append('_method', 'DELETE')
    const { data } = await api.post(`booking-rates/${id}`, fd)
    notify({ type: data.success, message: data.message })
    await getBookingRates()
}

onMounted(async () => {
    await getParkingZone()
    await getRates()
    await getIntervalSettings()
    await getVehicleTypes()
    await getQrCode()
    await getBookingRates()
})
</script>