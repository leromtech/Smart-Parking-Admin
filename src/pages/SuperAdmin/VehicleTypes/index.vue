<template>
    <Panel class="flex flex-col">
        <div class="flex flex-row items-center gap-2 justify-between">
            <div class="flex flex-row gap-2">
                <InputText placeholder="Search" v-model="filter.search" />
                <Select v-model="filter.space_occupied" showClear="true" :options="spaceOccupiedOptions"
                    placeholder="Space Occupied" class="w-full md:w-56" />
            </div>
            <Button icon="pi pi-plus" rounded @click="createOpen = true"></Button>
        </div>
        <div class="mt-2 flex flex-row gap-2 border border-neutral-200 p-2 rounded-md">
            <p class="text-blue-500 font-semibold">Note:</p>
            <p>Space occupied is calculated as Two wheeler = 1 space</p>
        </div>
        <DataTable :value="vehicleTypes" tableStyle="min-width: 50rem" paginator :rows="pagination.per_page"
            :lazy="true" class="mt-6" :totalRecords="pagination.total_records" :rowsPerPageOptions="[5, 10, 15, 30]"
            @page="(e) => getVehicleTypes(e)">
            <Column header="Type">
                <template #body="slotProps">
                    {{ slotProps.data.name }}
                </template>
            </Column>
            <Column header="Space occupied">
                <template #body="slotProps">
                    {{ slotProps.data.space_occupied }}
                </template>
            </Column>
            <Column>
                <template #body="slotProps">
                    <div class="flex flex-row gap-2">
                        <Button icon="pi pi-trash" rounded outlined severity="danger"
                            @click="() => { deleteItem = slotProps.data.id; deleteOpen = true }"></Button>
                        <Button icon="pi pi-pen-to-square" rounded severity="warn" outlined
                            @click="edit(slotProps.data)"></Button>
                    </div>
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="createOpen">
            <template #header>
                <span class="font-semibold">Create</span>
            </template>
            <create @created="handleCreated" />
        </Dialog>

        <Dialog v-model:visible="editOpen">
            <template #header>
                <span class="font-semibold">Edit</span>
            </template>
            <create @created="handleCreated" />
        </Dialog>

        <Dialog v-model:visible="deleteOpen">
            <template #header>
                <span class="font-semibold">Confirm delete?</span>
            </template>
            <div class="flex flex-col">
                <span>Do you really want to delete the user ?</span>
                <div class="w-full flex flex-row mt-2">
                    <Button icon="pi pi-trash" label="DELETE" outlined severity="danger" class="w-[40%]"
                        @click="confirmDelete"></Button>
                </div>
            </div>
        </Dialog>
    </Panel>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Create from './create.vue';
import api from '../../../boot/api';
import useVehicleTypes from '../../../scripts/admin/vehicleTypes';
import { useToast } from 'primevue';

const { vehicleTypes, spaceOccupiedOptions, pagination, filter, deleteItem, editItem, getVehicleTypes } = useVehicleTypes()
const toast = useToast()
const deleteOpen = ref()
const editOpen = ref()
const createOpen = ref()

const edit = (item) => {
    editItem.value = item
    editOpen.value = true
}

const confirmDelete = async () => {
    const fd = new FormData()
    fd.append('_method', 'DELETE')
    try {

        const { data } = await api.post(`vehicle-types/${deleteItem.value}`, fd)
        await getVehicleTypes()
        deleteItem.value = null
        deleteOpen.value = false

        toast.add({
            severity: 'success',
            closable: true,
            summary: 'Success',
            detail: data.message,
            life: 3000
        })
    } catch (error) {
        toast.add({
            severity: 'error',
            closable: true,
            summary: "Error",
            detail: 'Failed to delete vehicle type' + error,
            life: 3000
        })
    }
}

const handleCreated = async () => {
    createOpen.value = false
    editOpen.value = false
    editItem.value = null
    await getVehicleTypes()
}

onMounted(async () => {
    getVehicleTypes()
})

</script>