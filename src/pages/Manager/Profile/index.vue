<template>
    <div class="flex flex-col bg-[#0B0B0B] text-white">
        <div class="p-6 flex flex-row justify-between">
            <p class="font-semibold">Profile</p>
            <p class="font-semibold">Hi! {{ user?.name }}</p>
            <router-link to="profile/scan-qr">
                <font-awesome-icon :icon="['fas', 'qrcode']" class="text-[#F0E573] w-6 h-6" />
            </router-link>
        </div>
        <div class="m-6 flex rounded-lg bg-[#1D1D1D] p-4 items-center justify-center" v-if="qr_code">
            <img :src="qr_code" alt="" class="border-4 border-white min-h-[300px] min-w-[300px]:">
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
            <button class="text-[#B469FF]" @click="logout">Sign Out</button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '../../../boot/api';
import useAuth from '../../../scripts/auth';

const { logout } = useAuth()

const user = ref()

const qr_code = ref(null)

const getUser = async () => {
    const { data } = await api.get('user')
    user.value = data
}

const getParkingZoneQrCode = async () => {
    const { data } = await api.get('parking-zone/qr-code', {
        params: {
            parking_zone_id: user.value.parking_zone_managed[0].id
        }
    })
    qr_code.value = data.qr_code
}

onMounted(async () => {
    await getUser()
    await getParkingZoneQrCode()
})
</script>