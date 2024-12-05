<template>
    <div class="flex flex-col w-full h-screen bg-[#0B0B0B] p-8 text-white gap-4">
        <span class="text-lg font-semibold">ENTRY</span>
        <router-link to="scan/check-in"
            class="w-full items-center justify-center flex bg-green-500 md:py-[5%] py-[20%] rounded-lg gap-2">
            <font-awesome-icon :icon="['fas', 'qrcode']" class="text-[#ffffff] w-6 h-6" />
            <p>Check-In</p>
        </router-link>
        <router-link to="scan/check-out"
            class="w-full items-center justify-center flex bg-red-500 md:py-[5%] py-[20%] rounded-lg gap-2">
            <font-awesome-icon :icon="['fas', 'qrcode']" class="text-[#ffffff] w-6 h-6" />
            <p>Check-Out</p>
        </router-link>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../../../boot/api';
import useAuth from '../../../scripts/auth';
import useNotification from '../../../scripts/notification';

const { notify } = useNotification()

const vehicle_type_options = ref([])
const { user } = useAuth()

const form = ref({
    vehicle_type_id: '',
    registration_no: ''
})

const submit = async () => {
    const fd = new FormData()
    fd.append('vehicle_type', form.value.vehicle_type_id)
    fd.append('registration_no', form.value.registration_no)
    fd.append('user_id', user.value.id)
    const { data } = await api.post('vehicles', fd)

    notify({ type: 'success', message: data.message })
}

const getVehicleTypes = async () => {
    const { data } = await api.get('vehicle-types')
    vehicle_type_options.value = data.vehicle_types.data.map((item) => {
        return { label: item.name, value: item.id }
    })
}

onMounted(() => {
    getVehicleTypes()
})
</script>