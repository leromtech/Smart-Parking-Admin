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

const getVehicleTypes = async (pageParams) => {
    if (pageParams) {
        pagination.value = {
            per_page: pageParams.rows,
            page: pageParams.page + 1,
        }
    }
    const { data } = await api.get('vehicle-types', { params: { pagination: pagination.value, filters: filter.value } })
    pagination.value = {
        per_page: data.vehicle_types.per_page,
        total_records: data.vehicle_types.total,
        page: data.vehicle_types.current_page
    }
    vehicleTypes.value = data.vehicle_types.data
    spaceOccupiedOptions.value = data.space_occupied_options
}

watch(filter, async () => {
    await getVehicleTypes()
}, { deep: true })

export default function useVehicleTypes() {
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