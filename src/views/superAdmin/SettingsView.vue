<template>
    <div class="flex flex-col gap-4 w-full">
        <Panel class="w-full">
            <template #header>
                <div class="flex flex-row items-center justify-between w-full">
                    <div>Post Carwash Free Parking Period</div>
                    <div class="flex flex-row items-center gap-2">
                        <Button icon="pi pi-save" @click="saveFreePostCarwashPeriod" label="SAVE"></Button>
                    </div>
                </div>
            </template>
            <div class="grid grid-cols-2">
                <div>
                    <div class="flex flex-row items-center justify-between">
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-stopwatch"></i>
                            </InputGroupAddon>
                            <InputNumber v-model="freePostCarwashPeriod" v-keyfilter.int :min="0"
                                :style="{ width: '100%' }" />
                            <InputGroupAddon>
                                <span>Minutes</span>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                    <div class="mt-2">
                        <span class="text-sm text-gray-500">
                            Free parking period (in minutes) after carwash service completion.
                        </span>
                        <span class="text-sm text-red-500 block" v-if="freePostCarwashPeriod < 0">
                            Please enter a valid period (0 or greater).
                        </span>
                    </div>
                </div>
            </div>
        </Panel>

        <Panel class="w-full">
            <template #header>
                <div class="flex flex-row items-center justify-between w-full">
                    <div>Two-Wheeler Wash Timer</div>
                    <div class="flex flex-row items-center gap-2">
                        <Button icon="pi pi-save" @click="saveTwoWheelerWashTimer" label="SAVE"></Button>
                    </div>
                </div>
            </template>
            <div class="grid grid-cols-2">
                <div>
                    <div class="flex flex-row items-center justify-between">
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-stopwatch"></i>
                            </InputGroupAddon>
                            <InputNumber v-model="twoWheelerWashTimer" v-keyfilter.int :min="0"
                                :style="{ width: '100%' }" />
                            <InputGroupAddon>
                                <span>Minutes</span>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                    <div class="mt-2">
                        <span class="text-sm text-gray-500">
                            Wash timer (in minutes) for two-wheelers (space occupied = 1).
                        </span>
                        <span class="text-sm text-red-500 block" v-if="twoWheelerWashTimer < 0">
                            Please enter a valid period (0 or greater).
                        </span>
                    </div>
                </div>
            </div>
        </Panel>

        <Panel class="w-full">
            <template #header>
                <div class="flex flex-row items-center justify-between w-full">
                    <div>Four-Wheeler Wash Timer</div>
                    <div class="flex flex-row items-center gap-2">
                        <Button icon="pi pi-save" @click="saveFourWheelerWashTimer" label="SAVE"></Button>
                    </div>
                </div>
            </template>
            <div class="grid grid-cols-2">
                <div>
                    <div class="flex flex-row items-center justify-between">
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-stopwatch"></i>
                            </InputGroupAddon>
                            <InputNumber v-model="fourWheelerWashTimer" v-keyfilter.int :min="0"
                                :style="{ width: '100%' }" />
                            <InputGroupAddon>
                                <span>Minutes</span>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                    <div class="mt-2">
                        <span class="text-sm text-gray-500">
                            Wash timer (in minutes) for four-wheelers (space occupied &gt; 1).
                        </span>
                        <span class="text-sm text-red-500 block" v-if="fourWheelerWashTimer < 0">
                            Please enter a valid period (0 or greater).
                        </span>
                    </div>
                </div>
            </div>
        </Panel>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../../boot/api';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const freePostCarwashPeriod = ref(0);
const twoWheelerWashTimer = ref(0);
const fourWheelerWashTimer = ref(0);

const getFreePostCarwashPeriod = async () => {
    try {
        const { data } = await api.get('settings', {
            params: { key: 'free_post_carwash_period' }
        });
        freePostCarwashPeriod.value = parseInt(data.value) || 0;
    } catch (error) {
        freePostCarwashPeriod.value = 0;
        // Don't show error if setting doesn't exist yet (first time)
        if (error.response && error.response.status !== 404) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch post carwash free parking period',
                life: 3000,
            });
        }
    }
};

const saveFreePostCarwashPeriod = async () => {
    try {
        if (freePostCarwashPeriod.value < 0) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a valid period (0 or greater)',
                life: 3000,
            });
            return;
        }
        const fd = new FormData();
        fd.append('key', 'free_post_carwash_period');
        fd.append('value', freePostCarwashPeriod.value);
        await api.post('settings', fd);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Post carwash free parking period updated successfully',
            life: 3000,
        });
        await getFreePostCarwashPeriod();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update post carwash free parking period',
            life: 3000,
        });
    }
};

const getTwoWheelerWashTimer = async () => {
    try {
        const { data } = await api.get('settings', {
            params: { key: 'two_wheeler_wash_timer' }
        });
        twoWheelerWashTimer.value = parseInt(data.value) || 0;
    } catch (error) {
        twoWheelerWashTimer.value = 0;
        // Don't show error if setting doesn't exist yet (first time)
        if (error.response && error.response.status !== 404) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch two-wheeler wash timer',
                life: 3000,
            });
        }
    }
};

const getFourWheelerWashTimer = async () => {
    try {
        const { data } = await api.get('settings', {
            params: { key: 'four_wheeler_wash_timer' }
        });
        fourWheelerWashTimer.value = parseInt(data.value) || 0;
    } catch (error) {
        fourWheelerWashTimer.value = 0;
        // Don't show error if setting doesn't exist yet (first time)
        if (error.response && error.response.status !== 404) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch four-wheeler wash timer',
                life: 3000,
            });
        }
    }
};

const saveTwoWheelerWashTimer = async () => {
    try {
        if (twoWheelerWashTimer.value < 0) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a valid period (0 or greater)',
                life: 3000,
            });
            return;
        }
        const fd = new FormData();
        fd.append('key', 'two_wheeler_wash_timer');
        fd.append('value', twoWheelerWashTimer.value);
        await api.post('settings', fd);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Two-wheeler wash timer updated successfully',
            life: 3000,
        });
        await getTwoWheelerWashTimer();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update two-wheeler wash timer',
            life: 3000,
        });
    }
};

const saveFourWheelerWashTimer = async () => {
    try {
        if (fourWheelerWashTimer.value < 0) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a valid period (0 or greater)',
                life: 3000,
            });
            return;
        }
        const fd = new FormData();
        fd.append('key', 'four_wheeler_wash_timer');
        fd.append('value', fourWheelerWashTimer.value);
        await api.post('settings', fd);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Four-wheeler wash timer updated successfully',
            life: 3000,
        });
        await getFourWheelerWashTimer();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update four-wheeler wash timer',
            life: 3000,
        });
    }
};

onMounted(async () => {
    await getFreePostCarwashPeriod();
    await getTwoWheelerWashTimer();
    await getFourWheelerWashTimer();
});
</script>
