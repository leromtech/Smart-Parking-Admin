<template>
    <form @submit.prevent="submit" class="flex flex-col gap-8">
            <Select v-model="form.userId" filter
            @filter="(e) => searchUser(e)" :options="filteredUser" fluid placeholder="Select a User" optionLabel="label"
            optionValue="value"></Select>

        <Select v-model="form.vehicleId" optionValue="value" optionLabel="label" :options="filteredVehicles"
            placeholder="Select Vehicle" fluid :disabled="form.userId === null" />

        <Select v-model="form.rateId" optionValue="value" optionLabel="label" :options="filteredRates"
            placeholder="Select Rates" fluid />

        <Select v-model="form.status" :options="statuses" placeholder="Select Status" fluid />

        <DatePicker v-model="form.startDate" dateFormat="dd/mm/yy" placeholder="Select start date" showIcon disabled />

        <DatePicker v-model="computedEndDate" dateFormat="dd/mm/yy" placeholder="End date (auto-calculated)" showIcon
            disabled />

        <Button type="submit" icon="pi pi-save" label="SAVE" />
    </form>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import api from '../../../boot/api';
import useAuth from '../../../scripts/auth';
import { useToast } from 'primevue';

const { user } = useAuth()

const toast = useToast()

const statuses = ['active', 'canceled', 'trailing']

const filteredUser = ref([])
const filteredVehicles = ref([])
const filteredRates = ref([])


const form = ref({
    userId: null,
    vehicleId: null,
    rateId: null,
    status: null,
    startDate: new Date(),
    endDate: null
})

// Computed property for end date
const computedEndDate = computed({
    get() {
        if (form.value.startDate) {
            const startDate = new Date(form.value.startDate)
            return new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
        }
        return getLastDayOfCurrentMonth()
    },
    set(value) {
        form.value.endDate = value
    }
})

// Function to get last day of current month
const getLastDayOfCurrentMonth = () => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
}

// Update form.endDate when computedEndDate changes
watch(computedEndDate, (newEndDate) => {
    form.value.endDate = newEndDate
})

const emit = defineEmits(['save'])


const submit = async () => {
    try {
        const fd = new FormData()
        fd.append('user_id', form.value.userId)
        fd.append('vehicle_id', form.value.vehicleId)
        fd.append('rate_id', form.value.rateId)
        fd.append('parking_zone_id', user.value.parking_zone_owned.id)
        fd.append('status', form.value.status)

        const { data } = await api.post('subscriptions', fd)
        toast.add({ closable: true, severity: 'success', summary: 'Success', detail: 'Subscription Added Successfully', life: 3000 })
        emit('save')
    } catch (e) {
        toast.add({ closable: true, severity: 'error', summary: 'Failed', detail: 'Unexpected error occured', life: 3000 })
        emit('save')
    }
}

const searchUser = async (searchQuery) => {
    const { data } = await api.get('users', {
        params: {
            'filters': {
                'search': searchQuery.value
            }
        }
    })
    filteredUser.value = data.data.map((item) => {
        return {
            label: `${item.name} (${item.phone})`,
            value: item.id,
            data: item
        }
    })
}

const fetchRates = async () => {
    const { data } = await api.get(`parking-zone/${user.value.parking_zone_owned.id}/subscription-rates`)
    filteredRates.value = data.data.map((item) => {
        return {
            label: `${item.name ?? '-NO NAME-'} - ${item.vehicle_type.name} - ₹ ${item.price}`,
            value: item.id
        }
    })
}

watch(() => form.value.userId, (newVal) => {
    filteredVehicles.value = filteredUser.value.find((item) =>
        item.value === newVal
    ).data.vehicle.map((item) => {
        return {
            label: item.registration_no,
            value: item.id
        }
    })
})

onMounted(async () => {
    await fetchRates(user.value.parking_zone_owned.id)
    form.value.endDate = getLastDayOfCurrentMonth()
})
</script>