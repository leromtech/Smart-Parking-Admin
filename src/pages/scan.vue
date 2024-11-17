<template>
    <div class="w-full h-dvh flex p-8 pt-16 justify-center bg-[#0B0B0B]">
        <div class="qr-container border-2">
            <qrcode-stream @decode="onDecode" @init="onInit"></qrcode-stream>
        </div>
        <p v-if="qrCodeData">QR Code Data: {{ qrCodeData }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader';

const qrCodeData = ref(null);

const onDecode = async (data) => {
    qrCodeData.value = data;
    await sendQrCodeData();
};

const onInit = (promise) => {
    promise.catch(error => {
        console.error('Could not initialize camera', error);
    });
};

const sendQrCodeData = async () => {
    console.log(qrCodeData.value)
};
</script>

<style scoped>
.qr-container {
    width: 300px;
    height: 300px;
}
</style>