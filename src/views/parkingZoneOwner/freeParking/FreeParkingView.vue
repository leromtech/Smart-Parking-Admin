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
                :loading="loading" paginator :rows="10" :rowsPerPageOptions="[10, 25, 50]">
                <Column header="Name">
                    <template #body="slotProps">{{ slotProps.data.user?.name ?? '—' }}</template>
                </Column>
                <Column header="Phone">
                    <template #body="slotProps">{{ slotProps.data.user?.phone ?? '—' }}</template>
                </Column>
                <Column header="Remove">
                    <template #body="slotProps">
                        <Button rounded icon="pi pi-trash" severity="danger"
                            @click="initiateDelete(slotProps.data)"></Button>
                    </template>
                </Column>
                <template #empty>No free parking grants yet</template>
            </DataTable>
        </Panel>

        <Dialog v-model:visible="openDelete">
            <template #header>
                <div class="pr-6">Confirm Delete</div>
            </template>
            <div class="flex flex-col items-center justify-center">
                <span>Do you want to remove {{ deleteTarget?.user?.name ?? 'this user' }} from the free parking list?</span>
                <div class="flex flex-row items-center justify-end w-full mt-6 gap-3">
                    <Button icon="pi pi-times" severity="info" outlined label="Cancel"
                        @click="openDelete = false"></Button>
                    <Button icon="pi pi-trash" severity="danger" outlined label="Confirm" :loading="deleting"
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
import { onMounted, ref } from 'vue'
import api from '../../../boot/api'
import useAuth from '../../../scripts/auth'

const toast = useToast()
const { user } = useAuth()

const rows = ref([])
const loading = ref(false)
const openDelete = ref(false)
const createOpen = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)

const getAllFreeParkingList = async () => {
    if (!user.value?.id) {
        return
    }
    loading.value = true
    try {
        const { data } = await api.get('free-parking', { params: { user_id: user.value.id } })
        rows.value = Array.isArray(data) ? data : []
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message ?? 'Failed to fetch free parking list',
            life: 3000
        })
    } finally {
        loading.value = false
    }
}

const initiateDelete = (grant) => {
    deleteTarget.value = grant
    openDelete.value = true
}

const confirmDelete = async () => {
    if (!deleteTarget.value) {
        return
    }
    deleting.value = true
    try {
        const { data } = await api.delete(`free-parking/${deleteTarget.value.id}`)
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: data.message ?? 'Free parking removed',
            life: 3000
        })
        openDelete.value = false
        deleteTarget.value = null
        await getAllFreeParkingList()
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message ?? 'Failed to remove free parking',
            life: 3000
        })
    } finally {
        deleting.value = false
    }
}

const handleCreateSave = async () => {
    createOpen.value = false
    await getAllFreeParkingList()
}

onMounted(async () => {
    await getAllFreeParkingList()
})
</script>
