import { ref } from "vue";
import api from "../../boot/api";
import { attachPromotionsToPacks } from "./walletRechargePromotions";

const walletRechargeAmounts = ref();
const coinsMoneyValue = ref({
  coins: 0,
  money: 0,
});
const editItem = ref();
const deleteItem = ref();

const form = ref({
  id: null,
  name: "",
  amount: "",
  coins: "",
  active: true,
});

const parseRechargeAmountsResponse = (data, withPromotions) => {
  if (Array.isArray(data)) {
    return withPromotions ? attachPromotionsToPacks(data, []) : data;
  }

  const packs =
    data?.recharge_amounts ??
    data?.data ??
    (data?.success === false ? [] : []);

  if (withPromotions && (data?.promotions != null || data?.recharge_amounts != null)) {
    return attachPromotionsToPacks(packs, data.promotions ?? []);
  }

  return Array.isArray(packs) ? packs : [];
};

const getWalletRechargeAmounts = async (withPromotions = true) => {
  const { data } = await api.get("wallet-recharge-amount", {
    params: withPromotions ? { with_promotions: 1 } : undefined,
  });
  walletRechargeAmounts.value = parseRechargeAmountsResponse(data, withPromotions);
};

const confirmDelete = async (cb = null) => {
  const fd = new FormData();
  fd.append("_method", "DELETE");
  await api.post(`wallet-recharge-amount/${deleteItem.value}`, fd);
  await getWalletRechargeAmounts();
  deleteItem.value = null;
  if (cb) {
    cb();
  }
};

const getCoinsMoneyValue = async () => {
  const { data } = await api.get("settings", {
    params: {
      key: "coins_money_value",
    },
  });
  const temp = String(data.value).split(":").concat();
  coinsMoneyValue.value.coins = temp[0];
  coinsMoneyValue.value.money = temp[1];
};

export default function useRechargeAmounts() {
  return {
    getCoinsMoneyValue,
    coinsMoneyValue,
    walletRechargeAmounts,
    getWalletRechargeAmounts,
    confirmDelete,
    editItem,
    deleteItem,
    form,
  };
};
