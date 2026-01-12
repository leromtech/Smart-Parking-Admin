import { ref } from "vue";
import { useParkingZone } from "../parkingZone";
import api from "../../boot/api";

const policyIntervals = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const currentlyEditing = ref(null);

const parking_zone_id = ref(null);

const this_refresh = ref(function () {});

const selectedPolicyInterval = ref("hourly");
const timingToggle = ref(false);

const schemeTypeOptions = [
  { label: "Hourly", value: "hourly" },
  { label: "Subscription", value: "subscription" },
];

const ratePolicyForm = ref({
  rate_id: null,
  vehicle_type: null,
  parking_zone_id: null,
  name: "",
  from: null,
  to: null,
});

const intervalForm = ref({
  interval: "",
  rate_amount: 0,
  duration: 0,
  is_additive: false,
  rate_id: null,
});

const reset = () => {
  ratePolicyForm.value = {
    rate_id: null,
    vehicle_type: null,
    parking_zone_id: null,
    fixedRate: false,
    name: "",
    from: null,
    to: null,
  };
};

const fixedRateToggle = ref(false);

const this_toast = ref(null);

const editRatePolicy = (rate) => {
  console.log(rate);
  reset();
  currentlyEditing.value = rate;
  ratePolicyForm.value.name = rate.name;
  ratePolicyForm.value.rate_id = rate.id;
  ratePolicyForm.value.vehicle_type = rate.vehicle_type.id;
  ratePolicyForm.value.from = parseTimeToDate(rate.from) ?? null;
  ratePolicyForm.value.to = parseTimeToDate(rate.to) ?? null;
  timingToggle.value = rate.from === "" && rate.to === "";
};

const addInterval = (rate_id, parking_zone_id) => {
  intervalForm.value.rate_id = rate_id;
  intervalForm.value.parking_zone_id = parking_zone_id;
};

const saveInterval = async () => {
  try {
    const fd = new FormData();
    fd.append("rate_id", intervalForm.value.rate_id);
    fd.append("interval", intervalForm.value.interval);
    fd.append("rate_amount", intervalForm.value.rate_amount);
    fd.append("duration", intervalForm.value.duration);
    fd.append("is_additive", false);
    fd.append("parking_zone_id", intervalForm.value.parking_zone_id);

    const { data } = await api.post("rate-intervals", fd);
    this_toast.value.add({
      severity: data.success ? "success" : "error",
      summary: data.success ? "Success" : "Error",
      detail: data.message,
      life: 3000,
    });
    await this_refresh.value();
  } catch (error) {
    this_toast.value.add({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
    });
  }
};

const deleteInterval = async (rate) => {
  try {
    const fd = new FormData();
    fd.append("_method", "DELETE");
    const { data } = await api.post(`rate-intervals/${rate}`, fd);
    this_toast.value.add({
      severity: data.success ? "success" : "error",
      summary: data.success ? "Success" : "Error",
      detail: data.message,
      life: 3000,
    });
  } catch (error) {
    this_toast.value.add({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
    });
  }
  await this_refresh.value();
};

const submitRatePolicy = async () => {
  try {
    const fd = new FormData();
    fd.append("vehicle_type", ratePolicyForm.value.vehicle_type);
    fd.append("interval", selectedPolicyInterval.value);
    if (timingToggle.value) {
      fd.append("from", ratePolicyForm.value.from.toTimeString().split(" ")[0]);
      fd.append("to", ratePolicyForm.value.to.toTimeString().split(" ")[0]);
    } else {
      fd.append("from", "");
      fd.append("to", "");
    }
    fd.append("name", ratePolicyForm.value.name);
    fd.append("days", ratePolicyForm.value.days);
    if (fixedRateToggle.value && ratePolicyForm.value.fixedRate !== null) {
      fd.append("fixed_rate", ratePolicyForm.value.fixedRate);
    } else {
      fd.append("fixed_rate", "0"); // Default value
    }

    if (currentlyEditing.value) {
      fd.append("_method", "PUT");
    }

    fd.append("parking_zone_id", useParkingZone().parking_zone.value.id);
    const { data } = await api.post("rates", fd);
    reset();
    this_toast.value.add({
      severity: data.success ? "success" : "error",
      summary: data.success ? "Success" : "Error",
      detail: data.message,
      life: 3000,
    });
    return true;
  } catch (error) {
    reset();
    this_toast.value.add({
      severity: "error",
      summary: "Error",
      detail: error.response.data.message,
      life: 3000,
    });
    return false;
  }
};

const updateInterval = async (interval) => {
  await api.put(`/rate-intervals/${interval.id}`, {
    rate_id: interval.rate_id,
    duration: interval.duration,
    interval: interval.interval,
    rate_amount: interval.rate_amount,
    _method: "PATCH",
  });
  await this_refresh.value();
};

const parseTimeToDate = (timeString) => {
  if (!timeString) return null;

  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds, 0); // Set hours, minutes, and seconds
  return date;
};

export default function useCreateRate(
  this_parking_zone_id,
  toast,
  refreshCb = () => {
    return;
  }
) {
  parking_zone_id.value = this_parking_zone_id;
  this_toast.value = toast;
  this_refresh.value = refreshCb;

  return {
    schemeTypeOptions,
    selectedPolicyInterval,
    policyIntervals,
    ratePolicyForm,
    fixedRateToggle,
    timingToggle,
    intervalForm,
    updateInterval,
    saveInterval,
    parseTimeToDate,
    addInterval,
    submitRatePolicy,
    editRatePolicy,
    deleteInterval,
  };
}
