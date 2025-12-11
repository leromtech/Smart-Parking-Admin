<template>
    <div @click.stop class="bg-white p-8 rounded-md">
        <p class="text-xl font-semibold">
            ADD MANAGER
        </p>
        <form @submit.prevent="submit" class="flex flex-col">
            <div class="flex flex-row gap-4">
                <div class="w-full h-full">
                    <div class="relative flex flex-col w-full gap-2 mt-8">
                        <label for="owner" class="font-semibold">SEARCH USER</label>
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
import dSelect from '../../../components/common/d-select.vue';
import { onMounted, ref, watch } from 'vue';
import api from '../../../boot/api';
import useNotification from '../../../scripts/notification';

const { notify } = useNotification()
const users = ref([])

const search = ref('')
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

const props = defineProps(['parkingZoneId'])
const message = ref('')
const form = ref({
    user_id: ''
})

const emits = defineEmits(['close'])

const submit = async () => {
    const fd = new FormData()
    fd.append('user_id', form.value.user_id)
    fd.append('parking_zone_id', props.parkingZoneId)
    const { data } = await api.post('managers', fd)
    if (data.success) {
        emits('close')
        notify({ type: 'success', message: 'Manager added successfully' })
    } else {
        message.value = data.message
    }
}

onMounted(async () => {
    form.value.parking_zone_id = props.parkingZoneId
    await getVehicleTypes()
})

</script>