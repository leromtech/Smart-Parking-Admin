<template>
    <Panel class="w-full">
        <template #header>
            <div class="flex flex-col gap-1 w-full">
                <span class="font-semibold text-lg">Parking Zone Commission Rates</span>
                <span class="text-sm text-gray-500 font-normal">
                    Set the commission percentage for each parking zone. This rate applies to earnings and settlements for that zone.
                </span>
            </div>
        </template>

        <DataTable
            :value="rows"
            tableStyle="min-width: 50rem"
            paginator
            :rows="pagination.per_page"
            :lazy="true"
            :totalRecords="pagination.total_records"
            :rowsPerPageOptions="[10, 15, 30, 50]"
            :loading="loading"
            @page="onPage"
        >
            <template #header>
                <div class="flex flex-row justify-between items-center">
                    <InputText
                        icon="pi pi-search"
                        placeholder="Search parking zones..."
                        v-model="search"
                        class="w-full max-w-md"
                    />
                </div>
            </template>

            <Column header="Parking Zone">
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <span class="font-medium">{{ data.name }}</span>
                        <span class="text-sm text-gray-500">{{ data.address }}</span>
                    </div>
                </template>
            </Column>

            <Column field="owner.name" header="Owner" />

            <Column header="Commission Rate" style="min-width: 12rem">
                <template #body="{ data }">
                    <InputGroup class="w-36">
                        <InputNumber
                            v-model="commissionEdits[data.id]"
                            v-keyfilter.int
                            :min="0"
                            :max="100"
                            placeholder="0"
                        />
                        <InputGroupAddon>
                            <span>%</span>
                        </InputGroupAddon>
                    </InputGroup>
                </template>
            </Column>

            <Column header="" style="width: 8rem">
                <template #body="{ data }">
                    <Button
                        icon="pi pi-save"
                        label="Save"
                        size="small"
                        :loading="savingId === data.id"
                        :disabled="savingId != null && savingId !== data.id"
                        @click="saveCommission(data)"
                    />
                </template>
            </Column>
        </DataTable>
    </Panel>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import api from '../../boot/api';
import useAdmin from '../../scripts/admin';
import { debounce } from '../../scripts/utils';

const toast = useToast();
const { parking_zones, getParkingZones, pagination } = useAdmin();

const rows = ref([]);
const search = ref('');
const loading = ref(false);
const savingId = ref(null);
const commissionEdits = ref({});

const syncCommissionEdits = (zones) => {
    const edits = {};
    for (const zone of zones) {
        edits[zone.id] = zone.commission_rate != null ? zone.commission_rate * 100 : null;
    }
    commissionEdits.value = edits;
};

const fetchZones = async (pageParams = null) => {
    loading.value = true;
    try {
        await getParkingZones(pageParams, search.value);
        rows.value = parking_zones.value?.data ?? [];
        syncCommissionEdits(rows.value);
    } finally {
        loading.value = false;
    }
};

const debouncedSearch = debounce(() => fetchZones(), 300);
watch(search, debouncedSearch);

watch(parking_zones, () => {
    rows.value = parking_zones.value?.data ?? [];
    syncCommissionEdits(rows.value);
});

const onPage = (e) => fetchZones(e);

const saveCommission = async (zone) => {
    const rate = commissionEdits.value[zone.id];

    if (rate == null || rate <= 0) {
        toast.add({
            severity: 'error',
            summary: 'Invalid rate',
            detail: 'Please enter a commission rate greater than 0%',
            life: 3000,
        });
        return;
    }
    if (rate > 100) {
        toast.add({
            severity: 'error',
            summary: 'Invalid rate',
            detail: 'Commission rate cannot exceed 100%',
            life: 3000,
        });
        return;
    }

    savingId.value = zone.id;
    try {
        const fd = new FormData();
        fd.append('_method', 'PATCH');
        fd.append('commission_rate', rate / 100);

        await api.post(`parking-zones/${zone.id}`, fd);

        toast.add({
            severity: 'success',
            summary: 'Saved',
            detail: `Commission rate updated for ${zone.name}`,
            life: 3000,
        });

        await fetchZones();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'Failed to update commission rate',
            life: 3000,
        });
    } finally {
        savingId.value = null;
    }
};

onMounted(() => fetchZones());
</script>
