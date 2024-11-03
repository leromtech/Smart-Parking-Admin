import { ref } from "vue";

const map_api_key = ref()
const center = ref({
    lat: 0,
    lng: 0
})

const googleMapInit = () => {
    map_api_key.value = import.meta.env.VITE_GOOGLE_MAP_API_KEY
    navigator.geolocation.getCurrentPosition((e) => {
        center.value.lat = Number(e.coords.latitude)
        center.value.lng = Number(e.coords.longitude)
    })
}

export default function useMap(){
    return {
        map_api_key,
        center,
        googleMapInit
    }
}