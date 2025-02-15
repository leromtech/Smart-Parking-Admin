<template>
    <div class="flex flex-col gap-4">
        <Panel>
            <InputText />
        </Panel>
        <!-- Wrap v-if in a template to avoid using it with v-for -->
        <template v-if="p">
            <!-- Iterate over the object's key-value pairs -->
            <div class="flex flex-row gap-2">
                <Panel :header="k.toUpperCase()" v-for="[k, v] in Object.entries(p)" :key="k">
                    <!-- Iterate over the array of data inside `v` -->
                    <DataTable :value="v" scrollable scrollHeight="400px" tableStyle="min-width: 50rem"
                        :loading="loading">
                        <Column field="id" header="Id"></Column>
                        <Column field="receipt_number" header="Receipt No."></Column>
                        <Column field="payment_method" header="Payment Method"></Column>
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
                                <span class="text-end">{{ v.total_earnings.toLocaleString('en-IN') }}</span>
                            </div>
                        </template>
                    </DataTable>
                </Panel>
            </div>
        </template>
        <div v-else class="top-0 bottom-0 left-0 right-0 fixed flex items-center justify-center">
            <ProgressSpinner />
        </div>
    </div>
</template>

<script setup>
import { toRaw } from 'vue'; // Import toRaw to unwrap Proxy
import api from '../../../boot/api';
import { onMounted, ref } from 'vue';
import { useParkingZone } from '../../../scripts/parkingZone';

const { parking_zone } = useParkingZone();
const loading = ref(false)
const p = ref();

const getEarnings = async () => {
    loading.value = true
    try {
        const { data } = await api.get('earnings', { params: { parking_zone_id: 1 } });
        p.value = data;
        loading.value = false
    } catch (error) {
        console.error('Error fetching earnings:', error);
        p.value = {}; // Fallback to an empty object in case of error
    }
};

onMounted(() => {
    getEarnings();
});
</script>