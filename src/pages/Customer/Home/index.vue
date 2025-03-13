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
                @zoom_changed="updateZoom" ref="mapRef" @ready="onMapReady">
                <Marker v-for="parkingZone in parkingZones" :key="parkingZone.id"
                    :options="{ position: { lat: parseFloat(parkingZone.latitude), lng: parseFloat(parkingZone.longitude) }, label: { text: parkingZone.name, color: '#ffffff', className: 'mb-12' } }"
                    @click="() => openDetails(parkingZone)" />
                <Circle
                    :options="{ center: userLocation, radius: circleRadius, strokeColor: '#4285f4', strokeWeight: 2, fillColor: '#4285f4' }"
                    v-if="userLocation.lat !== null && userLocation.lng !== null" />
                <!-- Add Polyline for navigation route -->
                <Polyline v-if="booking.length > 0 && navigationPath" :options="{
                    path: navigationPath,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 4
                }" />
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
        <Modal v-model="modalOpen" class="flex flex-col bg-black p-6 rounded-lg border">
            <img src="" alt="unavailable" class="min-w-full min-h-[300px] rounded-lg bg-stone-950 my-2 border">
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
            <div class="mt-8 flex gap-2 justify-between text-white w-full px-2">
                <button
                    :class="['border border-[#7F00FF] p-2  rounded-md font-normal w-full', booking.length > 0 ? 'bg-[#8000ff86]' : 'bg-[#7F00FF]']"
                    @click="displayBookingInfo" :disabled="booking.length > 0">Continue to
                    book</button>
                <button class="border border-[#7F00FF] p-2  rounded-md font-normal w-full" @click="calculateRoute">Start
                    navigation</button>
            </div>
        </Modal>

        <Modal v-model="openBookingInfo"
            class="flex flex-col bg-[#1a1919e8] border border-stone-700 rounded-lg p-6 text-white font-medium w-[90%]">
            <p>Booking Information</p>
            <p class="mt-4">Booking Time</p>
            <p class="font-normal text-sm">{{ getDateTime() }}</p>
            <p class="mt-4">Select Your Vehicle</p>
            <div :class="['w-full flex flex-row items-center gap-4 my-2 p-2 rounded-lg', bookingVehicle == vehicle.registration_no ? 'bg-[#FF9500]' : 'bg-[#1d1d1d]']"
                v-for="vehicle in user.vehicle">
                <input :id='vehicle.registration_no' type="radio" :value="vehicle.id" v-model="bookingVehicle">
                <label :for="vehicle.registration_no" class="w-full">{{ vehicle.registration_no }}</label>
            </div>

            <button class="w-full p-2 rounded-lg bg-[#7F00FF] mt-auto" @click="initiateBooking">Confirm Booking</button>
        </Modal>
    </div>
</template>


<script setup>
import { Loader } from '@googlemaps/js-api-loader';
import Modal from '../../../components/Modal.vue';
import { computed, onMounted, onUnmounted, reactive, ref, useTemplateRef, watch } from 'vue';
import useMap from '../../../scripts/map';
import { Circle, GoogleMap, Marker, Polyline } from 'vue3-google-map';
import api from '../../../boot/api';
import useAuth from '../../../scripts/auth';
import useNotification from '../../../scripts/notification';
import { useToast } from 'primevue';
import useBooking from '../../../scripts/customer/booking';

const { booking } = useBooking()

const { notify } = useNotification()
const { user } = useAuth()

const navigationPath = ref(null)

const directionsService = ref(null);
const directionsRenderer = ref(null);

const modalOpen = ref(false)
const selected = ref(null)
const openBookingInfo = ref(false)

const bookingVehicle = ref()

const toast = useToast()

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
    const { data } = await api.get('get-parking-zones');
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

const initiateBooking = async () => {
    const fd = new FormData()
    fd.append('user_id', user.value.id)
    fd.append('vehicle_id', bookingVehicle.value)
    fd.append('parking_zone_id', selected.value.id)
    const { data } = await api.post('bookings/initiate', fd)
    toast.add({
        severity: data.success ? 'success' : 'error',
        summary: data.success ? 'Success' : 'Error',
        detail: data.message,
        life: 2000
    });
    if (data.success) {
        openBookingInfo.value = false
        await calculateRoute() // Calculate route after successful booking
    }
}

const onMapReady = (map) => {
    console.log("here")
    directionsService.value = new google.maps.DirectionsService();
    directionsRenderer.value = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 4
        }
    });
};

const calculateRoute = async () => {
    if (!userLocation.lat || !directionsService.value) return;

    try {
        const request = {
            origin: { lat: userLocation.lat, lng: userLocation.lng },
            destination: {
                lat: parseFloat(selected.value.latitude),
                lng: parseFloat(selected.value.longitude)
            },
            travelMode: google.maps.TravelMode.DRIVING
        };

        const response = await new Promise((resolve, reject) => {
            directionsService.value.route(request, (result, status) => {
                if (status === 'OK') resolve(result);
                else reject(status);
            });
        });

        directionsRenderer.value.setDirections(response);
        bookedParkingZone.value = selected.value;
    } catch (error) {
        console.error('Directions request failed:', error);
        toast.add({
            severity: 'error',
            summary: 'Routing Error',
            detail: 'Could not calculate route to parking zone',
            life: 3000
        });
    }
};
watch(booking, async (newVal) => {
    if (newVal.length > 0) {
        await calculateRoute();
    } else {
        navigationPath.value = null; // Clear route when no booking exists
    }
}, { deep: true });

onMounted(async () => {
    getUserLocation(); // Fetch initial location
    getUserPositionTick();
    await getParkingZones()

    window.Echo.channel('parking-zones').listen('ParkingAvailabilityUpdated', (data) => {
        const { parking_zone_id, real_time_availability, allowed_vehicle_types } = data;

        const zoneIndex = parkingZones.value.findIndex(zone => zone.id === parseInt(parking_zone_id));
        if (zoneIndex !== -1) {
            parkingZones.value[zoneIndex].availability.real_time_availability = real_time_availability;
            parkingZones.value[zoneIndex].availability.allowed_vehicle_types = allowed_vehicle_types;
        }
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
