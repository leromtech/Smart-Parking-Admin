<template>
    <div class="h-full w-full flex flex-col relative overflow-hidden">
        <div class="h-[30%] w-full flex bg-gradient-to-b from-black absolute top-0 z-10 pointer-events-none"></div>
        <div class="flex flex-col h-[20%] w-full p-4 z-20 relative">
            <div class="font-extrabold text-xl text-white flex flex-col w-full">
                <p>Find Your</p>
                <p>Parking Space</p>
            </div>
            <div class="w-full items-center justify-center flex mt-2 relative">
                <input type="text" class="p-2 rounded-full z-10 w-full bg-transparent border text-white"
                    placeholder="Search">
                <font-awesome-icon :icon="['fas', 'fa-search']" class="text-white absolute right-5" />
            </div>
        </div>
        <div class="flex items-center justify-center h-full w-full absolute top-0 bottom-0 right-0 left-0 z-0">
            <GoogleMap :api-key="map_api_key" style="width: 100%; height: 100vh"
                :center="userLocation.lat ? userLocation : defaultCenter" :zoom="15" :styles="customDarkStyle"
                :fullscreen-control="false" :map-type-control="false" :zoom-control="false" :disable-default-ui="true"
                @zoom_changed="updateZoom" ref="mapRef">
                <Marker v-for="parkingZone in parkingZones" :key="parkingZone.id"
                    :options="{ position: { lat: parseFloat(parkingZone.latitude), lng: parseFloat(parkingZone.longitude) }, label: { text: parkingZone.name, color: '#ffffff', className: 'mb-12' } }"
                    @click="() => openDetails(parkingZone)" />
                <Circle
                    :options="{ center: userLocation, radius: circleRadius, strokeColor: '#4285f4', strokeWeight: 2, fillColor: '#4285f4' }"
                    v-if="userLocation.lat !== null && userLocation.lng !== null" />
            </GoogleMap>
        </div>
        <!-- Draggable Drawer -->
        <div class="bg-[#000000b0] p-2 w-full z-10 mt-auto rounded-t-xl flex flex-col items-center justify-start"
            :style="{ top: drawerTop + 'px', maxHeight: '100vh', height: '100vh', position: 'absolute' }"
            @mousedown="startDrag" @touchstart="startDrag">
            <div class="bg-white h-1 w-[30%] mb-1 cursor-pointer"></div>
            <div class="flex flex-col w-full px-4">
                <div class="overflow-y-scroll w-full" style="max-height: calc(60vh - 4rem);">
                    <div class="text-white py-2 border-b flex flex-row items-center justify-between cursor-pointer"
                        v-for="parkingZone in parkingZones" :key="parkingZone.id" @click="openDetails(parkingZone)">
                        <p>
                            {{ parkingZone.name }}
                        </p>
                        <p>
                            {{ parkingZone.availability.real_time_availability }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <Modal v-model:open="modalOpen" class="z-50">
            <div
                class="w-[90%] h-[70%] flex flex-col items-center bg-[#1a1919e8] border border-stone-700 rounded-lg p-2">
                <img src="" alt="" class="w-full h-[45%] rounded-lg bg-stone-950 my-2">
                <div class="flex flex-col w-full h-[40%] text-white px-2 mt-2 gap-2">
                    <p>{{ selected.name }}</p>
                    <div class="flex flex-row items-center justify-between">
                        <p>Location</p>
                        <p>{{ selected.address }}</p>
                    </div>
                    <div class="flex flex-row items-center justify-between">
                        <p>availability</p>
                        <p>{{ selected.availability.real_time_availability }}</p>
                    </div>
                </div>
                <div class="mt-auto flex gap-2 justify-between text-white w-full px-2">
                    <button class="border border-[#7F00FF] bg-[#7F00FF] p-2  rounded-md font-normal w-full"
                        @click="displayBookingInfo">Continue to
                        book</button>
                    <button class="border border-[#7F00FF] p-2  rounded-md font-normal w-full">Start
                        navigation</button>
                </div>
            </div>
        </Modal>

        <Modal v-model:open="openBookingInfo">
            <div
                class="w-[90%] h-[70%] flex flex-col bg-[#1a1919e8] border border-stone-700 rounded-lg p-6 text-white font-medium">
                <p>Booking Information</p>
                <p class="mt-4">Booking Time</p>
                <p class="font-normal text-sm">{{ getDateTime() }}</p>
                <p class="mt-4">Select Your Vehicle</p>
                <div :class="['w-full flex flex-row items-center gap-4 my-2 p-2 rounded-lg', bookingVehicle == vehicle.registration_no ? 'bg-[#FF9500]' : 'bg-[#1d1d1d]']"
                    v-for="vehicle in user.vehicle">
                    <input :id='vehicle.registration_no' type="radio" :value="vehicle.registration_no"
                        v-model="bookingVehicle">
                    <label :for="vehicle.registration_no" class="w-full">{{ vehicle.registration_no }}</label>
                </div>

                <button class="w-full p-2 rounded-lg bg-[#7F00FF] mt-auto">Confirm Booking</button>
            </div>
        </Modal>
    </div>
</template>


<script setup>
import Modal from '../../../components/Modal.vue';
import { computed, onMounted, onUnmounted, reactive, ref, useTemplateRef, watch } from 'vue';
import useMap from '../../../scripts/map';
import { Circle, GoogleMap, Marker } from 'vue3-google-map';
import api from '../../../boot/api';
import useAuth from '../../../scripts/auth';

const { user } = useAuth()

const modalOpen = ref(false)
const selected = ref(null)
const openBookingInfo = ref(false)

const bookingVehicle = ref()

const searchQuery = ref('')
const theme = ref('dark')
const zoom = ref(15); // Initial zoom level

const { map_api_key, center } = useMap()

const userLocation = reactive({ lat: null, lng: null });

const intervalId = ref(null)

const circleRadius = computed(() => {
    const baseRadius = 1;
    return baseRadius * Math.pow(2, 20 - zoom.value);
});

const parkingZones = ref([])

const customDarkStyle = ref([
    { elementType: 'geometry', stylers: [{ color: '#212121' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
    {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [{ color: '#757575' }],
    },
    {
        featureType: 'administrative.country',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9e9e9e' }],
    },
    {
        featureType: 'administrative.land_parcel',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#bdbdbd' }],
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#757575' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#181818' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#616161' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#1b1b1b' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [{ color: '#2c2c2c' }],
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#8a8a8a' }],
    },
    {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#373737' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#3c3c3c' }],
    },
    {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [{ color: '#4e4e4e' }],
    },
    {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#616161' }],
    },
    {
        featureType: 'transit',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#757575' }],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#000000' }],
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#3d3d3d' }],
    },
]);

const drawerTop = ref(window.innerHeight * 0.80); // Initial bottom position
const originalPosition = window.innerHeight * 0.80;
const belowSearchPosition = window.innerHeight * 0.2 + 20; // Position just below search bar

const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default coordinates for fallback

const mapRef = ref(null)

let startY = 0;
let initialTop = 0;

const startDrag = (event) => {
    startY = event.touches ? event.touches[0].clientY : event.clientY;
    initialTop = drawerTop.value;
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', onDrag);
    document.addEventListener('touchend', stopDrag);
};

const onDrag = (event) => {
    const currentY = event.touches ? event.touches[0].clientY : event.clientY;
    const deltaY = currentY - startY;
    drawerTop.value = Math.min(originalPosition, initialTop + deltaY);
};

const stopDrag = () => {
    const draggedPos = drawerTop.value;

    if (draggedPos < window.innerHeight * 0.8) {
        drawerTop.value = belowSearchPosition; // Snap just below the search bar
    } else {
        drawerTop.value = originalPosition; // Snap to original position (bottom)
    }

    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', stopDrag);
};

const updateZoom = () => {
    if (mapRef.value?.ready) {
        const currentZoom = mapRef.value.map.getZoom();
        zoom.value = currentZoom;
    } else {
        return
    }
};

const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation.lat = position.coords.latitude;
                userLocation.lng = position.coords.longitude;
            },
            (error) => {
                console.error("Error getting location:", error.message);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
};

const getUserPositionTick = () => {
    if (!intervalId.value) {
        intervalId.value = setInterval(getUserLocation, 2000);
    }
};

const getParkingZones = async () => {
    const { data } = await api.get('parking-zones');
    const { parking_zones, availabilities } = data;

    const availabilityMap = availabilities.reduce((map, availability) => {
        map[availability.parking_zone_id] = availability;
        return map;
    }, {});

    parkingZones.value = parking_zones.data.map(zone => {
        return {
            ...zone,
            availability: availabilityMap[zone.id] || null
        };
    });
};

const openDetails = (item) => {
    modalOpen.value = true
    selected.value = item
}

const displayBookingInfo = () => {
    modalOpen.value = false
    openBookingInfo.value = true
}

const getDateTime = () => {
    const date = new Date();

    const time = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
    });

    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const dayNumber = date.getDate();
    const year = date.getFullYear();

    return `${time}, ${day}, ${dayNumber} ${month}, ${year}`;
}


onMounted(() => {
    getUserLocation(); // Fetch initial location
    getUserPositionTick();
    getParkingZones()

    Echo.channel('parking-zones').listen('ParkingAvailabilityUpdated', (data) => {
        const { parking_zone_id, real_time_availability, allowed_vehicle_types } = data;

        const zoneIndex = parkingZones.value.findIndex(zone => zone.id === parseInt(parking_zone_id));
        console.log(zoneIndex)
        if (zoneIndex !== -1) {
            parkingZones.value[zoneIndex].availability.real_time_availability = real_time_availability;
            parkingZones.value[zoneIndex].availability.allowed_vehicle_types = allowed_vehicle_types;
        }
        console.log(parkingZones.value[zoneIndex])
    });
});

onUnmounted(() => {
    if (intervalId.value) {
        clearInterval(intervalId.value);
        intervalId.value = null;
    }

    Echo.leaveChannel('parking-zones');
});
</script>
