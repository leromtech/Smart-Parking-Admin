<template>
    <div class="flex flex-col gap-2">
        <DataTable :value="subscriptions" tableStyle="min-width: 50rem" paginator :rows="pagination.per_page"
            :lazy="true" :totalRecords="pagination.total" :rowsPerPageOptions="[5, 10, 15, 30]"
            @page="(e) => fetchSubscriptionRates(e)">
            <template #empty>
                <div class="flex items-center justify-center text-neutral-400 py-2">
                    No Subscription rates
                </div>
            </template>
            <template #header>
                <div class="flex flex-row justify-between">
                    <InputText icon="pi pi-search" placeholder="Search" v-model="search" />
                    <Button icon="pi pi-plus" @click="openCreateDialog()"></Button>
                </div>
            </template>
            <Column header="Name">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        <span class="font-semibold">{{ slotProps.data.name }}</span>
                    </div>
                </template>
            </Column>
            <Column header="Price">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        <span>₹{{ slotProps.data.price }}</span>
                    </div>
                </template>
            </Column>
            <Column header="Active">
                <template #body="slotProps">
                    <div :class="[slotProps.data.is_active ? 'bg-green-500' : 'bg-red-500', 'w-3 h-3 rounded-full']">
                    </div>
                </template>
            </Column>
            <Column header="Vehicle Type">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        {{ humanizeString(slotProps.data.vehicle_type.name) }}
                    </div>
                </template>
            </Column>
            <Column header="Created At">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        {{ normalizeTimestamp(slotProps.data.created_at) }}
                    </div>
                </template>
            </Column>
            <Column header="Updated At">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        {{ normalizeTimestamp(slotProps.data.updated_at) }}
                    </div>
                </template>
            </Column>
            <Column header="Actions">
                <template #body="slotProps">
                    <div class="flex flex-row gap-2">
                        <Button icon="pi pi-pen-to-square" size="small" severity="warning"
                            @click="openEditDialog(slotProps.data)" variant="outlined" />
                        <Button icon="pi pi-trash" size="small" severity="danger"
                            @click="() => initiateDelete(slotProps.data.id)" variant="outlined" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="createDialogOpen" class="w-[50%]" modal :header="dialogTitle">
            <create :editData="editData" @save="handleCreateSave" />
        </Dialog>

        <Dialog v-model:visible="deleteDialogOpen" class="w-[30%]" modal header="Confirm Delete">
            <div class="flex flex-col gap-4">
                <p>Are you sure you want to delete this subscription rate?</p>
                <div class="flex justify-end gap-2">
                    <Button label="Cancel" severity="secondary" outlined @click="deleteDialogOpen = false" />
                    <Button label="Delete" severity="danger" @click="confirmDelete" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import api from '../../../boot/api';
import create from './SubscriptionRatesView.vue';
import useAuth from '../../../scripts/auth';
import { normalizeTimestamp, humanizeString, debounce } from '../../../scripts/utils';
import { useToast } from 'primevue';

const { user } = useAuth()
const toast = useToast();

const createDialogOpen = ref(false)
const subscriptions = ref([]) // Initialize as empty array
const search = ref('')
const editData = ref(null)

const pagination = ref({
    per_page: 10,
    total_records: 0, // Keep consistent naming
    page: 1,
})

const deleteDialogOpen = ref(false)
const selectedSubscriptionId = ref(null)

// Computed property for dialog title
const dialogTitle = computed(() => {
    return editData.value ? 'Edit Subscription Rate' : 'Create a new subscription rate'
})

const fetchSubscriptionRates = async (pageParams = null) => {
    try {
        if (pageParams) {
            pagination.value = {
                per_page: pageParams.rows,
                page: pageParams.page + 1,
            }
        }

        const { data } = await api.get(`parking-zone/${user.value.parking_zone_owned.id}/subscription-rates`, {
            params: {
                page: pagination.value.page,
                per_page: pagination.value.per_page,
                parking_zone_id: user.value.parking_zone_owned.id,
                search: search.value
            }
        })

        subscriptions.value = data.data || []
        pagination.value = {
            per_page: data.per_page,
            total_records: data.total, // Fix: use correct property name
            page: data.current_page
        }
    } catch (error) {
        console.error('Error fetching subscription rates:', error)
        subscriptions.value = []
    }
}

// Dialog functions
const openCreateDialog = () => {
    editData.value = null
    createDialogOpen.value = true
}

const openEditDialog = (item) => {
    editData.value = { ...item } // Create a copy of the item
    createDialogOpen.value = true
}

// Fix: Debounce with proper delay and reset pagination on search
const debouncedSearch = debounce(() => {
    pagination.value.page = 1 // Reset to first page when searching
    fetchSubscriptionRates()
}, 300)

watch(search, debouncedSearch)

// Handle dialog close and refresh
const handleCreateSave = async () => {
    createDialogOpen.value = false
    editData.value = null
    await fetchSubscriptionRates() // Refresh data after create/update
}

const initiateDelete = (id) => {
    selectedSubscriptionId.value = id
    deleteDialogOpen.value = true
}

const confirmDelete = async () => {
    try {
        await api.delete(`parking-zone/${user.value.parking_zone_owned.id}/subscription-rates/${selectedSubscriptionId.value}`)
        deleteDialogOpen.value = false
        selectedSubscriptionId.value = null
        await fetchSubscriptionRates() // Refresh data after delete
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Subscription rate deleted successfully',
            life: 3000
        })
    } catch (error) {
        console.error('Error deleting subscription rate:', error)
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete subscription rate',
            life: 3000
        })
    }
}

onMounted(async () => {
    await fetchSubscriptionRates()
})
</script>