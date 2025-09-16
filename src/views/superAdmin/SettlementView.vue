<template>
    <div class="flex flex-col gap-4">
        <Panel>
            <div class="flex flex-row gap-8">
                <div class="flex flex-row gap-4 w-full">
                    <Select v-model="selectedParkingZone" :options="parkingZones" filter optionLabel="name"
                        placeholder="Select a Parking Zone" class="w-full md:w-80">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                <div>{{ `${slotProps.value.name} (${slotProps.value.address})` }}</div>
                            </div>
                            <span v-else>
                                Select a Parking zone
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex items-center">
                                <div>{{ `${slotProps.option.name} (${slotProps.option.address})` }}</div>
                            </div>
                        </template>
                    </Select>

                    <IftaLabel>
                        <DatePicker v-model="monthFilter" selectionMode="range" :manualInput="false"
                            class="w-full md:w-40" dateFormat="MM yy dd" />
                        <label for="date">Date filter</label>
                    </IftaLabel>

                    <Select v-model="filters.status" class="md:w-80 w-full" placeholder="Select Status"
                        :options="statusOptions" optionLabel="label" optionValue="value">
                    </Select>
                </div>
                <div class="flex flex-col items-end justify-end w-full">
                    <span class="font-semibold">
                        Settlement Status
                    </span>
                    <span>
                        {{ status }}
                    </span>
                </div>
            </div>
        </Panel>
        <div class="flex flex-row items-center justify-between">
            <Button @click="settle">Settle</Button>
        </div>
        <div class="flex flex-col gap-2">
            <Panel :header="k.toUpperCase()" v-for="[k, v] in Object.entries(payments)" :key="k">
                <DataTable :value="v" scrollable scrollHeight="400px" tableStyle="min-width: 50rem" :loading="loading"
                    lazy>
                    <Column header="Receipt No.">
                        <template #body="slotProps">
                            {{ slotProps.data.receipt_number ?? '--' }}
                        </template>
                    </Column>
                    <Column header="Payment Method">
                        <template #body="slotProps">
                            {{ slotProps.data.payment_method ?? '--' }}
                        </template>
                    </Column>
                    <Column header="Created at">
                        <template #body="slotProps">
                            <div class="text-end">
                                {{ slotProps.data.created_at }}
                            </div>
                        </template>
                    </Column>
                    <Column field="status" header="Status"></Column>
                    <Column header="Amount">
                        <template #body="slotProps">
                            <div class="text-end">
                                {{ (Number(slotProps.data.amount) || 0) !== 0 ?
                                    (Number(slotProps.data.amount) || 0).toLocaleString('en-IN') : '-' }}
                            </div>
                        </template>
                    </Column>

                    <template #footer>
                        <div class="flex justify-between p-2 font-bold">
                            <span>Total: </span>
                            <span class="text-end">₹ {{ totals[k] }}</span>
                        </div>
                    </template>

                    <template #empty>
                        <div class="text-center p-4 text-gray-500">
                            No records found.
                        </div>
                    </template>
                </DataTable>
            </Panel>
        </div>

    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '../../boot/api';
import { useToast } from 'primevue';

const filters = ref({
    search: null,
    status: null
})

const toast = useToast()

const loading = ref(false)

const monthFilter = ref([
    new Date(),
])

const parkingZones = ref([])

const payments = ref({})

const status = ref('')

const totals = ref(null)

const selectedParkingZone = ref(null)

const statusOptions = ref([
    { label: 'All', value: '' },
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' }
])

const getParkingZonesData = async () => {
    const { data } = await api.get('parking-zones')
    parkingZones.value = data.parking_zones.data
}


const getEarnings = async () => {
    loading.value = true
    if (!selectedParkingZone.value) {
        selectedParkingZone.value = 1
    }
    try {
        let dateFilter = {
            start: null,
            end: null
        }
        if (monthFilter.value[1]) {
            dateFilter.end = monthFilter.value[1].toLocaleDateString('en-GB', { month: 'numeric', year: 'numeric', day: 'numeric' }).replaceAll('/', '-');
        }
        dateFilter.start = monthFilter.value[0].toLocaleDateString('en-GB', { month: 'numeric', year: 'numeric', day: "numeric" }).replaceAll('/', '-');
        const { data } = await api.get('earnings', { params: { parking_zone_id: selectedParkingZone.value.id, dateFilter, filters: filters.value } });
        payments.value = data.payments;
        totals.value = data.totals
        status.value = data.status
        loading.value = false
    } catch (error) {
        console.error('Error fetching earnings:', error);
    }
};

const settle = async () => {
    const month = monthFilter.value.toLocaleDateString('en-GB', { month: 'numeric', year: 'numeric' }).replace('/', '-');
    const { data } = await api.post('settlement/initiate', { parkingZoneId: selectedParkingZone.value.id, month })
    toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
}

watch(selectedParkingZone, async (newVal) => {
    await getEarnings()
})

watch(monthFilter, async (newVal) => {
    if (!newVal[0]) {
        return
    }
    await getEarnings()
})

watch(filters, async (newVal) => {
    await getEarnings()
}, { deep: true })

onMounted(async () => {
    await getParkingZonesData()
    if (parkingZones.value.length > 0) {
        selectedParkingZone.value = parkingZones.value[0]
    }
})
</script>