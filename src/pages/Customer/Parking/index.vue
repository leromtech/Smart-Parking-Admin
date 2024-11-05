<template>
    <div class="min-h-screen flex flex-col bg-gray-900 text-white">
      <div class="text-center my-6">
        <h1 class="text-2xl font-bold mt-2">Parking Detail & History</h1>
      </div>
  
      <div class="flex w-full justify-center items-center py-2">
        <div class="flex-1 text-center px-4">
          <button class="w-full py-2 bg-gray-600 text-white rounded-full">Ongoing</button>
        </div>
        <div class="flex-1 text-center px-4">
          <button class="w-full py-2 bg-gray-600 text-white rounded-full">Completed</button>
        </div>
        <div class="flex-1 text-center px-4">
          <button class="w-full py-2 bg-gray-600 text-white rounded-full">Canceled</button>
        </div>
      </div>
  
      <div class="flex items-center justify-center h-auto my-8">
        <div class="relative flex items-center justify-center">
          <!-- Outer Ring -->
          <div class="absolute w-56 h-56 rounded-full border-8 border-gray-300"></div>
          
          <!-- SVG Circle for Countdown Progress -->
          <svg class="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
            <circle class="text-gray-300" cx="100" cy="100" r="90" stroke-width="10" fill="none" />
            <circle
              class="text-green-500 transition-all duration-1000 ease-linear"
              cx="100"
              cy="100"
              r="90"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="progressOffset"
              stroke-width="10"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
          
          <!-- Countdown Text (Hours:Minutes:Seconds) -->
          <div class="absolute text-2xl font-bold text-gray-700">
            {{ hours }}:{{ minutes }}:{{ seconds }}
          </div>
        </div>
      </div>
  
      <div class="w-full h-auto mt-4">
        <div class="bg-gray-800 mx-6 rounded-lg">
          <div class="flex justify-center items-center">
            <div class="flex-1 mx-4 py-4">
              <label class="">Parking Area</label>
              <div class="text-lg py-1">
                <h1>Millennium Center</h1>
              </div>
            </div>
            <div class="flex-1 mx-4 py-4">
              <label class="">Vehicle Type</label>
              <div class="text-lg py-1">
                <h1>Four Wheeler</h1>
              </div>
            </div>
          </div>
          <div class="flex justify-center items-center">
            <div class="flex-1 mx-4 py-4">
              <label class="">Duration</label>
              <div class="text-lg py-1">
                <h1>2 Hours</h1>
              </div>
            </div>
            <div class="flex-1 mx-4 py-4">
              <label class="">Date</label>
              <div class="text-lg py-1">
                <h1>8th October 2024</h1>
              </div>
            </div>
          </div>
          <div class="flex justify-center items-center">
            <div class="flex-1 mx-4 py-4">
              <label class="">Time</label>
              <div class="text-lg py-1">
                <h1>4:00PM to 6:00PM</h1>
              </div>
            </div>
            <div class="flex-1 mx-4 py-4">
              <label class=""></label>
              <div class="text-lg py-1">
                <h3 class="text-[#F0E573]">Expand Parking Time</h3>
              </div>
            </div>
          </div>
        </div>
        
      </div>
  
    </div>
  </template>
  
  
<script setup>
  import { ref, computed } from 'vue';
  
  const countdownTime = ref(10 * 60); // Default: 10 minutes in seconds
  const remainingTime = ref(countdownTime.value);
  const countingDown = ref(false); // Countdown state
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  
  // Computed properties for hours, minutes, and seconds
  const hours = computed(() => String(Math.floor(remainingTime.value / 3600)).padStart(2, '0'));
  const minutes = computed(() => String(Math.floor((remainingTime.value % 3600) / 60)).padStart(2, '0'));
  const seconds = computed(() => String(remainingTime.value % 60).padStart(2, '0'));
  
  // Computed property for progress offset
  const progressOffset = computed(() => circumference - (remainingTime.value / countdownTime.value) * circumference);
  
  // Start countdown function
  function startCountdown() {
    if (countingDown.value) return; // Prevent multiple countdowns
  
    countingDown.value = true;
    const interval = setInterval(() => {
      if (remainingTime.value > 0) {
        remainingTime.value -= 1;
      } else {
        clearInterval(interval);
        countingDown.value = false;
      }
    }, 1000);
  }
</script>
