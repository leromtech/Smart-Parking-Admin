<template>
    <div class="w-full h-full flex fixed top-0 left-0 bg-[rgb(0,0,0,0.2)] z-40 items-center justify-center" v-if="open"
        @click="open = false">
        <div class="fixed flex top-0 left-0 bottom-0 right-0 items-center justify-center">
            <div class="bg-white lg:w-[25%] w-[90%] p-8 text-black rounded-md" @click.stop>
                <p class="text-[24px] font-semibold">
                    LOGIN
                </p>
                <form @submit.prevent="submit" class="text-black w-full h-full flex flex-col items-center">
                    <div class="flex flex-col w-full gap-2 mt-8">
                        <label for="phone" class="font-semibold">PHONE</label>
                        <input type="tel" name="phone" maxlength="10" required
                            class="p-3 border-2 w-full rounded-md bg-neutral-100" v-model="form.phone">
                    </div>
                    <div class="flex flex-col w-full gap-2 mt-8">
                        <label for="password" class="font-semibold">PASSWORD</label>
                        <input type="password" name="password" class="p-3 border-2 w-full rounded-md bg-neutral-100"
                            required v-model="form.password">
                    </div>
                    <div class="w-full flex mt-2 justify-center text-red-500">
                        <p>{{ message }}</p>
                    </div>
                    <div class="w-full flex mt-12 justify-center">
                        <button type="submit"
                            class="w-[50%] bg-blue-500 hover:bg-blue-600 p-4 text-white font-semibold rounded-md">LOGIN</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import useAuth from '../../scripts/auth';


const { login } = useAuth()

const form = ref({
    phone: '',
    password: ''
})

const message = ref('')

const submit = async () => {
    const fd = new FormData()
    fd.append('phone', form.value.phone)
    fd.append('password', form.value.password)
    const error = await login(fd)
    message.value = error

}

const open = defineModel('open', false)
</script>
