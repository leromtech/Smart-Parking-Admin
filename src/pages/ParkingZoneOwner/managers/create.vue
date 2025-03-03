<template>
    <div class="flex flex-col">
        <Tabs value="0" style="width: 100%">
            <TabList>
                <Tab value="0">Search Users</Tab>
                <Tab value="1">Create Manager</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
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
                </TabPanel>
                <!-- Create -->
                <TabPanel value="1">
                    <form class="flex flex-col gap-4 md:w-[500px]" @submit.prevent="submit">
                        <IftaLabel>
                            <InputText id="full" v-model="form.name" variant="filled" />
                            <label for="name">Name</label>
                        </IftaLabel>
                        <IftaLabel>
                            <InputText id="full" v-model="form.phone" variant="filled" />
                            <label for="phone">Phone no.</label>
                        </IftaLabel>

                        <IftaLabel>
                            <InputText id="full" v-model="form.email" variant="filled" />
                            <label for="phone">Email</label>
                        </IftaLabel>

                        <Button label="Submit" type="submit" class="mt-4"></Button>
                    </form>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import dInput from '../../../components/d-input.vue';
import api from '../../../boot/api';
import { useParkingZone } from '../../../scripts/parkingZone';
import { useToast } from 'primevue';

const { addManager, refresh } = useParkingZone()

const toast = useToast()

const searchQuery = ref('')

const rows = ref([])

const form = ref({
    name: '',
    phone: '',
    email: ''
})

const submit = async () => {
    try {
        const fd = new FormData()
        fd.append('name', form.value.name)
        fd.append('phone', form.value.phone)
        fd.append('email', form.value.email)
        const { data } = await api.post('manager/create', fd)

        if (data.success) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Manager added successfully', life: 3000 })
        }
        refresh()
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 })
    }
}

const search = async () => {
    const { data } = await api.get('users', { params: { 'filters': { 'search': searchQuery.value } } })
    rows.value = data.data
}
</script>

<style scoped>
form input {
    width: 100%;
}
</style>