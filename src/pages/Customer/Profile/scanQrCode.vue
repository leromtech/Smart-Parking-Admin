<template>
    <div class="w-full h-dvh flex p-8 pt-16 justify-center items-center flex-col bg-[#0B0B0B]">
        <div class="qr-container relative">
            <video id="video" width="300" height="300" autoplay>
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
            </video>
            <p v-if="qrCodeData">QR Code Data: {{ qrCodeData }}</p>

        </div>
        <p class="text-white">QR Code Data: {{ qrCodeData }}</p>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { BrowserQRCodeReader } from '@zxing/browser';

const qrCodeData = ref(null);

onMounted(() => {
    const codeReader = new BrowserQRCodeReader();
    codeReader.decodeOnceFromVideoDevice(undefined, 'video')
        .then(result => {
            console.log(result);
            qrCodeData.value = result.text;
        })
        .catch(err => console.error(err));
});
</script>

<style scoped>
.qr-container {
    width: 300px;
    height: 300px;
    position: relative;
}

.corner {
    width: 60px;
    height: 60px;
    border: 6px solid #ffffff;
    /* Adjust color as needed */
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
