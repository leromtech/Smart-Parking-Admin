<template>
    <div class="w-full h-dvh flex p-8 pt-16 justify-center items-center flex-col bg-[#0B0B0B]">
        <div class="relative video-container">
            <div class="corner top-left"></div>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
            <div class="corner bottom-right"></div>
            <video id="video" class="video-feed" autoplay></video>
        </div>
        <p class="text-white mt-4">QR Code Data: {{ qrCodeData }}</p>
        <button @click="simulateQrScan">Simulate</button>
    </div>
</template>

<script setup>
import api from '../../../boot/api'
import { onMounted, ref } from 'vue';
import { BrowserQRCodeReader } from '@zxing/browser';
import useParking from '../../../scripts/parking';
import router from '../../../routes/router';
import useAuth from '../../../scripts/auth';

const { initParking } = useParking()

const { user } = useAuth()

const qrCodeData = ref(null);
const parkingZoneId = ref(null)

const getParkingZone = async (id) => {
    const { data } = await api.get('parking-zone', {
        params: {
            id: parkingZoneId
        }
    })
}

const getQrCode = async () => {
    const { data } = await api.get('parking-zone/qr-code', {
        params: {
            parking_zone_id: 1
        }
    })
}

const scan = async () => {
    const { data } = await api.get('manager/check-in', {
        params: {
            parking_zone_id: parking_zones_managed.id
        }
    })
    console.log(data)
    initParking(data.id)
    router.push('/park')
}

const simulateQrScan = async () => {
    const { data } = await api.get('customer/scan-qr', { params: { parking_zone_id: "eyJpdiI6Im1WS1BTMXBiSHU2elBCM2tYUXUyRWc9PSIsInZhbHVlIjoiS3NIRTM4NWcwcVNYTDhnS1RnQmNpQT09IiwibWFjIjoiYjg2OTIwYjM1NzQ1YTM3YzdmODRjYzZjOWYzMzA0MTZlNTBhNTBiNDliNGE3NTc4ZTdiYTlkZGQzNThhNjAzNCIsInRhZyI6IiJ9" } })
    console.log(data)
    initParking(data.id)
    router.push('/park')
}

onMounted(() => {
    const codeReader = new BrowserQRCodeReader();
    codeReader.decodeOnceFromVideoDevice(undefined, 'video')
        .then(result => {
            qrCodeData.value = JSON.parse(result.text);
            getParkingZone(result)
        })
        .catch(err => console.error(err));

    getQrCode()
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
