<template>
    <div class="bg-gray-900 min-h-screen p-5 text-white">
      <!-- Header Section -->
      <div class="flex items-center justify-between mb-8">
        <button class="text-white text-xl">
          <!-- Back Arrow Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold">Hi! Christina</h1>
        <button class="text-lime-500">
          <!-- QR Code Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 5h4V3H5a2 2 0 00-2 2v4h2V5zM19 5h-4V3h4a2 2 0 012 2v4h-2V5zM5 19h4v2H5a2 2 0 01-2-2v-4h2v4zM19 19h-4v2h4a2 2 0 002-2v-4h-2v4zM7 7h10v10H7V7z" />
          </svg>
        </button>
      </div>
  
      <!-- Vehicle Tabs -->
      <div class="flex space-x-2 mb-8">
        <button class="bg-lime-500 text-gray-900 rounded-full px-4 py-1 font-semibold">MZ01AB 9090</button>
        <button class="bg-gray-800 text-white rounded-full px-4 py-1 font-semibold">MZ01Y 8900</button>
      </div>
  
      <!-- QR Code Section -->
      <div class="bg-gray-800 p-5 rounded-lg flex items-center justify-center mb-8">
        <!-- <img src="/path-to-qr-code-image.png" alt="QR Code" class="w-40 h-40"> -->
      </div>
  
      <!-- Profile Links -->
      <div class="text-center text-lime-500 mb-8">
        <a href="#" class="underline">Edit profile</a>
        <span class="mx-2">||</span>
        <a href="#" class="underline">Add more vehicle</a>
      </div>
  
      <!-- Profile Information -->
      <div class="space-y-3 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-400">Name</span>
          <span class="font-semibold">Christina</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">Address</span>
          <span class="font-semibold">Falkland</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">Phone number</span>
          <span class="font-semibold">8794371004</span>
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
  // No additional scripts are necessary in this example.
  </script>
  
  <style scoped>
  /* Optional: Add any specific styling if needed */
  </style>
  