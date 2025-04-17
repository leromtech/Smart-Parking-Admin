<template>
    <div>
        <form class="w-full h-full" @click.stop @submit.prevent="submit">
            <div class="flex flex-col w-full gap-2 mt-8">
                <label for="name" class="font-semibold">NAME</label>
                <InputText type="text" name="name" required class="p-3 border-2 w-[400px] rounded-md bg-neutral-100"
                    v-model="form.name" />
            </div>
            <div class="flex flex-col w-full gap-2 mt-8">
                <label for="email" class="font-semibold">EMAIL</label>
                <InputText type="email" name="email" required class="p-3 border-2 w-[400px] rounded-md bg-neutral-100"
                    v-model="form.email" />
            </div>
            <div class="flex flex-col w-full gap-2 mt-8">
                <label for="phone" class="font-semibold">PHONE</label>
                <InputText type="tel" name="phone" maxlength="10" required
                    class="p-3 border-2 w-[400px] rounded-md bg-neutral-100" v-model="form.phone" />
            </div>
            <div class="flex flex-col w-full gap-2 mt-8">
                <label for="role" class="font-semibold">ROLE</label>
                <Select v-model="form.role" placeholder="Select a role" :options="roleOptions" optionValue="value"
                    optionLabel="label"></Select>
            </div>

            <div v-if="form.role === 'owner' || form.role === 'manager'" class="
                flex flex-col w-full gap-2 mt-8">
                <label for="role-managed">Pakring Zone<span class="text-red-500">*</span></label>
                <Select :options="parkingZones" optionValue="value" optionLabel="label"></Select>
            </div>

            <div class="w-full flex items-center justify-center text-red-600 font-normal">
                {{ message }}
            </div>
            <div class="flex flex-row items-center justify-end w-full mt-4">
                <Button class="p-3 bg-blue-500 text-white rounded-sm hover:bg-blue-600" @click="submit">Submit</Button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../../../boot/api';
import useUsers from '../../../scripts/admin/users';
import { Select, useToast } from 'primevue';
const message = ref()
const { getUsers, editItem } = useUsers()

const emit = defineEmits('created');
const toast = useToast()

const form = ref({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    parkingZone: ''
})


const parkingZones = ref([])

const roleOptions = [
    { label: 'Customer', value: 'customer' },
    { label: 'Super Admin', value: 'superadmin' },
    { label: 'Manager', value: 'manager' },
    { label: 'Owner', value: 'owner' }
]

const reset = () => {
    form.value.name = ''
    form.value.email = ''
    form.value.phone = ''
    form.value.password = ''
    form.value.role = ''
}

const submit = async () => {
    try {
        const fd = new FormData()
        if (form.value.id !== null || form.value.id !== undefined) {
            fd.append('_method', 'PATCH')
        }
        fd.append('name', form.value.name)
        fd.append('email', form.value.email)
        fd.append('phone', form.value.phone)
        if (form.value.id == null || form.value.id == undefined) {
            fd.append('password', form.value.password)
        }
        fd.append('role', form.value.role)
        await api.post(`/users/${form.value.id ?? ''}`, fd)
        reset()
        await getUsers()
    } catch (error) {
        message.value = error.response.data.message
    }
}

const getParkingZone = async () => {
    try {
        const { data } = await api.get('parking-zones', { params: { 'filters': { 'all': 1 } } })
        parkingZones.value = data.parking_zones.map((item) => {
            return { label: item.name, value: item.id }
        })
        console.log(parkingZones.value)
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load parking zones' + error,
            life: 3000
        })
    }
}

onMounted(async () => {
    if (editItem.value) {
        form.value.id = editItem.value.id
        form.value.name = editItem.value.name || ''
        form.value.email = editItem.value.email || ''
        form.value.phone = editItem.value.phone || ''
        form.value.password = editItem.value.password || ''
        form.value.role = editItem.value.role || ''
    }
    await getParkingZone()
})

</script>