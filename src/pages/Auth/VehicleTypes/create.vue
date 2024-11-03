<template>
    <div @click.stop>
        <p class="text-xl font-semibold">
            CREATE A VEHICLE TYPE
        </p>
        <form @submit.prevent="submit" class="flex flex-col">
            <div class="flex flex-row gap-4">
                <div class="w-full h-full">
                    <dInput label="TYPE NAME" v-model="form.name" />

                    <dInput label="SPACE OCCUPIED" v-model="form.space_occupied" />

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
import dInput from '../../../components/d-input.vue';
import api from '../../../boot/api';
const message = ref()

const emit = defineEmits(['created']);

const showSearchOpts = ref(false)

const search = ref('')
const users = ref([])

const form = ref({
    name: '',
    space_occupied: '',
})

const reset = () => {
    form.value.name = ''
    form.value.space_occupied = ''
}

watch(search, async (newVal) => {
    if (newVal != '') {
        await fetchUsers()
    } else {
        users.value = []
    }
})


const submit = async () => {
    try {
        const fd = new FormData()
        fd.append('name', form.value.name)
        fd.append('space_occupied', form.value.space_occupied)

        const { data } = await api.post('/vehicle-types', fd)
        reset()
        emit('created', data.message)
    } catch (error) {
        message.value = error.response.data.message
        reset()
    }
}

</script>