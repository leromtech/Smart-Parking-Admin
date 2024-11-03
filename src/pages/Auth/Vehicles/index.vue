<template>
    <div class="flex flex-col w-full h-full">
        <div class="flex md:flex-row flex-col gap-4 mt-4">
            <div class="flex flex-col">
                <label for="search">Search</label>
                <input type="search" name="search" v-model="filters.search" @update:model-value="fetchData"
                    class="p-2 border-2 bg-neutral-100" placeholder="Search">
            </div>
            <div class="flex flex-col md:w-[20%] w-full">
                <label for="filterByAddress">Filter by Type</label>
                <select class="w-full h-full px-2 md:py-0 py-2" name="filterByType" v-model="filters.type"
                    @update:model-value="fetchData">
                    <option value="" disabled hidden>Select by Type</option>
                    <option v-for="type in vehicle_types" :value="type.id" :key="type.id">
                        {{ type.label }}
                    </option>
                </select>
            </div>
            <button class="p-2 shadow-md self-end ml-auto rounded-md border hover:bg-neutral-100"
                @click="openCreate = true">Create</button>
        </div>

        <d-table :columns="columns" :rows="rows" :pagination="pagination">
            <template #actions="{ row }">
                <td align="right" class="py-4">
                    <div class="flex flex-row items-center justify-end pr-2 gap-2">
                        <button @click="() => _edit(row)" class="rounded-full hover:bg-slate-100">
                            <font-awesome-icon :icon="['fas', 'pen-to-square']"
                                class="w-5 h-5 hover:text-neutral-700" />
                        </button>
                        <button @click="() => deleteItem(row.id)" class="rounded-full hover:bg-slate-100">
                            <font-awesome-icon :icon="['far', 'trash-can']"
                                class="text-red-700 w-5 h-5 hover:text-red-500 " />
                        </button>
                    </div>
                </td>
            </template>
        </d-table>
        <div class="flex flex-row items-center justify-between pt-4 border-t">
            <div>
                {{ items_num !== 0 ? items_num : 0 }} of {{ total !== 0 ? total : 0 }}
            </div>

            <div align="center" class="flex flex-row">
                <div class="border w-8 h-8 flex items-center justify-center">
                    <font-awesome-icon :icon="['fas', 'chevron-left']" @click="prevPage"
                        :class="{ 'text-gray-400 cursor-not-allowed': pagination.page === 1 }" />
                </div>

                <div class="border w-8 h-8 flex items-center justify-center">
                    <font-awesome-icon :icon="['fas', 'chevron-right']" @click="nextPage"
                        :class="{ 'text-gray-400 cursor-not-allowed': pagination.page >= totalPages }" />
                </div>

            </div>
            <div>
                <select class="p-2 " v-model="pagination.per_page">
                    <option :value="po" v-for="po in perPageOptions" :key="po">{{ po }}</option>
                </select>
            </div>
        </div>
    </div>

    <Modal v-model:open="openCreate">
        <create class="bg-white p-8" @created="fetchData" :vehicleTypes="vehicle_types" />
    </Modal>

    <Modal v-model:open="openEdit">
        <edit class="bg-white p-8" @updated="onUpdated" :item="editItem" :vehicleTypes="vehicle_types" />
    </Modal>

    <Modal v-model:open="showDelete">
        <div class="bg-white p-6">
            <p>DELETE</p>
            <p>Are you sure you want to delete the parking zone?</p>
            <div class="w-full flex items-center justify-end mt-4">
                <button @click="confirmDelte" class="bg-red-500 text-white p-2 px-4">Confirm</button>
            </div>
        </div>
    </Modal>
</template>


<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import create from './create.vue';
import edit from './edit.vue';
import api from '../../../boot/api';
import useNotification from '../../../scripts/notification';

const { notify } = useNotification()

const openEdit = ref(false)
const openCreate = ref(false)
const showDelete = ref(false)
const deleteId = ref([])
const editItem = ref()

const selected = ref([])


const rows = ref([])
const total = ref(0)
const items_num = ref(0)

const address_options = ref([])


const perPageOptions = [
    5, 10, 15, 30, 50
]

const pagination = ref({
    per_page: 15,
    page: 1,
    total: 0
})

const filters = ref({
    search: '',
    type: ''
})

const vehicle_types = ref([])

const columns = [
    { name: 'registration_no', label: 'NAME', field: 'registration_no' },
    { name: 'owner', label: 'OWNER', field: (row) => row.user.name },
    { name: 'type', label: 'TYPE', field: (row) => row.vehicle_type.name },
    { name: 'model', label: 'MODEL', field: 'model' }
]

const totalPages = computed(() => Math.ceil(total.value / pagination.value.per_page));

watch(filters, async (newVal) => {
    await fetchData()
}, { deep: true })

watch(pagination, async (newVal) => {
    await fetchData()
}, { deep: true })


const onUpdated = async (e) => {
    await fetchData();
    openEdit.value = false;
    notify({ type: 'success', message: e })
}

const _edit = (item) => {
    editItem.value = item
    openEdit.value = true
}


const nextPage = () => {
    if (pagination.value.page < totalPages.value) {
        pagination.value.page++;
    }
}

const prevPage = () => {
    if (pagination.value.page > 1) {
        pagination.value.page--;
    }
}

const deleteItem = async (id) => {
    deleteId.value = id
    showDelete.value = true
}

const fetchData = async () => {
    const { data } = await api.get('vehicles', { params: { filters: filters.value, pagination: pagination.value } })
    total.value = data.vehicles.total
    items_num.value = data.vehicles.data.length
    rows.value = data.vehicles.data

    vehicle_types.value = data.vehicle_types.map((item) => {
        return { label: item.name, value: item.id }
    })
}

const confirmDelte = async () => {
    const fd = new FormData()
    fd.append('_method', 'DELETE')
    const { data } = await api.post(`/parking-zones/${deleteId.value}`, fd)
    notify({ type: 'success', message: data.message })
    fetchData()
}

const selectAll = async () => {
    if (selected.value.length <= 0) {
        vehicles.value.forEach((item) => {
            selected.value.push(item.id)
        })
    } else {
        selected.value = []
    }
}

onMounted(async () => {
    await fetchData()
})
</script>