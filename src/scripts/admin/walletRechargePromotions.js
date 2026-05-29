import { ref } from "vue";
import api from "../../boot/api";

const promotions = ref([]);
const rechargePacks = ref([]);
const editItem = ref(null);
const deleteItem = ref(null);
const loading = ref(false);

const defaultForm = () => ({
  id: null,
  name: "",
  discount_type: "percent_off",
  discount_value: null,
  is_active: true,
  priority: 0,
  first_n_users: null,
  max_uses: null,
  max_uses_per_user: null,
  starts_at: null,
  ends_at: null,
  daily_start_time: null,
  daily_end_time: null,
  wallet_recharge_amount_id: null,
  min_recharge_amount: null,
});

const form = ref(defaultForm());

export const DISCOUNT_TYPE_OPTIONS = [
  { label: "Percent off (pay less)", value: "percent_off" },
  { label: "Fixed off (₹ less)", value: "fixed_off" },
  { label: "Bonus coins % (pay full, extra coins)", value: "bonus_coins_percent" },
  { label: "Bonus coins fixed (pay full, extra coins)", value: "bonus_coins_fixed" },
];

export const discountTypeLabel = (type) =>
  DISCOUNT_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;

export const formatDiscountValue = (promo) => {
  const v = promo.discount_value;
  if (v == null) return "—";
  switch (promo.discount_type) {
    case "percent_off":
    case "bonus_coins_percent":
      return `${v}%`;
    case "fixed_off":
      return `₹${v}`;
    case "bonus_coins_fixed":
      return `+${v} coins`;
    default:
      return String(v);
  }
};

const getPromotions = async () => {
  loading.value = true;
  try {
    const { data } = await api.get("wallet-recharge-promotions");
    promotions.value = Array.isArray(data) ? data : data?.data ?? [];
  } finally {
    loading.value = false;
  }
};

const getRechargePacks = async () => {
  const { data } = await api.get("wallet-recharge-amount");
  rechargePacks.value = Array.isArray(data) ? data : data?.data ?? [];
};

const confirmDelete = async (cb = null) => {
  const fd = new FormData();
  fd.append("_method", "DELETE");
  await api.post(`wallet-recharge-promotions/${deleteItem.value}`, fd);
  deleteItem.value = null;
  await getPromotions();
  if (cb) cb();
};

const resetForm = () => {
  form.value = defaultForm();
};

export default function useWalletRechargePromotions() {
  return {
    promotions,
    rechargePacks,
    editItem,
    deleteItem,
    loading,
    form,
    getPromotions,
    getRechargePacks,
    confirmDelete,
    resetForm,
    defaultForm,
  };
}
