<template>
    <div class="flex flex-col w-dvh h-dvh bg-neutral-100 relative overflow-hidden">
        <!-- Background pattern with opacity -->
        <div class="absolute inset-0 z-0" :style="{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: '400px 400px',
            backgroundRepeat: 'repeat',
            opacity: '0.10'
        }"></div>

        <!-- Main content -->
        <div
            class="flex items-center justify-center h-[10vh] text-white relative z-10 bg-gradient-to-tr from-sky-900 to-sky-600">
            <h1 class="font-bold text-2xl">Lerom Park</h1>
        </div>
        <div class="flex items-center justify-center mt-[10%] relative z-10">
            <div class="shadow-lg">
                <Card>
                    <template #header>
                        <div
                            class="flex flex-row items-center gap-2 rounded-t-md p-3 px-4 bg-gradient-to-tr from-sky-700 to-sky-500">
                            <!-- Car SVG Icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="text-white">
                                <!-- Car body -->
                                <path d="M5 17h14v-5H5v5z" />
                                <!-- Car top/windshield -->
                                <path d="M7 12L8 8h8l1 4" />
                                <!-- Wheels -->
                                <circle cx="7.5" cy="17.5" r="1.5" fill="currentColor" />
                                <circle cx="16.5" cy="17.5" r="1.5" fill="currentColor" />
                                <!-- Windows -->
                                <rect x="6" y="12" width="3" height="3" stroke="none" fill="white" opacity="0.3" />
                                <rect x="15" y="12" width="3" height="3" stroke="none" fill="white" opacity="0.3" />
                                <!-- Headlights -->
                                <rect x="5" y="14" width="1" height="1" fill="white" />
                                <rect x="18" y="14" width="1" height="1" fill="white" />
                            </svg>
                            <h1 class="font-bold text-2xl text-white">Admin Login</h1>
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
    </div>
</template>

<script setup>
import { ref } from 'vue';
import useAuth from '../../scripts/auth';
import { Card, Image } from 'primevue';
// Import your background image
import backgroundImage from '../../assets/doodle.jpg';

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