<template>
    <div class="flex flex-col gap-4">
        <Panel>
            <div class="flex flex-row gap-8">
                <div class="flex flex-row gap-4 w-full">
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
        <div class="flex flex-col items-start justify-start gap-4">
            <Panel v-for="(item, index) in payments" class="w-full">
                <DataTable :value="item" class="max-h-[500px] overflow-y-scroll">
                    <Column header="id">
                        <template #body="slotProps">
                            {{ slotProps.data.id }}
                        </template>
                    </Column>
                    <Column header="Receipt No.">
                        <template #body="slotProps">
                            {{ slotProps.data.receipt_no ?? "--NA--" }}
                        </template>
                    </Column>
                    <Column header="Created At">
                        <template #body="slotProps">
                            {{ slotProps.data.created_at ?? "--NA--" }}
                        </template>
                    </Column>
                    <Column header="Status">
                        <template #body="slotProps">
                            {{ slotProps.data.status ?? "--NA--" }}
                        </template>
                    </Column>
                    <Column header="Amount">
                        <template #body="slotProps">
                            {{ slotProps.data.amount ?? "--NA--" }}
                        </template>
                    </Column>
                    <template #footer>
                        <div class="flex justify-between p-2 font-bold">
                            <span>Total: </span>
                            <span class="text-end">₹ {{ totals[index] }}</span>
                        </div>
                    </template>
                    <template #empty>
                        <div class="flex items-center justify-center w-full ">
                            NO RECORD FOUND
                        </div>
                    </template>
                </DataTable>
            </Panel>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '../../../boot/api';
import { useToast } from 'primevue';
import { useParkingZone } from '../../../scripts/parkingZone';

const { parking_zone } = useParkingZone()
const filters = ref({
    search: '',
    status: ''
})

const totals = ref()

const toast = useToast()

const loading = ref(false)

const monthFilter = ref([
    new Date(),
])

const payments = ref([])

const status = ref('')

const statusOptions = ref([
    { label: 'All', value: '' },
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' }
])

const getEarnings = async () => {
    loading.value = true
    try {
        let dateFilter = {
            start: null,
            end: null
        }
        if (monthFilter.value[1]) {
            dateFilter.end = monthFilter.value[1].toLocaleDateString('en-GB', { month: 'numeric', year: 'numeric', day: 'numeric' }).replaceAll('/', '-');
        }
        const month = monthFilter.value.toLocaleDateString('en-GB', { month: 'numeric', year: 'numeric', day: 'numeric' }).replaceAll('/', '-');
        const { data } = await api.get('earnings', { params: { parking_zone_id: parking_zone.value.id, month, filters: filters.value } });
        payments.value = data.payments;
        status.value = data.status
        totals.value = data.totals
        loading.value = false
        console.log(payments.value)
    } catch (error) {
        console.error('Error fetching earnings:', error);
    }
};

watch(filters, async (newVal) => {
    await getEarnings()
}, { deep: true })

watch(monthFilter, async (newVal) => {
    await getEarnings()
})

watch(parking_zone, async () => {
    await getEarnings()
}, { deep: true })
</script>