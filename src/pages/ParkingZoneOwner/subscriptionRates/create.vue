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
            <InputGroupAddon>$</InputGroupAddon>
            <InputNumber v-model="form.price" placeholder="Price">
            </InputNumber>
        </InputGroup>

        <div class="flex flex-row gap-4">
            <label for="is_active">Active</label>
            <ToggleSwitch v-model="form.is_active"></ToggleSwitch>
        </div>

        <Button label="Submit" class="mt-2" type="submit"></Button>
    </form>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '../../../boot/api';
import useAuth from '../../../scripts/auth';
import { useToast } from 'primevue';

const { user } = useAuth()

const toast = useToast()

const statuses = ['active', 'canceled', 'trailing']

const filteredVehicles = ref([])

const form = ref({
    name: null,
    description: null,
    vehicle_type: null,
    price: null,
    is_active: true,
})

const emit = defineEmits(['save'])

const submit = async () => {
    try {
        const fd = new FormData()
        fd.append('name', form.value.name)
        fd.append('description', form.value.description)
        fd.append('price', form.value.price)
        fd.append('vehicle_type_id', form.value.vehicle_type)
        fd.append('is_active', form.value.is_active)
        fd.append('parking_zone_id', user.value.parking_zone_owned.id)

        const { data } = await api.post(`parking-zone/${user.value.parking_zone_owned.id}/subscription-rates`, fd)

        toast.add({
            closable: true, severity: 'success', summary: 'Success', detail: 'Subscription rate created successfully'
            , life: 3000
        })
        emit('save')
    } catch (e) {
        toast.add({ closable: true, severity: 'error', summary: 'Failed', detail: e.response.data.message, life: 3000 })
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