import { onMounted, ref, watch } from "vue"
import api from "../../boot/api"

const vehicleTypes = ref()
const spaceOccupiedOptions = ref()
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
        space_occupied: ''
    }
)

const getVehicleTypes = async () => {
    const { data } = await api.get('vehicle-types', { params: { pagination: pagination.value, filters: filter.value } })
    vehicleTypes.value = data.vehicle_types.data
    spaceOccupiedOptions.value = data.space_occupied_options
}

watch(filter, async () => {
    await getVehicleTypes()
}, { deep: true })

export default function useVehicleTypes() {
    onMounted(() => {
        getVehicleTypes()
    })

    return {
        getVehicleTypes,
        spaceOccupiedOptions,
        vehicleTypes,
        pagination,
        filter,
        loading,
        deleteItem,
        editItem,
        form
    }
} 