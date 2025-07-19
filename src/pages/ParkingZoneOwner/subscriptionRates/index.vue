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
                    <Button icon="pi pi-plus" @click="createDialogOpen = true"></Button>
                </div>
            </template>
            <Column header="Name">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        {{ slotProps.data.name }}
                    </div>
                </template>
            </Column>
            <Column header="Price">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        {{ slotProps.data.price }}
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
            <Column>
                <template #body="slotProps">
                    <Button icon="pi pi-trash" variant="text" severity="danger"
                        @click="() => initiateDelete(slotProps.data.id)"></Button>
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="createDialogOpen" class="w-[50%]" modal header="Create a new subscription rate">
            <create @save="handleCreateSave" />
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '../../../boot/api';
import create from './create.vue';
import useAuth from '../../../scripts/auth';
import { normalizeTimestamp, humanizeString, debounce } from '../../../scripts/utils';

const { user } = useAuth()

const createDialogOpen = ref(false)
const subscriptions = ref([]) // Initialize as empty array
const search = ref('')

const pagination = ref({
    per_page: 10,
    total_records: 0, // Keep consistent naming
    page: 1,
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

// Fix: Debounce with proper delay and reset pagination on search
const debouncedSearch = debounce(() => {
    pagination.value.page = 1 // Reset to first page when searching
    fetchSubscriptionRates()
}, 300)

watch(search, debouncedSearch)

// Handle dialog close and refresh
const handleCreateSave = async () => {
    createDialogOpen.value = false
    await fetchSubscriptionRates() // Refresh data after create
}

onMounted(async () => {
    await fetchSubscriptionRates()
})
</script>