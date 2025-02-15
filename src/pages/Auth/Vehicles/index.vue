<template>
    <Panel class="flex flex-col">
        <div class="flex flex-row items-center gap-2 justify-between">
            <div class="flex flex-row gap-2">
                <InputText placeholder="Search" v-model="filter.search" />
                <Select v-model="filter.type" :options="vehicleTypes" optionLabel="name"
                    placeholder="Select a Vehicle Type" class="w-full md:w-56" />
            </div>
            <Button icon="pi pi-plus" rounded @click="createOpen = true"></Button>
        </div>
        <DataTable :value="vehicles" tableStyle="min-width: 50rem" paginator :rows="pagination.per_page" :lazy="true"
            class="mt-6" :totalRecords="pagination.total" :rowsPerPageOptions="[5, 10, 15, 30]">
            <Column header="Registration No.">
                <template #body="slotProps">
                    {{ slotProps.data.registration_no }}
                </template>
            </Column>
            <Column header="Owner">
                <template #body="slotProps">
                    {{ slotProps.data.user.name }}
                </template>
            </Column>
            <Column header="Vehicle Type">
                <template #body="slotProps">
                    {{ slotProps.data.vehicle_type.name }}
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
                <span class="font-semibold">Add a User</span>
            </template>
            <Create />
        </Dialog>

        <Dialog v-model:visible="editOpen">
            <template #header>
                <span class="font-semibold">Edit {{ }}</span>
            </template>
            <create />
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
import { ref } from 'vue';
import Create from './create.vue';
import api from '../../../boot/api';
import useVehicles from '../../../scripts/admin/vehicles';

const { vehicles, vehicleTypes, pagination, filter, deleteItem, editItem, getVehicles } = useVehicles()

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
    const { data } = api.post(`vehicles/${deleteItem.value}`, fd)
    await getVehicles()
}


</script>