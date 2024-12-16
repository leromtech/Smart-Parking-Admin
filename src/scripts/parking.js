import { ref } from "vue";
import useAuth from './auth'
import api from "../boot/api";

const {user} = useAuth()
const selected_vehicle = ref(null)
const form = ref({
    user_id: null,
    parking_zone_id: null,
    phone: null,
    vehicle_type: null,
    vehicle_registration_no: null
})

const initParkingCustomer = async (parkingZoneId, vehicle_registration_no, vehicle_type) => {
    const fd = new FormData()
    fd.append('parking_zone_id', parkingZoneId)
    fd.append('vehicle_registration_no', vehicle_registration_no)
    fd.append('vehicle_type', vehicle_type)

    const {data} = await api.post('parking/initiate', fd)

    return data
}

const initParkingManager = async (user_id, vehicle_registration_no, vehicle_type) => {
    const fd = new FormData()
    fd.append('user_id', user_id)
    fd.append('vehicle_registration_no', vehicle_registration_no)
    fd.append('vehicle_type', vehicle_type)
    fd.append('parking_zone_id', user.value.parking_zone_managed.id)
    console.log(fd)

    const {data} = await api.post('manager/initiate')
}

export default function useParking(){
    return{
        initParkingCustomer,
        initParkingManager,
        selected_vehicle,
        form
    }
}