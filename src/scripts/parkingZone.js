import { onMounted, ref } from "vue";
import api from "../boot/api";
import useAuth from "./auth";

const { user } = useAuth()

const parking_zone = ref([])
const rates = ref(null)
const intervals = ref(null)

const pagination = ref({
    per_page: 5,
    page: 0,
    total_records: 0
})

const refresh = async () => {
    await getParkingZone(parking_zone.value.id)
    await getRates()
}

const getParkingZone = async () => {
    const { data } = await api.get(`parking-zones/${user.value.parking_zone_owned.id}`)
    console.log(data)
    parking_zone.value = data
}

const getIntevalSettings = async () => {
    const { data } = await api.get('settings', { params: { key: 'intervals' } })
    intervals.value = [...Object.keys(data.value)]
}

const updateParkingZone = async (item) => {
    if (!parking_zone.value) {
        return 'Parking Zone is not defined'
    }

    const fd = new FormData()
    for (let key in item) {
        fd.append(key, item[key])
    }
    fd.append('_method', 'PATCH')
    const { data } = await api.post(`parking-zones/${user.value.parking_zone_owned.id}`, fd)

    await getParkingZone(parking_zone.value.id)

    return data
}

const removeManager = async (id) => {
    const fd = new FormData()
    fd.append('_method', 'DELETE')
    const { data } = await api.post(`managers/${id}`, fd)

    await getParkingZone(parking_zone.value.id)

    return data
}

const addManager = async (id) => {
    const fd = new FormData()
    fd.append('user_id', id)
    fd.append('parking_zone_id', parking_zone.value.id)
    const { data } = await api.post('managers', fd)

    await getParkingZone(parking_zone.value.id)

    return data
}

const getRates = async () => {
    const { data } = await api.get('rates', { params: { parking_zone_id: parking_zone.value.id } })
    rates.value = data
}

const newRateForm = ref({
    rate_amount: 0,
    duration: 0,
    interval: ''
})

const addFreeParkingUser = async (id) => {
    const fd = new FormData()
    fd.append('user_id', id)
    fd.append('parking_zone_id', parking_zone.value.id)
    const { data } = await api.post('free-parking-users', fd)

    await refresh()

    return data
}

export function useParkingZone() {
    return {
        newRateForm,
        parking_zone,
        rates,
        intervals,
        refresh,
        getParkingZone,
        updateParkingZone,
        addManager,
        removeManager,
        getRates,
        pagination,
        addFreeParkingUser
    }
}
