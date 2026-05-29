<template>
    <Panel class="w-full">
        <template #header>
            <div class="flex flex-row items-center justify-between w-full">
                <div class="flex flex-col gap-1">
                    <span class="font-semibold text-lg">Wallet Recharge Promotions</span>
                    <span class="text-sm text-gray-500 font-normal">
                        Discounts and bonus-coin offers applied automatically on recharge (best eligible promotion wins).
                    </span>
                </div>
                <Button icon="pi pi-plus" rounded label="Add promotion" @click="openCreate" />
            </div>
        </template>

        <DataTable
            :value="promotions"
            :loading="loading"
            tableStyle="min-width: 60rem"
            paginator
            :rows="10"
            :rowsPerPageOptions="[10, 25, 50]"
        >
            <Column field="name" header="Name" style="min-width: 10rem" />

            <Column header="Type" style="min-width: 12rem">
                <template #body="{ data }">
                    <span class="text-sm">{{ discountTypeLabel(data.discount_type) }}</span>
                </template>
            </Column>

            <Column header="Value" style="width: 6rem">
                <template #body="{ data }">
                    {{ formatDiscountValue(data) }}
                </template>
            </Column>

            <Column field="priority" header="Priority" style="width: 5rem" />

            <Column header="Active" style="width: 5rem">
                <template #body="{ data }">
                    <i
                        :class="[
                            Boolean(data.is_active)
                                ? 'pi pi-check text-green-600'
                                : 'pi pi-times text-red-600',
                        ]"
                    />
                </template>
            </Column>

            <Column header="Conditions" style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="flex flex-col gap-0.5 text-xs text-gray-600">
                        <span v-if="data.first_n_users">First {{ data.first_n_users }} users</span>
                        <span v-if="data.max_uses">Max {{ data.max_uses }} uses</span>
                        <span v-if="data.max_uses_per_user">Max {{ data.max_uses_per_user }}/user</span>
                        <span v-if="data.starts_at || data.ends_at">
                            {{ data.starts_at || '…' }} → {{ data.ends_at || '…' }}
                        </span>
                        <span v-if="data.daily_start_time && data.daily_end_time">
                            Daily {{ data.daily_start_time }}–{{ data.daily_end_time }}
                        </span>
                        <span v-if="data.wallet_recharge_amount">
                            Pack: {{ data.wallet_recharge_amount.name }}
                        </span>
                        <span v-else-if="data.wallet_recharge_amount_id">
                            Pack #{{ data.wallet_recharge_amount_id }}
                        </span>
                        <span v-if="data.min_recharge_amount">Min ₹{{ data.min_recharge_amount }}</span>
                        <span
                            v-if="
                                !data.first_n_users &&
                                !data.max_uses &&
                                !data.max_uses_per_user &&
                                !data.starts_at &&
                                !data.ends_at &&
                                !data.daily_start_time &&
                                !data.wallet_recharge_amount_id &&
                                !data.min_recharge_amount
                            "
                            class="text-gray-400"
                        >—</span>
                    </div>
                </template>
            </Column>

            <Column header="Usage" style="width: 6rem">
                <template #body="{ data }">
                    <span v-if="data.uses_count != null">{{ data.uses_count }}</span>
                    <span v-else class="text-gray-400">—</span>
                </template>
            </Column>

            <Column header="" style="width: 7rem">
                <template #body="{ data }">
                    <div class="flex flex-row gap-2">
                        <Button
                            icon="pi pi-pen-to-square"
                            rounded
                            outlined
                            severity="warn"
                            size="small"
                            @click="openEdit(data)"
                        />
                        <Button
                            icon="pi pi-trash"
                            rounded
                            outlined
                            severity="danger"
                            size="small"
                            @click="initiateDelete(data.id)"
                        />
                    </div>
                </template>
            </Column>

            <template #empty>
                <div class="text-center py-8 text-gray-500">No promotions yet. Create one to get started.</div>
            </template>
        </DataTable>

        <Dialog v-model:visible="formOpen" modal :header="editItem ? 'Edit promotion' : 'Create promotion'" class="w-full max-w-xl">
            <WalletRechargePromotionForm :key="formKey" @saved="handleSaved" />
        </Dialog>

        <Dialog v-model:visible="deleteOpen" modal header="Delete promotion?">
            <p class="mb-4">This promotion will no longer apply to wallet recharges.</p>
            <Button
                icon="pi pi-trash"
                label="Delete"
                severity="danger"
                outlined
                @click="handleDelete"
            />
        </Dialog>
    </Panel>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import WalletRechargePromotionForm from './WalletRechargePromotionForm.vue';
import useWalletRechargePromotions, {
    discountTypeLabel,
    formatDiscountValue,
} from '../../../scripts/admin/walletRechargePromotions';

const toast = useToast();
const {
    promotions,
    editItem,
    deleteItem,
    loading,
    getPromotions,
    confirmDelete,
    resetForm,
} = useWalletRechargePromotions();

const formOpen = ref(false);
const deleteOpen = ref(false);
const formKey = ref(0);

const openCreate = () => {
    editItem.value = null;
    resetForm();
    formKey.value += 1;
    formOpen.value = true;
};

const openEdit = (item) => {
    editItem.value = item;
    formKey.value += 1;
    formOpen.value = true;
};

const handleSaved = () => {
    formOpen.value = false;
    editItem.value = null;
};

const initiateDelete = (id) => {
    deleteItem.value = id;
    deleteOpen.value = true;
};

const handleDelete = async () => {
    try {
        await confirmDelete(() => {
            deleteOpen.value = false;
            toast.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Promotion removed',
                life: 3000,
            });
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'Failed to delete promotion',
            life: 3000,
        });
    }
};

onMounted(() => getPromotions());
</script>
