import { onMounted, ref } from "vue";
import api from "../../boot/api";

const walletRechargeAmounts = ref()
const coinsMoneyValue = ref({
    coins: 0,
    money: 0
})
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

const getCoinsMoneyValue = async () => {
    const { data } = await api.get('settings', {
        params: {
            key: 'coins_money_value'
        }
    })
    const temp = String(data.value).split(':').concat()
    coinsMoneyValue.value.coins = temp[0]
    coinsMoneyValue.value.money = temp[1]
}

export default function useRechargeAmounts() {
    onMounted(async () => [
        await getWalletRechargeAmounts(),
        await getCoinsMoneyValue()
    ])

    return {
        getCoinsMoneyValue,
        coinsMoneyValue,
        walletRechargeAmounts,
        getWalletRechargeAmounts,
        confirmDelete,
        editItem,
        deleteItem,
        form
    }
}

