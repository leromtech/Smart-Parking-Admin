<template>
    <form @submit.prevent="submit" class="flex flex-col gap-6">
        <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">Customer</label>
            <Select v-model="form.userId" filter @filter="searchUser" :options="filteredUsers" fluid
                optionLabel="label" optionValue="value" placeholder="Select a user" @change="onUserChange" />
        </div>

        <div v-if="selectedUser" class="text-xs text-neutral-500">
            <div v-if="selectedUser.contract_start_date || selectedUser.contract_end_date">
                Contract: {{ selectedUser.contract_start_date || '—' }} → {{ selectedUser.contract_end_date || '—' }}
            </div>
            <div v-if="selectedUser.subscription_limit !== null && selectedUser.subscription_limit !== undefined">
                Subscription limit: {{ selectedUser.subscription_limit }}
            </div>
        </div>

        <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">Subscription rate</label>
            <Select v-model="form.rateId" :options="filteredRates" fluid optionLabel="label" optionValue="value"
                placeholder="Select a rate" @change="onRateChange" />
        </div>

        <div v-if="selectedRate" class="text-xs text-neutral-500">
            <div>Vehicle type: {{ selectedRate.vehicleTypeName }}</div>
            <div>Price: ₹{{ selectedRate.price }} / {{ selectedRate.interval }}</div>
        </div>

        <template v-if="hasContractTenure">
            <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium">Start month</label>
                    <Select v-model="form.monthFrom" :options="monthOptions" fluid optionLabel="label"
                        optionValue="value" placeholder="Select start month" @change="onMonthChange" />
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium">End month</label>
                    <Select v-model="form.monthTo" :options="monthToOptions" fluid optionLabel="label"
                        optionValue="value" placeholder="Select end month" />
                </div>
            </div>
            <small class="text-neutral-400">Select a consecutive range within the contract tenure. Leave blank to use the rate's default duration.</small>
            <small v-if="monthError" class="text-red-500">{{ monthError }}</small>
        </template>
        <small v-else class="text-neutral-400">
            Contract tenure is not set for this user — the rate's default duration will be used.
        </small>

        <Button type="submit" icon="pi pi-save" label="Request subscription" :loading="loading" />
    </form>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import api from '../../../boot/api';
import useAuth from '../../../scripts/auth';
import { useToast } from 'primevue';

const { user } = useAuth();
const toast = useToast();

const emit = defineEmits(['save']);

const filteredUsers = ref([]);
const filteredRates = ref([]);
const loading = ref(false);
const monthError = ref('');

const form = ref({
    userId: null,
    rateId: null,
    monthFrom: null,
    monthTo: null,
});

const selectedUser = computed(() => filteredUsers.value.find((u) => u.value === form.value.userId)?.data ?? null);
const selectedRate = computed(() => filteredRates.value.find((r) => r.value === form.value.rateId) ?? null);

const hasContractTenure = computed(() => {
    return Boolean(selectedUser.value?.contract_start_date && selectedUser.value?.contract_end_date);
});

const parkingZoneId = computed(() => {
    return user.value?.parkingZoneOwned?.id ?? user.value?.parking_zone_owned?.id ?? null;
});

const parseMonth = (value) => {
    const [y, m] = String(value).split('-').map(Number);
    return new Date(y, m - 1, 1);
};

const monthLabel = (y, m) => {
    return new Date(y, m - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
};

const monthOptions = computed(() => {
    const u = selectedUser.value;
    if (!u?.contract_start_date || !u?.contract_end_date) return [];

    const options = [];
    const cursor = parseMonth(u.contract_start_date);
    const last = parseMonth(u.contract_end_date);

    while (cursor <= last) {
        const y = cursor.getFullYear();
        const m = String(cursor.getMonth() + 1).padStart(2, '0');
        options.push({ label: monthLabel(y, m), value: `${y}-${m}` });
        cursor.setMonth(cursor.getMonth() + 1);
    }

    return options;
});

const monthToOptions = computed(() => {
    if (!form.value.monthFrom) return monthOptions.value;
    return monthOptions.value.filter((m) => m.value >= form.value.monthFrom);
});

const buildMonths = () => {
    if (!form.value.monthFrom && !form.value.monthTo) return [];

    const from = form.value.monthFrom ?? form.value.monthTo;
    const to = form.value.monthTo ?? form.value.monthFrom;

    if (from > to) {
        monthError.value = 'Start month must be before or equal to the end month.';
        return null;
    }

    const list = [];
    const cursor = parseMonth(from);
    const last = parseMonth(to);

    while (cursor <= last) {
        const y = cursor.getFullYear();
        const m = String(cursor.getMonth() + 1).padStart(2, '0');
        list.push(`${y}-${m}`);
        cursor.setMonth(cursor.getMonth() + 1);
    }

    return list;
};
const searchUser = async (event) => {
    const query = event?.value ?? '';
    const { data } = await api.get('users', {
        params: { filters: { search: query } },
    });
    filteredUsers.value = (data.data ?? []).map((item) => ({
        label: `${item.name} (${item.phone})`,
        value: item.id,
        data: item,
    }));
};

const fetchRates = async () => {
    const { data } = await api.get(`parking-zone/${parkingZoneId.value}/subscription-rates`);
    filteredRates.value = (data.data ?? []).map((item) => ({
        label: `${item.name ?? '-NO NAME-'} - ₹${item.price}`,
        value: item.id,
        vehicleTypeId: item.vehicle_type_id ?? item.vehicleType?.id ?? null,
        vehicleTypeName: item.vehicleType?.name ?? '-',
        price: item.price,
        interval: item.interval,
    }));
};

const onUserChange = () => {
    form.value.monthFrom = null;
    form.value.monthTo = null;
    monthError.value = '';
};

const onRateChange = () => {
    monthError.value = '';
};

const onMonthChange = () => {
    monthError.value = '';
    if (form.value.monthTo && form.value.monthFrom && form.value.monthTo < form.value.monthFrom) {
        form.value.monthTo = null;
    }
};

const submit = async () => {
    monthError.value = '';

    if (!form.value.userId) {
        toast.add({ severity: 'warn', summary: 'Missing user', detail: 'Please select a customer.', life: 3000 });
        return;
    }
    if (!form.value.rateId) {
        toast.add({ severity: 'warn', summary: 'Missing rate', detail: 'Please select a subscription rate.', life: 3000 });
        return;
    }

    const months = buildMonths();
    if (months === null) return;

    const vehicleTypeId = selectedRate.value?.vehicleTypeId;
    if (!vehicleTypeId) {
        toast.add({ severity: 'error', summary: 'Failed', detail: 'Selected rate has no vehicle type.', life: 3000 });
        return;
    }

    try {
        const fd = new FormData();
        fd.append('user_id', form.value.userId);
        fd.append('subscription_rate_id', form.value.rateId);
        fd.append('vehicle_type_id', vehicleTypeId);
        fd.append('parking_zone_id', parkingZoneId.value);
        fd.append('auto_renew', 'false');
        months.forEach((m) => fd.append('months[]', m));

        loading.value = true;
        const { data } = await api.post('subscriptions/initiate', fd);
        loading.value = false;

        toast.add({
            closable: true,
            severity: 'success',
            summary: 'Success',
            detail: data.message ?? 'Subscription request submitted',
            life: 3000,
        });

        form.value = { userId: null, rateId: null, monthFrom: null, monthTo: null };
        emit('save');
    } catch (e) {
        loading.value = false;
        const detail = e.response?.data?.message ?? 'Unexpected error occurred';
        toast.add({ closable: true, severity: 'error', summary: 'Failed', detail, life: 4000 });
    }
};

onMounted(async () => {
    await fetchRates();
});
</script>
