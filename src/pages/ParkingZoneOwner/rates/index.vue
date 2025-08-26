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

        <DataTable v-if="parking_zone?.rates?.length > 0" :value="parking_zone?.rates" tableStyle="min-width: 50rem"
            :expandedRows="expandedRows" v-model:expandedRows="expandedRows" dataKey="id">
            <Column expander style="width: 5rem" header="Expand" />

            <Column header="Name" style="width: 20%">
                <template #body="slotProps">
                    <span class="font-semibold">{{ slotProps.data.name ?? 'No Name' }}</span>
                </template>
            </Column>

            <Column header="Vehicle Type" style="width: 15%">
                <template #body="slotProps">
                    <span>{{ slotProps.data.vehicle_type?.name ?? "--N/A--" }}</span>
                </template>
            </Column>

            <!-- <Column header="Time Range" style="width: 20%">
                <template #body="slotProps">
                    <Chip>
                        <template #default>
                            <i class="pi pi-clock mr-2"></i>
                            <span v-if="slotProps.data.from && slotProps.data.to">
                                {{ formatTime12Hour(slotProps.data.from) }} - {{ formatTime12Hour(slotProps.data.to) }}
                            </span>
                            <span v-else>--:-- - --:--</span>
                        </template>
                    </Chip>
                </template>
            </Column> -->

            <Column header="Interval" style="width: 10%">
                <template #body="slotProps">
                    <span>{{ slotProps.data.interval }}</span>
                </template>
            </Column>

            <!-- <Column header="Fixed Rate" style="width: 15%">
                <template #body="slotProps">
                    <i class="pi pi-money-bill mr-2"></i>
                    <span>₹{{ slotProps.data.fixed_rate || '0.00' }}</span>
                </template>
            </Column> -->

            <Column header="Actions" style="width: 15%">
                <template #body="slotProps">
                    <div class="flex flex-row gap-2">
                        <Button icon="pi pi-pen-to-square" rounded size="small" severity="warning"
                            @click="() => { addingPolicy = true; editRatePolicy(slotProps.data) }" variant="outlined" />
                        <Button icon="pi pi-trash" rounded size="small" severity="danger"
                            @click="() => deleteInterval(slotProps.data.id)" variant="outlined" />
                    </div>
                </template>
            </Column>

            <!-- Expanded Row Template for Intervals -->
            <template #expansion="slotProps">
                <div class="p-4 bg-gray-50 rounded">
                    <div v-if="slotProps.data.fixed_rate !== '0.00' || slotProps.data.fixed_rate === 0">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-700">Rate Intervals</h3>
                            <Button icon="pi pi-plus" label="Add Interval" size="small"
                                @click="() => addIntervalLocal(slotProps.data.id, parking_zone.id)"
                                v-if="activeRateId !== slotProps.data.id" />
                            <Button icon="pi pi-save" label="Save Interval" size="small" severity="success"
                                @click="saveInterval" v-else />
                        </div>

                        <!-- Existing Intervals -->
                        <div v-if="slotProps.data.intervals && slotProps.data.intervals.length > 0" class="mb-4">
                            <DataTable :value="slotProps.data.intervals" class="mb-4" size="small">
                                <Column header="Rate Amount">
                                    <template #body="intervalProps">
                                        <InputGroup class="w-32">
                                            <InputGroupAddon>₹</InputGroupAddon>
                                            <InputNumber
                                                v-model="slotProps.data.intervals[intervalProps.index].rate_amount"
                                                mode="currency" currency="INR" :minFractionDigits="2" fluid
                                                size="small" />
                                        </InputGroup>
                                    </template>
                                </Column>

                                <Column header="Duration">
                                    <template #body="intervalProps">
                                        <div class="flex items-center gap-2">
                                            <InputGroup class="w-24">
                                                <InputGroupAddon>
                                                    <i class="pi pi-clock"></i>
                                                </InputGroupAddon>
                                                <InputText
                                                    v-model="slotProps.data.intervals[intervalProps.index].duration"
                                                    size="small" placeholder="1" />
                                            </InputGroup>
                                            <Select :options="dailyIntervals" placeholder="Unit"
                                                v-model="slotProps.data.intervals[intervalProps.index].interval"
                                                class="w-24" size="small" />
                                        </div>
                                    </template>
                                </Column>

                                <Column header="Actions" style="width: 10%">
                                    <template #body="intervalProps">
                                        <Button icon="pi pi-trash" size="small" severity="danger" text
                                            @click="() => removeInterval(slotProps.data.id, intervalProps.index)" />
                                    </template>
                                </Column>
                            </DataTable>
                        </div>

                        <!-- New Interval Form -->
                        <div v-if="activeRateId === slotProps.data.id" class="border-t pt-4">
                            <h4 class="font-medium mb-3 text-gray-600">Add New Interval</h4>
                            <div class="flex gap-4 items-end">
                                <div class="flex flex-col gap-2">
                                    <label class="text-sm font-medium text-gray-600">Rate Amount</label>
                                    <InputGroup class="w-32">
                                        <InputGroupAddon>₹</InputGroupAddon>
                                        <InputNumber v-model="intervalForm.rate_amount" mode="currency" currency="INR"
                                            :minFractionDigits="2" placeholder="0.00" />
                                    </InputGroup>
                                </div>

                                <div class="flex flex-col gap-2">
                                    <label class="text-sm font-medium text-gray-600">Duration</label>
                                    <div class="flex gap-2">
                                        <InputGroup class="w-24">
                                            <InputGroupAddon>
                                                <i class="pi pi-clock"></i>
                                            </InputGroupAddon>
                                            <InputText v-model="intervalForm.duration" placeholder="1" />
                                        </InputGroup>
                                        <Select :options="dailyIntervals" placeholder="Unit"
                                            v-model="intervalForm.interval" class="w-24" />
                                    </div>
                                </div>

                                <div class="flex gap-2">
                                    <Button icon="pi pi-check" label="Save" size="small" severity="success"
                                        @click="saveInterval" />
                                    <Button icon="pi pi-times" label="Cancel" size="small" severity="secondary" outlined
                                        @click="cancelAddInterval" />
                                </div>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div v-if="(!slotProps.data.intervals || slotProps.data.intervals.length === 0) && activeRateId !== slotProps.data.id"
                            class="text-center py-8 text-gray-500">
                            <i class="pi pi-info-circle text-2xl mb-2"></i>
                            <p>No intervals defined. Click "Add Interval" to get started.</p>
                        </div>
                    </div>

                    <!-- Fixed Rate Message -->
                    <div v-else class="text-center py-4 text-gray-500">
                        <i class="pi pi-money-bill text-2xl mb-2"></i>
                        <p>This rate uses a fixed pricing model (₹{{ slotProps.data.fixed_rate }})</p>
                    </div>
                </div>
            </template>

            <!-- Empty State -->
            <template #empty>
                <div class="text-center py-8">
                    <i class="pi pi-info-circle text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-500 text-lg">No rates found</p>
                    <p class="text-gray-400">Click the + button to create your first rate</p>
                </div>
            </template>
        </DataTable>

        <!-- No Rates Panel -->
        <Panel v-else>
            <div class="text-center py-8">
                <i class="pi pi-info-circle text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-500 text-lg mb-4">No rates configured</p>
                <Button icon="pi pi-plus" label="Create First Rate" @click="addingPolicy = true" />
            </div>
        </Panel>

        <Dialog v-model:visible="addingPolicy" modal header="Create a new policy" class="w-[90%] max-w-2xl">
            <CreatePolicy @success="handleSuccess" />
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
const expandedRows = ref({});

// Modified addInterval function that also tracks which rate is active
const addIntervalLocal = (rateId, parkingZoneId) => {
    activeRateId.value = rateId;
    addInterval(rateId, parkingZoneId);
};

// Cancel adding interval
const cancelAddInterval = () => {
    activeRateId.value = null;
};

// Remove interval function
const removeInterval = async (rateId, intervalIndex) => {
    const rate = parking_zone.value.rates.find(r => r.id === rateId);
    if (rate && rate.intervals) {
        rate.intervals.splice(intervalIndex, 1);
        // You might want to call an API to update this on the backend
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Interval removed successfully',
            life: 3000
        });
    }
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
    if (!date) return '--:--';
    let [hours, minutes] = date.split(':');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${hours}:${minutes} ${ampm}`;
}

const handleSuccess = async () => {
    addingPolicy.value = false;
    await getParkingZone();
}

onMounted(() => {
    getParkingZone();
})
</script>