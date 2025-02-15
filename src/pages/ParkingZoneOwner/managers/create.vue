<template>
    <div class="flex flex-col">
        <InputGroup>
            <InputText v-model="searchQuery" placeholder="Search" />
            <InputGroupAddon>
                <Button icon="pi pi-search" severity="secondary" @click="search" />
            </InputGroupAddon>
        </InputGroup>

        <div>
            <DataTable :value="rows" tableStyle="min-width: 50rem" class="mt-6">
                <template #header>
                    <span>Search for users</span>
                </template>
                <template #empty>
                    <span>No Users</span>
                </template>
                <Column header="Name">
                    <template #body="slotProps">
                        <div class="flex flex-col">
                            <span>{{ slotProps.data.name }}</span>
                            <span>{{ slotProps.data.email }}</span>
                        </div>
                    </template>
                </Column>
                <Column field="phone" header="Phone"></Column>
                <Column header="Role">
                    <template #body="slotProps">
                        {{ slotProps.data.roles[0].name }}
                    </template>
                </Column>
                <Column>
                    <template #body="slotProps">
                        <Button icon="pi pi-plus" outlined rounded
                            @click="() => { addManager(slotProps.data.id); search() }"></Button>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import dInput from '../../../components/d-input.vue';
import api from '../../../boot/api';
import { useParkingZone } from '../../../scripts/parkingZone';

const { addManager } = useParkingZone()

const searchQuery = ref('')

const rows = ref([])

const form = ref({
    name: 'asd',
    age: 0
})

const search = async () => {
    const { data } = await api.get('users', { params: { 'filters': { 'search': searchQuery.value } } })
    rows.value = data.data
}
</script>