<template>
    <div class="flex flex-col m-4 md:w-[400px]">
        <div class="flex flex-col mt-4">
            <label>Name</label>
            <InputText v-model="form.name" />
        </div>
        <div class="flex flex-col mt-4">
            <label>Amount</label>
            <InputNumber v-model="form.amount" mode="currency" currency="INR" fluid @input="handleAmountInput" />
        </div>
        <div class="flex flex-col mt-4">
            <label>Coins</label>
            <InputNumber v-model="form.coins" fluid @input="handleCoinInput" />
        </div>
        <div class="flex flex-col mt-4">
            <label>Active</label>
            <ToggleSwitch v-model="form.active" />
        </div>

        <Button class="mt-4" @click="submit">Submit</Button>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import api from '../../../boot/api';
import useRechargeAmounts from '../../../scripts/admin/wallet';
import { useToast } from 'primevue';

const toast = useToast()

const { form, getWalletRechargeAmounts, getCoinsMoneyValue, coinsMoneyValue } = useRechargeAmounts()

// Handle amount input - calculate coins based on amount
const handleAmountInput = (value) => {
    if (coinsMoneyValue.value?.coins && coinsMoneyValue.value?.money) {
        form.value.coins = Math.round(value.value * (Number(coinsMoneyValue.value.coins) / Number(coinsMoneyValue.value.money)))
    }
}

// Handle coin input - calculate amount based on coins
const handleCoinInput = (value) => {
    if (coinsMoneyValue.value?.coins && coinsMoneyValue.value?.money) {
        form.value.amount = Math.round(value.value * (Number(coinsMoneyValue.value.money) / Number(coinsMoneyValue.value.coins)))
    }
}

const submit = async () => {
    try {
        const fd = new FormData()
        fd.append('name', form.value.name)
        fd.append('amount', form.value.amount)
        fd.append('coins', form.value.coins)
        fd.append('active', form.value.active ? 1 : 0)

        let url = 'wallet-recharge-amount'
        if (form.value.id) {
            url = url + `/${form.value.id}`
            fd.append('_method', 'PATCH')
        }

        const { data } = await api.post(url, fd)

        if (data.success) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: data.message || 'Recharge amount saved successfully',
                life: 3000
            })

            // Reset form after successful submission
            form.value = {
                name: '',
                amount: 0,
                coins: 0,
                active: true
            }

            await getWalletRechargeAmounts()
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: data.message || 'Failed to save recharge amount',
                life: 3000
            })
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'An error occurred',
            life: 3000
        })
    }
}

onMounted(async () => {
    // Ensure coins money value is loaded
    await getCoinsMoneyValue()
})

onUnmounted(() => {
    // Reset form on unmount
    form.value = {
        name: '',
        amount: 0,
        coins: 0,
        active: true
    }
})
</script>