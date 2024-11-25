<template>
    <div class="flex flex-col w-full h-screen bg-[#0B0B0B] p-8 text-white">
        <p class="text-[24px] font-normal mt-2">ENTER DETAILS</p>
        <div class="w-full flex flex-col mt-4">
            <label for="phone">Phone No.</label>
            <input type="text" max="10" v-model="_form.phone"
                class="p-2 border border-[#8B8B8B] bg-[#0B0B0B] rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-[#7F00FF] tracking-[0.8rem] text-center">
        </div>

        <template v-if="!newVehicleToggle">
            <label for="vehicleType" class="mt-8 font-semibold">Select your vehicle</label>
            <div v-for="vehicle in user.vehicle" class="flex flex-row gap-6 mt-2" v-if="user">
                <input type="radio" :id="vehicle.registration_no" v-model="_form.vehicle_registration_no"
                    :value="vehicle.registration_no" @change="() => inferVehicleType(vehicle.vehicle_type.id)">
                <label :for="vehicle.registration_no">{{ vehicle.registration_no }}</label>
            </div>
        </template>

        <div class="w-full mt-6 flex flex-row items-center gap-4">
            <p v-if="newVehicleToggle">Vehicle already registered?</p>
            <p v-else>Not in the list?</p>
            <button :class="['border-[#7F00FF] border p-1 rounded-lg', newVehicleToggle ? 'bg-[#7F00FF]' : 'bg-none']"
                @click="toggleNewVehicle">Click
                here</button>
        </div>

        <label for="vehicleType" class="mt-6 font-semibold">Select your vehicle type</label>
        <select name="VehicleType" v-if="vehiceTypes" v-model="_form.vehicle_type" :disabled="!newVehicleToggle"
            class="p-3 border border-[#8B8B8B] bg-[#0B0B0B] rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-[#7F00FF]">
            <option v-for="vehicleType in vehiceTypes" :value="vehicleType.id" :key="vehicleType.id">
                {{ vehicleType.name }}
            </option>
        </select>

        <template v-if="newVehicleToggle">
            <label for="newRegistration" class="mt-4">Vehicle Registration No.</label>
            <input type="text" v-model="_form.vehicle_registration_no"
                class="p-2 border border-[#8B8B8B] bg-[#0B0B0B] rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-[#7F00FF]" />
        </template>

        <button class="border-[#7F00FF] border p-2 rounded-lg mt-6" @click="submit">Continue</button>

        <div v-if="error" class="text-red-600 w-full flex items-center justify-center">
            {{ error }}
        </div>

        <div v-if="loading"
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-10 bg-[#1D1D1D] rounded-lg items-center justify-center flex flex-col gap-2">

            <font-awesome-icon :icon="['fas', 'spinner']" spin-pulse class="w-8 h-8" />
            <p>
                Please Wait
            </p>
        </div>

        <div v-if="success"
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-10 bg-[#1D1D1D] rounded-lg items-center justify-center flex flex-col gap-2">
            <p>
                Successful!
            </p>
        </div>

    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '../../../boot/api';
import useParking from '../../../scripts/parking';
import useAuth from '../../../scripts/auth';
import router from '../../../routes/router';

const { form } = useParking()
const { user } = useAuth()

const newVehicleToggle = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const vehiceTypes = ref([])

const _form = ref({
    phone: '',
    parking_zone_id: '',
    vehicle_registration_no: '',
    vehicle_type: ''
})

const inferVehicleType = (id) => {
    _form.value.vehicle_type = id
}

const toggleNewVehicle = () => {
    newVehicleToggle.value = !newVehicleToggle.value
    _form.value.vehicle_registration_no = ''
    _form.value.vehicle_type = ''
}

const getVehicleType = async () => {
    const { data } = await api.get('vehicle-types')
    vehiceTypes.value = data.vehicle_types.data
}

const submit = async () => {

    error.value = ''
    if (_form.value.vehicle_registration_no === '') {
        error.value = 'Vehicle registration number is required'
        return
    }

    if (_form.value.vehicle_type === '') {
        error.value = 'Vehicle type no is required'
        return
    }

    const fd = new FormData()
    fd.append('parking_zone_id', _form.value.parking_zone_id)
    fd.append('phone_no', _form.value.phone)
    fd.append('vehicle_type', _form.value.vehicle_type)
    fd.append('vehicle_registration_no', _form.value.vehicle_registration_no)
    const url = 'parking/initiate'
    loading.value = true
    const { data } = await api.post(url, fd)
    loading.value = false
    success.value = data.success
    if (success.value) {
        setTimeout(() => {
            router.push('/customer/profile')
        }, 3000)
    }
}

onMounted(() => {
    if (form.value.parking_zone_id == null) {
        router.back()
    }
    console.log(form.value)
    _form.value.phone = user.value.phone
    _form.value.parking_zone_id = form.value.parking_zone_id
    getVehicleType()
})
</script>