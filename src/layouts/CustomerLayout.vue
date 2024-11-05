<template>
  <router-view></router-view>
  <div class="relative h-screen text-white">
    <div class="absolute inset-0 z-0">
      <!-- Map iframe with user location -->
      <iframe class="w-full h-full" :src="mapSrc" frameborder="0" style="border:0;" allowfullscreen=""></iframe>
      <!-- Dark overlay -->
      <div class="absolute inset-0 bg-black opacity-50"></div>
    </div>

    <!-- Overlay content -->
    <div class="relative z-10 p-4 space-y-4 bg-gray-800 bg-opacity-90 rounded-b-2xl">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-200">Find Your Parking Space</h1>
      </div>

      <div class="flex items-center space-x-2 bg-gray-800 rounded-full px-4 py-2">
        <input type="text" placeholder="Search" v-model="searchQuery"
          class="flex-grow bg-transparent border-none text-white outline-none" />
        <button class="p-2 rounded-full text-white">
          <font-awesome-icon :icon="['fas', 'search']" />
        </button>
      </div>

      <!-- Filter Buttons -->
      <div class="flex justify-between mt-4 mx-1">
        <button class="bg-gray-800 rounded-full px-8 py-2" :class="{ 'bg-yellow-400 text-black': filterType === 'all' }"
          @click="setFilter('all')">
          All
        </button>
        <button class="bg-gray-800 rounded-full px-8 py-2"
          :class="{ 'bg-yellow-400 text-black': filterType === 'nearby' }" @click="setFilter('nearby')">
          Nearby
        </button>
        <button class="bg-gray-800 rounded-full px-8 py-2"
          :class="{ 'bg-yellow-400 text-black': filterType === 'available' }" @click="setFilter('available')">
          Available
        </button>
      </div>

    </div>

    <!-- Bottom section -->
    <div class="fixed bottom-0 left-0 right-0 z-20 p-4">
      <div class="bg-gray-900 bg-opacity-80 rounded-lg p-4 space-y-2">
        <div v-for="parking in filteredParkingSpots" :key="parking.id"
          class="border-b border-gray-700 py-2 flex flex-row w-full justify-between"
          @click="() => openBookingDetails(parking.id)">
          <div class="flex flex-col">
            <p class="text-lg">{{ parking.name }}</p>
            <p class="text-sm text-gray-400">{{ parking.distance }} km away</p>
          </div>
          <p :class="['text-sm', parking.availability.real_time_availability ? 'text-green-400' : 'text-blue-400']">
            {{ parking.availability.real_time_availability }}
          </p>
        </div>
      </div>

      <div class="flex justify-between bg-gray-800 px-4 py-5 text-white rounded-full mt-4">
        <router-link to="/customer" class="flex-1 text-center"
          :class="{ 'text-purple-500': $route.path === '/customer' }">Home</router-link>
        <router-link to="/customer/parking" class="flex-1 text-center"
          :class="{ 'text-purple-500': $route.path === '/customer/parking' }">Parking</router-link>
        <router-link to="/customer/wallet" class="flex-1 text-center"
          :class="{ 'text-purple-500': $route.path === '/customer/wallet' }">Wallet</router-link>
        <router-link to="/customer/profile" class="flex-1 text-center"
          :class="{ 'text-purple-500': $route.path === '/customer/profile' }">Profile</router-link>
      </div>
    </div>

    <Modal v-model:open="openDetails">
      <create :item="detailsItem" />
    </Modal>

  </div>
</template>

<script setup>
import Modal from '../components/Modal.vue';
import create from '../pages/Customer/Booking/create.vue'
import { ref, onMounted, computed } from 'vue';
import api from '../boot/api';

const searchQuery = ref('');
const parkingSpots = ref([]);
const userLocation = ref({ lat: null, lng: null });
const filterType = ref('all'); // Current filter type

const detailsItem = ref(null)
const openDetails = ref(false)

const mapSrc = computed(() => {
  const defaultLocation = 'Millennium%20Centre%20Aizawl';
  const { lat, lng } = userLocation.value;

  const markers = parkingSpots.value
    .map(parking => `&markers=color:red%7Clabel:${encodeURIComponent(parking.name.charAt(0))}%7C${parking.latitude},${parking.longitude}`)
    .join('');

  return lat && lng
    ? `https://maps.google.com/maps?q=${lat},${lng}&t=&z=13&ie=UTF8&iwloc=&output=embed${markers}`
    : `https://maps.google.com/maps?q=${defaultLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed${markers}`;
});

const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value.lat = position.coords.latitude;
        userLocation.value.lng = position.coords.longitude;
      },
      (error) => {
        console.error('Error obtaining location', error);
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
};

const openBookingDetails = (id) => {
  openDetails.value = true;
  detailsItem.value = parkingSpots.value.find((item) => {
    return item.id == id
  })
}

const closeBookingDetails = () => [
  openDetails.value = false,
  detailsItem.value = null
]

const fetchParkingZones = async () => {
  try {
    const response = await api.get('parking-zones', {
      method: 'GET'
    });

    // Ensure response.parking_zones is defined and an array before assigning
    if (response.data.parking_zones.data && Array.isArray(response.data.parking_zones.data)) {
      parkingSpots.value = response.data.parking_zones.data;
      parkingSpots.value.forEach((zone) => {
        zone.availability = response.data.availabilities.find((availability) =>
          availability.parking_zone_id === zone.id
        );
      });
    } else {
      parkingSpots.value = []; // Set an empty array if parking zones are not available
    }
  } catch (error) {
    console.error('Error fetching parking zones:', error);
    parkingSpots.value = []; // Optional: Set an empty array in case of error
  }
};


const calculateDistance = (lat, lng) => {
  const { lat: userLat, lng: userLng } = userLocation.value;
  if (!userLat || !userLng) return null;

  const rad = Math.PI / 180;
  const dLat = (lat - userLat) * rad;
  const dLng = (lng - userLng) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(userLat * rad) * Math.cos(lat * rad) * Math.sin(dLng / 2) ** 2;
  return (6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1); // in kilometers
};

const setFilter = (type) => {
  filterType.value = type;
};

const filteredParkingSpots = computed(() => {
  if (filterType.value === 'nearby') {
    return [...parkingSpots.value].sort((a, b) => a.distance - b.distance);
  }
  if (filterType.value === 'available') {
    return parkingSpots.value.filter(parking => parking.status.toLowerCase() === 'available');
  }
  return parkingSpots.value;
});

onMounted(() => {
  getUserLocation();
  fetchParkingZones();

  onMounted(() => {
    window.Echo.channel('parking-zones')
      .listen('ParkingAvailabilityUpdated', (e) => {
        console.log(e)
      });
  });
});
</script>

<style scoped>
/* Tailwind is used for the majority of styling. No additional styles needed unless customization is required. */
</style>