<template>
    <Panel header="Commission Rate" class="w-full">
        <template #header>
            <div class="flex flex-row items-center justify-between w-full">
                <div>Commission Rate</div>
                <div class="flex flex-row items-center gap-2">
                    <Button icon="pi pi-save" @click="submit" label="SAVE"></Button>
                </div>
            </div>
        </template>
        <div class="grid grid-cols-2">
            <div>
                <div class="flex flex-row items-center justify-between">
                    <InputGroup>
                        <InputNumber v-model="commission" v-keyfilter.int />
                        <InputGroupAddon>
                            <span>%</span>
                        </InputGroupAddon>
                    </InputGroup>
                </div>
                <div>
                    <span class="text-sm text-gray-500">Commission rate is the percentage of the total amount that will
                        be
                        charged as a commission.</span>
                    <span class="text-sm text-red-500" v-if="commission < 0">Please enter a valid commission
                        rate.</span>
                </div>
            </div>
        </div>
    </Panel>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../../../boot/api';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const commission = ref();

const submit = async () => {
    try {
        if (commission.value <= 0) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a valid commission rate',
                life: 3000,
            });
            return;
        }
        if (commission.value > 100) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Commission rate cannot be more than 100%',
                life: 3000,
            });
            return;
        }
        const fd = new FormData();
        fd.append('key', 'commission_rate');
        fd.append('value', commission.value / 100);
        await api.post('settings', fd);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Commission rate updated successfully',
            life: 3000,
        });
        await getCommissionRate();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update commission rate',
            life: 3000,
        });
    }
};

const getCommissionRate = async () => {
    try {
        const { data } = await api.get('settings', { params: { key: 'commission_rate' } });
        commission.value = data.value * 100;
        return;
    } catch (error) {
        commission.value = 0;
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No commission rate found',
            life: 3000,
        });
    }
};

onMounted(async () => {
    await getCommissionRate();
});
</script>