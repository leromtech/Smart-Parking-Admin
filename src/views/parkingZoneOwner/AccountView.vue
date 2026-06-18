<template>
  <div class="card flex flex-row w-full gap-4">
    <Panel header="PAYOUT ACCOUNT DETAILS" class="w-full max-w-lg">
      <div v-if="loading" class="flex flex-col gap-4">
        <div class="skeleton h-10 w-full" v-for="i in 5" :key="i"></div>
      </div>
      <div v-else class="flex flex-col gap-5">
        <div class="flex flex-col gap-1.5">
          <label for="bank-acc" class="text-sm font-medium text-surface-700">Bank Account No.</label>
          <InputText id="bank-acc" v-model="form.upi_id" placeholder="Enter bank account number" :disabled="submitting" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="ifsc" class="text-sm font-medium text-surface-700">IFSC Code</label>
          <InputText id="ifsc" v-model="form.ifsc_code" placeholder="e.g. SBIN0001234" :disabled="submitting" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="holder" class="text-sm font-medium text-surface-700">Account Holder Name</label>
          <InputText id="holder" v-model="form.account_holder" placeholder="Enter account holder name" :disabled="submitting" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-sm font-medium text-surface-700">Email</label>
          <InputText id="email" v-model="form.email" placeholder="Enter email address" :disabled="submitting" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="phone" class="text-sm font-medium text-surface-700">Phone</label>
          <InputText id="phone" v-model="form.phone" placeholder="Enter phone number" :disabled="submitting" />
        </div>
        <Button @click="submit" :loading="submitting" :disabled="submitting" icon="pi pi-save" label="Save Changes" class="mt-2" />
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import useAuth from "../../scripts/auth";
import { InputText, useToast } from "primevue";
import api from "../../boot/api";

const toast = useToast();
const { user } = useAuth();

const loading = ref(true);
const submitting = ref(false);

const form = ref({
  upi_id: "",
  ifsc_code: "",
  account_holder: "",
  email: "",
  phone: "",
});

const submit = async () => {
  submitting.value = true;
  try {
    const fd = new FormData();
    fd.append("account_number", form.value.upi_id);
    fd.append("account_holder", form.value.account_holder);
    fd.append("email", form.value.email);
    fd.append("phone", form.value.phone);
    fd.append("ifsc_code", form.value.ifsc_code);
    const { data } = await api.post("onboarding/initiate", fd);
    toast.add({ severity: data.success ? "success" : "error", summary: data.success ? "Success" : "Error", detail: data.message, life: 3000 });
  } catch (err) {
    toast.add({ severity: "error", summary: "Error", detail: "Something went wrong. Please try again.", life: 3000 });
  } finally {
    submitting.value = false;
  }
};

const getAccount = async () => {
  loading.value = true;
  try {
    const { data } = await api.get("parking-zone/account", {
      params: {
        parking_zone_id: user.value.parking_zone_owned?.id,
      },
    });
    if (!data) {
      form.value.account_holder = user.value.name;
      form.value.email = user.value.email;
      form.value.phone = user.value.phone;
    } else {
      form.value.account_holder = data.account_name;
      form.value.ifsc_code = data.ifsc_code;
      form.value.email = data.email;
      form.value.phone = data.phone;
      form.value.upi_id = data.bank_account_no;
    }
  } catch (err) {
    toast.add({ severity: "error", summary: "Error", detail: "Failed to load account details", life: 3000 });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getAccount();
});
</script>
