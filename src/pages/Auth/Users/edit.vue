<template>
    <div>
        <p class="text-xl font-semibold">
            EDIT USER
        </p>
        <form class="w-full h-full" @click.stop @submit.prevent="submit">
            <div class="flex flex-col w-full gap-2 mt-8">
                <label for="name" class="font-semibold">NAME</label>
                <input type="text" name="name" required class="p-3 border-2 w-[400px] rounded-md bg-neutral-100"
                    v-model="form.name">
            </div>
            <div class="flex flex-col w-full gap-2 mt-8">
                <label for="email" class="font-semibold">EMAIL</label>
                <input type="email" name="email" required class="p-3 border-2 w-[400px] rounded-md bg-neutral-100"
                    v-model="form.email">
            </div>
            <div class="flex flex-col w-full gap-2 mt-8">
                <label for="phone" class="font-semibold">PHONE</label>
                <input type="tel" name="phone" maxlength="10" required
                    class="p-3 border-2 w-[400px] rounded-md bg-neutral-100" v-model="form.phone">
            </div>
            <div class="w-full flex items-center justify-center text-red-600 font-normal">
                {{ message }}
            </div>
            <div class="flex flex-row items-center justify-end w-full mt-4">
                <button class="p-3 bg-blue-500 text-white rounded-sm hover:bg-blue-600">SUBMIT</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../../../boot/api';
const showPassword = ref(false)
const message = ref()

const props = defineProps(['item'])

onMounted(() => {
    form.value.name = props.item.name
    form.value.email = props.item.email
    form.value.phone = props.item.phone
    form.value.role = props.item.roles[0].id
})


const emit = defineEmits(['updated']);

const form = ref({
    name: '',
    email: '',
    phone: '',
    role: ''
})

const reset = () => {
    form.value.name = ''
    form.value.email = ''
    form.value.phone = ''
    form.value.role = ''
}

const submit = async () => {
    try {
        const fd = new FormData()
        fd.append('name', form.value.name)
        fd.append('email', form.value.email)
        fd.append('phone', form.value.phone)
        fd.append('role', form.value.role)
        fd.append('_method', 'PATCH')

        await api.post(`/users/${props.item.id}`, fd)
        reset()
        emit('updated')
    } catch (error) {
        message.value = error.response.data.message
    }
}

</script>