import { onMounted, ref } from "vue";
import api from "../boot/api";

const parking_zones = ref()

const getParkingZones = async () => {
    const { data } = await api.get('parking-zones')
    parking_zones.value = data.parking_zones
    console.log(parking_zones.value)
}

const parking_zone_edit = ref()

const parking_zone_delete = ref()

const updateItem = () => {

}

export default function useAdmin() {
    onMounted(async () => {
        await getParkingZones()
    })

    return {
        getParkingZones,
        parking_zones,
        parking_zone_delete,
        parking_zone_edit,
    }
}