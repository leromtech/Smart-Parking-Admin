<template>
    <div @click.stop>
        <p class="text-xl font-semibold">
            {{ form.id ? 'EDIT ' : 'CREATE A ' }} VEHICLE
        </p>
        <form @submit.prevent="submit" class="grid grid-cols-2 gap-4">
            <div class="flex flex-row gap-4 w-[80%]">
                <div class="w-full h-full">
                    <div class="flex flex-col w-full gap-2 mt-8">
                        <label>Registration no</label>
                        <InputText v-model="form.registration_no" />
                    </div>

                    <div class="flex flex-col w-full gap-2 mt-8">
                        <label>Model</label>
                        <InputText v-model="form.model" />
                    </div>

                    <div class="flex flex-col w-full gap-2 mt-8">
                        <label for="type" class="font-semibold">TYPE</label>
                        <Select v-model="form.vehicle_type" :options="vehicleTypes" placeholder="Select a Vehicle Type"
                            optionLabel="name" optionValue="id" class="w-full md:w-56" />
                    </div>

                    <div class="relative flex flex-col w-full gap-2 mt-8">
                        <label for="owner" class="font-semibold">Owner</label>
                        <InputText class="w-full" v-model="form.displayName" disabled />
                    </div>

                    <div class="w-full flex items-center justify-center text-red-600 font-normal">
                        {{ message }}
                    </div>
                </div>
            </div>
            <div>
                <InputText class="w-full" v-model="search" placeholder="Search User..." />
                <DataTable :value="users" class="mt-6 overflow-y-scroll h-[400px]">
                    <template #header>
                        <span>Search for users</span>
                    </template>
                    <template #empty>
                        <span>No Users</span>
                    </template>
                    <Column header="Name" class="w-[200px]">
                        <template #body="slotProps">
                            <div class="flex flex-col">
                                <span>{{ slotProps.data.name }}</span>
                                <span>{{ slotProps.data.email }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="phone" header="Phone" class="w-[200px]"></Column>
                    <Column>
                        <template #body="slotProps">
                            <Button icon="pi pi-plus" outlined rounded
                                @click="() => { setVehicleOwner(slotProps.data.id) }"></Button>
                        </template>
                    </Column>
                </DataTable>
                <div class="flex flex-row items-center justify-end w-full mt-4">
                    <Button @click="submit">Submit</Button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '../../../boot/api';
import { InputText, Select, useToast } from 'primevue';
import useVehicles from '../../../scripts/admin/vehicles';

const { vehicleTypes, editItem } = useVehicles()
const toast = useToast()
const message = ref()

const props = defineProps(['vehicleTypes'])

const emit = defineEmits(['created']);

const showSearchOpts = ref(false)

const search = ref('')
const users = ref([])

const form = ref({
    id: '',
    registration_no: '',
    vehicle_type: '',
    user_id: '',
    displayName: '',
    model: ''
})

const reset = () => {
    form.value.registration_no = ''
    form.value.vehicle_type = ''
    form.value.user_id = ''
}

watch(search, async (newVal) => {
    if (newVal != '') {
        await fetchUsers()
    } else {
        users.value = []
    }
})

const fetchUsers = async () => {
    const { data } = await api('users', { params: { filters: { search: search.value } } })
    users.value = data.data
    if (users.value.length > 0) {
        showSearchOpts.value = true
    } else {
        showSearchOpts.value = false
    }
}

const submit = async () => {
    try {
        const fd = new FormData()
        fd.append('vehicle_type', form.value.vehicle_type)
        fd.append('registration_no', form.value.registration_no)
        fd.append('color', form.value.color)
        fd.append('user_id', form.value.user_id)
        fd.append('model', form.value.model)
        if (form.value.id) {
            fd.append('_method', 'PATCH')
        }
        const path = form.value.id ? `/vehicles/${form.value.id}` : '/vehicles'

        const { data } = await api.post(path, fd)

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Vehicle added successfully',
            life: 3000
        })
        reset()
        emit('created', data.message)
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add vehicle',
            life: 3000
        })
        message.value = error.response.data.message
        reset()
    }
}

const setVehicleOwner = (id) => {
    console.log(id)
    form.value.user_id = id
    const user = users.value.find((item) => item.id === id)
    form.value.displayName = `${user.name} - (${user.phone})`
}

onMounted(async () => {
    if (editItem.value) {
        form.value.id = editItem.value.id
        form.value.registration_no = editItem.value.registration_no
        form.value.vehicle_type = editItem.value.vehicle_type.id
        form.value.user_id = editItem.value.user_id
    }
    await fetchUsers()
})

</script>