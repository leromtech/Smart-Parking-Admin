<template>
  <div>
    <form class="w-full h-full" @click.stop @submit.prevent="submit">
      <div class="flex flex-col w-full gap-2 mt-8">
        <label for="name" class="font-semibold">NAME</label>
        <InputText
          type="text"
          name="name"
          required
          class="p-3 border-2 w-[400px] rounded-md bg-neutral-100"
          v-model="form.name" />
      </div>
      <div class="flex flex-col w-full gap-2 mt-8">
        <label for="email" class="font-semibold">EMAIL</label>
        <InputText
          type="email"
          name="email"
          required
          class="p-3 border-2 w-[400px] rounded-md bg-neutral-100"
          v-model="form.email" />
      </div>
      <div class="flex flex-col w-full gap-2 mt-8">
        <label for="phone" class="font-semibold">PHONE</label>
        <InputText
          type="tel"
          name="phone"
          maxlength="10"
          required
          class="p-3 border-2 w-[400px] rounded-md bg-neutral-100"
          v-model="form.phone" />
      </div>
      <div class="flex flex-col w-full gap-2 mt-8">
        <label for="role" class="font-semibold">ROLE</label>
        <Select
          v-model="form.role"
          placeholder="Select a role"
          :options="roleOptions"
          optionValue="value"
          optionLabel="label"></Select>
      </div>

      <div
        v-if="form.role === 'owner' || form.role === 'manager'"
        class="flex flex-col w-full gap-2 mt-8">
        <label for="role-managed"
          >Pakring Zone<span class="text-red-500">*</span></label
        >
        <Select
          :options="parkingZones"
          optionValue="value"
          optionLabel="label"
          v-model="form.parkingZone"></Select>
      </div>

      <div class="flex flex-col w-full gap-2 mt-8">
        <label for="subscription_limit" class="font-semibold">SUBSCRIPTION LIMIT</label>
        <InputText
          type="number"
          name="subscription_limit"
          min="0"
          class="p-3 border-2 w-[400px] rounded-md bg-neutral-100"
          v-model="form.subscriptionLimit" />
      </div>
      <div class="flex flex-col w-full gap-2 mt-8">
        <label for="contract_start_date" class="font-semibold">CONTRACT START DATE</label>
        <DatePicker
          inputId="contract_start_date"
          v-model="form.contractStartDate"
          dateFormat="dd/mm/yy"
          showIcon
          placeholder="Select contract start date"
          class="w-[400px]" />
      </div>
      <div class="flex flex-col w-full gap-2 mt-8">
        <label for="contract_end_date" class="font-semibold">CONTRACT END DATE</label>
        <DatePicker
          inputId="contract_end_date"
          v-model="form.contractEndDate"
          dateFormat="dd/mm/yy"
          showIcon
          placeholder="Select contract end date"
          class="w-[400px]" />
      </div>

      <div
        class="w-full flex items-center justify-center text-red-600 font-normal">
        {{ message }}
      </div>
      <div class="flex flex-row items-center justify-end w-full mt-4">
        <Button
          class="p-3 bg-blue-500 text-white rounded-sm hover:bg-blue-600"
          @click="submit"
          >Submit</Button
        >
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "../../../boot/api";
import useUsers from "../../../scripts/admin/users";
import { Select, useToast } from "primevue";
const message = ref();
const { getUsers, editItem } = useUsers();

const emit = defineEmits(["submit"]);
const toast = useToast();

const form = ref({
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "",
  parkingZone: "",
  subscriptionLimit: null,
  contractStartDate: null,
  contractEndDate: null,
});

const parkingZones = ref([]);

const roleOptions = [
  { label: "Customer", value: "customer" },
  { label: "Super Admin", value: "superadmin" },
  { label: "Manager", value: "manager" },
  { label: "Owner", value: "owner" },
];

const reset = () => {
  form.value.name = "";
  form.value.email = "";
  form.value.phone = "";
  form.value.password = "";
  form.value.role = "";
  form.value.parkingZone = "";
  form.value.subscriptionLimit = null;
  form.value.contractStartDate = null;
  form.value.contractEndDate = null;
};

const toDateInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDate = (value) => {
  if (!value) return null;
  const [year, month, day] = String(value).split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day);
};

const submit = async () => {
  let create = true;
  try {
    const fd = new FormData();
    if (form.value.id !== null && form.value.id !== undefined) {
      fd.append("_method", "PATCH");
      create = false;
    }

    fd.append("name", form.value.name);
    fd.append("email", form.value.email);
    fd.append("phone", form.value.phone);
    fd.append("subscription_limit", form.value.subscriptionLimit ?? "");
    fd.append("contract_start_date", toDateInput(form.value.contractStartDate));
    fd.append("contract_end_date", toDateInput(form.value.contractEndDate));

    if (form.value.id == null && form.value.id == undefined) {
      fd.append("password", "password");
    }
    fd.append("role", form.value.role);
    if (form.value.role) {
      fd.append("parking_zone_id", form.value.parkingZone);
    }
    await api.post(`/users/${form.value.id ?? ""}`, fd);
    reset();
    await getUsers();
    toast.add({
      severity: "success",
      closable: true,
      summary: "Success",
      detail: `User ${create ? "added" : "updated"} successfully`,
      life: 3000,
    });
    emit("success");
  } catch (error) {
    message.value = error.response.data.message;
    toast.add({
      severity: "error",
      closable: true,
      summary: "Success",
      detail: `Failed to ${create ? "add" : "update"} user`,
      life: 3000,
    });
    emit("error");
  }
};

const getParkingZone = async () => {
  try {
    const { data } = await api.get("parking-zones", {
      params: { filters: { all: 1 } },
    });

    console.log(data.parking_zones);

    parkingZones.value = data.parking_zones.data.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load parking zones" + error,
      life: 3000,
    });
  }
};

onMounted(async () => {
  // Load parking zones first
  await getParkingZone();

  if (editItem.value) {
    // Safely get parking zone with null checks
    const parkingZoneOwned = editItem.value.parking_zone_owned;
    const parkingZoneManaged = editItem.value.parking_zone_managed;

    let selectedParkingZoneId = null;

    // Check if user owns a parking zone
    if (parkingZoneOwned) {
      selectedParkingZoneId = parkingZoneOwned.id;
    }
    // If not owner, check if user manages a parking zone
    else if (
      parkingZoneManaged &&
      Array.isArray(parkingZoneManaged) &&
      parkingZoneManaged.length > 0
    ) {
      selectedParkingZoneId = parkingZoneManaged[0].id;
    }

    form.value.id = editItem.value.id || null;
    form.value.name = editItem.value.name || "";
    form.value.email = editItem.value.email || "";
    form.value.phone = editItem.value.phone || "";
    form.value.password = editItem.value.password || "";
    form.value.role = editItem.value.roles?.[0]?.name || "";
    form.value.parkingZone = selectedParkingZoneId || "";
    form.value.subscriptionLimit = editItem.value.subscription_limit ?? null;
    form.value.contractStartDate = parseDate(editItem.value.contract_start_date);
    form.value.contractEndDate = parseDate(editItem.value.contract_end_date);
  }
});
</script>
