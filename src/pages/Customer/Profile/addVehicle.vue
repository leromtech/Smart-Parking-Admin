<template>
    <div class="flex flex-col w-full h-screen bg-[#0B0B0B] p-8 text-white">
        <p class="text-[24px] font-normal mt-2">ADD VEHICLE</p>

        <p class="mt-4">Vehicle Type</p>
        <select class="border bg-[#0B0B0B] border-[#8B8B8B] p-3 mt-2 rounded-lg" v-model="form.vehicle_type_id">
            <option v-for="option in vehicle_type_options" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>

        <label class="mt-8">Vehicle Registration No.</label>
        <input type="text" v-model="form.registration_no"
            class="p-2 border border-[#8B8B8B] bg-[#0B0B0B] rounded-lg mt-2">

        <button class="bg-[#7F00FF] p-2 rounded-full mt-auto" @click="submit">Submit</button>
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