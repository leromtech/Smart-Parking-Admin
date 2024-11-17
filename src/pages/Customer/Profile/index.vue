<template>
  <div class="flex flex-col bg-[#0B0B0B] text-white">
    <div class="p-6 flex flex-row justify-between">
      <p class="font-semibold">Profile</p>
      <p class="font-semibold">Hi! {{ user?.name }}</p>
      <router-link to="profile/scan-qr">
        <font-awesome-icon :icon="['fas', 'qrcode']" class="text-[#F0E573] w-6 h-6" />
      </router-link>
    </div>
    <div class="w-full flex flex-row overflow-x-scroll gap-2" v-if="user">
      <div class="rounded-full min-w-[33%] flex items-center justify-center p-2"
        :class="selected === vehicle.id ? 'bg-[#F0E573] text-black' : 'bg-[#1D1D1D] text-white'"
        v-for="vehicle in user.vehicle" :key="vehicle.id" @click="() => { selected = vehicle.id }">
        {{ vehicle.registration_no }}
      </div>
    </div>
    <div class="m-6 flex rounded-lg bg-[#1D1D1D] p-4" v-if="vehicleQrCode">
      <img :src="vehicleQrCode" alt="" class="border-4 border-white">
    </div>
    <div class="flex flex-row items-center justify-center gap-2 text-yellow-300">
      <router-link>Edit Profile</router-link>
      <div class="h-full">||</div>
      <router-link to="profile/add-vehicle">Add more vehicle</router-link>
    </div>
    <div class="flex flex-col p-6 gap-2">
      <div class="flex flex-row items-center justify-between px-4">
        <p>Name</p>
        <p>{{ user?.name }}</p>
      </div>
      <div class="flex flex-row items-center justify-between px-4">
        <p>Address</p>
        <p>{{ user?.address }}</p>
      </div>
      <div class="flex flex-row items-center justify-between px-4">
        <p>Phone No.</p>
        <p>{{ user?.phone }}</p>
      </div>
    </div>
    <div class="flex items-center justify-center">
      <button class="text-[#B469FF]">Sign Out</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '../../../boot/api';

const user = ref(null)

const selected = ref(null)

const vehicleQrCode = ref(null)

watch(selected, async (newValue) => {
  const { data } = await api.get(`vehicle/qr-code?vehicle_id=${newValue}`, {
  })
  vehicleQrCode.value = data.qr_code
})

const getUser = async () => {
  const { data } = await api.get('user')
  user.value = data
  selected.value = data.vehicle[0]?.id ?? null
}

onMounted(async () => {
  await getUser()
})
</script>