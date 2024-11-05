<template>
    <div class="min-h-screen bg-black text-gray-200 p-4 space-y-6">
      <!-- Header -->
      <div class="flex items-center space-x-2">
        <span class="text-lg font-semibold">Millennium Center Parking</span>
      </div>
      <div class="flex items-center space-x-2">
        <h1 class="font-bold text-2xl">In Vehicles</h1>
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
  
      <!-- Checkin Section -->
      <div>
        <h2 class="text-lg font-bold">Checkin</h2>
        <input
          type="text"
          placeholder="e.g 80"
          v-model="vehicleNumber"
          class="w-full bg-gray-900 rounded-lg px-4 py-2 text-white mt-2 outline-none"
        />
      </div>
  
      <!-- List of Vehicles -->
      <div v-for="vehicle in filteredVehicles" :key="vehicle.id" class="border-b border-gray-700 py-4">
        <p class="text-lg">{{ vehicle.number }}</p>
        <p class="text-sm text-gray-400">Entry : {{ vehicle.entryTime }}</p>
        <p class="text-sm text-gray-400">00:00:00</p>
        <p class="text-yellow-500 font-semibold">Total amount</p>
        <p class="text-yellow-500">Rs. {{ vehicle.totalAmount.toFixed(2) }}</p>
      </div>
  
      <!-- Bottom Navigation -->
      <div class="fixed bottom-4 left-0 right-0 bg-gray-800 p-4 m-4 rounded-full">
        <div class="flex justify-between">
          <router-link
            to="/customer/vehicle/in"
            class="flex-1 text-center"
            :class="{ 'text-purple-500': $route.path === '/customer/vehicle/in' }"
          >In</router-link>
          <router-link
            to="/customer/vehicle/out"
            class="flex-1 text-center"
            :class="{ 'text-purple-500': $route.path === '/customer/vehicle/out' }"
          >Out</router-link>
          <router-link
            to="/customer/scan"
            class="flex-1 text-center"
            :class="{ 'text-purple-500': $route.path === '/customer/scan' }"
          >Scan</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  // Import FontAwesome for QR code icon
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faQrcode } from '@fortawesome/free-solid-svg-icons';
  import { library } from '@fortawesome/fontawesome-svg-core';
  
  library.add(faQrcode);
  
  const searchQuery = ref('');
  const vehicleNumber = ref('');
  
  // Sample vehicle data
  const vehicles = ref([
    { id: 1, number: 'MZ01 Y 3996', entryTime: '09:01 AM', totalAmount: 0 },
    { id: 2, number: 'MZ01 AB 8896', entryTime: '09:01 AM', totalAmount: 0 },
    { id: 3, number: 'MZ01 L 7890', entryTime: '09:01 AM', totalAmount: 0 },
  ]);
  
  // Filtered vehicles based on search query
  const filteredVehicles = computed(() =>
    vehicles.value.filter((vehicle) =>
      vehicle.number.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
  </script>
  
  <style scoped>
  /* Font Awesome icon styles */
  @import '@fortawesome/fontawesome-svg-core/styles.css';
  </style>
  