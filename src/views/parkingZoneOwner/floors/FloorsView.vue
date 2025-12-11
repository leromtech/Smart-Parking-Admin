<template>
    <div>
        <Panel>
            <template #header>
                <div class="flex flex-row justify-between items-center w-full">
                    <h2 class="text-xl font-semibold">Floors Management</h2>
                    <Button icon="pi pi-plus" label="Add Floor" @click="createOpen = true" />
                </div>
            </template>

            <div v-if="loading" class="flex items-center justify-center p-8">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>

            <div v-else-if="floors.length === 0" class="p-8 text-center text-gray-500">
                No floors found. Click "Add Floor" to create one.
            </div>

            <DataTable v-else :value="floors" tableStyle="min-width: 50rem" class="mt-4">
                <Column field="floor_number" header="Floor Number" sortable>
                    <template #body="slotProps">
                        <span class="font-semibold">{{ slotProps.data.floor_number }}</span>
                    </template>
                </Column>
                <Column field="name" header="Name" sortable></Column>
                <Column field="capacity" header="Capacity" sortable>
                    <template #body="slotProps">
                        {{ slotProps.data.capacity || 0 }}
                    </template>
                </Column>
                <Column header="Vehicle Types">
                    <template #body="slotProps">
                        <div class="flex flex-wrap gap-1">
                            <span v-if="slotProps.data.vehicle_types && slotProps.data.vehicle_types.length > 0">
                                <Tag v-for="vt in slotProps.data.vehicle_types" :key="vt.id" :value="vt.name" 
                                    severity="info" class="mr-1" />
                            </span>
                            <span v-else class="text-gray-400 text-sm">No vehicle types</span>
                        </div>
                    </template>
                </Column>
                <Column header="Actions">
                    <template #body="slotProps">
                        <div class="flex flex-row items-center gap-2">
                            <Button icon="pi pi-pencil" rounded severity="info" outlined
                                @click="() => edit(slotProps.data)" />
                            <Button icon="pi pi-trash" rounded severity="danger" outlined
                                @click="() => deleteRow(slotProps.data)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </Panel>

        <Dialog v-model:visible="createOpen" modal :style="{ width: '600px' }" :closable="true">
            <template #header>
                <span class="font-semibold">Add Floor</span>
            </template>
            <FloorsCreate :parking-zone-id="parkingZoneId" @created="refresh" @close="createOpen = false" />
        </Dialog>

        <Dialog v-model:visible="editOpen" modal :style="{ width: '600px' }" :closable="true">
            <template #header>
                <span class="font-semibold">Edit Floor</span>
            </template>
            <FloorsCreate :parking-zone-id="parkingZoneId" :floor="editItem" @created="refresh" @close="editOpen = false" />
        </Dialog>

        <Dialog v-model:visible="deleteOpen" modal :style="{ width: '400px' }">
            <template #header>
                <span class="font-semibold">Confirm Delete</span>
            </template>
            <div class="flex flex-col gap-4">
                <p>Are you sure you want to delete floor "{{ deleteItem?.name }}" (Floor {{ deleteItem?.floor_number }})?</p>
                <p class="text-sm text-gray-600">This action cannot be undone.</p>
                <div class="flex flex-row justify-end gap-2">
                    <Button label="Cancel" outlined @click="deleteOpen = false" />
                    <Button label="Delete" severity="danger" @click="confirmDelete" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useParkingZone } from '../../../scripts/parkingZone';
import useFloors from '../../../scripts/floors';
import FloorsCreate from './FloorsCreate.vue';
import { useToast } from 'primevue';

const toast = useToast();
const { parking_zone, getParkingZone } = useParkingZone();
const { floors, loading, editItem, deleteItem, getFloors, deleteFloor } = useFloors();

const parkingZoneId = ref(null);
const createOpen = ref(false);
const editOpen = ref(false);
const deleteOpen = ref(false);

onMounted(async () => {
    // Get parking zone from owner's parking zone
    await getParkingZone();
    if (parking_zone.value && parking_zone.value.id) {
        parkingZoneId.value = parking_zone.value.id;
        await refresh();
    }
});

// Watch for parking zone changes
watch(parking_zone, async (newVal) => {
    if (newVal && newVal.id) {
        parkingZoneId.value = newVal.id;
        await refresh();
    }
});

const refresh = async () => {
    if (parkingZoneId.value) {
        await getFloors(parkingZoneId.value);
    }
};

const edit = (floor) => {
    editItem.value = floor;
    editOpen.value = true;
};

const deleteRow = (floor) => {
    deleteItem.value = floor;
    deleteOpen.value = true;
};

const confirmDelete = async () => {
    try {
        if (parkingZoneId.value && deleteItem.value) {
            await deleteFloor(parkingZoneId.value, deleteItem.value.id);
            toast.add({ severity: 'success', summary: 'Success', detail: 'Floor deleted successfully', life: 3000 });
            await refresh();
            deleteOpen.value = false;
            deleteItem.value = null;
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete floor';
        toast.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
    }
};
</script>

