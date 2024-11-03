<template>
    <div class="flex flex-col w-full h-full">
        <div class="flex md:flex-row flex-col gap-4 mt-4">
            <div class="flex flex-col">
                <label for="search">Search</label>
                <input type="search" name="search" v-model="filters.search" @update:model-value="fetchUsers"
                    class="p-2 border-2 bg-neutral-100" placeholder="Search">
            </div>
            <div class="flex flex-col md:w-[20%] w-full">
                <label for="filterByAddress">Filter by Address</label>
                <select class="w-full h-full px-2 md:py-0 py-2" name="filterByAddress" v-model="filters.address"
                    @update:model-value="fetchUsers">
                    <option value="" disabled hidden>Select by Address</option>
                    <option v-for="address in address_options" :key="address">
                        {{ address }}
                    </option>
                </select>
            </div>
            <button class="p-2 shadow-md self-end ml-auto rounded-md border hover:bg-neutral-100"
                @click="openCreate = true">Create</button>
        </div>

        <div class="w-full h-[400px] mt-8">
            <template v-if="map_api_key.length > 0">
                <GoogleMap :api-key="map_api_key" :center="{ lat: center.lat, lng: center.lng }" :zoom="12"
                    class="w-full h-full">
                    <Marker v-for="zone in parking_zones" :key="zone.id" @click="() => _edit(zone)"
                        :options="{ position: { lat: parseFloat(zone.latitude), lng: parseFloat(zone.longitude) }, label: { text: zone.name, className: 'mb-[60%] font-normal' }, title: zone.name }" />
                </GoogleMap>
            </template>
        </div>
        <div class="w-full max-h-[500px] overflow-y-scroll mt-6 text-black">
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
    </div>

    <Modal v-model:open="openCreate">
        <create class="bg-white p-8" @created="fetchParkingZones" />
    </Modal>

    <Modal v-model:open="openEdit">
        <edit class="bg-white p-8" @updated="onUpdated" :item="editItem" />
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
import Modal from '../../../components/Modal.vue';
import api from '../../../boot/api';
import useNotification from '../../../scripts/notification';
import useMap from '../../../scripts/map';
import { AdvancedMarker, GoogleMap, Marker } from 'vue3-google-map';

const { map_api_key, center } = useMap()

const { notify } = useNotification()

const columns = [
    { name: 'name', label: 'NAME', field: (row) => row.name },
    { name: 'address', label: 'ADDRESS', field: (row) => row.address },
    { name: 'owner', label: 'OWNER', field: (row) => row.owner.name },
    { name: 'total_space', label: 'TOTAL SPACE', field: (row) => row.capacity_total },
]

const openEdit = ref(false)
const openCreate = ref(false)
const showDelete = ref(false)
const deleteId = ref([])
const editItem = ref()

const selected = ref([])
const _edit = (item) => {
    editItem.value = item
    openEdit.value = true
}

const rows = ref([])

const address_options = ref([])

const total = ref(0)
const items_num = ref(0)

const perPageOptions = [
    5, 10, 15, 30, 50
]

const pagination = ref({
    per_page: 15,
    page: 1
})

const filters = ref({
    search: '',
    address: ''
})

const totalPages = computed(() => Math.ceil(total.value / pagination.value.per_page));

watch(filters, async (newVal) => {
    await fetchParkingZones()
}, { deep: true })

watch(pagination, async (newVal) => {
    await fetchParkingZones()
}, { deep: true })


const onUpdated = async (e) => {
    await fetchParkingZones();
    openEdit.value = false;
    notify({ type: 'success', message: e })
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

const fetchParkingZones = async () => {
    const { data } = await api.get('parking-zones', { params: { filters: filters.value, pagination: pagination.value } })
    total.value = data.parking_zones.total
    items_num.value = data.parking_zones.data.length
    rows.value = data.parking_zones.data

    address_options.value = ['All', ...data.unique_addresses]
}

const confirmDelte = async () => {
    const fd = new FormData()
    fd.append('_method', 'DELETE')
    const { data } = await api.post(`/parking-zones/${deleteId.value}`, fd)
    notify({ type: 'success', message: data.message })
    fetchParkingZones()
}

const selectAll = async () => {
    if (selected.value.length <= 0) {
        rows.value.forEach((item) => {
            selected.value.push(item.id)
        })
    } else {
        selected.value = []
    }
}

onMounted(async () => {
    await fetchParkingZones()
})
</script>