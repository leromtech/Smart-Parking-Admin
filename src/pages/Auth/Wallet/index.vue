<template>
    <div class="flex flex-col w-full h-full pt-4">
        <p class="text-lg font-semibold">Wallet Recharge Amounts</p>
        <div class="flex flex-row items-center justify-end">
            <button class="p-2 bg-blue-600 rounded-md text-white px-6" @click="openAddModal">ADD</button>
        </div>
        <div class="flex flex-col border m-4 p-4">
            <div v-if="walletRechargeAmounts.length <= 0" class="w-full flex items-center justify-center">
                NO ITEMS
            </div>
            <div v-else v-for="amount in walletRechargeAmounts"
                class="flex flex-row items-center justify-between hover:bg-slate-50 border p-2 px-4">
                <div class="flex flex-col gap-2">
                    <div class="flex flex-col">
                        <p class="font-semibold">Cost</p>
                        <p class="font-light">(Cost in rupees)</p>
                    </div>
                    <div class="text-lg font-semibold">
                        {{ amount.amount }}
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex flex-col">
                        <p class="font-semibold">Coins</p>
                        <p class="font-light">(Coins relative to the cost)</p>
                    </div>
                    <div class="text-lg font-semibold">
                        {{ amount.amount }}
                    </div>
                </div>
                <div class="flex flex-col gap-2 h-full items-stretch justify-between">
                    <div class="flex flex-col">
                        <p class="font-semibold">Active</p>
                    </div>
                    <div class="w-full flex items-center justify-center">
                        <div :class="['rounded-full w-3 h-3', amount.active ? 'bg-green-600' : 'bg-red-600']" />
                    </div>
                </div>
                <div class="flex flex-row h-full gap-2">
                    <font-awesome-icon :icon="['fas', 'pen-to-square']" class="w-5 h-5 hover:text-neutral-700"
                        @click="() => edit(amount)" />
                    <font-awesome-icon :icon="['far', 'trash-can']" class="text-red-700 w-5 h-5 hover:text-red-500 " />
                </div>
            </div>
        </div>

        <Modal v-model="openAdd" class="flex flex-col bg-white p-8 lg:w-[20%] md:w-[60%] w-[90%]">
            <p class="text-lg font-medium">ADD A RECHARGE AMOUNT</p>
            <form class="flex flex-col mt-4" @submit.prevent="submit">
                <div class="flex flex-col gap-2">
                    <label for="name" class="text-lg">Name</label>
                    <input type="text" id="name" v-model="form.name" class="p-4 bg-slate-200">
                </div>
                <div class="flex flex-col gap-2">
                    <label for="amount" class="text-lg">Amount</label>
                    <input type="number" id="amount" v-model="form.amount" class="p-4 bg-slate-200" required>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="coins" class="text-lg">Coins</label>
                    <input type="number" id="coins" v-model="form.coins" class="p-4 bg-slate-200" required>
                </div>
                <div class="flex flex-row gap-2 mt-4" v-if="form.id">
                    <label for="active" class="text-lg">Active</label>
                    <input type="checkbox" id="active" v-model="form.active" class="p-4 bg-slate-200">
                </div>
                <div class="flex flex-row items-center justify-end mt-4">
                    <button class="p-3 px-6 bg-blue-600 text-white rounded-md">SAVE</button>
                </div>
            </form>
        </Modal>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import api from '../../../boot/api';
import Modal from '../../../components/Modal.vue';
import useNotification from '../../../scripts/notification';

const { notify } = useNotification()

const edit = (item) => {
    openAdd.value = true
    form.value = { ...item, active: item.active ? true : false }
}

const walletRechargeAmounts = ref([])
const openAdd = ref(false)

const openAddModal = () => {
    form.value = {
        name: '',
        amount: '',
        coins: ''
    }
    openAdd.value = true
}

const isValid = computed(() => {
    return form.value.amount &&
        form.value.coins
})

const form = ref({
    'id': '',
    'name': '',
    'amount': 0,
    'coins': 0,
})

const getWalletRechargeAmounts = async () => {
    const { data } = await api.get('wallet-recharge-amount')
    walletRechargeAmounts.value = data
}

const submit = async () => {
    if (!isValid.value) {
        return alert('Please fill all required fields')
    }
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
        notify({ type: 'success', message: data.message })
    }

    getWalletRechargeAmounts()
    openAdd.value = false
}

onMounted(() => [
    getWalletRechargeAmounts()
])
</script>