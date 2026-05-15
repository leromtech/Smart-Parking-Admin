<template>
    <div class="flex flex-col gap-4">
        <Panel>
            <div class="flex flex-col gap-4">
                <div class="flex flex-row gap-4 w-full">
                    <Select v-model="selectedParkingZone" :options="parkingZones" filter optionLabel="name"
                        placeholder="Select a Parking Zone" class="w-full md:w-80">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                <div>{{ `${slotProps.value.name} (${slotProps.value.address})` }}</div>
                            </div>
                            <span v-else>
                                Select a Parking zone
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex items-center">
                                <div>{{ `${slotProps.option.name} (${slotProps.option.address})` }}</div>
                            </div>
                        </template>
                    </Select>

                    <IftaLabel>
                        <DatePicker v-model="monthFilter" selectionMode="range" :manualInput="false"
                            class="w-full md:w-40" dateFormat="MM yy dd" />
                        <label for="date">Date filter</label>
                    </IftaLabel>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Select v-model="filters.payable_type" class="w-full" placeholder="Payable Type"
                        :options="payableTypeOptions" optionLabel="label" optionValue="value" />

                    <Select v-model="filters.status" class="w-full" placeholder="General Status" :options="statusOptions"
                        optionLabel="label" optionValue="value" />

                    <Select v-model="filters.payment_status" class="w-full" placeholder="Payment Status"
                        :options="paymentStatusOptions" optionLabel="label" optionValue="value" />

                    <Select v-model="filters.payment_method" class="w-full" placeholder="Payment Method"
                        :options="paymentMethodOptions" optionLabel="label" optionValue="value" />
                </div>

                <div class="flex items-center justify-between">
                    <Button
                        :label="showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'"
                        text
                        severity="secondary"
                        @click="showAdvancedFilters = !showAdvancedFilters"
                    />
                </div>

                <div v-if="showAdvancedFilters" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Select v-if="showParkingStatusFilter" v-model="filters.parking_status" class="w-full"
                        placeholder="Parking Status" :options="parkingStatusOptions" optionLabel="label"
                        optionValue="value" />

                    <Select v-if="showBookingStatusFilter" v-model="filters.booking_status" class="w-full"
                        placeholder="Booking Status" :options="bookingStatusOptions" optionLabel="label"
                        optionValue="value" />

                    <Select v-model="filters.vehicle_type" class="w-full" placeholder="Vehicle Type"
                        :options="vehicleTypeOptions" optionLabel="label" optionValue="value" />

                    <InputText v-model="filters.user_id" class="w-full" placeholder="User ID" />

                    <InputNumber v-model="filters.min_amount" class="w-full" :min="0" placeholder="Min Amount" />
                    <InputNumber v-model="filters.max_amount" class="w-full" :min="0" placeholder="Max Amount" />
                </div>

                <div class="flex flex-row items-center justify-between w-full">
                    <div class="flex flex-col items-start">
                        <span class="font-semibold">Settlement Status</span>
                        <span>{{ status }}</span>
                    </div>
                    <div class="flex gap-2">
                        <Button label="Apply Filters" severity="info" @click="getEarnings" />
                        <Button label="Clear Filters" severity="secondary" outlined @click="clearFilters" />
                        <Button @click="settle">Settle</Button>
                    </div>
                </div>
            </div>
        </Panel>
        <div v-if="activeFilterChips.length > 0" class="flex flex-wrap gap-2">
            <Tag v-for="chip in activeFilterChips" :key="chip.key" :value="chip.label" />
        </div>

        <div class="flex flex-col gap-2">
            <Panel :header="entry[0].toUpperCase()" v-for="entry in visiblePaymentEntries" :key="entry[0]">
                <DataTable :value="entry[1]" scrollable scrollHeight="400px" tableStyle="min-width: 50rem" :loading="loading"
                    lazy>
                    <Column header="Receipt No.">
                        <template #body="slotProps">
                            {{ slotProps.data.receipt_number ?? '--' }}
                        </template>
                    </Column>
                    <Column header="Payment Method">
                        <template #body="slotProps">
                            {{ slotProps.data.payment_method ?? '--' }}
                        </template>
                    </Column>
                    <Column header="Created at">
                        <template #body="slotProps">
                            <div class="text-end">
                                {{ slotProps.data.created_at }}
                            </div>
                        </template>
                    </Column>
                    <Column field="status" header="Status"></Column>
                    <Column header="Vehicle Type">
                        <template #body="slotProps">
                            <div class="capitalize">
                                {{ slotProps.data.payable?.vehicle_type?.name || slotProps.data.payable?.vehicleType?.name || slotProps.data.payable?.vehicle?.vehicle_type?.name || slotProps.data.payable?.vehicle?.vehicleType?.name || "--NA--" }}
                            </div>
                        </template>
                    </Column>
                    <Column header="Amount">
                        <template #body="slotProps">
                            <div class="text-end">
                                {{ (Number(slotProps.data.amount) || 0) !== 0 ?
                                    (Number(slotProps.data.amount) || 0).toLocaleString('en-IN') : '-' }}
                            </div>
                        </template>
                    </Column>

                    <template #footer>
                        <div class="flex justify-between p-2 font-bold">
                            <span>Total: </span>
                            <span class="text-end">₹ {{ totals?.[entry[0]] }}</span>
                        </div>
                    </template>

                    <template #empty>
                        <div class="text-center p-4 text-gray-500">
                            No records found.
                        </div>
                    </template>
                </DataTable>
            </Panel>
        </div>

    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import api from '../../boot/api';
import { useToast } from 'primevue';

const filters = ref({
    status: '',
    parking_status: '',
    booking_status: '',
    payment_status: '',
    payment_method: '',
    vehicle_type: null,
    user_id: '',
    payable_type: '',
    min_amount: null,
    max_amount: null,
})

const toast = useToast()

const loading = ref(false)

const monthFilter = ref([
    new Date(),
])

const parkingZones = ref([])

const payments = ref({})

const status = ref('')

const totals = ref(null)

const selectedParkingZone = ref(null)
const vehicleTypeOptions = ref([])
const showAdvancedFilters = ref(false)

const statusOptions = ref([
    { label: 'All', value: '' },
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' }
])
const payableTypeOptions = ref([
    { label: 'All Types', value: '' },
    { label: 'Parking', value: 'parking' },
    { label: 'Booking', value: 'booking' },
])
const parkingStatusOptions = ref([
    { label: 'All Parking Statuses', value: '' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
])
const bookingStatusOptions = ref([
    { label: 'All Booking Statuses', value: '' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
])
const paymentStatusOptions = ref([
    { label: 'All Payment Statuses', value: '' },
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Failed', value: 'failed' },
])
const paymentMethodOptions = ref([
    { label: 'All Methods', value: '' },
    { label: 'Wallet', value: 'wallet' },
    { label: 'UPI', value: 'upi' },
    { label: 'Cash', value: 'cash' },
    { label: 'Card', value: 'card' },
    { label: 'Razorpay', value: 'razorpay' },
])

const showParkingStatusFilter = computed(() => filters.value.payable_type !== 'booking')
const showBookingStatusFilter = computed(() => filters.value.payable_type !== 'parking')
const visiblePaymentEntries = computed(() => {
    const allEntries = Object.entries(payments.value || {})
    if (filters.value.payable_type === 'parking') return allEntries.filter(([key]) => key === 'parking')
    if (filters.value.payable_type === 'booking') return allEntries.filter(([key]) => key === 'booking')
    return allEntries
})
const activeFilterChips = computed(() => {
    const chips = []
    const cleaned = sanitizeFilters()
    Object.entries(cleaned).forEach(([key, value]) => {
        chips.push({
            key,
            label: `${key.replaceAll('_', ' ')}: ${value}`,
        })
    })
    return chips
})

const getParkingZonesData = async () => {
    const { data } = await api.get('parking-zones')
    parkingZones.value = data.parking_zones.data
}

const getVehicleTypes = async () => {
    try {
        const { data } = await api.get('vehicle-types')
        const items = data?.vehicle_types?.data || []
        vehicleTypeOptions.value = [
            { label: 'All Vehicle Types', value: null },
            ...items.map((item) => ({ label: item.name, value: item.id })),
        ]
    } catch (error) {
        vehicleTypeOptions.value = [{ label: 'All Vehicle Types', value: null }]
    }
}

const isBlank = (value) => value === '' || value === null || value === undefined

const sanitizeFilters = () => {
    const next = {}
    const source = filters.value

    if (!isBlank(source.status)) next.status = source.status
    if (!isBlank(source.parking_status) && source.payable_type !== 'booking') next.parking_status = source.parking_status
    if (!isBlank(source.booking_status) && source.payable_type !== 'parking') next.booking_status = source.booking_status
    if (!isBlank(source.payment_status)) next.payment_status = source.payment_status
    if (!isBlank(source.payment_method)) next.payment_method = source.payment_method
    if (!isBlank(source.vehicle_type)) next.vehicle_type = source.vehicle_type
    if (!isBlank(source.user_id)) next.user_id = source.user_id
    if (!isBlank(source.payable_type)) next.payable_type = source.payable_type
    if (!isBlank(source.min_amount)) next.min_amount = Number(source.min_amount)
    if (!isBlank(source.max_amount)) next.max_amount = Number(source.max_amount)

    return next
}

const validateFilters = (sanitized) => {
    if (sanitized.payable_type && !['parking', 'booking'].includes(sanitized.payable_type)) {
        toast.add({ severity: 'error', summary: 'Validation', detail: 'Invalid payable type', life: 3000 })
        return false
    }

    if (sanitized.min_amount !== undefined && Number.isNaN(Number(sanitized.min_amount))) {
        toast.add({ severity: 'error', summary: 'Validation', detail: 'Minimum amount must be numeric', life: 3000 })
        return false
    }

    if (sanitized.max_amount !== undefined && Number.isNaN(Number(sanitized.max_amount))) {
        toast.add({ severity: 'error', summary: 'Validation', detail: 'Maximum amount must be numeric', life: 3000 })
        return false
    }

    if (sanitized.min_amount !== undefined && sanitized.max_amount !== undefined && Number(sanitized.max_amount) < Number(sanitized.min_amount)) {
        toast.add({ severity: 'error', summary: 'Validation', detail: 'Maximum amount must be greater than or equal to minimum amount', life: 3000 })
        return false
    }

    return true
}

const getEarnings = async () => {
    if (!selectedParkingZone.value?.id || !monthFilter.value?.[0]) {
        return
    }

    loading.value = true
    try {
        let dateFilter = {
            start: null,
            end: null
        }
        if (monthFilter.value[1]) {
            dateFilter.end = monthFilter.value[1].toLocaleDateString('en-GB', { month: 'numeric', year: 'numeric', day: 'numeric' }).replaceAll('/', '-');
        }
        dateFilter.start = monthFilter.value[0].toLocaleDateString('en-GB', { month: 'numeric', year: 'numeric', day: "numeric" }).replaceAll('/', '-');
        const sanitizedFilters = sanitizeFilters()
        if (!validateFilters(sanitizedFilters)) {
            loading.value = false
            return
        }

        const params = {
            parking_zone_id: selectedParkingZone.value.id,
            dateFilter,
        }

        if (Object.keys(sanitizedFilters).length > 0) {
            params.filters = sanitizedFilters
        }

        const { data } = await api.get('earnings', { params });
        payments.value = data.payments;
        totals.value = data.totals
        status.value = data.status
        loading.value = false
    } catch (error) {
        console.error('Error fetching earnings:', error);
        loading.value = false
    }
};

const clearFilters = async () => {
    filters.value = {
        status: '',
        parking_status: '',
        booking_status: '',
        payment_status: '',
        payment_method: '',
        vehicle_type: null,
        user_id: '',
        payable_type: '',
        min_amount: null,
        max_amount: null,
    }
    showAdvancedFilters.value = false
    await getEarnings()
}

const settle = async () => {
    const month = monthFilter.value.toLocaleDateString('en-GB', { month: 'numeric', year: 'numeric' }).replace('/', '-');
    const { data } = await api.post('settlement/initiate', { parkingZoneId: selectedParkingZone.value.id, month })
    toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
}

watch(selectedParkingZone, async (newVal) => {
    await getEarnings()
})

watch(monthFilter, async (newVal) => {
    if (!newVal[0]) {
        return
    }
    await getEarnings()
})

onMounted(async () => {
    await getParkingZonesData()
    await getVehicleTypes()
    if (parkingZones.value.length > 0) {
        selectedParkingZone.value = parkingZones.value[0]
    }
})
</script>