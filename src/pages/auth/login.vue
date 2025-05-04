<template>
    <div class="flex flex-col items-center justify-center w-dvh h-dvh">
        <h1 class="font-semiblod text-2xl mb-12">SMART PARKING (DAWKEK) ADMIN</h1>
        <Panel header="Login">
            <form @submit.prevent="() => login(form, cb)" class="w-full h-full">
                <div class="flex flex-col gap-2 mt-4">
                    <label for="phone">Phone</label>
                    <InputMask id="phone" v-model="form.phone" class="" mask="9999999999" />
                </div>
                <div class="flex flex-col gap-2 mt-6">
                    <label for="phone">Password</label>
                    <Password id="phone" class="p-2" :feedback="false" toggle-mask="true" v-model="form.password" />
                </div>
                <p class="text-red-500">{{ message }}</p>
                <Button type="submit" label="Login" class="w-full mt-6"></Button>
            </form>
        </Panel>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import useAuth from '../../scripts/auth';
const { login } = useAuth();

const message = ref('')

const form = ref({
    phone: '',
    password: ''
})

const cb = (data) => {
    console.log(data)
    message.value = data.message
}
</script>
