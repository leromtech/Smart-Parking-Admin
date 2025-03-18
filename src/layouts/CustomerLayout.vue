<template>
  <div class="flex flex-col items-center justify-between h-screen w-full relative">
    <div class="flex flex-col h-full bg-slate-200 w-full items-center justify-center
    0/">
      <router-view class="flex h-full w-full"></router-view>
    </div>
    <div
      class="absolute bottom-0 bg-[#1D1D1D] rounded-full w-[90%] mb-[5%] py-4 flex flex-row items-center justify-evenly z-40">
      <router-link :to="option.link" v-for="option in menuOptions" :key="option.name"
        class="text-white w-full h-full text-center" v-if="user">
        {{ option.name }}
      </router-link>
      <div class="text-white w-full h-full text-center cursor-pointer" @click="loginDialogVisible = true" v-if="!user">
        Login</div>
      <div class="text-white w-full h-full text-center cursor-pointer" @click="registerDialogVisible = true"
        v-if="!user">Register
      </div>
    </div>
  </div>

  <Dialog v-model:visible="loginDialogVisible" header="Login" :style="{ width: '90%' }" modal="true"
    style="background-color: #111a; color: white;">
    <template #footer>
      <Button label="Login" @click="() => login(loginFd, loginCb)" />
    </template>
    <div class="flex flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          +91
        </InputGroupAddon>
        <InputMask v-model="loginForm.phone" mask="9999999999" placeholder="Phone" />
      </InputGroup>
      <InputText v-model="loginForm.password" placeholder="Password" />
      <span class="text-red-500">{{ loginError }}</span>
      <div class="flex flex-row gap-4">
        <p>Not Registered?</p>
        <span class="cursor-pointer text-violet-500">Register</span>
      </div>
    </div>
  </Dialog>

  <Dialog v-model:visible="registerDialogVisible" header="Register" :style="{ width: '90%' }" modal="true"
    style="background-color: #111a; color: white;">
    <template #footer>
      <Button label="Register" @click="() => register(registerFd, registerCb)" />
    </template>
    <div class="flex flex-col gap-4">
      <InputText v-model="registrationForm.name" placeholder="Name" />
      <InputGroup>
        <InputGroupAddon>
          +91
        </InputGroupAddon>
        <InputMask v-model="registrationForm.phone" mask="9999999999" placeholder="Phone" />
      </InputGroup>
      <InputText v-model="registrationForm.email" placeholder="Email" />
      <InputText v-model="registrationForm.password" placeholder="Password" />
      <span class="text-red-500">{{ registerError }}</span>
      <div class="flex flex-row gap-4">
        <p>Already Registered?</p>
        <span class="cursor-pointer text-violet-500">Login</span>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import useAuth from '../scripts/auth';
import { InputMask, InputNumber } from 'primevue';

const { user, login, register } = useAuth()

const loginDialogVisible = ref(false)
const registerDialogVisible = ref(false)

const loginError = ref('')
const registerError = ref('')

const loginForm = ref({
  phone: '',
  password: '',
})

const loginFd = computed(() => {
  const fd = new FormData()
  fd.append('phone', loginForm.value.phone)
  fd.append('password', loginForm.value.password)
  return fd
})

const registerFd = computed(() => {
  const fd = new FormData()
  fd.append('name', registrationForm.value.name)
  fd.append('phone', registrationForm.value.phone)
  fd.append('email', registrationForm.value.email)
  fd.append('password', registrationForm.value.password)
  return fd
})

const loginCb = (data) => {
  loginError.value = data.message
  loginDialogVisible.value = !data.success
}

const registerCb = (data) => {
  registerError.value = data.message
  registerDialogVisible.value = !data.success
}

const registrationForm = ref({
  name: '',
  phone: '',
  email: '',
  password: '',
})

const menuOptions = ref([
  { name: 'Home', link: '/' },
  { name: 'Parking', link: '/customer/parking' },
  { name: 'Wallet', link: '/customer/wallet' },
  { name: 'Profile', link: '/customer/profile' },
])
</script>
