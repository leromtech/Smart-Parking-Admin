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
            <div class="flex flex-col w-[400px] gap-2 mt-8">
                <label for="password" class="font-semibold">PASSWORD</label>
                <div class="relative">
                    <InputText :type="showPassword ? 'text' : 'password'" name="password" required
                        class="p-3 border-2 w-[400px] rounded-md bg-neutral-100" v-model="form.password" />
                    <font-awesome-icon :icon="[showPassword ? 'fas' : 'far', 'eye']"
                        class="absolute right-0 top-[35%] mr-2" @click="showPassword = !showPassword" />
                </div>
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
const showPassword = ref(false)
const message = ref()


const { getUsers, editItem } = useUsers()

const emit = defineEmits('created');

const form = ref({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
})

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
        if (form.value.id !== null) {
            fd.append('id', form.value.id)
            fd.append('_method', 'PATCH')
        }
        fd.append('name', form.value.name)
        fd.append('email', form.value.email)
        fd.append('phone', form.value.phone)
        fd.append('password', form.value.password)
        fd.append('role', form.value.role)

        await api.post('/users', fd)
        reset()
        await getUsers()
    } catch (error) {
        message.value = error.response.data.message
    }
}

onMounted(() => {
    if (editItem.value) {
        form.value.name = editItem.value.name || ''
        form.value.email = editItem.value.email || ''
        form.value.phone = editItem.value.phone || ''
        form.value.password = editItem.value.password || ''
        form.value.role = editItem.value.role || ''
    }
})

</script>