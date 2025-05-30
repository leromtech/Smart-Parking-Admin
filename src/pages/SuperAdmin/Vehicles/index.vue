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
            :loading="loading" class="mt-6" :totalRecords="pagination.total_records"
            :rowsPerPageOptions="[5, 10, 15, 30]" @page="(e) => getVehicles(e)">
            <Column header="Registration No.">
                <template #body="slotProps">
                    {{ slotProps.data.registration_no }}
                </template>
            </Column>
            <Column header="Owner">
                <template #body="slotProps">
                    {{ slotProps.data.user?.name || 'N/A' }}
                </template>
            </Column>
            <Column header="Vehicle Type">
                <template #body="slotProps">
                    {{ slotProps.data.vehicle_type?.name || 'N/A' }}
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

        <Dialog v-model:visible="createOpen" class="md:w-[80%] w-full">
            <template #header>
                <span class="font-semibold">Add a Vehicle</span>
            </template>
            <Create @created="handleCreated" />
        </Dialog>

        <Dialog v-model:visible="editOpen">
            <template #header>
                <span class="font-semibold">Edit Vehicle</span>
            </template>
            <Create @created="handleCreated" />
        </Dialog>

        <Dialog v-model:visible="deleteOpen">
            <template #header>
                <span class="font-semibold">Confirm delete?</span>
            </template>
            <div class="flex flex-col">
                <span>Do you really want to delete the vehicle?</span>
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
import useVehicles from '../../../scripts/admin/vehicles';
import { useToast } from 'primevue';

const toast = useToast()

const { vehicles, vehicleTypes, pagination, filter, deleteItem, editItem, getVehicles, loading, onPage } = useVehicles()

const deleteOpen = ref(false)
const editOpen = ref(false)
const createOpen = ref(false)

const edit = (item) => {
    editItem.value = item
    editOpen.value = true
}

const handleCreated = async () => {
    createOpen.value = false
    editOpen.value = false
    editItem.value = null
    await getVehicles()
}

const confirmDelete = async () => {
    try {
        const fd = new FormData()
        fd.append('_method', 'DELETE')
        const { data } = await api.post(`vehicles/${deleteItem.value}`, fd)

        deleteOpen.value = false
        deleteItem.value = null

        toast.add({
            severity: 'success',
            closable: true,
            detail: data.message,
            life: 3000
        })

        await getVehicles()
    } catch (error) {
        toast.add({
            severity: 'error',
            closable: true,
            detail: 'Failed to delete vehicle',
            life: 3000
        })
    }
}

onMounted(async () => {
    await getVehicles()
})
</script>