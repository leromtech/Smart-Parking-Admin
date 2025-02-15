<template>
    <Panel header="Rates">
        <Fieldset :legend="r.vehicle_type.name" v-for="(r, i) in rates" :key="i">
            <!-- Loop through existing intervals -->
            <div v-for="(interval, j) in r.intervals" :key="j" class="flex flex-row items-center justify-between gap-6">
                <InputGroup>
                    <InputGroupAddon>₹</InputGroupAddon>
                    <InputText v-model="rates[i].intervals[j].rate_amount" v-filter.num />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-stopwatch"></i>
                    </InputGroupAddon>
                    <InputText v-model="rates[i].intervals[j].duration" v-filter.num />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon>Interval</InputGroupAddon>
                    <Select v-model="rates[i].intervals[j].interval" :options="intervals" />
                </InputGroup>
                <div class="flex flex-row gap-2">
                    <Button icon="pi pi-check" outlined rounded @click="() => updateInterval(rates[i].intervals[j])" />
                    <Button icon="pi pi-trash" severity="danger" outlined rounded @click="cancelNewRate" />
                </div>
            </div>

            <!-- Add new interval form -->
            <div v-if="newRateForm.vehicleTypeIndex === i" class="flex flex-row items-center justify-between gap-6">
                <InputGroup>
                    <InputGroupAddon>₹</InputGroupAddon>
                    <InputText v-model="newRateForm.rate_amount" v-filter.num />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-stopwatch"></i>
                    </InputGroupAddon>
                    <InputText v-model="newRateForm.duration" v-filter.num />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon>Interval</InputGroupAddon>
                    <Select v-model="newRateForm.interval" :options="intervals" />
                </InputGroup>
                <div class="flex flex-row gap-2">
                    <Button icon="pi pi-check" outlined rounded @click="saveNewRate(i)" />
                    <Button icon="pi pi-times" severity="danger" outlined rounded @click="cancelNewRate" />
                </div>
            </div>

            <!-- Add button -->
            <div class="flex flex-row w-full items-center justify-center" v-if="newRateForm.vehicleTypeIndex !== i">
                <Button icon="pi pi-plus" outlined id="but" @click="() => openNewRateForm(i, rates[i].id)"></Button>
            </div>
        </Fieldset>
    </Panel>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useParkingZone } from '../../../scripts/parkingZone';
import { ColumnGroupStyle, InputText, Select, useToast } from 'primevue';
import api from '../../../boot/api';

const toast = useToast()

const { getRates, rates, parking_zone, intervals } = useParkingZone();

// New rate form state
const newRateForm = ref({
    vehicleTypeIndex: null, // Track which vehicle type the new rate is for
    rate_amount: 0,
    duration: 0,
    interval: 'minute'
});

const updateInterval = async (item) => {
    const fd = new FormData()
    for (const [key, value] of Object.entries(item)) {
        fd.append(key, value);
    }
    fd.append('_method', 'PATCH')
    const { data } = await api.post(`rate-intervals/${item.id}`, fd)

    toast.add({ severity: data.success ? 'success' : 'error', summary: data.success ? 'Success' : 'Error', detail: data.message, life: 800 })
}

// Open the new rate form
const openNewRateForm = (index, rateId) => {
    newRateForm.value.vehicleTypeIndex = index;
    newRateForm.value.rate_id = rateId;
};

// Save the new rate
const saveNewRate = async (index) => {
    if (newRateForm.value.rate_amount && newRateForm.value.duration && newRateForm.value.interval) {
        rates.value[index].intervals.push({
            rate_amount: newRateForm.value.rate_amount,
            duration: newRateForm.value.duration,
            interval: newRateForm.value.interval
        });
        const fd = new FormData()
        for (let [key, value] of Object.entries(newRateForm.value)) {
            fd.append(key, value)
        }
        fd.append('parking_zone_id', parking_zone.value.id)
        const { data } = await api.post('rate-intervals', fd)

        toast.add({ severity: data.success ? 'success' : 'error', summary: data.success ? 'Success' : 'Error', detail: data.message, life: 2000 })

        // Reset the form
        cancelNewRate();
    } else {
        console.error('Please fill all fields');
    }
};

// Cancel the new rate form
const cancelNewRate = () => {
    newRateForm.value.vehicleTypeIndex = null;
    newRateForm.value.rate_amount = '';
    newRateForm.value.duration = '';
    newRateForm.value.interval = '';
};

watch(parking_zone, async () => {
    await getRates();
});
</script>

<style>
#but {
    margin-top: 1.2rem;
    width: 100%;
}

.hide {
    visibility: hidden;
}
</style>