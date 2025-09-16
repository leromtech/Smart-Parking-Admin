<template>
    <div class="card flex flex-row w-full gap-4">
        <Panel header="PAYOUT ACCOUNT DETAILS" class="w-[50%]">
            <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-2">
                    <label for="upi-id" v-tooltip="'eg. dinahnamte-1@okicici'">Bank Account No.</label>
                    <InputText id="upi-id" v-model="form.upi_id" aria-describedby="username-help" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="upi-id" v-tooltip="'eg. dinahnamte-1@okicici'">IFSC Code</label>
                    <InputText id="upi-id" v-model="form.ifsc_code" aria-describedby="username-help" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="username">Account holder name</label>
                    <InputText id="username" v-model="form.account_holder" aria-describedby="username-help" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="email">Email</label>
                    <InputText id="email" v-model="form.email" aria-describedby="username-help" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="phone">Phone</label>
                    <InputText id="phone" v-model="form.phone" aria-describedby="username-help" />
                </div>
                <Button @click="submit">Save</Button>
            </div>
        </Panel>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import useAuth from '../../scripts/auth';
import { InputText, useToast } from 'primevue';
import api from '../../boot/api';

const toast = useToast()
const { user } = useAuth()

const form = ref({
    upi_id: '',
    ifsc_code: '',
    account_holder: '',
    email: '',
    phone: ''
})

const submit = async () => {
    const fd = new FormData()
    fd.append('account_number', form.value.upi_id)
    fd.append('account_holder', form.value.account_holder)
    fd.append('email', form.value.email)
    fd.append('phone', form.value.phone)
    fd.append('ifsc_code', form.value.ifsc_code)
    const { data } = await api.post('onboarding/initiate', fd)
    toast.add({ severity: data.success ? 'success' : 'error', summary: data.success ? 'Success' : 'Error', detail: data.message, life: 2000 })
}

const getAccount = async () => {
    const { data } = await api.get('parking-zone/account', {
        params: {
            parking_zone_id: user.value.parking_zone_owned?.id
        }
    })
    if (!data) {
        toast.add({ severity: 'warn', summary: 'Warning!', detail: "Please update your account", life: 2000 })
        form.value.account_holder = user.value.name
        form.value.email = user.value.email
        form.value.phone = user.value.phone
    } else {
        toast.add({ severity: 'info', summary: 'Info', detail: "You can update your account anytime", life: 2000 })
        form.value.account_holder = data.account_name
        form.value.email = data.email
        form.value.phone = data.phone
        form.value.upi_id = data.bank_account_no
    }
}

onMounted(async () => {
    await getAccount()
})

</script>