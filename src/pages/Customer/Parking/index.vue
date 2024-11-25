<template>
  <div class="h-full w-full flex flex-col bg-[#0B0B0B] text-white relative overflow-hidden">
    <div class="text-center my-6">
      <h1 class="text-2xl font-bold mt-2">Parking Detail & History</h1>
    </div>

    <div class="flex w-full justify-center items-center py-2 px-4 gap-2">
      <button class="w-full py-2 bg-[#1D1D1D] text-white rounded-full"
        @click="() => selectFilter('ongoing')">Ongoing</button>
      <button class="w-full py-2 bg-[#1D1D1D] text-white rounded-full"
        @click="() => selectFilter('completed')">Completed</button>
      <button class="w-full py-2 bg-[#1D1D1D] text-white rounded-full"
        @click="() => selectFilter('canceled')">Canceled</button>
    </div>

    <div class="w-full h-full flex flex-col px-2 mt-6">
      <div class="flex flex-col w-full p-4 bg-[#14141480] border-2 border-[#1D1D1D] rounded-lg"
        v-for="parkingRecord in parkingRecords" :key="parkingRecord.id">
        <span>
          Time until check-out
        </span>
        <div class="font-semibold tracking-widest text-[2rem] text-blue-600" v-if="parkingRecord.end_time === null">
          {{ formatTime(parkingRecord.elapsedTime) }}
        </div>
        <div class="bg-[#1D1D1D] p-2 mt-2 gap-2 flex flex-col rounded-lg">
          <span class="font-semibold">
            {{ parkingRecord.parking_zone.name }}
          </span>
          <div class="flex flex-row items-center justify-between">
            <p>Check-in time</p>
            <p>{{ parkingRecord.start_time }}</p>
          </div>
          <div class="flex flex-row items-center justify-between">
            <p>Vehicle Reg. Number</p>
            <p>{{ parkingRecord.vehicle.registration_no }}</p>
          </div>
          <div class="flex flex-row items-center justify-between">
            <p>Vehicle Type</p>
            <p>{{ parkingRecord.vehicle_type.name }}</p>
          </div>
          <button class="bg-[#0e991a] p-2 rounded-lg mt-4" @click="() => checkOut(parkingRecord.id)">Checkout</button>
        </div>
      </div>
    </div>

    <Modal v-model:open="checkOutOpen">
      <div class="flex flex-col p-6 bg-[#272727] rounded-lg">
        <span class="font-bold text-[1.2rem] mb-2">Check-Out</span>
        <div class="fkex flex-col justify-center p-6 bg-[#414141] rounded-lg">
          <div class="flex items-center justify-center p-2 bg-black">
            <img src="" alt="qr" class="w-[300px] h-[300px]">
          </div>
          <div class="flex flex-row justify-between w-full mt-2">
            <p>Reg No.</p>
            <p>{{ parkingRecords[selectedParkingRecord].vehicle.registration_no }}</p>
          </div>
          <div class="flex flex-row justify-between w-full mt-2">
            <p>Type</p>
            <p>{{ parkingRecords[selectedParkingRecord].vehicle_type.name }}</p>
          </div>
          <div class="flex flex-row justify-between w-full mt-2">
            <p>Token</p>
            <p>{{ parkingRecords[selectedParkingRecord].otp_code }}</p>
          </div>
        </div>
        <div class="my-4 self-center">
          OR
        </div>
        <button class="rounded-full p-3 w-full bg-blue-700">Scan</button>
      </div>
    </Modal>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, triggerRef } from 'vue';
import api from '../../../boot/api';
import useAuth from '../../../scripts/auth';
import Drawer from '../../../components/Drawer.vue';
import Modal from '../../../components/Modal.vue';

const { user } = useAuth()

const filter = ref('ongoing')
const parkingRecords = ref([])
const checkOutOpen = ref(false)
const selectedParkingRecord = ref(null)

const selectFilter = async (value) => {
  filter.value = value
  await getParkingRecords()
}

const checkOut = (id) => {
  selectedParkingRecord.value = parkingRecords.value.findIndex((item) => { return item.id === id })
  checkOutOpen.value = true
}

const getParkingRecords = async () => {
  const { data } = await api.get('customer/get-parking-record', {
    params: {
      user_id: user.value.id,
      filter: filter.value
    }
  })

  parkingRecords.value = data.map((record) => {
    const startTime = new Date(record.start_time); // Convert start_time to Date
    const elapsed = Math.floor((Date.now() - startTime) / 1000); // Elapsed time in seconds
    return { ...record, elapsedTime: elapsed };
  });

  beginTimer();
}

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

let timerInterval;

const beginTimer = () => {
  if (timerInterval) clearInterval(timerInterval); // Clear previous timer if it exists
  timerInterval = setInterval(() => {
    parkingRecords.value = parkingRecords.value.map((record) => {
      return { ...record, elapsedTime: record.elapsedTime + 1 };
    });
  }, 1000);
};

onMounted(() => {
  getParkingRecords()
})
</script>
