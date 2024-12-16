<template>
    <div class="w-full h-dvh flex p-8 pt-16 justify-center items-center flex-col bg-[#0B0B0B]">
        <p class="text-white mb-8 font-semibold text-lg">{{ selected_vehicle?.registration_no }}</p>
        <div class="relative video-container">
            <div class="corner top-left"></div>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
            <div class="corner bottom-right"></div>
            <video id="video" class="video-feed" autoplay></video>
        </div>
        <p class="text-white mb-8 font-semibold text-lg">{{ success }}</p>
        <p class="text-white mb-8 font-semibold text-lg">{{ po ?? 'Nothig' }}</p>
    </div>
</template>

<script setup>
import api from '../../../boot/api'
import { onMounted, ref } from 'vue';
import { BrowserQRCodeReader } from '@zxing/browser';
import useParking from '../../../scripts/parking';
import router from '../../../routes/router';
import useAuth from '../../../scripts/auth';

const { initParkingCustomer, selected_vehicle } = useParking()
const success = ref()
const { user } = useAuth()

const po = ref()

const form = ref({
    vehicle_registration_no: null,
})

const parkingZoneId = ref(null)

const onScanQr = async (qrCodeData) => {
    po.value = qrCodeData
    const data = await initParkingCustomer(parkingZoneId.value, qrCodeData.value.vehicle_id, qrCodeData.value.user_id)
    success.value = data
}

onMounted(() => {
    if (!selected_vehicle.value) {
        router.back()
    }

    const codeReader = new BrowserQRCodeReader();
    codeReader.decodeOnceFromVideoDevice(undefined, 'video')
        .then(result => {
            onScanQr(JSON.parse(result.text))
        })
        .catch(err => console.error(err));
});
</script>

<style scoped>
.video-container {
    width: 300px;
    height: 300px;
    overflow: hidden;
    position: relative;
}

.video-feed {
    width: 100%;
    height: auto;
    min-height: 300px;
    /* Adjust video alignment if needed */
    object-fit: cover;
    /* Ensures the video fills the container without distortion */
}

.corner {
    width: 60px;
    height: 60px;
    border: 6px solid #ffffff;
    position: absolute;
}

.top-left {
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: none;
}

.top-right {
    top: 0;
    right: 0;
    border-left: none;
    border-bottom: none;
}

.bottom-left {
    bottom: 0;
    left: 0;
    border-right: none;
    border-top: none;
}

.bottom-right {
    bottom: 0;
    right: 0;
    border-left: none;
    border-top: none;
}
</style>
