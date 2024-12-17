import { ref } from "vue";
import useAuth from './auth'
import api from "../boot/api";
import router from "../routes/router";
import useNotification from "./notification";

const {user} = useAuth()
const {notify} = useNotification()

const selected_vehicle = ref(null)
const form = ref({
    user_id: null,
    parking_zone_id: null,
    phone: null,
    vehicle_type: null,
    vehicle_registration_no: null
})

const initParkingCustomer = (parkingZoneId) => {
    form.value.parking_zone_id = parkingZoneId
    form.value.vehicle_registration_no = selected_vehicle.registration_no
    if(user.value){
        form.value.user_id = user.value.id
        form.value.phone = user.value.phone
    }
    router.push('/customer/park')
}

const initParkingManager = async (user_id, vehicle_registration_no ) => {
    const fd = new FormData()
    fd.append('user_id', user_id)
    fd.append('vehicle_registration_no', vehicle_registration_no)
    fd.append('parking_zone_id', user.value.parking_zone_managed.id)

    const {data} = api.post('parking/initiate')

    notify({type: data.success, message: data.message})
}

export default function useParking(){
    return{
        initParkingCustomer,
        initParkingManager,
        selected_vehicle,
        form
    }
}