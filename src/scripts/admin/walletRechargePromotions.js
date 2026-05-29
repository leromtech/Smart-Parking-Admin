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

const roundMoney = (n) => Math.round(n * 100) / 100;

const timePart = (t) => {
  if (t == null || t === "") return null;
  const s = String(t);
  const segment = s.includes("T") ? s.split("T")[1] : s;
  const hhmmss = segment.slice(0, 8);
  return hhmmss.length === 5 ? `${hhmmss}:00` : hhmmss;
};

const isWithinDailyWindow = (promo, at = new Date()) => {
  if (!promo.daily_start_time || !promo.daily_end_time) return true;

  const current = at.toTimeString().slice(0, 8);
  const start = timePart(promo.daily_start_time);
  const end = timePart(promo.daily_end_time);
  if (!start || !end) return true;

  if (start <= end) {
    return current >= start && current <= end;
  }
  return current >= start || current <= end;
};

/** Static eligibility for admin display (no per-user limits). */
export const isPromotionEligibleForPack = (promo, pack, at = new Date()) => {
  if (!promo?.is_active) return false;

  if (
    promo.wallet_recharge_amount_id != null &&
    Number(promo.wallet_recharge_amount_id) !== Number(pack.id)
  ) {
    return false;
  }

  if (
    promo.min_recharge_amount != null &&
    Number(pack.amount) < Number(promo.min_recharge_amount)
  ) {
    return false;
  }

  if (promo.starts_at && at < new Date(promo.starts_at)) return false;
  if (promo.ends_at && at > new Date(promo.ends_at)) return false;

  if (!isWithinDailyWindow(promo, at)) return false;

  const uses = Number(promo.uses_count) || 0;
  if (promo.max_uses != null && uses >= Number(promo.max_uses)) return false;
  if (promo.first_n_users != null && uses >= Number(promo.first_n_users)) return false;

  return true;
};

const baseQuote = (pack) => {
  const amount = roundMoney(Number(pack.amount));
  const coins = Number(pack.coins) || 0;
  return {
    original_amount: amount,
    payable_amount: amount,
    base_coins: coins,
    bonus_coins: 0,
    total_coins: coins,
    promotion: null,
    savings: 0,
  };
};

const applyPromotion = (base, promotion) => {
  const quote = {
    ...base,
    promotion,
    promotion_id: promotion.id,
  };
  const value = Number(promotion.discount_value);

  switch (promotion.discount_type) {
    case "percent_off": {
      const discount = roundMoney(quote.original_amount * (value / 100));
      quote.payable_amount = Math.max(0, roundMoney(quote.original_amount - discount));
      break;
    }
    case "fixed_off":
      quote.payable_amount = Math.max(0, roundMoney(quote.original_amount - value));
      break;
    case "bonus_coins_percent":
      quote.bonus_coins = Math.floor(quote.base_coins * (value / 100));
      quote.total_coins = quote.base_coins + quote.bonus_coins;
      break;
    case "bonus_coins_fixed":
      quote.bonus_coins = Math.floor(value);
      quote.total_coins = quote.base_coins + quote.bonus_coins;
      break;
    default:
      break;
  }

  quote.savings = roundMoney(quote.original_amount - quote.payable_amount);
  return quote;
};

const isBetterQuote = (candidate, current) => {
  if (candidate.total_coins !== current.total_coins) {
    return candidate.total_coins > current.total_coins;
  }
  return candidate.payable_amount < current.payable_amount;
};

/** Merge API recharge_amounts + promotions onto each pack (matches backend quote logic). */
export const attachPromotionsToPacks = (packs, promotionList) => {
  const list = Array.isArray(promotionList) ? promotionList : [];
  const sorted = [...list].sort((a, b) => Number(b.priority) - Number(a.priority));

  return (Array.isArray(packs) ? packs : []).map((pack) => {
    const base = baseQuote(pack);
    let best = base;

    for (const promo of sorted) {
      if (!isPromotionEligibleForPack(promo, pack)) continue;
      const candidate = applyPromotion(base, promo);
      if (isBetterQuote(candidate, best)) {
        best = candidate;
      }
    }

    return {
      ...pack,
      applied_promotion: best.promotion,
      payable_amount: best.payable_amount,
      bonus_coins: best.bonus_coins,
      total_coins: best.total_coins,
      savings: best.savings,
    };
  });
};

/** Best / applied promotion on a recharge pack */
export const getAppliedPromotion = (pack) => {
  if (!pack) return null;
  return (
    pack.applied_promotion ??
    pack.appliedPromotion ??
    pack.promotion ??
    pack.best_promotion ??
    (Array.isArray(pack.promotions) ? pack.promotions[0] : null) ??
    null
  );
};

export const formatPromotionEffect = (promo) => {
  if (!promo) return null;
  const v = formatDiscountValue(promo);
  switch (promo.discount_type) {
    case "percent_off":
      return `${v} off payable`;
    case "fixed_off":
      return `${v} off payable`;
    case "bonus_coins_percent":
      return `${v} bonus coins`;
    case "bonus_coins_fixed":
      return `${v} bonus coins`;
    default:
      return v;
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
