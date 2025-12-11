<template>
    <div class="w-full flex flex-col items-center justify-start gap-2">
        <Panel class="w-full">
            <template #header>
                <div class="flex flex-row items-center justify-between w-full">
                    <div>Free Parking List</div>
                    <div class="flex flex-row items-center gap-2">
                        <Button icon="pi pi-plus" @click="createOpen = true"></Button>
                    </div>
                </div>
            </template>
            <DataTable striped-rows :value="rows" scrollable scrollHeight="400px" tableStyle="min-width: 50rem"
                :loading="loading" lazy>
                <Column field="id" header="Id"></Column>
                <Column field="name" header="Name"></Column>
                <Column header="Remove">
                    <template #body="slotProps">
                        <div class="flex flex-row items-center justify-between w-full">
                            <Button rounded icon="pi pi-trash" severity="danger"
                                @click="deleteUser(slotProps.data.id)"></Button>
                        </div>
                    </template>
                </Column>
                <template #footer>
                    <div class="flex flex-row items-center justify-between w-full">
                        <div class="flex flex-row items-center gap-2">
                            <Button icon="pi pi-angle-double-left" @click="pagination.page = 1"></Button>
                            <span>Page {{ pagination.page }} of {{ Math.ceil(pagination.total / pagination.per_page)
                                }}</span>
                            <Button icon="pi pi-angle-double-right"
                                @click="pagination.page = Math.ceil(pagination.total / pagination.per_page)"></Button>
                        </div>
                    </div>
                </template>
            </DataTable>
        </Panel>

        <Dialog v-model:visible="openDelete">
            <template #header>
                <div class="pr-6">Confirm Delete</div>
            </template>
            <div class="flex flex-col items-center justify-center">
                <span>Do you want to remove {{ deleteName.toUpperCase() }} from free parking list?</span>
                <div class="flex flex-row items-center justify-end w-full mt-6 gap-3">
                    <Button icon="pi pi-times" severity="info" outlined label="Cancel"
                        @click="openDelete = false"></Button>
                    <Button icon="pi pi-trash" severity="danger" outlined label="Confirm"
                        @click="confirmDelete"></Button>
                </div>
            </div>
        </Dialog>

        <Dialog v-model:visible="createOpen" :modal="true" :closeOnEscape="false" dismissableMask>
            <template #header>
                <span class="font-semibold">Add a free parking for User</span>
            </template>
            <create @save="handleCreateSave" />
        </Dialog>
    </div>
</template>

<script setup>
import create from './FreeParkingCreate.vue'
import { useToast } from 'primevue'
import { onMounted, ref, watch } from 'vue'
import api from '../../../boot/api'

const toast = useToast()

const pagination = ref({
    page: 1,
    per_page: 10,
    total: 0,
})

const filters = ref({
    free_parking: 'true',
    search: '',
    role: '',
})

const rows = ref([])
const openDelete = ref(false)
const createOpen = ref(false)

const getAllFreeParkingList = async () => {
    try {
        const { data } = await api.get('users', {
            params: {
                page: pagination.value.page,
                per_page: pagination.value.per_page,
                filters: filters.value
            }
        })
        console.log(data)
        rows.value = data.data
        if (data.data.length === 0) {
            toast.add({
                severity: 'info',
                summary: 'No Data',
                detail: 'No free parking list found',
                life: 3000
            })
        }
        console.log(data)
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch free parking list : ' + error,
            life: 3000
        })
    }
}

const deleteUser = async (userId) => {
    try {
        const { data } = await api.delete(`users/${userId}`)
        if (data.success) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User deleted successfully',
                life: 3000
            })
            getAllFreeParkingList()
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete user : ' + error,
            life: 3000
        })
    }
    await getAllFreeParkingList()
}

const handleCreateSave = async () => {
    createOpen.value = false
    await getAllFreeParkingList()
}

onMounted(async () => {
    await getAllFreeParkingList()
})
</script>
