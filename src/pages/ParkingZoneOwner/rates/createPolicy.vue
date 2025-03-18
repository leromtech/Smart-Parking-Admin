<template>
    <form @submit.prevent="submitRatePolicy">
        <div class="flex flex-col gap-4 md:w-[500px]">
            <InputText v-model="ratePolicyForm.name" placeholder="Name" />
            <Select :options="vehicleTypes" optionValue="id" optionLabel="name" fluid
                placeholder="Select a vehicle type for the policy" v-model="ratePolicyForm.vehicle_type"></Select>

            <Select :options="policyIntervals" placeholder="Select a policy interval" fluid
                v-model="selectedPolicyInterval" optionLabel="label" optionValue="value"></Select>
            {{ selectedPolicyInterval }}
            <div class="flex flex-col gap-2">
                <div class=" flex flex-row items-center gap-2">
                    <Checkbox binary v-model="fixedRateToggle" :disabled="selectedPolicyInterval == 'hourly'"
                        id="fixed-rate-toggle" />
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
                <Checkbox binary v-model="timingToggle" :disabled="selectedPolicyInterval !== 'hourly'" />
                <label for="">Timing</label>
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


</script>
