<template>
    <Panel class="w-full h-full" :header="`Closed Days`">
        <!-- Recurring Days -->
        <div class="flex flex-col gap-4">
            <h3>Recurring Closed Days</h3>
            <div v-for="(day, index) in daysOfWeek" :key="index" class="flex flex-row items-center gap-2">
                <label :for="day">{{ day }}</label>
                <input type="checkbox" :id="day" :value="index" v-model="recurring" />
            </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end mt-4">
            <Button label="Save" icon="pi pi-save" @click="submit" />
        </div>
    </Panel>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

import Button from 'primevue/button';
import api from '../../../boot/api';
import { useToast } from 'primevue';
import useAuth from '../../../scripts/auth';
import { useParkingZone } from '../../../scripts/parkingZone';

const { parking_zone } = useParkingZone()
const toast = useToast();

// Days of the week
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Reactive variables
const recurring = ref([0, 6]); // Sunday and Saturday closed by default

const submit = async () => {
    try {
        const fd = new FormData();
        fd.append('recurring_days', JSON.stringify(recurring.value));
        fd.append('parking_zone_id', parking_zone.value.id)
        const { data } = await api.post('parking-closed-days', fd); // Adjust the endpoint as needed

        // Show success toast
        toast.add({
            severity: 'success',
            summary: 'Succeßss',
            detail: data.message || 'Recurring closed days saved successfully',
            life: 3000,
        });
    } catch (e) {
        // Show error toast
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: e.response?.data?.error || 'Failed to save recurring closed days',
            life: 3000,
        });
    }
};

const getRecurringDays = async () => {
    const { data } = await api.get('parking-closed-days', {
        params: {
            parking_zone_id: parking_zone.value.id
        }
    })
    recurring.value = data.recurring_days
}
watch(parking_zone, () => {
    getRecurringDays()
    console.log('here')
}, { immediate: true })

</script>