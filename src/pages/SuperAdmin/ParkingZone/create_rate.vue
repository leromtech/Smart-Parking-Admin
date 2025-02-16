<template>
    <div @click.stop class="bg-white p-8 rounded-md">
        <p class="text-xl font-semibold">
            CREATE RATE
        </p>
        <form @submit.prevent="submit" class="flex flex-col">
            <div class="flex flex-row gap-4">
                <div class="w-full h-full">
                    <select v-model="form.vehicle_type_id" class="p-4 w-full">
                        <option value="" disabled hidden>Select A Vehicle Type</option>
                        <option v-for="type in vehicle_types" :key="type.value" :value="type.value">
                            {{ type.label }}
                        </option>
                    </select>
                    <div class="w-full flex items-center justify-center text-red-600 font-normal">
                        {{ message }}
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center justify-end w-full mt-4">
                <button class="p-3 bg-blue-500 text-white rounded-sm hover:bg-blue-600">SUBMIT</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../../../boot/api';
import useNotification from '../../../scripts/notification';

const { notify } = useNotification()

const props = defineProps(['parkingZoneId'])
const message = ref('')
const form = ref({
    vehicle_type_id: '',
    parking_zone_id: ''
})

const emits = defineEmits(['close'])

const vehicle_types = ref(null)

const getVehicleTypes = async () => {
    const { data } = await api.get('vehicle-types')
    vehicle_types.value = data.vehicle_types.data.map((element) => {
        return { value: element.id, label: element.name }
    })
    console.log(vehicle_types.value)
}

const submit = async () => {
    const fd = new FormData()
    fd.append('vehicle_type', form.value.vehicle_type_id)
    fd.append('parking_zone_id', form.value.parking_zone_id)
    const { data } = await api.post('rates', fd)
    if (data.success) {
        emits('close')
        notify({ type: 'success', message: 'Rate created successfully' })
    } else {
        message.value = data.message
    }
}

onMounted(async () => {
    form.value.parking_zone_id = props.parkingZoneId
    await getVehicleTypes()
})

</script>