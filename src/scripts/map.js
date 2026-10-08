import { ref } from "vue";

const map_api_key = ref()
const center = ref({
    lat: 0,
    lng: 0
})
let initialized = false

const googleMapInit = () => {
    if (initialized) return
    initialized = true
    map_api_key.value = import.meta.env.VITE_GOOGLE_MAP_API_KEY ?? ''
    navigator.geolocation.getCurrentPosition((e) => {
        center.value.lat = Number(e.coords.latitude)
        center.value.lng = Number(e.coords.longitude)
    })
}

export default function useMap() {
    // Initialize on first use so map pages work regardless of the entry route
    googleMapInit()
    return {
        map_api_key,
        center,
        googleMapInit
    }
}
