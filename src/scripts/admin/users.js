import { onMounted, ref, watch } from "vue"
import api from "../../boot/api"

const users = ref()
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
        role: ''
    }
)

const getUsers = async (pageParams = null) => {
    if (pageParams) {
        pagination.value = {
            per_page: pageParams.rows,
            page: pageParams.page + 1,
        }
    }
    const { data } = await api.get('users', { params: { pagination: pagination.value, filters: filter.value } })
    users.value = data.data
    pagination.value = {
        per_page: data.per_page,
        total_records: data.total,
        page: data.current_page
    }
}

watch(filter, async () => {
    await getUsers()
}, { deep: true })

export default function useUsers() {
    return {
        getUsers,
        users,
        pagination,
        filter,
        loading,
        deleteItem,
        editItem,
        form
    }
} 