<template>
    <form @submit.prevent="submitRatePolicy">
        <div class="flex flex-col gap-4 md:w-[500px]">
            <Select :options="vehicleTypes" optionValue="id" optionLabel="name" fluid
                placeholder="Select a vehicle type for the policy" v-model="form.vehicleType"></Select>

            <Select :options="intervals" placeholder="Select a policy interval" fluid v-model="form.interval"></Select>

            <div class="flex flex-row items-center gap-2">
                <Checkbox binary v-model="timeSelect" />
                <label for="">Timing</label>
            </div>
            <div v-if="timeSelect" class="flex flex-row gap-4">
                <div>
                    <label for="from">From</label>
                    <DatePicker v-model="form.from" showIcon fluid iconDisplay="input" id="from" timeOnly
                        hourFormat="12">
                        <template #inputicon="slotProps">
                            <i class="pi pi-clock" @click="slotProps.clickCallback" />
                        </template>
                    </DatePicker>
                </div>
                <div>
                    <label for="to">To</label>
                    <DatePicker v-model="form.to" showIcon fluid iconDisplay="input" id="to" timeOnly hourFormat="12">
                        <template #inputicon="slotProps">
                            <i class="pi pi-clock" @click="slotProps.clickCallback" />
                        </template>
                    </DatePicker>
                </div>
            </div>

            <Button type="submit">Submit</Button>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import useVehicleTypes from '../../../scripts/admin/vehicleTypes';
import { useParkingZone } from '../../../scripts/parkingZone';
import api from '../../../boot/api';
import { useToast } from 'primevue';

const toast = useToast()

const { vehicleTypes } = useVehicleTypes()

const intervals = ['daily', 'weekly', 'monthly', 'yearly']

const timeSelect = ref(false)

const form = ref({
    vehicleType: null,
    interval: null,
    from: null,
    to: null
})

const submitRatePolicy = async () => {
    try {
        const fd = new FormData()
        fd.append('vehicle_type', form.value.vehicleType)
        fd.append('interval', form.value.interval)
        if (timeSelect.value) {
            fd.append('from', form.value.from.toTimeString().split(' ')[0])
            fd.append('to', form.value.to.toTimeString().split(' ')[0])
        } else {
            fd.append('from', '')
            fd.append('to', '')
        }

        fd.append('parking_zone_id', useParkingZone().parking_zone.value.id)
        const { data } = await api.post('rates', fd)
        toast.add({ severity: data.success ? 'success' : 'error', summary: data.success ? 'Success' : 'Error', detail: data.message, life: 3000 })
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 })
    }
}
</script>
