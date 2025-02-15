<template>
    <div class="flex flex-col m-4">
        <div class="flex flex-col mt-4">
            <label>Name</label>
            <InputText v-model="form.name" />
        </div>
        <div class="flex flex-col mt-4">
            <label>Amount</label>
            <InputText v-model="form.amount" v-keyfilter.int fluid />
        </div>
        <div class="flex flex-col mt-4">
            <label>Coins</label>
            <InputText v-model="form.coins" v-keyfilter.int fluid />
        </div>
        <div class="flex flex-col mt-4">
            <label>Active</label>
            <ToggleSwitch v-model="form.active" />
        </div>

        <Button class="mt-4" @click="submit">Submit</Button>
    </div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue';
import api from '../../../boot/api';
import useRechargeAmounts from '../../../scripts/admin/wallet';
import { useToast } from 'primevue';

const toast = useToast()

const { form, getWalletRechargeAmounts } = useRechargeAmounts()

const submit = async () => {
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
        toast.add({ severity: 'success', summary: 'Success', detail: 'Recharge amount added successfully' })
    }

    getWalletRechargeAmounts()
}

onUnmounted(() => {
    form.value = { active: true }
})

</script>