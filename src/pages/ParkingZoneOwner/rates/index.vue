<template>
    <Panel>
        <template #header>
            <div class="flex flex-row items-center justify-between w-full">
                <span class="font-semibold">Rates</span>
                <Button icon="pi pi-plus" rounded @click="openNewRateDialog" />
            </div>
        </template>

        <Fieldset v-for="(rate, index) in rates" :key="rate.id" :legend="rate.vehicle_type.name">
            <div class="grid grid-cols-6 gap-2 font-medium">
                <p>Order</p>
                <p>Amount</p>
                <p>Duration</p>
                <p>Interval</p>
                <p v-tooltip="'If checked, rate adds per unit (e.g., Rs.10 + Rs.10/min); otherwise, it multiplies.'">Additive</p>
                <p>Actions</p>
            </div>

            <div v-for="interval in rate.intervals" :key="interval.id" class="grid grid-cols-6 gap-2 py-2 border-t mt-2">
                <InputText 
                    v-model="interval.order" 
                    :disabled="editingIntervalId !== interval.id" 
                />
                <InputNumber 
                    inputId="currency-india" 
                    mode="currency" 
                    currency="INR" 
                    locale="en-IN" 
                    v-model="interval.rate_amount" 
                    :disabled="editingIntervalId !== interval.id" 
                />
                <InputText 
                    v-model="interval.duration" 
                    :disabled="editingIntervalId !== interval.id" 
                />
                <Select 
                    :options="intervals" 
                    placeholder="Interval" 
                    v-model="interval.interval" 
                    :disabled="editingIntervalId !== interval.id" 
                />
                <div class="flex items-center justify-start">
                    <Checkbox 
                        v-model="interval.is_additive" 
                        binary 
                        :disabled="editingIntervalId !== interval.id" 
                    />
                </div>
                <div class="flex gap-2">
                    <template v-if="isEditing && editingIntervalId === interval.id">
                        <Button icon="pi pi-check" rounded outlined @click="saveInterval(index)" />
                        <Button icon="pi pi-times" rounded outlined severity="danger" @click="cancelEdit" />
                    </template>
                    <template v-else>
                        <Button 
                            icon="pi pi-pen-to-square" 
                            rounded 
                            outlined 
                            severity="warn" 
                            :disabled="isEditing || isAddingNew" 
                            @click="editInterval(interval, index)" 
                        />
                        <Button 
                            icon="pi pi-trash" 
                            rounded 
                            outlined 
                            severity="danger" 
                            :disabled="isEditing || isAddingNew" 
                            @click="deleteInterval(index, interval.id)" 
                        />
                    </template>
                </div>
            </div>

            <div v-if="isAddingNew && editingRateIndex === index" class="grid grid-cols-6 gap-2 py-2 border-t mt-2">
                <InputNumber v-model="newInterval.order" />
                <InputNumber inputId="currency-india" mode="currency" currency="INR" locale="en-IN" v-model="newInterval.rate_amount" />
                <InputNumber v-model="newInterval.duration" />
                <Select :options="intervals" placeholder="Interval" v-model="newInterval.interval" />
                <div class="flex items-center justify-start">
                    <Checkbox v-model="newInterval.is_additive" binary />
                </div>
                <div class="flex gap-2">
                    <Button icon="pi pi-check" rounded outlined @click="saveInterval(index)" />
                    <Button icon="pi pi-times" rounded outlined severity="danger" @click="cancelEdit" />
                </div>
            </div>

            <Button v-if="!isEditing && !isAddingNew" outlined icon="pi pi-plus" class="mt-4 w-full" @click="startNewInterval(index, rate.id)" />
        </Fieldset>

        <Dialog v-model:visible="showNewRateDialog" header="Add New Rate" :modal="true">
            <div class="flex flex-row items-center justify-center gap-4">
                <Select :options="filteredVehicleTypes" option-value="id" option-label="name" placeholder="Select vehicle type" v-model="newRate.vehicle_type" />
                <Button label="Save" @click="saveNewRate" />
            </div>
        </Dialog>
    </Panel>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import Panel from 'primevue/panel';
import Fieldset from 'primevue/fieldset';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import api from '../../../boot/api';
import { useParkingZone } from '../../../scripts/parkingZone';
import useVehicleTypes from '../../../scripts/admin/vehicleTypes';

const toast = useToast();
const { getRates, rates, parking_zone, intervals } = useParkingZone();
const { vehicleTypes } = useVehicleTypes();

// State for editing/adding intervals
const isEditing = ref(false); // Editing an existing interval
const isAddingNew = ref(false); // Adding a new interval
const editingIntervalId = ref(null);
const editingRateIndex = ref(null);
const newInterval = ref({
    id: null,
    order: 0,
    rate_amount: 0,
    duration: 0,
    interval: 'minute',
    is_additive: false,
    rate_id: null,
});

// State for adding new rates
const showNewRateDialog = ref(false);
const newRate = ref({
    vehicle_type: null,
    parking_zone_id: null,
});

// Computed property for available vehicle types
const filteredVehicleTypes = computed(() => {
    const existingVehicleTypeIds = rates.value.map(rate => rate.vehicle_type_id);
    return vehicleTypes.value.filter(vt => !existingVehicleTypeIds.includes(vt.id));
});

// Initialize rates on mount
onMounted(async () => {
    await getRates();
});

// Watch parking_zone changes
watch(parking_zone, async () => {
    await getRates();
});

// Functions
const resetNewInterval = () => {
    newInterval.value = {
        id: null,
        order: 0,
        rate_amount: 0,
        duration: 0,
        interval: 'minute',
        is_additive: false,
        rate_id: null,
    };
    isEditing.value = false;
    isAddingNew.value = false;
    editingIntervalId.value = null;
    editingRateIndex.value = null;
};

const startNewInterval = (index, rateId) => {
    resetNewInterval();
    isAddingNew.value = true;
    editingRateIndex.value = index;
    newInterval.value.order = rates.value[index].intervals.length + 1;
    newInterval.value.rate_id = rateId;
};

const editInterval = (interval, index) => {
    resetNewInterval();
    isEditing.value = true;
    editingIntervalId.value = interval.id;
    editingRateIndex.value = index;
    newInterval.value = { ...interval, rate_id: rates.value[index].id };
};

const saveInterval = async (index) => {
    const interval = newInterval.value;
    if (!interval.rate_amount || !interval.duration || !interval.interval) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all fields', life: 2000 });
        return;
    }
    if (interval.rate_amount < 0 || interval.duration < 0) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Values cannot be negative', life: 2000 });
        return;
    }

    const fd = new FormData();
    for (const [key, value] of Object.entries(interval)) {
        fd.append(key, value);
    }
    fd.append('parking_zone_id', parking_zone.value.id)
    try {
        if (interval.id) {
            // Update existing interval
            fd.append('_method', 'PATCH');
            const { data } = await api.post(`rate-intervals/${interval.id}`, fd);
            if (data.success) {
                const updatedInterval = rates.value[index].intervals.find(i => i.id === interval.id);
                Object.assign(updatedInterval, interval);
            }
            toast.add({ severity: data.success ? 'success' : 'error', summary: data.success ? 'Success' : 'Error', detail: data.message, life: 2000 });
        } else {
            // Add new interval
            const { data } = await api.post('rate-intervals', fd);
            if (data.success) {
                rates.value[index].intervals.push({ ...interval, id: data.rate_interval_id }); // Assuming API returns ID
            }
            toast.add({ severity: data.success ? 'success' : 'error', summary: data.success ? 'Success' : 'Error', detail: data.message, life: 2000 });
        }
        resetNewInterval();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save interval', life: 2000 });
    }
};

const deleteInterval = async (index, intervalId) => {
    if (!confirm('Are you sure you want to delete this interval?')) return;
    try {
        const fd = new FormData()
        fd.append("_method", 'DELETE')
        const { data } = await api.post(`rate-intervals/${intervalId}`, fd);
        if (data.success) {
            rates.value[index].intervals = rates.value[index].intervals.filter(i => i.id !== intervalId);
        }
        toast.add({ severity: data.success ? 'success' : 'error', summary: data.success ? 'Success' : 'Error', detail: data.message, life: 2000 });
    } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete interval', life: 2000 });
    }
};

const openNewRateDialog = () => {
    newRate.value.vehicle_type = null;
    newRate.value.parking_zone_id = parking_zone.value.id;
    showNewRateDialog.value = true;
};

const saveNewRate = async () => {
    if (!newRate.value.vehicle_type) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a vehicle type', life: 2000 });
        return;
    }

    const fd = new FormData();
    for (const [key, value] of Object.entries(newRate.value)) {
        fd.append(key, value);
    }

    try {
        const { data } = await api.post('rates', fd);
        if (data.success) {
            await getRates(); // Refresh rates
        }
        toast.add({ severity: data.success ? 'success' : 'error', summary: data.success ? 'Success' : 'Error', detail: data.message, life: 2000 });
        showNewRateDialog.value = false;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save rate', life: 2000 });
    }
};

const cancelEdit = () => {
    resetNewInterval();
};
</script>

<style scoped>
.grid {
    display: grid;
}
.grid-cols-6 {
    grid-template-columns: repeat(6, 1fr);
}
.gap-2 {
    gap: 0.5rem;
}
.py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
}
.border-t {
    border-top: 1px solid #e5e7eb;
}
.mt-2 {
    margin-top: 0.5rem;
}
.mt-4 {
    margin-top: 1rem;
}
.w-full {
    width: 100%;
}
</style>

