<template>
    <div class="flex flex-col gap-4">
        <Panel>
            <div class="flex flex-row gap-8">
                <div class="flex flex-row gap-4 w-full">
                    <IftaLabel>
                        <DatePicker v-model="monthFilter" showIcon fluid iconDisplay="input" view="month"
                            dateFormat="MM yy" />
                        <label for="date">Month</label>
                    </IftaLabel>
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
        <div class="flex flex-row items-start justify-start gap-4">
            <Panel v-for="(item, index) in payments" class="w-full">
                <DataTable :value="item">
                    <Column header="id">
                        <template #body="slotProps">
                            {{ slotProps.data.id }}
                        </template>
                    </Column>
                    <Column header="bd">
                        <template #body="slotProps">
                            {{ slotProps.data.id }}
                        </template>
                    </Column>
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

const {parking_zone} = useParkingZone()
const filters = ref({
    search: ''
})

const toast = useToast()

const loading = ref(false)

const monthFilter = ref(new Date())

const payments = ref([])

const status = ref('')

const getEarnings = async () => {
    loading.value = true
    try {
        const month = monthFilter.value.toLocaleDateString('en-GB', { month: 'numeric', year: 'numeric' }).replace('/', '-');
        const { data } = await api.get('earnings', { params: { parking_zone_id: parking_zone.value.id, month } });
        payments.value = data.payments;
        status.value = data.status
        loading.value = false
    } catch (error) {
        console.error('Error fetching earnings:', error);
    }
};

watch(monthFilter, async (newVal) => {
    await getEarnings()
})

watch(parking_zone, async () => {
    await getEarnings()
}, {deep: true})
</script>