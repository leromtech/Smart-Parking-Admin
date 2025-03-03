<template>
    <Panel>
        <template #header>
            <div class="flex flex-row items-center justify-between w-full">
                <div class="flex flex-row gap-10 items-center">
                    <span class="font-semibold">Wallet</span>
                    <div class="flex flex-row font-semibold items-center gap-3">
                        <div class="flex flex-row gap-2 items-center">
                            <InputGroup>
                                <InputGroupAddon class="cursor-pointer">
                                    <span>Coins</span>
                                </InputGroupAddon>
                                <InputNumber v-model="coinsForm.coins" id="small" :disabled="!editing" />
                            </InputGroup>
                            <span>=</span>
                            <InputGroup>
                                <InputNumber v-model="coinsForm.money" currency="INE" id="small" :disabled="!editing" />
                                <InputGroupAddon>
                                    <span>₹</span>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                        <Button icon="pi pi-pen-to-square" rounded outlined severity="warn" v-if="!editing"
                            @click="editing = true"></Button>
                        <Button icon="pi pi-check" rounded outlined v-else @click="saveCoinsToMoneyRate"></Button>
                    </div>
                </div>
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
import { InputNumber, useToast } from 'primevue';
import api from '../../../boot/api';

const toast = useToast()

const { editItem, deleteItem, walletRechargeAmounts, form, confirmDelete } = useRechargeAmounts()

const { notify } = useNotification()

const editing = ref(false)

const coinsForm = ref({
    coins: 1,
    money: 1
})

const saveCoinsToMoneyRate = async () => {
    const fd = new FormData()
    fd.append('key', 'coins_money_value')
    fd.append('value', `${coinsForm.value.coins}:${coinsForm.value.money}`)
    const { data } = await api.post('settings', fd)
    editing.value = false

    toast.add({ severity: data.success ? 'success' : 'error', summary: data.success ? 'Success' : 'Error', detail: data.message, life: 3000 })
}

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

<style>
#small input {
    width: 50px;
}
</style>