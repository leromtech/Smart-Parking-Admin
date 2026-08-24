<template>
    <div class="flex flex-col gap-8">
        <section class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Pending approvals</h3>
                <Button icon="pi pi-refresh" rounded outlined severity="secondary" @click="fetchPending" />
            </div>
            <DataTable :value="pending" tableStyle="min-width: 50rem" paginator :rows="pendingPagination.per_page"
                :lazy="true" :totalRecords="pendingPagination.total" :rowsPerPageOptions="[5, 10, 15, 30]"
                @page="(e) => fetchPending(e)">
                <template #empty>
                    <div class="flex items-center justify-center text-neutral-400 py-2">No pending requests</div>
                </template>
                <Column header="User">
                    <template #body="slotProps">{{ slotProps.data.user?.name ?? '—' }}</template>
                </Column>
                <Column header="Rate">
                    <template #body="slotProps">{{ slotProps.data.subscriptionRate?.name ?? '—' }}</template>
                </Column>
                <Column header="Months">
                    <template #body="slotProps">{{ formatMonths(slotProps.data.selected_months) }}</template>
                </Column>
                <Column header="Amount">
                    <template #body="slotProps">₹{{ slotProps.data.amount ?? '—' }}</template>
                </Column>
                <Column header="From - To">
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.start_date) }} - {{ formatDate(slotProps.data.end_date) }}
                    </template>
                </Column>
                <Column header="Actions">
                    <template #body="slotProps">
                        <div class="flex flex-row gap-2">
                            <Button icon="pi pi-check" size="small" severity="success"
                                :loading="approving === slotProps.data.id" @click="approve(slotProps.data)" />
                            <Button icon="pi pi-times" size="small" severity="danger" @click="openReject(slotProps.data)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </section>

        <section class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Subscriptions</h3>
                <Button icon="pi pi-plus" @click="createDialogOpen = true" />
            </div>
            <DataTable :value="subscriptions" tableStyle="min-width: 50rem" paginator :rows="allPagination.per_page"
                :lazy="true" :totalRecords="allPagination.total" :rowsPerPageOptions="[5, 10, 15, 30]"
                @page="(e) => fetchSubscriptions(e)">
                <template #empty>
                    <div class="flex items-center justify-center text-neutral-400 py-2">No subscriptions yet</div>
                </template>
                <Column header="User">
                    <template #body="slotProps">{{ slotProps.data.user?.name ?? '—' }}</template>
                </Column>
                <Column header="Rate">
                    <template #body="slotProps">{{ slotProps.data.subscriptionRate?.name ?? '—' }}</template>
                </Column>
                <Column header="Months">
                    <template #body="slotProps">{{ formatMonths(slotProps.data.selected_months) }}</template>
                </Column>
                <Column header="Amount">
                    <template #body="slotProps">₹{{ slotProps.data.amount ?? '—' }}</template>
                </Column>
                <Column header="From - To">
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.start_date) }} - {{ formatDate(slotProps.data.end_date) }}
                    </template>
                </Column>
                <Column header="Status">
                    <template #body="slotProps">
                        <Tag :value="humanizeString(slotProps.data.status)"
                            :severity="statusSeverity(slotProps.data.status)" />
                    </template>
                </Column>
            </DataTable>
        </section>

        <Dialog v-model:visible="createDialogOpen" class="w-[50%]" modal header="Request a new subscription">
            <create @save="onCreated" />
        </Dialog>

        <Dialog v-model:visible="rejectOpen" class="w-[40%]" modal header="Reject subscription">
            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium">Reason</label>
                    <Textarea v-model="rejectReason" rows="3" placeholder="Reason for rejection" />
                </div>
                <div class="flex justify-end gap-2">
                    <Button label="Cancel" outlined severity="secondary" @click="rejectOpen = false" />
                    <Button label="Reject" severity="danger" :loading="rejecting" @click="confirmReject" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import api from '../../../boot/api';
import create from './SubscriptionCreate.vue';
import useAuth from '../../../scripts/auth';
import { useToast } from 'primevue';
import { humanizeString } from '../../../scripts/utils';

const { user } = useAuth();
const toast = useToast();

const createDialogOpen = ref(false);
const rejectOpen = ref(false);
const rejectReason = ref('');
const rejectTarget = ref(null);
const approving = ref(null);
const rejecting = ref(false);

const subscriptions = ref([]);
const pending = ref([]);

const pendingPagination = ref({ per_page: 10, total: 0, page: 1 });
const allPagination = ref({ per_page: 10, total: 0, page: 1 });

const parkingZoneId = computed(() => {
    return user.value?.parkingZoneOwned?.id ?? user.value?.parking_zone_owned?.id ?? null;
});

const fetchPending = async (pageParams) => {
    if (pageParams) {
        pendingPagination.value = { per_page: pageParams.rows, page: pageParams.page + 1 };
    }
    const { data } = await api.get('subscriptions/pending', {
        params: { pagination: pendingPagination.value },
    });
    pending.value = data.data ?? [];
    pendingPagination.value = { per_page: data.per_page, total: data.total, page: data.current_page };
};

const fetchSubscriptions = async (pageParams) => {
    if (pageParams) {
        allPagination.value = { per_page: pageParams.rows, page: pageParams.page + 1 };
    }
    const { data } = await api.get('subscriptions', {
        params: {
            pagination: allPagination.value,
            parking_zone_id: parkingZoneId.value,
        },
    });
    subscriptions.value = data.data ?? [];
    allPagination.value = { per_page: data.per_page, total: data.total, page: data.current_page };
};
const approve = async (item) => {
    try {
        approving.value = item.id;
        await api.post(`subscriptions/${item.id}/approve`);
        toast.add({ severity: 'success', summary: 'Approved', detail: 'Subscription approved', life: 3000 });
        await Promise.all([fetchPending(), fetchSubscriptions()]);
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Failed', detail: e.response?.data?.message ?? 'Approval failed', life: 4000 });
    } finally {
        approving.value = null;
    }
};

const openReject = (item) => {
    rejectTarget.value = item;
    rejectReason.value = '';
    rejectOpen.value = true;
};

const confirmReject = async () => {
    if (!rejectTarget.value) return;
    try {
        rejecting.value = true;
        await api.post(`subscriptions/${rejectTarget.value.id}/reject`, { rejection_reason: rejectReason.value });
        rejecting.value = false;
        toast.add({ severity: 'success', summary: 'Rejected', detail: 'Subscription rejected', life: 3000 });
        rejectOpen.value = false;
        rejectTarget.value = null;
        rejectReason.value = '';
        await Promise.all([fetchPending(), fetchSubscriptions()]);
    } catch (e) {
        rejecting.value = false;
        toast.add({ severity: 'error', summary: 'Failed', detail: e.response?.data?.message ?? 'Rejection failed', life: 4000 });
    }
};

const onCreated = () => {
    createDialogOpen.value = false;
    fetchPending();
    fetchSubscriptions();
};

const formatDate = (value) => {
    if (!value) return '—';
    return String(value).split('T')[0];
};

const formatMonths = (months) => {
    if (!Array.isArray(months) || !months.length) return '—';
    return months.map((m) => {
        const [y, mm] = m.split('-').map(Number);
        return new Date(y, mm - 1, 1).toLocaleString('default', { month: 'short', year: 'numeric' });
    }).join(', ');
};

const statusSeverity = (status) => {
    switch (status) {
        case 'active': return 'success';
        case 'approved': return 'info';
        case 'pending': return 'warn';
        case 'rejected': return 'danger';
        case 'canceled': return 'secondary';
        case 'expired': return 'secondary';
        default: return 'secondary';
    }
};

onMounted(async () => {
    await Promise.all([fetchPending(), fetchSubscriptions()]);
});
</script>
