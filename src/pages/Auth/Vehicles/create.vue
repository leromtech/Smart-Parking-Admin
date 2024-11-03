<template>
    <div @click.stop>
        <p class="text-xl font-semibold">
            CREATE A VEHICLE
        </p>
        <form @submit.prevent="submit" class="flex flex-col">
            <div class="flex flex-row gap-4">
                <div class="w-full h-full">
                    <dInput label="REGISTRATION No." v-model="form.registration_no" />

                    <div class="flex flex-col w-full gap-2 mt-8">
                        <label for="type" class="font-semibold">TYPE</label>
                        <select class="p-2 py-4" v-model="form.vehicle_type">
                            <option v-for="vehicle_type in vehicleTypes" :key="vehicle_type.id"
                                :value="vehicle_type.value">{{ vehicle_type.label }}</option>
                        </select>
                    </div>

                    <div class="relative flex flex-col w-full gap-2 mt-8">
                        <label for="owner" class="font-semibold">Owner</label>
                        <dSelect :options="users" class="w-full" v-model:search="search" options-label="name"
                            options-value="id" v-model="form.user_id" />
                    </div>

                    <div class="w-full flex items-center justify-center text-red-600 font-normal">
                        {{ message }}
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center justify-end w-full mt-4">
                <button class="p-3 bg-blue-500 text-white rounded-sm hover:bg-blue-600">SUBMIT</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { ColorPicker } from 'vue3-colorpicker';
import dSelect from '../../../components/d-select.vue';
import dInput from '../../../components/d-input.vue';
import api from '../../../boot/api';
const message = ref()

const props = defineProps(['vehicleTypes'])

const emit = defineEmits(['created']);

const showSearchOpts = ref(false)

onMounted(() => {
    console.log(props)
})

const search = ref('')
const users = ref([])

const form = ref({
    registration_no: '',
    vehicle_type: '',
    user_id: '',
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

        const { data } = await api.post('/vehicles', fd)
        reset()
        emit('created', data.message)
    } catch (error) {
        message.value = error.response.data.message
        reset()
    }
}

</script>