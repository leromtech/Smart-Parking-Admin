<template>
    <div class="flex flex-col gap-4">
        <Panel>
            <template #header>
                <div class="flex flex-col gap-1">
                    <span class="font-semibold text-lg">Settlement</span>
                    <span class="text-sm text-gray-500 font-normal">
                        Summary by parking zone. Open details for the full payment breakdown.
                    </span>
                </div>
            </template>

            <div class="flex flex-col gap-4">
                <div class="flex flex-row gap-4 w-full flex-wrap items-end">
                    <IftaLabel>
                        <DatePicker
                            v-model="selectedMonth"
                            view="month"
                            dateFormat="MM yy"
                            :manualInput="false"
                            class="w-full md:w-48"
                            @update:model-value="onMonthChange"
                        />
                        <label for="settlement-month">Month</label>
                    </IftaLabel>
                    <span v-if="monthLabel" class="text-sm text-gray-600 pb-2">
                        Period: {{ monthLabel }}
                    </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Select
                        v-model="filters.payable_type"
                        class="w-full"
                        placeholder="Payable Type"
                        :options="payableTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                    />
                    <Select
                        v-model="filters.status"
                        class="w-full"
                        placeholder="General Status"
                        :options="statusOptions"
                        optionLabel="label"
                        optionValue="value"
                    />
                    <Select
                        v-model="filters.payment_status"
                        class="w-full"
                        placeholder="Payment Status"
                        :options="paymentStatusOptions"
                        optionLabel="label"
                        optionValue="value"
                    />
                    <Select
                        v-model="filters.payment_method"
                        class="w-full"
                        placeholder="Payment Method"
                        :options="paymentMethodOptions"
                        optionLabel="label"
                        optionValue="value"
                    />
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
                    <Select
                        v-if="showParkingStatusFilter"
                        v-model="filters.parking_status"
                        class="w-full"
                        placeholder="Parking Status"
                        :options="parkingStatusOptions"
                        optionLabel="label"
                        optionValue="value"
                    />
                    <Select
                        v-if="showBookingStatusFilter"
                        v-model="filters.booking_status"
                        class="w-full"
                        placeholder="Booking Status"
                        :options="bookingStatusOptions"
                        optionLabel="label"
                        optionValue="value"
                    />
                    <Select
                        v-model="filters.vehicle_type"
                        class="w-full"
                        placeholder="Vehicle Type"
                        :options="vehicleTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                    />
                    <InputText v-model="filters.user_id" class="w-full" placeholder="User ID" />
                    <InputNumber v-model="filters.min_amount" class="w-full" :min="0" placeholder="Min Amount" />
                    <InputNumber v-model="filters.max_amount" class="w-full" :min="0" placeholder="Max Amount" />
                </div>

                <div class="flex flex-row gap-2 justify-end">
                    <Button label="Apply Filters" severity="info" :loading="loadingSummaries" @click="loadSummaries" />
                    <Button label="Clear Filters" severity="secondary" outlined @click="clearFilters" />
                </div>
            </div>
        </Panel>

        <div v-if="activeFilterChips.length > 0" class="flex flex-wrap gap-2">
            <Tag v-for="chip in activeFilterChips" :key="chip.key" :value="chip.label" />
        </div>

        <Panel>
            <template #header>
                <span class="font-semibold">
                    Parking zones
                    <span v-if="monthLabel" class="text-gray-500 font-normal">— {{ monthLabel }}</span>
                </span>
            </template>
            <DataTable
                :value="zoneSummaries"
                :loading="loadingSummaries"
                tableStyle="min-width: 60rem"
                paginator
                :rows="15"
                :rowsPerPageOptions="[10, 15, 25, 50]"
            >
                <Column header="Parking Zone" style="min-width: 14rem">
                    <template #body="{ data }">
                        <div class="flex flex-col">
                            <span class="font-medium">{{ data.name }}</span>
                            <span class="text-sm text-gray-500">{{ data.address }}</span>
                        </div>
                    </template>
                </Column>

                <Column header="Month" style="width: 9rem">
                    <template #body="{ data }">
                        <span class="text-sm font-medium text-sky-800">{{ data.monthLabel }}</span>
                    </template>
                </Column>

                <Column header="Status" style="width: 8rem">
                    <template #body="{ data }">
                        <Tag
                            :severity="data.status === 'Settled' ? 'success' : 'warn'"
                            :value="data.status || 'Unsettled'"
                        />
                    </template>
                </Column>

                <Column header="Parking" style="width: 8rem">
                    <template #body="{ data }">
                        <div class="text-end">₹ {{ formatMoney(data.totals?.parking) }}</div>
                    </template>
                </Column>

                <Column header="Booking" style="width: 8rem">
                    <template #body="{ data }">
                        <div class="text-end">₹ {{ formatMoney(data.totals?.booking) }}</div>
                    </template>
                </Column>

                <Column header="Grand Total" style="width: 9rem">
                    <template #body="{ data }">
                        <div class="text-end font-semibold">₹ {{ formatMoney(data.grandTotal) }}</div>
                    </template>
                </Column>

                <Column header="Commission" style="width: 9rem">
                    <template #body="{ data }">
                        <div class="text-end text-sm">
                            ₹ {{ formatMoney(data.commissionShare) }}
                            <span class="text-gray-500">({{ (data.commissionRate * 100).toFixed(1) }}%)</span>
                        </div>
                    </template>
                </Column>

                <Column header="Zone Share" style="width: 9rem">
                    <template #body="{ data }">
                        <div class="text-end text-green-700 font-medium">
                            ₹ {{ formatMoney(data.zoneShare) }}
                        </div>
                    </template>
                </Column>

                <Column header="" style="width: 11rem">
                    <template #body="{ data }">
                        <div class="flex flex-row gap-2">
                            <Button
                                label="Details"
                                icon="pi pi-eye"
                                size="small"
                                outlined
                                @click="openDetails(data)"
                            />
                            <Button
                                icon="pi pi-check"
                                size="small"
                                severity="success"
                                outlined
                                v-tooltip.top="'Settle'"
                                :loading="settlingId === data.id"
                                @click="settle(data)"
                            />
                        </div>
                    </template>
                </Column>

                <template #empty>
                    <div class="text-center py-8 text-gray-500">
                        {{ loadingSummaries ? 'Loading…' : 'No parking zones found. Adjust filters and apply.' }}
                    </div>
                </template>
            </DataTable>
        </Panel>

        <Dialog
            v-model:visible="detailsOpen"
            modal
            maximizable
            class="w-full max-w-6xl"
            :header="detailsDialogTitle"
        >
            <SettlementBreakdown
                v-if="selectedZone && detailEarnings"
                :zone-name="selectedZone.name"
                :zone-address="selectedZone.address"
                :month-label="selectedZone.monthLabel || monthLabel"
                :payments="detailEarnings.payments"
                :totals="detailEarnings.totals"
                :commission-rate="detailEarnings.commission_rate || 0"
                :status="detailEarnings.status"
                :loading="loadingDetails"
                :payable-type-filter="filters.payable_type"
                :active-filter-chips="activeFilterChips"
            />
            <div v-else-if="loadingDetails" class="py-12 text-center text-gray-500">Loading breakdown…</div>

            <template #footer>
                <div class="flex flex-row justify-between w-full">
                    <Button label="Close" severity="secondary" outlined @click="detailsOpen = false" />
                    <Button
                        v-if="selectedZone"
                        label="Settle"
                        icon="pi pi-check"
                        :loading="settlingId === selectedZone.id"
                        @click="settle(selectedZone)"
                    />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import api from '../../boot/api';
import SettlementBreakdown from './settlement/SettlementBreakdown.vue';

const toast = useToast();

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
});

const selectedMonth = ref(startOfMonth(new Date()));
const parkingZones = ref([]);
const zoneSummaries = ref([]);
const earningsCache = ref({});
const loadingSummaries = ref(false);
const loadingDetails = ref(false);
const detailsOpen = ref(false);
const selectedZone = ref(null);
const detailEarnings = ref(null);
const settlingId = ref(null);
const vehicleTypeOptions = ref([]);
const showAdvancedFilters = ref(false);

const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' },
];
const payableTypeOptions = [
    { label: 'All Types', value: '' },
    { label: 'Parking', value: 'parking' },
    { label: 'Booking', value: 'booking' },
];
const parkingStatusOptions = [
    { label: 'All Parking Statuses', value: '' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
];
const bookingStatusOptions = [
    { label: 'All Booking Statuses', value: '' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
];
const paymentStatusOptions = [
    { label: 'All Payment Statuses', value: '' },
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Failed', value: 'failed' },
];
const paymentMethodOptions = [
    { label: 'All Methods', value: '' },
    { label: 'Wallet', value: 'wallet' },
    { label: 'UPI', value: 'upi' },
    { label: 'Cash', value: 'cash' },
    { label: 'Card', value: 'card' },
    { label: 'Razorpay', value: 'razorpay' },
];

const showParkingStatusFilter = computed(() => filters.value.payable_type !== 'booking');
const showBookingStatusFilter = computed(() => filters.value.payable_type !== 'parking');

function startOfMonth(date) {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

const monthLabel = computed(() => {
    if (!selectedMonth.value) return '';
    return selectedMonth.value.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
});

const settlementMonthKey = computed(() => formatSettlementMonth(selectedMonth.value));

const detailsDialogTitle = computed(() => {
    if (!selectedZone.value) return 'Settlement details';
    const month = selectedZone.value.monthLabel || monthLabel.value;
    return month ? `Settlement — ${selectedZone.value.name} (${month})` : `Settlement — ${selectedZone.value.name}`;
});

function formatSettlementMonth(date) {
    if (!date) return '';
    const d = startOfMonth(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${month}-${d.getFullYear()}`;
}

const onMonthChange = (value) => {
    if (value) {
        selectedMonth.value = startOfMonth(value);
    }
};

const formatMoney = (value) =>
    (Number(value) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const isBlank = (value) => value === '' || value === null || value === undefined;

const sanitizeFilters = () => {
    const next = {};
    const source = filters.value;

    if (!isBlank(source.status)) next.status = source.status;
    if (!isBlank(source.parking_status) && source.payable_type !== 'booking') {
        next.parking_status = source.parking_status;
    }
    if (!isBlank(source.booking_status) && source.payable_type !== 'parking') {
        next.booking_status = source.booking_status;
    }
    if (!isBlank(source.payment_status)) next.payment_status = source.payment_status;
    if (!isBlank(source.payment_method)) next.payment_method = source.payment_method;
    if (!isBlank(source.vehicle_type)) next.vehicle_type = source.vehicle_type;
    if (!isBlank(source.user_id)) next.user_id = source.user_id;
    if (!isBlank(source.payable_type)) next.payable_type = source.payable_type;
    if (!isBlank(source.min_amount)) next.min_amount = Number(source.min_amount);
    if (!isBlank(source.max_amount)) next.max_amount = Number(source.max_amount);

    return next;
};

const activeFilterChips = computed(() => {
    const chips = [];
    if (monthLabel.value) {
        chips.push({ key: 'month', label: `month: ${monthLabel.value}` });
    }
    const cleaned = sanitizeFilters();
    Object.entries(cleaned).forEach(([key, value]) => {
        chips.push({
            key,
            label: `${key.replaceAll('_', ' ')}: ${value}`,
        });
    });
    return chips;
});

const validateFilters = (sanitized) => {
    if (sanitized.payable_type && !['parking', 'booking'].includes(sanitized.payable_type)) {
        toast.add({ severity: 'error', summary: 'Validation', detail: 'Invalid payable type', life: 3000 });
        return false;
    }
    if (sanitized.min_amount !== undefined && Number.isNaN(Number(sanitized.min_amount))) {
        toast.add({ severity: 'error', summary: 'Validation', detail: 'Minimum amount must be numeric', life: 3000 });
        return false;
    }
    if (sanitized.max_amount !== undefined && Number.isNaN(Number(sanitized.max_amount))) {
        toast.add({ severity: 'error', summary: 'Validation', detail: 'Maximum amount must be numeric', life: 3000 });
        return false;
    }
    if (
        sanitized.min_amount !== undefined &&
        sanitized.max_amount !== undefined &&
        Number(sanitized.max_amount) < Number(sanitized.min_amount)
    ) {
        toast.add({
            severity: 'error',
            summary: 'Validation',
            detail: 'Maximum amount must be greater than or equal to minimum amount',
            life: 3000,
        });
        return false;
    }
    return true;
};

const formatApiDate = (date) =>
    date
        .toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })
        .replaceAll('/', '-');

const buildDateFilter = () => {
    if (!selectedMonth.value) return null;

    const start = startOfMonth(selectedMonth.value);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

    return {
        start: formatApiDate(start),
        end: formatApiDate(end),
    };
};

const buildEarningsParams = (zoneId) => {
    const sanitizedFilters = sanitizeFilters();
    const params = {
        parking_zone_id: zoneId,
        dateFilter: buildDateFilter(),
    };
    if (Object.keys(sanitizedFilters).length > 0) {
        params.filters = sanitizedFilters;
    }
    return params;
};

const mapEarningsToSummary = (zone, data) => {
    const commissionRate = Number(data.commission_rate) || 0;
    const grandTotal = Number(data.totals?.grand_total) || 0;

    return {
        id: zone.id,
        name: zone.name,
        address: zone.address,
        monthLabel: monthLabel.value,
        settlementMonth: settlementMonthKey.value,
        status: data.status,
        commissionRate,
        totals: data.totals,
        grandTotal,
        commissionShare: grandTotal * commissionRate,
        zoneShare: grandTotal * (1 - commissionRate),
        parkingCount: data.payments?.parking?.length ?? 0,
        bookingCount: data.payments?.booking?.length ?? 0,
    };
};

const fetchZoneEarnings = async (zone) => {
    const { data } = await api.get('earnings', { params: buildEarningsParams(zone.id) });
    earningsCache.value[zone.id] = data;
    return mapEarningsToSummary(zone, data);
};

const loadSummaries = async () => {
    if (!selectedMonth.value) {
        toast.add({ severity: 'warn', summary: 'Month required', detail: 'Select a month first', life: 3000 });
        return;
    }

    const sanitizedFilters = sanitizeFilters();
    if (!validateFilters(sanitizedFilters)) return;

    loadingSummaries.value = true;
    earningsCache.value = {};

    try {
        const results = await Promise.all(parkingZones.value.map((zone) => fetchZoneEarnings(zone)));
        zoneSummaries.value = results.sort((a, b) => b.grandTotal - a.grandTotal);
    } catch (error) {
        console.error('Error loading settlement summaries:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'Failed to load settlement summaries',
            life: 3000,
        });
    } finally {
        loadingSummaries.value = false;
    }
};

const openDetails = async (row) => {
    selectedZone.value = {
        id: row.id,
        name: row.name,
        address: row.address,
        monthLabel: row.monthLabel,
        settlementMonth: row.settlementMonth,
    };
    detailsOpen.value = true;

    const cached = earningsCache.value[row.id];
    if (cached) {
        detailEarnings.value = cached;
        return;
    }

    loadingDetails.value = true;
    try {
        const { data } = await api.get('earnings', { params: buildEarningsParams(row.id) });
        earningsCache.value[row.id] = data;
        detailEarnings.value = data;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'Failed to load settlement details',
            life: 3000,
        });
        detailsOpen.value = false;
    } finally {
        loadingDetails.value = false;
    }
};

const settle = async (row) => {
    const month = row.settlementMonth || settlementMonthKey.value;
    if (!month) return;

    settlingId.value = row.id;
    try {
        const { data } = await api.post('settlement/initiate', {
            parkingZoneId: row.id,
            month,
        });
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: data.message || 'Settlement initiated successfully',
            life: 3000,
        });
        await loadSummaries();
        if (detailsOpen.value && selectedZone.value?.id === row.id) {
            detailEarnings.value = earningsCache.value[row.id] ?? detailEarnings.value;
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'An error occurred during settlement',
            life: 3000,
        });
    } finally {
        settlingId.value = null;
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
    };
    showAdvancedFilters.value = false;
    selectedMonth.value = startOfMonth(new Date());
    await loadSummaries();
};

const getParkingZonesData = async () => {
    const { data } = await api.get('parking-zones');
    parkingZones.value = data.parking_zones?.data ?? data?.data ?? [];
};

const getVehicleTypes = async () => {
    try {
        const { data } = await api.get('vehicle-types');
        const items = data?.vehicle_types?.data || [];
        vehicleTypeOptions.value = [
            { label: 'All Vehicle Types', value: null },
            ...items.map((item) => ({ label: item.name, value: item.id })),
        ];
    } catch {
        vehicleTypeOptions.value = [{ label: 'All Vehicle Types', value: null }];
    }
};

onMounted(async () => {
    await getParkingZonesData();
    await getVehicleTypes();
    await loadSummaries();
});
</script>
