<template>
  <div class="card flex flex-row w-full gap-4">
    <Panel header="PAYOUT ACCOUNT DETAILS" class="w-full max-w-lg">
      <div v-if="loading" class="flex flex-col gap-4">
        <div class="skeleton h-10 w-full" v-for="i in 5" :key="i"></div>
      </div>
      <div v-else-if="isOnboarded" class="flex flex-col gap-4">
        <Message severity="success" :closable="false">Your payout account is active.</Message>
        <dl class="flex flex-col gap-3">
          <div class="flex flex-col gap-0.5">
            <dt class="text-sm font-medium text-surface-700">Bank Account No.</dt>
            <dd>{{ account.account_number ?? '—' }}</dd>
          </div>
          <div class="flex flex-col gap-0.5">
            <dt class="text-sm font-medium text-surface-700">IFSC Code</dt>
            <dd>{{ account.ifsc_code ?? '—' }}</dd>
          </div>
          <div class="flex flex-col gap-0.5">
            <dt class="text-sm font-medium text-surface-700">Account Holder Name</dt>
            <dd>{{ account.account_holder ?? '—' }}</dd>
          </div>
          <div class="flex flex-col gap-0.5">
            <dt class="text-sm font-medium text-surface-700">Email</dt>
            <dd>{{ account.email ?? '—' }}</dd>
          </div>
          <div class="flex flex-col gap-0.5">
            <dt class="text-sm font-medium text-surface-700">Phone</dt>
            <dd>{{ account.phone ?? '—' }}</dd>
          </div>
        </dl>
        <small class="text-surface-500">To change this account, contact the platform administrator.</small>
      </div>
      <div v-else class="flex flex-col gap-5">
        <div class="flex flex-col gap-1.5">
          <label for="bank-acc" class="text-sm font-medium text-surface-700">Bank Account No.</label>
          <InputText id="bank-acc" v-model="form.account_number" placeholder="Enter bank account number" :disabled="submitting" />
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
        <Button @click="submit" :loading="submitting" :disabled="submitting" icon="pi pi-save" label="Save Account" class="mt-2" />
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import useAuth from "../../scripts/auth";
import { InputText, Message, useToast } from "primevue";
import api from "../../boot/api";

const toast = useToast();
const { user } = useAuth();

const loading = ref(true);
const submitting = ref(false);
const account = ref(null);

const isOnboarded = computed(() => Boolean(account.value?.active));

const form = ref({
  account_number: "",
  ifsc_code: "",
  account_holder: "",
  email: "",
  phone: "",
});

const prefillFromUser = () => {
  form.value.account_holder = user.value?.name ?? "";
  form.value.email = user.value?.email ?? "";
  form.value.phone = user.value?.phone ?? "";
};

// The API masks the stored account number, so it is never copied back into
// the form; resubmitting "XXXX1234" would onboard the wrong account.
const prefillFromAccount = (details) => {
  form.value.account_holder = details.account_holder ?? "";
  form.value.ifsc_code = details.ifsc_code ?? "";
  form.value.email = details.email ?? "";
  form.value.phone = details.phone ?? "";
  form.value.account_number = "";
};

const submit = async () => {
  submitting.value = true;
  try {
    const { data } = await api.post("onboarding/initiate", { ...form.value });
    toast.add({ severity: data.success ? "success" : "error", summary: data.success ? "Success" : "Error", detail: data.message, life: 3000 });
    if (data.success) {
      await getAccount();
    }
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: err.response?.data?.message ?? "Something went wrong. Please try again.",
      life: 4000,
    });
  } finally {
    submitting.value = false;
  }
};

const getAccount = async () => {
  loading.value = true;
  try {
    const { data } = await api.get("parking-zone/account", {
      params: {
        parking_zone_id: user.value?.parking_zone_owned?.id,
      },
    });
    account.value = data.account ?? null;
    if (account.value) {
      prefillFromAccount(account.value);
    } else {
      prefillFromUser();
    }
  } catch (err) {
    account.value = null;
    prefillFromUser();
    if (err.response?.status !== 404) {
      toast.add({ severity: "error", summary: "Error", detail: "Failed to load account details", life: 3000 });
    }
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getAccount();
});
</script>
