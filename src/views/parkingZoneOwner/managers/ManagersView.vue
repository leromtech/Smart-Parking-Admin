<template>
    <div>
        <DataTable :value="rows" tableStyle="min-width: 50rem" paginator :rows="pagination.per_page" :lazy="true"
            :totalRecords="pagination.total" :rowsPerPageOptions="[5, 10, 15, 30]" @page="(e) => getManagers(e)">
            <template #empty>
                <div class="flex items-center justify-center text-neutral-400 py-2">
                    No managers found
                </div>
            </template>
            <template #header>
                <div class="flex flex-row justify-between">
                    <InputText icon="pi pi-search" placeholder="Search managers..." v-model="search" />
                    <Button icon="pi pi-plus" @click="createOpen = true"></Button>
                </div>
            </template>
            <Column header="Name">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        <span>{{ slotProps.data.name }}</span>
                        <span class="text-sm text-neutral-500">{{ slotProps.data.email }}</span>
                    </div>
                </template>
            </Column>
            <Column field="phone" header="Phone"></Column>
            <Column>
                <template #body="slotProps">
                    <Button icon="pi pi-trash" variant="text" severity="danger"
                        @click="() => initiateDelete(slotProps.data.id)"></Button>
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="openDelete">
            <template #header>
                <div class="pr-6">Confirm Delete</div>
            </template>
            <div class="flex flex-col items-center justify-center">
                <span>Do you want to remove {{ deleteName.toUpperCase() }} from managers?</span>
                <div class="flex flex-row items-center justify-end w-full mt-6 gap-3">
                    <Button icon="pi pi-times" severity="info" outlined label="Cancel"
                        @click="openDelete = false"></Button>
                    <Button icon="pi pi-trash" severity="danger" outlined label="Confirm"
                        @click="confirmDelete"></Button>
                </div>
            </div>
        </Dialog>

        <Dialog v-model:visible="createOpen">
            <template #header>
                <span class="font-semibold">Add a manager</span>
            </template>
            <create />
        </Dialog>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useParkingZone } from '../../../scripts/parkingZone';
import create from './ManagersCreate.vue'
import api from '../../../boot/api';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { useToast } from "primevue/usetoast";
import { debounce } from '../../../scripts/utils';
const toast = useToast();

const { parking_zone, removeManager, pagination, getParkingZone } = useParkingZone();
const createOpen = ref(false)
const openDelete = ref(false)
const search = ref('')

const rows = ref([]);

const toDelete = ref(null)
const deleteName = ref()

// Debounced search function
const debouncedSearch = debounce(() => {
    getManagers()
}, 300)

// Watch for search changes
watch(search, debouncedSearch)

const getManagers = async (pageParams = null) => {
    if (pageParams) {
        pagination.value = {
            per_page: pageParams.rows,
            page: pageParams.page + 1,
        }
    }

    const params = {
        pagination: pagination.value,
        search: search.value
    }

    try {
        const { data } = await api.get(`managers`, { params })
        rows.value = data.data || []
        pagination.value = {
            per_page: data.per_page,
            total: data.total,
            page: data.current_page
        }
    } catch (error) {
        console.error('Error fetching managers:', error)
        rows.value = []
    }
}

const initiateDelete = (id) => {
    toDelete.value = id
    openDelete.value = true
    deleteName.value = parking_zone.value.managers.find(item => item.id === toDelete.value).name

}

const confirmDelete = async () => {
    const data = await removeManager(toDelete.value)
    openDelete.value = false
    await getManagers() // Refresh the managers list
    toast.add({ severity: 'success', summary: 'Success', detail: data.message, life: 3000 });
}

onMounted(() => {
    getManagers()
});

</script>
