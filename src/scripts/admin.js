import { onMounted, ref } from "vue";
import api from "../boot/api";

const parking_zones = ref()

const pagination = ref({
    per_page: 10,
    total_records: 0,
    page: 0
})

const getParkingZones = async (pageParams = null, searchTerm = '') => {
    if (pageParams) {
        pagination.value = {
            per_page: pageParams.rows,
            page: pageParams.page + 1,
        }
    }

    const params = {
        pagination: pagination.value,
        filters: {}
    }
    if (searchTerm) {
        params.filters.search = searchTerm
    }

    const { data } = await api.get('parking-zones', { params })
    parking_zones.value = data.parking_zones
    console.log(data)
    pagination.value = {
        per_page: data.parking_zones.per_page,
        total_records: data.parking_zones.total,
        page: data.parking_zones.current_page
    }
}

const parking_zone_edit = ref()

const parking_zone_delete = ref()

const updateItem = () => {

}

export default function useAdmin() {
    return {
        getParkingZones,
        pagination,
        parking_zones,
        parking_zone_delete,
        parking_zone_edit,
    }
}