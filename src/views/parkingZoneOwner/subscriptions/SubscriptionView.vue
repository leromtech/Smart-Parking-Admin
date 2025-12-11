<template>
    <div class="flex flex-col gap-2">
        <DataTable :value="subscriptions" tableStyle="min-width: 50rem" paginator :rows="pagination.per_page"
            :lazy="true" :totalRecords="pagination.total" :rowsPerPageOptions="[5, 10, 15, 30]"
            @page="(e) => fetchSubscriptions(e)">
            <template #empty>
                <div class="flex items-center justify-center text-neutral-400 py-2">
                    No subscriptions yet
                </div>
            </template>
            <template #header>
                <div class="flex flex-row justify-between">
                    <InputText icon="pi pi-search" placeholder="Search" />
                    <Button icon="pi pi-plus" @click="createDialogOpen = true"></Button>
                </div>
            </template>
            <Column header="User">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        {{ slotProps.data.user.name }}
                    </div>
                </template>
            </Column>
            <Column header="Rate">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        {{ slotProps.data.subscription_rate.name }}
                    </div>
                </template>
            </Column>
            <Column header="From - To">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        {{ normalizeTimestamp(slotProps.data.start_date) }} - {{
                            normalizeTimestamp(slotProps.data.end_date) }}
                    </div>
                </template>
            </Column>
            <Column header="Month">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        {{ deduceMonth(slotProps.data.start_date) }}
                    </div>
                </template>
            </Column>
            <Column header="Remaining">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        {{ getRemainingDays(slotProps.data.end_date) }}
                    </div>
                </template>
            </Column>
            <Column header="Status">
                <template #body="slotProps">
                    {{ slotProps.data.status }}
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="createDialogOpen" class="w-[50%]" modal header="Create a new subsscription">
            <create @save="createDialogOpen = false" />
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../../../boot/api';
import create from './SubscriptionCreate.vue';
import useAuth from '../../../scripts/auth';
import { normalizeTimestamp } from '../../../scripts/utils';

const { user } = useAuth()

const createDialogOpen = ref(false)

const subscriptions = ref()

const pagination = ref({
    per_page: 10,
    total: 0,
    page: 1,
})

const fetchSubscriptions = async (pageParams) => {
    if (pageParams) {
        pagination.value = {
            per_page: pageParams.rows,
            page: pageParams.page + 1,
        }
    }
    const { data } = await api.get('subscriptions', {
        params: {
            'pagination': pagination.value,
            'parking_zone_id': user.value.parking_zone_owned.id
        }
    })
    subscriptions.value = data.data
    console.log(subscriptions.value)
    pagination.value = {
        per_page: data.per_page,
        total_records: data.total,
        page: data.current_page
    }
}

const getRemainingDays = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    if (diff <= 0) return 'Expired';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days + ' day' + (days !== 1 ? 's' : '') + ' left';
}

const deduceMonth = (startDate) => {
    const date = new Date(startDate);
    const month = date.toLocaleString('default', { month: 'long' });
    return month.charAt(0).toUpperCase() + month.slice(1); // Capitalize the first letter
}

onMounted(async () => {
    await fetchSubscriptions()
})
</script>