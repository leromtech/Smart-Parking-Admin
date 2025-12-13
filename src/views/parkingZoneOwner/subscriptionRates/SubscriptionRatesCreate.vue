<template>
    <form @submit.prevent="submit" class="flex flex-col gap-6">
        <FloatLabel class="mt-6">
            <InputText id="name" v-model="form.name" fluid />
            <label for="name">name <span class="text-red-500">*</span></label>
        </FloatLabel>

        <FloatLabel>
            <Textarea id="description" v-model="form.description" fluid />
            <label for="descriptionß">Description</label>
        </FloatLabel>

        <FloatLabel>
            <Select id="vehicleType" v-model="form.vehicle_type" fluid :options="filteredVehicles" optionLabel="name"
                optionValue="id" />
            <label for="vehicleType">Vehicle Type</label>
        </FloatLabel>

        <InputGroup class="mt-0">
            <InputGroupAddon>₹</InputGroupAddon>
            <InputNumber v-model="form.price" placeholder="Price" mode="currency" currency="INR" :minFractionDigits="2">
            </InputNumber>
        </InputGroup>

        <FloatLabel class="mt-6">
            <InputText id="duration" v-model="form.duration" fluid type="number" />
            <label for="duration">Duration <span class="text-red-500">*</span></label>
        </FloatLabel>

        <FloatLabel>
            <Select id="interval" v-model="form.interval" fluid :options="intervals" />
            <label for="interval">Interval</label>
        </FloatLabel>

        <div class="flex flex-row gap-4">
            <label for="is_active">Active</label>
            <ToggleSwitch v-model="form.is_active"></ToggleSwitch>
        </div>

        <Button :label="isEditing ? 'Update' : 'Submit'" class="mt-2" type="submit"></Button>
    </form>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '../../../boot/api';
import useAuth from '../../../scripts/auth';
import { useToast } from 'primevue';

const intervals = [
    'day', 'week', 'month', 'year'
]

const { user } = useAuth()

const toast = useToast()

const statuses = ['active', 'canceled', 'trailing']

const filteredVehicles = ref([])

const props = defineProps({
    editData: {
        type: Object,
        default: null
    }
})

const isEditing = ref(false)

const form = ref({
    name: null,
    description: null,
    vehicle_type: null,
    price: null,
    duration: 0,
    interval: 'month',
    is_active: true,
})

const emit = defineEmits(['save'])

// Define resetForm before the watch to avoid reference error
const resetForm = () => {
    form.value = {
        name: null,
        description: null,
        vehicle_type: null,
        price: null,
        duration: 0,
        interval: 'month',
        is_active: true,
    }
}

// Watch for editData changes to populate form
watch(() => props.editData, (newData) => {
    if (newData) {
        isEditing.value = true
        form.value = {
            name: newData.name,
            description: newData.description,
            vehicle_type: newData.vehicle_type?.id || newData.vehicle_type,
            price: newData.price,
            duration: newData.duration,
            interval: newData.interval,
            is_active: newData.is_active,
        }
    } else {
        isEditing.value = false
        resetForm()
    }
}, { immediate: true })

const submit = async () => {
    try {
        const fd = new FormData()
        fd.append('name', form.value.name)
        fd.append('description', form.value.description)
        fd.append('price', form.value.price)
        fd.append('vehicle_type_id', form.value.vehicle_type)
        fd.append('duration', form.value.duration)
        fd.append('interval', form.value.interval)
        fd.append('is_active', form.value.is_active)
        fd.append('parking_zone_id', user.value.parking_zone_owned.id)

        let response
        if (isEditing.value) {
            // Update existing subscription rate
            fd.append('_method', 'PUT')
            response = await api.post(`parking-zone/${user.value.parking_zone_owned.id}/subscription-rates/${props.editData.id}`, fd)
        } else {
            // Create new subscription rate
            response = await api.post(`parking-zone/${user.value.parking_zone_owned.id}/subscription-rates`, fd)
        }

        const { data } = response

        toast.add({
            closable: true,
            severity: 'success',
            summary: 'Success',
            detail: isEditing.value ? 'Subscription rate updated successfully' : 'Subscription rate created successfully',
            life: 3000
        })
        emit('save')
    } catch (e) {
        toast.add({
            closable: true,
            severity: 'error',
            summary: 'Failed',
            detail: e.response?.data?.message || 'An error occurred',
            life: 3000
        })
        emit('save')
    }
}

const fetchVehicleTypes = async () => {
    const { data } = await api.get('vehicle-types')
    filteredVehicles.value = data.vehicle_types.data
}

onMounted(async () => {
    await fetchVehicleTypes()
})
</script>