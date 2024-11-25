import { ref } from "vue";
import useAuth from './auth'

const {user} = useAuth()
const form = ref({
    parking_zone_id: null,
    phone: null,
    vehicle_type: null,
    vehicle_registration_no: null
})

const initParking = (parkingZoneId) => {
    form.value.parking_zone_id = parkingZoneId
    if(user.value != null){
        form.value.phone = user.value.phone
    }
}


const reset = () => {
    _parkingZoneId.value = null
}

export default function useParking(){
    return{
        initParking,
        reset,
        form
    }
}