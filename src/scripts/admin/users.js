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

const getUsers = async () => {
    const { data } = await api.get('users', { params: { pagination: pagination.value, filters: filter.value } })
    users.value = data.data

    console.log(users.value)
}

watch(filter, async () => {
    await getUsers()
}, { deep: true })

export default function useUsers() {
    onMounted(() => {
        getUsers()
    })

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