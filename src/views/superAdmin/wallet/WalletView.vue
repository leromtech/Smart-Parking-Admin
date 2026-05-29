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
                                <InputNumber v-model="coinsForm.coins" id="small" :disabled="!editing" :min="1"
                                    @blur="validateCoins" />
                            </InputGroup>
                            <span>=</span>
                            <InputGroup>
                                <InputNumber v-model="coinsForm.money" currency="INR" id="small" :disabled="!editing"
                                    :min="1" @blur="validateMoney" />
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
                <div class="flex flex-row gap-2">
                    <router-link to="/admin/wallet-promotions">
                        <Button icon="pi pi-gift" label="Promotions" outlined severity="info" />
                    </router-link>
                    <Button icon="pi pi-plus" rounded @click="openCreate = true"></Button>
                </div>
            </div>
        </template>
        <div class="flex flex-col gap-4 bg-neutral-100 p-2">
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
                <div class="grid grid-cols-3">
                    <div class="flex flex-col flex-1 items-center justify-center">
                        <span class="font font-semibold">Cost</span>
                        <span v-if="hasDiscountedPayable(rechargeAmount)" class="text-gray-400 line-through text-sm">
                            ₹{{ rechargeAmount.amount }}
                        </span>
                        <span :class="{ 'text-green-700 font-semibold': hasDiscountedPayable(rechargeAmount) }">
                            ₹{{ displayPayable(rechargeAmount) }}
                        </span>
                    </div>
                    <div class="flex flex-col flex-1 items-center justify-center">
                        <span class="font font-semibold">Coins</span>
                        <span>{{ rechargeAmount.coins }}</span>
                        <span
                            v-if="rechargeAmount.bonus_coins > 0 || displayTotalCoins(rechargeAmount) > rechargeAmount.coins"
                            class="text-sm text-green-700 font-medium"
                        >
                            +{{ rechargeAmount.bonus_coins ?? (displayTotalCoins(rechargeAmount) - rechargeAmount.coins) }} bonus
                            <template v-if="displayTotalCoins(rechargeAmount) > rechargeAmount.coins">
                                ({{ displayTotalCoins(rechargeAmount) }} total)
                            </template>
                        </span>
                    </div>
                    <div class="flex flex-col flex-1 items-center justify-center">
                        <span class="font font-semibold">Active</span>
                        <i
                            :class="[Boolean(rechargeAmount.active) ? 'pi pi-check text-green-600' : 'pi pi-times text-red-600']"></i>
                    </div>
                </div>
                <div
                    v-if="getAppliedPromotion(rechargeAmount)"
                    class="mt-3 pt-3 border-t border-sky-100 flex flex-col gap-2"
                >
                    <div class="flex flex-row items-center gap-2 flex-wrap">
                        <Tag severity="success" icon="pi pi-gift" :value="getAppliedPromotion(rechargeAmount).name" />
                        <span class="text-sm text-sky-800 font-medium">
                            {{ formatPromotionEffect(getAppliedPromotion(rechargeAmount)) }}
                        </span>
                    </div>
                    <p
                        v-if="promotionExtraDetail(rechargeAmount)"
                        class="text-xs text-gray-600 m-0"
                    >
                        {{ promotionExtraDetail(rechargeAmount) }}
                    </p>
                </div>
                <div
                    v-else-if="rechargeAmount.active"
                    class="mt-3 pt-3 border-t border-neutral-200 text-xs text-gray-400"
                >
                    No promotion currently applies
                </div>
            </Panel>
        </div>

        <Dialog v-model:visible="openCreate" header="Create a recharge amount">
            <template #header>
                <span class="font-semibold">{{ form.id ? 'Edit' : "Create" }}</span>
            </template>
            <create @created="handleCreated" />
        </Dialog>

        <Dialog v-model:visible="openDelete">
            <template #header>
                <span class="font-semibold">Confirm delete?</span>
            </template>
            <div class="flex flex-col">
                <span>Do you really want to delete the user ?</span>
                <div class="w-full flex flex-row mt-2">
                    <Button icon="pi pi-trash" label="DELETE" outlined severity="danger" class="w-[40%]"
                        @click="confirmDelete(handleDeleteCallback())"></Button>
                </div>
            </div>
        </Dialog>
    </Panel>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import useNotification from '../../../scripts/notification';
import create from './WalletCreate.vue';
import useRechargeAmounts from '../../../scripts/admin/wallet';
import {
    formatPromotionEffect,
    getAppliedPromotion,
} from '../../../scripts/admin/walletRechargePromotions';
import { InputNumber, useToast } from 'primevue';
import api from '../../../boot/api';

const toast = useToast()

const { editItem, deleteItem, walletRechargeAmounts, form, confirmDelete, coinsMoneyValue, getCoinsMoneyValue, getWalletRechargeAmounts } = useRechargeAmounts()

const { notify } = useNotification()

const editing = ref(false)

const displayPayable = (pack) => pack.payable_amount ?? pack.amount

const displayTotalCoins = (pack) =>
    pack.total_coins ?? pack.coins + (Number(pack.bonus_coins) || 0)

const hasDiscountedPayable = (pack) => {
    const payable = pack.payable_amount
    return payable != null && Number(payable) < Number(pack.amount)
}

const promotionExtraDetail = (pack) => {
    const parts = []
    if (hasDiscountedPayable(pack)) {
        parts.push(`User pays ₹${pack.payable_amount} instead of ₹${pack.amount}`)
    }
    const bonus = Number(pack.bonus_coins) || 0
    if (bonus > 0) {
        parts.push(`+${bonus} bonus coins on recharge`)
    }
    return parts.length ? parts.join(' · ') : null
}

const coinsForm = ref({
    coins: 1,
    money: 1
})

// Helper function to ensure positive values
const ensurePositiveValue = (value) => {
    const numValue = Number(value)
    return (numValue && numValue > 0) ? numValue : 1
}

const handleCreated = () => {
    openCreate.value = false
}

// Validation functions for individual fields
const validateCoins = () => {
    coinsForm.value.coins = ensurePositiveValue(coinsForm.value.coins)
}

const validateMoney = () => {
    coinsForm.value.money = ensurePositiveValue(coinsForm.value.money)
}

// Watch for changes in coinsMoneyValue and update coinsForm
watch(coinsMoneyValue, (newValue) => {
    if (newValue && newValue.coins && newValue.money) {
        coinsForm.value = {
            coins: ensurePositiveValue(newValue.coins),
            money: ensurePositiveValue(newValue.money)
        }
    }
}, { immediate: true, deep: true })

// Also watch coinsForm for any direct changes and validate
watch(() => coinsForm.value.coins, (newValue) => {
    if (newValue !== null && newValue !== undefined) {
        const validValue = ensurePositiveValue(newValue)
        if (validValue !== newValue) {
            coinsForm.value.coins = validValue
        }
    }
})

watch(() => coinsForm.value.money, (newValue) => {
    if (newValue !== null && newValue !== undefined) {
        const validValue = ensurePositiveValue(newValue)
        if (validValue !== newValue) {
            coinsForm.value.money = validValue
        }
    }
})

const saveCoinsToMoneyRate = async () => {
    // Validate before saving
    validateCoins()
    validateMoney()

    const fd = new FormData()
    fd.append('key', 'coins_money_value')
    fd.append('value', `${coinsForm.value.coins}:${coinsForm.value.money}`)
    const { data } = await api.post('settings', fd)
    editing.value = false

    toast.add({
        severity: data.success ? 'success' : 'error',
        summary: data.success ? 'Success' : 'Error',
        detail: data.success ? 'Coins to money rate updated successfully' : 'Failed to update coins to money rate',
        life: 3000
    })

    // Refresh the data after saving
    if (data.success) {
        await getCoinsMoneyValue()
    }
}

const handleDeleteCallback = () => {
    openDelete.value = false
    toast.add({ severity: 'success', summary: 'Success', detail: 'Wallet recharge pack deleted successfully', closable: true })
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

onMounted(async () => {
    try {
        await getCoinsMoneyValue()
        await getWalletRechargeAmounts()
        // Set coinsForm values after data is loaded
        if (coinsMoneyValue?.value) {
            coinsForm.value = {
                coins: ensurePositiveValue(coinsMoneyValue.value.coins),
                money: ensurePositiveValue(coinsMoneyValue.value.money)
            }
        }
    } catch (error) {
        console.error('Error loading coins money value:', error)
    }
})
</script>

<style>
#small input {
    width: 50px;
}
</style>