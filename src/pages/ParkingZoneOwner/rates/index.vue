<template>
    <div class="flex flex-col gap-2">
        <Panel>
            <template #header>
                <div class="flex flex-row items-center justify-between w-full">
                    <h1 class="font-semibold">Rates</h1>
                    <Button icon="pi pi-plus" rounded @click="addingPolicy = true"></Button>
                </div>
            </template>
        </Panel>

        <Panel v-if="parking_zone?.rates?.length > 0">
            <Panel class="flex flex-col gap-2 mb-2" v-for="(rate, rateIndex) in parking_zone.rates" :key="rate.id">
                <template #header>
                    <div class="flex flex-row items-center justify-between w-full">
                        <h1 class="font-semibold">{{ rate.name ?? 'No Name' }}</h1>
                        <div class="flex flex-row gap-2">
                            <Button icon="pi pi-save" rounded class="p-button-success"></Button>
                            <Button icon="pi pi-pen-to-square" rounded class="p-button-warn"
                                @click="() => { addingPolicy = true; editRatePolicy(rate) }"></Button>
                            <Button icon="pi pi-trash" rounded class="p-button-danger"
                                @click="() => deleteInterval(rate.id)"></Button>
                        </div>
                    </div>
                </template>
                <div class="columns-4">
                    <div class="p-2 flex flex-col items-center">
                        <Chip v-if="rate.vehicle_type">
                            <template #default>
                                <i class="pi pi-car"></i>
                                <span>{{ rate.vehicle_type?.name ?? "--Na--" }}</span>
                            </template>
                        </Chip>
                    </div>
                    <div class="p-2 flex flex-col items-center">
                        <Chip>
                            <template #default>
                                <i class="pi pi-clock"></i>
                                <span v-if="rate.from && rate.to">{{ formatTime12Hour(rate.from) }} - {{
                                    formatTime12Hour(rate.to) }}</span>
                                <span v-else>--:--:-- - --:--:--</span>
                            </template>
                        </Chip>
                    </div>
                    <div class="p-2 flex flex-col items-center">
                        <Chip :label="rate.interval"></Chip>
                    </div>
                    <div class="p-2 flex flex-col items-center">
                        <Chip :label="rate.fixed_rate">
                            <template #icon>
                                <i class="pi pi-money-bill"></i>
                            </template>
                        </Chip>
                    </div>
                </div>

                <!-- Intervals -->
                <Fieldset legend="Intervals" toggleable v-if="rate.fixed_rate === '0.00'">
                    <div class="flex flex-row items-center justify-end mb-2">
                        <Button icon="pi pi-plus" rounded @click="() => addIntervalLocal(rate.id, parking_zone.id)"
                            v-if="activeRateId !== rate.id"></Button>
                        <Button icon="pi pi-save" rounded @click="saveInterval" v-else></Button>
                    </div>
                    <template v-for="(interval, intervalIndex) in rate.intervals" :key="intervalIndex">
                        <div class="flex flex-row gap-2 items-center justify-between mb-2">
                            <InputGroup>
                                <InputGroupAddon>
                                    <span>₹</span>
                                </InputGroupAddon>
                                <InputNumber v-model="rate.intervals[intervalIndex].rate_amount" mode="currency"
                                    currency="INR" fluid />
                            </InputGroup>
                            <span>/</span>
                            <div class="flex flex-row">
                                <InputGroup>
                                    <InputGroupAddon>
                                        <i class="pi pi-clock"></i>
                                    </InputGroupAddon>
                                    <InputText v-model="rate.intervals[intervalIndex].duration" fluid />
                                </InputGroup>
                                <Select :options="dailyIntervals" placeholder="Select interval" fluid
                                    v-model="rate.intervals[intervalIndex].interval"></Select>
                            </div>
                        </div>
                    </template>
                    <!-- New Interval Form - only show for the actively edited rate -->
                    <div class="flex flex-row gap-2 items-center justify-between" v-if="activeRateId === rate.id">
                        <InputGroup>
                            <InputGroupAddon>
                                <span>₹</span>
                            </InputGroupAddon>
                            <InputNumber v-model="intervalForm.rate_amount" mode="currency" currency="INR" fluid />
                        </InputGroup>
                        <span>/</span>
                        <div class="flex flex-row">
                            <InputGroup>
                                <InputGroupAddon>
                                    <i class="pi pi-clock"></i>
                                </InputGroupAddon>
                                <InputText v-model="intervalForm.duration" fluid />
                            </InputGroup>
                            <Select :options="dailyIntervals" placeholder="Select interval" fluid
                                v-model="intervalForm.interval"></Select>
                        </div>
                    </div>
                </Fieldset>
            </Panel>
        </Panel>

        <Dialog v-model:visible="addingPolicy" modal header="Create a new policy">
            <CreatePolicy />
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import CreatePolicy from './createPolicy.vue';
import { useParkingZone } from '../../../scripts/parkingZone';
import { Fieldset, InputNumber, useToast } from 'primevue';
import useCreateRate from '../../../scripts/parkingZoneOwner/rate';

const toast = useToast();

const { parking_zone, getParkingZone, refresh } = useParkingZone();

// Track which rate is currently being edited
const activeRateId = ref(null);

// Modified addInterval function that also tracks which rate is active
const addIntervalLocal = (rateId, parkingZoneId) => {
    // Set the active rate ID
    activeRateId.value = rateId;
    // Call the original addInterval function
    addInterval(rateId, parkingZoneId);
};

// Get the rest of the functions from useCreateRate
const {
    editRatePolicy,
    deleteInterval,
    intervalForm,
    addInterval,
    saveInterval: originalSaveInterval
} = useCreateRate(parking_zone.value?.id, toast, refresh);

// Wrap the saveInterval function to reset activeRateId when done
const saveInterval = async () => {
    await originalSaveInterval();
    activeRateId.value = null;
};

const addingPolicy = ref(false);

const dailyIntervals = [
    'second',
    'minute',
    'hour'
];

function formatTime12Hour(date) {
    let [hours, minutes] = date.split(':');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${hours}:${minutes} ${ampm}`;
}

onMounted(() => {
    getParkingZone()
})
</script>