<template>
    <form action="">
        <DataTable :value="rows" tableStyle="min-width: 50rem" paginator :rows="pagination.per_page" :lazy="true"
            stripedRows totalRecords="pagination.total" :rowsPerPageOptions="[5, 10, 15, 30]" @page="onPageChange">
            <template #header>
                <div class="flex flex-row justify-between">
                    <IconField>
                        <InputIcon class="pi pi-search" />
                        <InputText v-model="filters.search" placeholder="Search users..." />
                    </IconField>
                </div>
            </template>
            <Column header="Name">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        <span>{{ slotProps.data.name }}</span>
                        <span class="text-sm text-neutral-500">{{ slotProps.data.email }}</span>
                    </div>
                </template>
            </Column>
            <Column field="phone" header="Phone"></Column>
            <Column header="Role">
                <template #body="slotProps">
                    <span>{{ slotProps.data.roles[0].name }}</span>
                </template>
            </Column>
            <Column>
                <template #body="slotProps">
                    <Button rounded filled icon="pi pi-plus" variant="text" severity="success"
                        @click="submit(slotProps.data.id)"></Button>
                </template>
            </Column>
            <!-- When no data -->
            <template #empty>
                <div class="flex flex-column align-items-center justify-center items-center justify-content-center">
                    <i class="pi pi-exclamation-triangle text-yellow-500" style="font-size: 3rem"></i>
                    <h5 class="text-red-600">No users found</h5>
                </div>
            </template>
        </DataTable>
    </form>

</template>

<script setup>
import { useToast } from 'primevue'
import api from '../../../boot/api'
import { onMounted, ref, watch } from 'vue'

const toast = useToast()

const rows = ref([])

const form = ref({
    user_id: ''
})

const filters = ref({
    free_parking: false,
    search: '',
    role: '',
})

const pagination = ref({
    total: 0,
    per_page: 10,
    page: 1
})

const loading = ref(false)

const getUsers = async () => {
    try {
        loading.value = true;
        // Match the backend's expected format for pagination and filters
        const { data } = await api.get('users', { params: { filters: filters.value, per_page: pagination.value.per_page, page: pagination.value.page } })
        rows.value = data.data
        pagination.value.total = data.meta?.total || data.total || 0

    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'Failed to fetch users',
            life: 3000
        })
    } finally {
        loading.value = false;
    }
}

const submit = async (userId) => {
    try {
        if (!userId) {
            throw new Error('User ID is required')
        }

        form.value.user_id = userId
        const formData = new FormData()
        formData.append('user_id', userId)

        console.log('Submitting form with user ID:', userId)

        const response = await api.post('free-parking', formData)
        const { data } = response

        console.log('Server response:', data)

        if (data.success) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Free parking assigned successfully',
                life: 3000
            })

            await getUsers()
        } else {
            throw new Error('Failed to assign free parking: ' + JSON.stringify(data))
        }
    } catch (error) {
        console.error('Error details:', error)

        if (error.response) {
            console.error('Response data:', error.response.data)
            console.error('Response status:', error.response.status)

            toast.add({
                severity: 'error',
                summary: 'Server Error',
                detail: error.response.data.message || error.message,
                life: 3000
            })
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message,
                life: 3000
            })
        }
    }
}

const onPageChange = (event) => {
    pagination.value.page = event.page + 1
    pagination.value.per_page = event.rows
}

watch(() => filters.value.search, async () => {
    pagination.value.page = 1 // Reset to first page when searching
    await getUsers()
})

watch(pagination, () => {
    getUsers()
}, { deep: true })

onMounted(async () => {
    await getUsers()
})
</script>