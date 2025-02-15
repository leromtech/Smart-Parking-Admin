import { onMounted, ref } from "vue";
import api from "../../boot/api";

const walletRechargeAmounts = ref()

const editItem = ref()
const deleteItem = ref()

const form = ref({
    id: null,
    name: '',
    amount: '',
    coins: '',
    active: true
})

const getWalletRechargeAmounts = async () => {
    const { data } = await api.get('wallet-recharge-amount')
    walletRechargeAmounts.value = data
}

const confirmDelete = async () => {
    const fd = new FormData()
    fd.append('_method', 'DELETE')
    const { data } = await api.post(`wallet-recharge-amount/${deleteItem.value}`, fd)
    await getWalletRechargeAmounts()
    deleteItem.value = null
}

export default function useRechargeAmounts() {
    onMounted(async () => [
        await getWalletRechargeAmounts()
    ])

    return {
        walletRechargeAmounts,
        getWalletRechargeAmounts,
        confirmDelete,
        editItem,
        deleteItem,
        form
    }
}

