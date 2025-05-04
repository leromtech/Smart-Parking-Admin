<template>
    <form @submit.prevent="submitRatePolicy">
        <div class="flex flex-col gap-4 md:w-[500px]">
            <InputText v-model="ratePolicyForm.name" placeholder="Name" />
            <Select :options="vehicleTypes" optionValue="id" optionLabel="name" fluid
                placeholder="Select a vehicle type for the policy" v-model="ratePolicyForm.vehicle_type"></Select>

            <Select :options="policyIntervals" placeholder="Select a policy interval" fluid
                v-model="selectedPolicyInterval" optionLabel="label" optionValue="value"></Select>

            <div class="flex flex-col gap-2">
                <div class="flex flex-row items-center gap-2">
                    <Checkbox binary v-model="fixedRateToggle" :disabled="selectedPolicyInterval == 'hourly'"
                        id="fixed-rate-toggle" @change="handleFixedRateToggle" />
                    <label for="fixed-rate-toggle">Fixed Rate</label>
                </div>
                <div v-if="fixedRateToggle" class="flex flex-row gap-4">
                    <InputGroup>
                        <InputGroupAddon>
                            <span>₹</span>
                        </InputGroupAddon>
                        <InputNumber v-model="ratePolicyForm.fixedRate" mode="currency" currency="INR" />
                    </InputGroup>
                </div>
            </div>

            <div class="flex flex-row items-center gap-2">
                <Checkbox binary v-model="timingToggle" :disabled="selectedPolicyInterval !== 'hourly'"
                    @change="handleTimingToggle" />
                <label for="timing-toggle">Timing</label>
            </div>
            <div v-if="timingToggle" class="flex flex-row gap-4">
                <div>
                    <label for="from">From</label>
                    <DatePicker v-model="ratePolicyForm.from" showIcon fluid iconDisplay="input" id="from" timeOnly
                        hourFormat="12">
                        <template #inputicon="slotProps">
                            <i class="pi pi-clock" @click="slotProps.clickCallback" />
                        </template>
                    </DatePicker>
                </div>
                <div>
                    <label for="to">To</label>
                    <DatePicker v-model="ratePolicyForm.to" showIcon fluid iconDisplay="input" id="to" timeOnly
                        hourFormat="12">
                        <template #inputicon="slotProps">
                            <i class="pi pi-clock" @click="slotProps.clickCallback" />
                        </template>
                    </DatePicker>
                </div>
            </div>

            <Button type="submit">Submit</Button>
        </div>
    </form>
</template>

<script setup>
import { watch } from 'vue';
import useVehicleTypes from '../../../scripts/admin/vehicleTypes';
import { useToast } from 'primevue';
import useCreateRate from '../../../scripts/parkingZoneOwner/rate';
import { useParkingZone } from '../../../scripts/parkingZone';

const { parking_zone } = useParkingZone()
const toast = useToast()

const {
    fixedRateToggle,
    policyIntervals,
    selectedPolicyInterval,
    ratePolicyForm,
    timingToggle,
    submitRatePolicy
} = useCreateRate(parking_zone.id, toast)

const { vehicleTypes } = useVehicleTypes()

// Handle toggle changes
const handleFixedRateToggle = (value) => {
    // If toggle is off, set fixedRate to null or 0
    if (!value) {
        ratePolicyForm.fixedRate = null;
    } else if (ratePolicyForm.fixedRate === null) {
        // If turning on and value is null, initialize with 0
        ratePolicyForm.fixedRate = 0;
    }
}

// Handle timing toggle
const handleTimingToggle = (value) => {
    if (!value) {
        ratePolicyForm.from = null;
        ratePolicyForm.to = null;
    }
}

// Watch for policy interval changes
watch(selectedPolicyInterval, (newVal) => {
    // Reset related fields when interval changes
    if (newVal === 'hourly') {
        fixedRateToggle.value = false;
        ratePolicyForm.fixedRate = null;
    }
});
</script>
