<template>
    <div :class="['bg-white p-8 text-black']" @click.stop>
        <p class="text-[24px] font-semibold">
            Register
        </p>
        <form class="w-full h-full flex flex-col items-center" @submit.prevent="submit">
            <div class="flex flex-col w-full gap-2 md:mt-8 mt-2">
                <label for="name" class="font-semibold">NAME</label>
                <input type="text" name="name" class="p-3 border-2 w-full rounded-md bg-neutral-100"
                    v-model="form.name">
            </div>
            <div class="flex flex-col w-full gap-2 md:mt-8 mt-2">
                <label for="email" class="font-semibold">EMAIL ADDRESS</label>
                <input type="email" name="email" class="p-3 border-2 w-full rounded-md bg-neutral-100"
                    v-model="form.email">
            </div>
            <div class="flex flex-col w-full gap-2 md:mt-8 mt-2">
                <label for="phone" class="font-semibold">PHONE NO.</label>
                <input type="tel" name="phone" maxlength="10" class="p-3 border-2 w-full rounded-md bg-neutral-100"
                    v-model="form.phone">
            </div>
            <div class="flex flex-col w-full gap-2 md:mt-8 mt-2">
                <label for="password" class="font-semibold">PASSWORD</label>
                <input type="password" name="password" class="p-3 border-2 w-full rounded-md bg-neutral-100"
                    v-model="form.password">
            </div>
            <div class="flex flex-col w-full gap-2 md:mt-8 mt-2">
                <label for="password_confirmation" class="font-semibold">CONFIRM PASSWORD</label>
                <input type="password" name="password_confirmation"
                    class="p-3 border-2 w-full rounded-md bg-neutral-100" v-model="form.password_confirmation">
            </div>
            <p class="my-2 text-red-600 font-normal" v-for="error in errors" :key="error">
                {{ error }}
            </p>
            <div class="w-full flex mt-12 justify-center">
                <button type="submit"
                    class="w-[50%] bg-blue-500 hover:bg-blue-600 p-4 text-white font-semibold rounded-md">REGISTER</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../boot/api';
import router from '../routes/router';


const form = ref({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: ''
})

const errors = ref('')

defineEmits(['close'])

const submit = async () => {

    errors.value = []

    for (const [key, value] of Object.entries(form.value)) {
        if (value === '') {
            errors.value.push(`Please Enter ${key}`);
            return;
        }
    }

    if (form.value.phone.length < 10) {
        errors.value.push('Please enter 10 digit phone number')
    }

    if (form.value.password !== form.value.password_confirmation) {
        errors.value.push('Passwords do not match!')
        return
    }

    const fd = new FormData()
    fd.append('name', form.value.name)
    fd.append('email', form.value.email)
    fd.append('phone', form.value.phone)
    fd.append('password', form.value.password)

    const { data } = await api.post('/register', fd)
    if (data.success) {
        localStorage.setItem('auth_token', data.token)
        router.push('/auth')
    } else {
        errors.value.push(data.message)
    }
}
</script>