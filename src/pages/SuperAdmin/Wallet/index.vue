<template>
    <Panel>
        <template #header>
            <div class="flex flex-row items-center justify-between w-full">
                <span>Wallet</span>
                <div>
                    <Button icon="pi pi-plus" rounded @click="openCreate = true"></Button>
                </div>
            </div>
        </template>
        <Panel v-for="rechargeAmount in walletRechargeAmounts">
            <template #header="slotProps">
                <div class="flex flex-row items-center justify-between w-full">
                    <span class="font-semibold">
                        {{ rechargeAmount.name }}
                    </span>
                    <div class="flex flex-row gap-2">
                        <Button icon="pi pi-trash" severity="danger" rounded outlined
                            @click="() => initiateDelete(rechargeAmount.id)"></Button>
                        <Button icon="pi pi-pen-to-square" severity="warn" rounded outlined
                            @click="() => edit(rechargeAmount)"></Button>
                    </div>
                </div>
            </template>
            <div class="flex flex-row">
                <div class="flex flex-col flex-1">
                    <span>Cost</span>
                    {{ rechargeAmount.amount }}
                </div>
                <div class="flex flex-col flex-1">
                    <span>Coins</span>
                    {{ rechargeAmount.coins }}
                </div>
                <div class="flex flex-col flex-1">
                    <span>Active</span>
                    {{ rechargeAmount.active }}
                </div>
            </div>
        </Panel>

        <Dialog v-model:visible="openCreate" header="Create a recharge amount">
            <template #header>
                <span class="font-semibold">{{ form.id ? 'Edit' : "Create" }}</span>
            </template>
            <create />
        </Dialog>

        <Dialog v-model:visible="openDelete">
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
import { computed, onMounted, ref } from 'vue';
import useNotification from '../../../scripts/notification';
import create from './create.vue';
import useRechargeAmounts from '../../../scripts/admin/wallet';

const { editItem, deleteItem, walletRechargeAmounts, form, confirmDelete } = useRechargeAmounts()

const { notify } = useNotification()

const openCreate = ref(false)
const openDelete = ref(false)

const initiateDelete = (id) => {
    deleteItem.value = id
    openDelete.value = true
}

const edit = (item) => {
    openCreate.value = true
    console.log(item)
    form.value = { ...item, active: item.active ? true : false }
}
</script>