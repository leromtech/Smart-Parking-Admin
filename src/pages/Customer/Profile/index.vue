<template>
  <div class="bg-gray-900 min-h-screen p-5 text-white">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-8">
      <button class="text-white text-xl">
        <!-- Back Arrow Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-lg font-semibold">Hi! {{ user?.name }}</h1>
      <router-link to="profile/scan-qr">
        <font-awesome-icon :icon="['fas', 'qrcode']" class="text-lime-500" />
      </router-link>
    </div>

    <!-- Vehicle Tabs -->
    <div class="flex space-x-2 mb-8">
      <button
        :class="['text-gray-900 rounded-full px-4 py-1 font-semibold', vehicle.id == selected_vehicle ? 'bg-lime-500' : 'bg-slate-700']"
        v-for="vehicle in user?.vehicle" :key="vehicle.id" @click="() => selectVehcile(vehicle.id)">{{
          vehicle.registration_no
        }}</button>
    </div>

    <!-- QR Code Section -->
    <div class="bg-gray-800 p-5 rounded-lg flex items-center justify-center mb-8 w-full h-[50%]">
      <img :src="qr_code" alt="QR Code" class="w-full h-full">
    </div>

    <!-- Profile Links -->
    <div class="text-center text-lime-500 mb-8">
      <router-link to="profile/add-vehicle" class="underline">Add more vehicles</router-link>
      <!-- <span class="mx-2">||</span> -->
      <!-- <a href="#" class="underline">Add more vehicle</a> -->
    </div>

    <!-- Profile Information -->
    <div class="space-y-3 text-sm">
      <div class="flex justify-between">
        <span class="text-gray-400">Name</span>
        <span class="font-semibold">{{ user?.name }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Address</span>
        <span class="font-semibold">Falkland</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Phone number</span>
        <span class="font-semibold">{{ user?.phone }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Vehicle registered</span>
        <span class="font-semibold">MZ01AB 9090</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400"></span>
        <span class="font-semibold">MZ01Y 3996</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '../../../boot/api';

const user = ref(null)
const selected_vehicle = ref(null)
const qr_code = ref(null)

watch(selected_vehicle, async (newValue) => [
  await getQrCode(newValue)
])

const getQrCode = async (vehicle_id) => {
  const { data } = await api.get('user/qr-code', {
    params: {
      user_id: user.value.id,
      vehicle_id: vehicle_id
    }
  })
  qr_code.value = data.qr_code
}

const selectVehcile = (id) => {
  selected_vehicle.value = id
}

const getUser = async () => {
  const { data } = await api.get('user')
  user.value = data
  selected_vehicle.value = data.vehicle[0].id
}

onMounted(async () => {
  await getUser()
})
</script>

<style scoped>
/* Optional: Add any specific styling if needed */
</style>