<template>
    <div class="w-full h-dvh flex p-8 pt-16 justify-center bg-[#0B0B0B]">
        <div class="qr-container border-2">
            <qrcode-stream :camera="{
                facingMode: { exact: 'environment' },
                width: 1280,
                height: 720
            }" @decode="onDecode" @init="onInit">
            </qrcode-stream>
        </div>
        <p v-if="qrCodeData">QR Code Data: {{ qrCodeData }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader';

const qrCodeData = ref(null);

const onDecode = (data) => {
    console.log('Decoded QR Code Data:', data);
    qrCodeData.value = data;
    sendQrCodeData();
};

const onInit = (promise) => {
    promise
        .then(() => console.log('Camera initialized successfully'))
        .catch(error => {
            console.error('Could not initialize camera', error);
        });
};

const sendQrCodeData = () => {
    console.log('Sending QR Code Data:', qrCodeData.value);
};
</script>

<style scoped>
.qr-container {
    width: 300px;
    height: 300px;
}
</style>
