<template>
    <div class="flex flex-col w-dvh h-dvh bg-neutral-100">
        <div class="flex items-center justify-center bg-sky-800 h-[10%] text-white">
            <h1 class="font-bold text-2xl">Lerom Park</h1>
        </div>
        <div class="flex items-center justify-center mt-[10%]">
            <Card>
                <template #header>
                    <div class="flex flex-row items-center gap-4 bg-sky-600 rounded-t-md p-3 px-4">
                        <!-- <Image src="/public/favicon.png" width="30" /> -->
                        <h1 class="font-bold text-2xl text-white">Login</h1>
                    </div>
                </template>
                <template #content>
                    <form @submit.prevent="() => login(form, cb)" class="w-full h-full mt-4 bg-white">
                        <IftaLabel>
                            <InputMask id="phone" v-model="form.phone" class="" mask="9999999999" fluid />
                            <label for="phone">Phone</label>
                        </IftaLabel>
                        <IftaLabel class="mt-5">
                            <Password v-model="value" inputId="password" variant="filled" />
                            <label for="password">Password</label>
                        </IftaLabel>
                        <p class="text-red-500 mt-2">{{ message }}</p>
                        <Button type="submit" label="Login" class="w-full mt-6"></Button>
                    </form>
                </template>
                <template #footer>
                    <div class="flex items-end justify-end text-xs mt-3 text-neutral-400">
                        LeromTech est. 2025
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import useAuth from '../../scripts/auth';
import { Card, Image } from 'primevue';
const { login } = useAuth();

const message = ref('')

const form = ref({
    phone: '',
    password: ''
})

const cb = (data) => {
    message.value = data.message
}
</script>
