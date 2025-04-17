<template>
    <Panel class="flex flex-col">
        <div class="flex flex-row items-center gap-2 justify-between">
            <div class="flex flex-row gap-2">
                <InputText placeholder="Search" v-model="filter.search" />
                <Select v-model="filter.role" :options="roles" placeholder="Select a Role" class="w-full md:w-56" />
            </div>
            <Button icon="pi pi-plus" rounded @click="createOpen = true"></Button>
        </div>
        <DataTable :value="users" tableStyle="min-width: 50rem" paginator :rows="pagination.per_page" :lazy="true"
            class="mt-6" :totalRecords="pagination.total" :rowsPerPageOptions="[5, 10, 15, 30]">
            <Column field="name" header="Name"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="phone" header="Phone"></Column>
            <!-- Roles -->
            <Column field="roles" header="Roles">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        <span>{{ slotProps.data.roles.length > 0 ? slotProps.data.roles[0].name.toUpperCase() : 'N/A'
                        }}</span>
                        <span v-if="slotProps.data.parking_zone_managed.length > 0" class="font-semibold">
                            {{ slotProps.data.parking_zone_managed[0].name }}</span>
                        <span v-if="slotProps.data.parking_zone_owned" class="font-semibold">
                            {{ slotProps.data.parking_zone_owned.name }}
                        </span>
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
import useUsers from '../../../scripts/admin/users';
import Create from './create.vue';
import api from '../../../boot/api';

const { users, pagination, filter, deleteItem, editItem, getUsers } = useUsers()

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
    const { data } = api.post(`users/${deleteItem.value}`, fd)
    await getUsers()
}

const roles = [
    '',
    'customer',
    'superadmin',
    'owner',
    'manager',
]
</script>