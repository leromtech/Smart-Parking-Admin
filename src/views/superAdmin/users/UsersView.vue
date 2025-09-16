<template>
    <Panel class="flex flex-col">
        <div class="flex flex-row items-center gap-2 justify-between">
            <div class="flex flex-row gap-2">
                <InputText placeholder="Search" v-model="filter.search" />
                <Select v-model="filter.role" :options="roles" placeholder="Select a Role" class="w-full md:w-56" />
                <Button icon="pi pi-times" rounded outlined severity="secondary" @click="clearFilters" label="Clear" />
            </div>
            <Button icon="pi pi-plus" rounded @click="create"></Button>
        </div>
        <DataTable :value="users" tableStyle="min-width: 50rem" paginator :rows="pagination.per_page" :lazy="true"
            class="mt-6" :totalRecords="pagination.total_records" :rowsPerPageOptions="[5, 10, 15, 30]"
            @page="(e) => getUsers(e)">
            <Column field="name" header="Name"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="phone" header="Phone"></Column>
            <!-- Roles -->
            <Column field="roles" header="Roles">
                <template #body="slotProps">
                    <div class="flex flex-col gap-1">
                        <!-- Show all roles -->
                        <div v-for="role in slotProps.data.roles" :key="role.id" class="flex items-center gap-1">
                            <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">{{ role.name.toUpperCase() }}</span>
                        </div>
                        <!-- Show owned parking zone -->
                        <div v-if="slotProps.data.parking_zone_owned" class="mt-1">
                            <span class="text-xs text-gray-600">Owns:</span>
                            <span class="text-xs font-semibold text-green-600">{{ slotProps.data.parking_zone_owned.name }}</span>
                        </div>
                        <!-- Show all managed parking zones -->
                        <div v-if="slotProps.data.parking_zone_managed && slotProps.data.parking_zone_managed.length > 0" class="mt-1">
                            <span class="text-xs text-gray-600">Manages:</span>
                            <div v-for="zone in slotProps.data.parking_zone_managed" :key="zone.id" class="ml-2">
                                <span class="text-xs font-semibold text-orange-600">{{ zone.name }}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </Column>
            <!-- Column Actions -->
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
            <Create @success="() => { createOpen = false }" />
        </Dialog>

        <Dialog v-model:visible="editOpen">
            <template #header>
                <span class="font-semibold">Edit</span>
            </template>
            <Create @success="() => { editItem = null, editOpen = false }" />
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
import useUsers from '../../../scripts/admin/users';
import Create from './create.vue';
import api from '../../../boot/api';

const { users, pagination, filter, deleteItem, editItem, getUsers } = useUsers()

const deleteOpen = ref()
const editOpen = ref()
const createOpen = ref()

const create = () => {
    editItem.value = null
    createOpen.value = true
}

const edit = (item) => {
    editItem.value = item
    editOpen.value = true
}

const confirmDelete = async () => {
    const fd = new FormData()
    fd.append('_method', 'DELETE')
    const { data } = await api.post(`users/${deleteItem.value}`, fd)
    deleteOpen.value = false
    await getUsers()
}

const roles = [
    '',
    'customer',
    'superadmin',
    'owner',
    'manager',
]

const clearFilters = () => {
    filter.value.search = ''
    filter.value.role = ''
}

onMounted(async () => {
    await getUsers()
})
</script>