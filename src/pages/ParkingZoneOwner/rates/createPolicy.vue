<template>
    <form @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-4 md:w-[500px] text-sm text-neutral-500">
            <div class="flex flex-col items-start justify-center gap-1">
                <label class="text-sm text-neutral-500">Policy name</label>
                <InputText v-model="ratePolicyForm.name" placeholder="Name" name="name" fluid
                    class="text-sm text-neutral-500" />
            </div>

            <div class="flex flex-col items-start justify-center gap-1">
                <label class="text-sm text-neutral-500">Vehicle type</label>
                <Select :options="vehicleTypes" optionValue="id" optionLabel="name" fluid
                    placeholder="Select a vehicle type for the policy" v-model="ratePolicyForm.vehicle_type">
                    <template #empty>
                        <div class="text-sm text-neutral-500">
                            No vehicle types found
                        </div>
                    </template>
                </Select>
            </div>

            <Button type="submit">Submit</Button>
        </div>
    </form>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import useVehicleTypes from '../../../scripts/admin/vehicleTypes';
import { Select, useToast } from 'primevue';
import useCreateRate from '../../../scripts/parkingZoneOwner/rate';
import { useParkingZone } from '../../../scripts/parkingZone';

const emit = defineEmits(['success', 'failure'])

const { parking_zone } = useParkingZone()
const toast = useToast()

const filteredInterval = ref([])

const {
    fixedRateToggle,
    policyIntervals,
    selectedPolicyInterval,
    ratePolicyForm,
    timingToggle,
    submitRatePolicy,
    schemeTypeOptions
} = useCreateRate(parking_zone.id, toast)

const { vehicleTypes, getVehicleTypes } = useVehicleTypes()

// Handle toggle changes
const handleFixedRateToggle = (value) => {
    // If toggle is off, set fixedRate to null or 0
    if (!value) {
        ratePolicyForm.value.fixedRate = null;
    } else if (ratePolicyForm.value.fixedRate === null) {
        // If turning on and value is null, initialize with 0
        ratePolicyForm.fixedRate = 0;
    }
}

const handleSubmit = async () => {
    const response = await submitRatePolicy()
    if (response) {
        emit('success')
    } else {
        emit('failure')
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

watch(() => ratePolicyForm.value.scheme_type, (newVal) => {
    console.log(newVal)
    if (newVal === 'subscription') {
        const filtered = policyIntervals.filter((item) => { return item.value !== 'hourly' }
        )
        filteredInterval.value = filtered
        fixedRateToggle.value = true
    } else {
        const filtered = policyIntervals.filter((item) => {
            return item.value === 'hourly'
        })
        filteredInterval.value = filtered
        fixedRateToggle.value = false
    }
})

onMounted(() => {
    getVehicleTypes()
})
</script>
