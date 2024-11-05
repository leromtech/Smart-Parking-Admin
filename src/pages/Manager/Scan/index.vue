<template>
    <div class="min-h-screen bg-black text-gray-200 p-4 space-y-6">
      <!-- Header -->
      <div class="flex items-center space-x-2">
        <span class="text-lg font-semibold">Millennium Center Parking</span>
      </div>
      <div class="flex items-center space-x-2">
        <h1 class="font-bold text-2xl">Scan Vehicle</h1>
      </div>
  
      <!-- Search Bar -->
      <div class="relative">
        <input
          type="text"
          placeholder="Search by vehicle registration no."
          v-model="searchQuery"
          class="w-full bg-gray-900 rounded-full px-4 py-3 pr-12 text-white outline-none"
        />
        <button class="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full">
          <font-awesome-icon :icon="['fas', 'qrcode']" class="text-white" />
        </button>
      </div>
  
      <!-- QR Scanner Section -->
      <div class="flex justify-center items-center min-h-[50vh]">
        <div class="w-72 h-72 rounded-2xl overflow-hidden border border-gray-700 bg-gray-900">
          <qrcode-stream @decode="onDecode" @init="onInit" class="w-full h-full"></qrcode-stream>
        </div>
      </div>
  
      <!-- Bottom Navigation -->
      <div class="fixed bottom-4 left-0 right-0 bg-gray-800 p-4 m-4 rounded-full">
        <div class="flex justify-between">
            <router-link
            to="/manager"
            class="flex-1 text-center"
            :class="{ 'text-purple-500': $route.path === '/manager' }"
            >Manager</router-link>

            <router-link
            to="/manager/checkout"
            class="flex-1 text-center"
            :class="{ 'text-purple-500': $route.path === '/manager/checkout' }"
            >Checkout</router-link>

            <router-link
            to="/manager/scan"
            class="flex-1 text-center"
            :class="{ 'text-purple-500': $route.path === '/manager/scan' }"
            >Scan</router-link>
        </div>
        </div>

    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  // Import FontAwesome for QR code icon
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faQrcode } from '@fortawesome/free-solid-svg-icons';
  import { library } from '@fortawesome/fontawesome-svg-core';
  
  // Import QR code scanner
  import { QrcodeStream } from 'vue-qrcode-reader';
  
  library.add(faQrcode);
  
  const searchQuery = ref('');
  
  const onDecode = (result) => {
    alert(`QR code scanned: ${result}`);
  };
  
  const onInit = (promise) => {
    promise.catch(error => {
      console.error(error);
      alert('Error initializing camera. Make sure you have camera permissions enabled.');
    });
  };
  </script>
  
  <style scoped>
  /* Font Awesome icon styles */
  @import '@fortawesome/fontawesome-svg-core/styles.css';
  </style>
  