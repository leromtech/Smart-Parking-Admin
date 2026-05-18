<template>
    <div class="flex flex-col gap-4">
        <Panel>
            <div class="flex flex-col gap-4">
                <div class="flex flex-row gap-4 w-full">
                    <IftaLabel>
                        <DatePicker v-model="monthFilter" selectionMode="range" :manualInput="false"
                            class="w-full md:w-40" dateFormat="dd/mm/yy" />
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
                    <Button :label="showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'" text
                        severity="secondary" @click="showAdvancedFilters = !showAdvancedFilters" />
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
                    </div>
                </div>
            </div>
        </Panel>
        <div v-if="activeFilterChips.length > 0" class="flex flex-wrap gap-2">
            <Tag v-for="chip in activeFilterChips" :key="chip.key" :value="chip.label" />
        </div>

        <Panel header="Earnings Trend" class="w-full">
            <div ref="earningsChart" class="w-full min-h-[350px]"></div>
        </Panel>

        <div class="flex flex-col items-start justify-start gap-4 text-neutral-500 text-sm">
            <Panel v-for="panel in visiblePaymentPanels" :key="panel.key" class="w-full">
                <template #header>
                    <div class="flex items-center gap-2">
                        <font-awesome-icon :icon="['fas', panel.type === 'parking' ? 'car' : 'calendar-check']"
                            class="text-blue-500"></font-awesome-icon>
                        <span class="font-semibold">{{ panel.label }}</span>
                    </div>
                </template>
                <DataTable :value="panel.items" class="max-h-[500px] overflow-y-scroll">
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
                    <Column header="Vehicle Type">
                        <template #body="slotProps">
                            <div class="capitalize">
                                {{ slotProps.data.payable?.vehicle_type?.name || slotProps.data.payable?.vehicleType?.name || slotProps.data.payable?.vehicle?.vehicle_type?.name || slotProps.data.payable?.vehicle?.vehicleType?.name || "--NA--" }}
                            </div>
                        </template>
                    </Column>
                    <Column header="Amount">
                        <template #body="slotProps">
                            ₹ {{ slotProps.data.amount ?? "0.00" }}
                        </template>
                    </Column>
                    <Column header="Commission Share">
                        <template #body="slotProps">
                            ₹ {{ ((slotProps.data.amount || 0) * commissionRate).toFixed(2) }} ({{ commissionRate * 100 }}%)
                        </template>
                    </Column>
                    <Column header="Your Share">
                        <template #body="slotProps">
                            ₹ {{ ((slotProps.data.amount || 0) * (1 - commissionRate)).toFixed(2) }}
                        </template>
                    </Column>
                    <template #footer>
                        <div class="flex justify-end p-2 font-bold gap-4">
                            <span class="text-end text-sm text-neutral-500">Total</span>
                            <span class="text-end text-sm text-neutral-500">₹ {{ panel.total || '0.00' }}</span>
                            <span class="text-end text-sm text-neutral-500">Commission: ₹ {{ ((panel.total || 0) * commissionRate).toFixed(2) }}</span>
                            <span class="text-end text-sm text-neutral-500">Your Share: ₹ {{ ((panel.total || 0) * (1 - commissionRate)).toFixed(2) }}</span>
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
import { computed, onMounted, ref, watch } from 'vue';
import api from '../../boot/api';
import { useToast } from 'primevue';
import { useParkingZone } from '../../scripts/parkingZone';
import ApexCharts from 'apexcharts';

const { parking_zone, getParkingZone } = useParkingZone()
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

const totals = ref()
const commissionRate = ref(0)

const toast = useToast()

const loading = ref(false)

const monthFilter = ref([
    new Date(),
])

const payments = ref([])
const paymentTypes = ref([])
const vehicleTypeOptions = ref([])
const showAdvancedFilters = ref(false)

const earningsChart = ref(null);
let chartInstance = null;

const status = ref('')

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
const visiblePaymentPanels = computed(() => {
    const payableType = filters.value.payable_type

    const panels = payments.value.map((items, index) => {
        const label = paymentTypes.value[index] || `Payments ${index + 1}`
        const type = label.toLowerCase().includes('parking') ? 'parking' : 'booking'
        return {
            key: `${type}-${index}`,
            type,
            label,
            items,
            total: totals.value?.[index] || 0,
        }
    })

    if (payableType === 'parking') return panels.filter((panel) => panel.type === 'parking')
    if (payableType === 'booking') return panels.filter((panel) => panel.type === 'booking')
    return panels
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

const getEarnings = async () => {
    if (!parking_zone.value?.id || !monthFilter.value?.[0]) {
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

        const sanitizedFilters = sanitizeFilters()
        if (!validateFilters(sanitizedFilters)) {
            loading.value = false
            return
        }

        const params = {
            parking_zone_id: parking_zone.value.id,
            dateFilter
        }

        if (Object.keys(sanitizedFilters).length > 0) {
            params.filters = sanitizedFilters
        }

        const { data } = await api.get('earnings', { params });

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
        commissionRate.value = data.commission_rate || 0;

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
        paymentTypes.value = [];
        totals.value = [];
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

watch(monthFilter, async (newVal) => {
    await getEarnings()
}, { deep: true })

const updateChart = () => {
    if (!earningsChart.value) return;

    // Process data to group by date
    const dailyEarnings = {};
    
    payments.value.forEach(paymentGroup => {
        if (!Array.isArray(paymentGroup)) return;
        paymentGroup.forEach(item => {
            if (!item.created_at || !item.amount) return;
            
            let dateKey = '';
            let timestamp = 0;
            const dateStr = String(item.created_at);
            
            // Parse date
            let d = new Date(dateStr);
            if (!isNaN(d.getTime())) {
                dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                // Normalizing timestamp to start of day for grouping
                timestamp = new Date(dateKey).getTime();
            } else {
                const parts = dateStr.split(' ')[0].split('-');
                if (parts.length === 3) {
                    if (parts[0].length === 2 && parts[2].length === 4) { // DD-MM-YYYY
                        dateKey = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    } else if (parts[0].length === 4) { // YYYY-MM-DD
                        dateKey = `${parts[0]}-${parts[1]}-${parts[2]}`;
                    } else {
                        dateKey = dateStr.split(' ')[0].split('T')[0];
                    }
                } else {
                    dateKey = dateStr.split(' ')[0].split('T')[0];
                }
                d = new Date(dateKey);
                timestamp = !isNaN(d.getTime()) ? d.getTime() : 0;
            }
            
            if (!dailyEarnings[dateKey]) {
                dailyEarnings[dateKey] = {
                    date: dateKey,
                    timestamp: timestamp,
                    total: 0,
                    commission: 0,
                    yourShare: 0
                };
            }
            
            const amount = parseFloat(item.amount) || 0;
            dailyEarnings[dateKey].total += amount;
            dailyEarnings[dateKey].commission += amount * commissionRate.value;
            dailyEarnings[dateKey].yourShare += amount * (1 - commissionRate.value);
        });
    });
    
    const sortedData = Object.values(dailyEarnings).sort((a, b) => a.timestamp - b.timestamp);
    
    const seriesYourShare = sortedData.map(d => [d.timestamp, parseFloat(d.yourShare.toFixed(2))]);
    const seriesCommission = sortedData.map(d => [d.timestamp, parseFloat(d.commission.toFixed(2))]);
    
    const options = {
        chart: {
            type: 'area',
            height: 350,
            toolbar: { show: true },
            fontFamily: 'inherit'
        },
        series: [
            { name: 'Your Share', data: seriesYourShare },
            { name: 'Commission', data: seriesCommission }
        ],
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeUTC: false,
                datetimeFormatter: {
                    year: 'yyyy',
                    month: 'MMM \'yy',
                    day: 'dd MMM',
                    hour: 'HH:mm'
                }
            }
        },
        colors: ['#10b981', '#f59e0b'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
            type: 'gradient',
            gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.1, stops: [0, 90, 100] }
        },
        tooltip: {
            y: { formatter: function (val) { return "₹ " + val } },
            x: { format: 'dd MMM yyyy' }
        },
        noData: {
            text: 'No data available',
            align: 'center',
            verticalAlign: 'middle',
            style: { color: '#888', fontSize: '14px' }
        }
    };
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    chartInstance = new ApexCharts(earningsChart.value, options);
    chartInstance.render();
};

watch(payments, () => {
    updateChart();
}, { deep: true });

watch(parking_zone, async () => {
    await getEarnings()
}, { deep: true })

onMounted(async () => {
    await getParkingZone()
    await getVehicleTypes()
})
</script>