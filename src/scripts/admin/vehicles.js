import { onMounted, ref, watch } from "vue"
import api from "../../boot/api"

const vehicles = ref()
const vehicleTypes = ref()
const loading = ref(false)

const deleteItem = ref()
const editItem = ref()

const form = ref()

const pagination = ref({
    per_page: 10,
    total_records: 0,
    page: 0
})

const filter = ref(
    {
        search: '',
        type: ''
    }
)

const getVehicles = async () => {
    const { data } = await api.get('vehicles', { params: { pagination: pagination.value, filters: filter.value } })
    vehicles.value = data.vehicles.data
    vehicleTypes.value = data.vehicle_types
}

watch(filter, async () => {
    await getVehicles()
}, { deep: true })

export default function useVehicles() {
    onMounted(() => {
        getVehicles()
    })

    return {
        getVehicles,
        vehicleTypes,
        vehicles,
        pagination,
        filter,
        loading,
        deleteItem,
        editItem,
        form
    }
} 