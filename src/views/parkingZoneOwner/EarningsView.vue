<template>
    <div class="flex flex-col gap-4">
        <Panel>
            <div class="flex flex-row gap-8">
                <div class="flex flex-row gap-4 w-full">
                    <IftaLabel>
                        <DatePicker v-model="monthFilter" selectionMode="range" :manualInput="false"
                            class="w-full md:w-40" dateFormat="dd/mm/yy" />
                        <label for="date">Date filter</label>
                    </IftaLabel>

                    <Select v-model="filters.status" class="md:w-80 w-full" placeholder="Select Status"
                        :options="statusOptions" optionLabel="label" optionValue="value">
                    </Select>
                </div>
                <div class="flex flex-col items-end justify-end w-full">
                    <span class="font-semibold">
                        Settlement Status
                    </span>
                    <span>
                        {{ status }}
                    </span>
                </div>
            </div>
        </Panel>
        <div class="flex flex-col items-start justify-start gap-4 text-neutral-500 text-sm">
            <Panel v-for="(item, index) in payments" :key="index" class="w-full">
                <template #header>
                    <div class="flex items-center gap-2">
                        <font-awesome-icon :icon="['fas', index === 0 ? 'car' : 'calendar-check']"
                            class="text-blue-500"></font-awesome-icon>
                        <span class="font-semibold">{{ paymentTypes[index] }}</span>
                    </div>
                </template>
                <DataTable :value="item" class="max-h-[500px] overflow-y-scroll">
                    <Column header="Receipt No.">
                        <template #body="slotProps">
                            {{ slotProps.data.receipt_no ?? "--NA--" }}
                        </template>
                    </Column>
                    <Column header="Created At">
                        <template #body="slotProps">
                            {{ slotProps.data.created_at ?? "--NA--" }}
                        </template>
                    </Column>
                    <Column header="Status">
                        <template #body="slotProps">
                            {{ slotProps.data.status ?? "--NA--" }}
                        </template>
                    </Column>
                    <Column header="Amount">
                        <template #body="slotProps">
                            ₹ {{ slotProps.data.amount ?? "0.00" }}
                        </template>
                    </Column>
                    <template #footer>
                        <div class="flex justify-end p-2 font-bold gap-4">
                            <span class="text-end text-sm text-neutral-500">Total</span>
                            <span class="text-end text-sm text-neutral-500">₹ {{ totals[index] || '0.00' }}</span>
                        </div>
                    </template>
                    <template #empty>
                        <div class="flex items-center justify-center w-full text-sm text-neutral-500">
                            No records found
                        </div>
                    </template>
                </DataTable>
            </Panel>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '../../boot/api';
import { useToast } from 'primevue';
import { useParkingZone } from '../../scripts/parkingZone';

const { parking_zone, getParkingZone } = useParkingZone()
const filters = ref({
    search: '',
    status: ''
})

const totals = ref()

const toast = useToast()

const loading = ref(false)

const monthFilter = ref([
    new Date(),
])

const payments = ref([])
const paymentTypes = ref([])

const status = ref('')

const statusOptions = ref([
    { label: 'All', value: '' },
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' }
])

const getEarnings = async () => {
    if (!parking_zone.value?.id) {
        console.warn('Parking zone not loaded yet');
        return;
    }

    loading.value = true
    try {
        let dateFilter = {
            start: null,
            end: null
        }

        // Format dates as d-m-Y (day-month-year) as expected by backend
        if (monthFilter.value[0]) {
            const startDate = monthFilter.value[0];
            dateFilter.start = `${String(startDate.getDate()).padStart(2, '0')}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${startDate.getFullYear()}`;
        }

        if (monthFilter.value[1]) {
            const endDate = monthFilter.value[1];
            dateFilter.end = `${String(endDate.getDate()).padStart(2, '0')}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${endDate.getFullYear()}`;
        }

        const { data } = await api.get('earnings', { params: { parking_zone_id: parking_zone.value.id, dateFilter, filters: filters.value } });

        // API returns payments as object with 'parking' and 'booking' arrays
        // Convert to array format for the DataTable component
        payments.value = [];
        paymentTypes.value = [];

        if (data.payments) {
            // Always include parking payments (even if empty array)
            if (Array.isArray(data.payments.parking)) {
                payments.value.push(data.payments.parking);
                paymentTypes.value.push('Parking Payments');
            }
            // Always include booking payments (even if empty array)
            if (Array.isArray(data.payments.booking)) {
                payments.value.push(data.payments.booking);
                paymentTypes.value.push('Booking Payments');
            }
        }

        status.value = data.status || 'Unsettled';

        // API returns totals as object with booking, parking, and grand_total
        // Match the order of payments array
        totals.value = [];
        if (data.totals) {
            // Match the order: parking first, then booking
            if (Array.isArray(data.payments?.parking)) {
                totals.value.push(data.totals.parking || 0);
            }
            if (Array.isArray(data.payments?.booking)) {
                totals.value.push(data.totals.booking || 0);
            }
        }

        loading.value = false
    } catch (error) {
        console.error('Error fetching earnings:', error);
        payments.value = [];
        totals.value = [];
        loading.value = false
    }
};

watch(filters, async (newVal) => {
    await getEarnings()
}, { deep: true })

watch(monthFilter, async (newVal) => {
    await getEarnings()
}, { deep: true })

watch(parking_zone, async () => {
    await getEarnings()
}, { deep: true })

onMounted(async () => {
    await getParkingZone()
})
</script>