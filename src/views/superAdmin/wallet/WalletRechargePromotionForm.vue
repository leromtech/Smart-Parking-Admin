<template>
    <div class="flex flex-col gap-4 md:w-[520px] max-h-[70vh] overflow-y-auto pr-1">
        <div class="flex flex-col gap-2">
            <label class="font-medium">Name</label>
            <InputText v-model="form.name" placeholder="e.g. Launch offer" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
                <label class="font-medium">Promotion type</label>
                <Select
                    v-model="form.discount_type"
                    :options="DISCOUNT_TYPE_OPTIONS"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select type"
                />
            </div>
            <div class="flex flex-col gap-2">
                <label class="font-medium">{{ discountValueLabel }}</label>
                <InputNumber v-model="form.discount_value" :min="0" fluid />
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
                <label class="font-medium">Priority</label>
                <InputNumber v-model="form.priority" :min="0" fluid />
                <span class="text-xs text-gray-500">Higher = evaluated first</span>
            </div>
            <div class="flex flex-col gap-2 justify-end">
                <label class="font-medium">Active</label>
                <ToggleSwitch v-model="form.is_active" />
            </div>
        </div>

        <Divider />
        <p class="text-sm font-semibold text-sky-800">Usage limits (optional)</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex flex-col gap-2">
                <label class="font-medium">First N users</label>
                <InputNumber v-model="form.first_n_users" :min="1" fluid placeholder="e.g. 100" />
            </div>
            <div class="flex flex-col gap-2">
                <label class="font-medium">Max uses (global)</label>
                <InputNumber v-model="form.max_uses" :min="1" fluid />
            </div>
            <div class="flex flex-col gap-2">
                <label class="font-medium">Max uses per user</label>
                <InputNumber v-model="form.max_uses_per_user" :min="1" fluid />
            </div>
        </div>

        <Divider />
        <p class="text-sm font-semibold text-sky-800">Schedule (optional)</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
                <label class="font-medium">Valid from</label>
                <DatePicker v-model="form.starts_at" dateFormat="yy-mm-dd" showIcon fluid />
            </div>
            <div class="flex flex-col gap-2">
                <label class="font-medium">Valid until</label>
                <DatePicker v-model="form.ends_at" dateFormat="yy-mm-dd" showIcon fluid />
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
                <label class="font-medium">Daily start time</label>
                <InputText v-model="form.daily_start_time" placeholder="14:00" />
            </div>
            <div class="flex flex-col gap-2">
                <label class="font-medium">Daily end time</label>
                <InputText v-model="form.daily_end_time" placeholder="18:00" />
            </div>
        </div>

        <Divider />
        <p class="text-sm font-semibold text-sky-800">Targeting (optional)</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
                <label class="font-medium">Recharge pack only</label>
                <Select
                    v-model="form.wallet_recharge_amount_id"
                    :options="packOptions"
                    optionLabel="label"
                    optionValue="value"
                    showClear
                    placeholder="Any pack"
                />
            </div>
            <div class="flex flex-col gap-2">
                <label class="font-medium">Min recharge amount (₹)</label>
                <InputNumber v-model="form.min_recharge_amount" :min="0" mode="currency" currency="INR" fluid />
            </div>
        </div>

        <Button class="mt-2" label="Save promotion" :loading="submitting" @click="submit" />
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import api from '../../../boot/api';
import useWalletRechargePromotions, {
    DISCOUNT_TYPE_OPTIONS,
} from '../../../scripts/admin/walletRechargePromotions';

const emit = defineEmits(['saved']);
const toast = useToast();

const {
    form,
    editItem,
    rechargePacks,
    getPromotions,
    getRechargePacks,
    resetForm,
} = useWalletRechargePromotions();

const submitting = ref(false);

const packOptions = computed(() =>
    rechargePacks.value.map((p) => ({
        label: `${p.name} (₹${p.amount})`,
        value: p.id,
    }))
);

const discountValueLabel = computed(() => {
    switch (form.value.discount_type) {
        case 'percent_off':
            return 'Percent off';
        case 'fixed_off':
            return 'Amount off (₹)';
        case 'bonus_coins_percent':
            return 'Bonus coins (%)';
        case 'bonus_coins_fixed':
            return 'Bonus coins (fixed)';
        default:
            return 'Discount value';
    }
});

const toDate = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
};

const formatDate = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 10);
};

const appendIfSet = (fd, key, value) => {
    if (value !== null && value !== undefined && value !== '') {
        fd.append(key, value);
    }
};

const loadEditItem = () => {
    if (!editItem.value) return;
    const item = editItem.value;
    form.value = {
        id: item.id,
        name: item.name ?? '',
        discount_type: item.discount_type ?? 'percent_off',
        discount_value: item.discount_value != null ? Number(item.discount_value) : null,
        is_active: Boolean(item.is_active),
        priority: item.priority ?? 0,
        first_n_users: item.first_n_users ?? null,
        max_uses: item.max_uses ?? null,
        max_uses_per_user: item.max_uses_per_user ?? null,
        starts_at: toDate(item.starts_at),
        ends_at: toDate(item.ends_at),
        daily_start_time: item.daily_start_time ?? null,
        daily_end_time: item.daily_end_time ?? null,
        wallet_recharge_amount_id: item.wallet_recharge_amount_id ?? null,
        min_recharge_amount: item.min_recharge_amount != null ? Number(item.min_recharge_amount) : null,
    };
};

const submit = async () => {
    if (!form.value.name?.trim()) {
        toast.add({ severity: 'warn', summary: 'Validation', detail: 'Name is required', life: 3000 });
        return;
    }
    if (form.value.discount_value == null || form.value.discount_value < 0) {
        toast.add({ severity: 'warn', summary: 'Validation', detail: 'Discount value is required', life: 3000 });
        return;
    }

    submitting.value = true;
    try {
        const fd = new FormData();
        fd.append('name', form.value.name.trim());
        fd.append('discount_type', form.value.discount_type);
        fd.append('discount_value', form.value.discount_value);
        fd.append('is_active', form.value.is_active ? 1 : 0);
        fd.append('priority', form.value.priority ?? 0);

        appendIfSet(fd, 'first_n_users', form.value.first_n_users);
        appendIfSet(fd, 'max_uses', form.value.max_uses);
        appendIfSet(fd, 'max_uses_per_user', form.value.max_uses_per_user);
        appendIfSet(fd, 'starts_at', formatDate(form.value.starts_at));
        appendIfSet(fd, 'ends_at', formatDate(form.value.ends_at));
        appendIfSet(fd, 'daily_start_time', form.value.daily_start_time);
        appendIfSet(fd, 'daily_end_time', form.value.daily_end_time);
        appendIfSet(fd, 'wallet_recharge_amount_id', form.value.wallet_recharge_amount_id);
        appendIfSet(fd, 'min_recharge_amount', form.value.min_recharge_amount);

        let url = 'wallet-recharge-promotions';
        if (form.value.id) {
            url += `/${form.value.id}`;
            fd.append('_method', 'PATCH');
        }

        const { data } = await api.post(url, fd);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: data.message || 'Promotion saved',
            life: 3000,
        });
        resetForm();
        await getPromotions();
        emit('saved');
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'Failed to save promotion',
            life: 3000,
        });
    } finally {
        submitting.value = false;
    }
};

onMounted(async () => {
    await getRechargePacks();
    loadEditItem();
});

onUnmounted(() => {
    editItem.value = null;
    resetForm();
});
</script>
