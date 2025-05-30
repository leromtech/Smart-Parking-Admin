<template>
    <div>
        <Panel>
            <div class="w-full h-[400px] bg-white" v-if="map_api_key != null">
                <template v-if="map_api_key.length > 0">
                    <GoogleMap :api-key="map_api_key" :center="{ lat: center.lat, lng: center.lng }" :zoom="12"
                        class="w-full h-full">
                        <Marker v-for="zone in rows" :key="zone.id" @click="() => edit(zone)"
                            :options="{ position: { lat: parseFloat(zone.latitude), lng: parseFloat(zone.longitude) }, label: { text: zone.name, className: 'mb-[160%] font-normal' }, title: zone.name }" />
                    </GoogleMap>
                </template>
            </div>
            <div v-else class="w-full flex items-center justify-center">
                <span class="text-red-600 border border-dashed border-red-600 p-2">
                    NO MAP API KEY!
                </span>
            </div>
            <DataTable :value="rows" tableStyle="min-width: 50rem" paginator :rows="pagination.per_page" :lazy="true"
                class="mt-6" :totalRecords="pagination.total_records" :rowsPerPageOptions="[5, 10, 15, 30]"
                @page="(e) => getParkingZones(e)">
                <template #header>
                    <div class="flex flex-row justify-between">
                        <InputText icon="pi pi-search" />
                        <Button icon="pi pi-plus" @click="createOpen = true"></Button>
                    </div>
                </template>
                <Column header="Name">
                    <template #body="slotProps">
                        <div class="flex flex-col">
                            <span>{{ slotProps.data.name }}</span>
                        </div>
                    </template>
                </Column>
                <Column field="address" header="Address"></Column>
                <Column field="owner.name" header="Owner"></Column>
                <Column header="">
                    <template #body="slotProps">
                        <div class="flex flex-row items-center gap-2">
                            <Button icon="pi pi-trash" rounded severity="danger" outlined
                                @click="() => deleteRow(slotProps.data.id)"></Button>
                            <Button icon="pi pi-pen-to-square" rounded severity="warn" outlined
                                @click="edit(slotProps.data)"></Button>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </Panel>

        <Dialog v-model:visible="createOpen">
            <template #header>
                <span class="font-semibold">Add a Parking Zone</span>
            </template>
            <create @created="refresh" />
        </Dialog>

        <Dialog v-model:visible="editOpen">
            <template #header>
                <span class="font-semibold">Edit</span>
            </template>
            <create @created="refresh" />
        </Dialog>

        <Dialog v-model:visible="deleteOpen">
            <template #header>
                <span class="font-semibold">Confirm delete?</span>
            </template>
            <div class="flex flex-col">
                <span>Do you really want to delete the parking zone ?</span>
                <div class="w-full flex flex-row mt-2">
                    <Button icon="pi pi-trash" label="DELETE" outlined severity="danger" class="w-[40%]"
                        @click="confirmDelete"></Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { GoogleMap, Marker } from 'vue3-google-map';
import useMap from '../../../scripts/map';
import useAdmin from '../../../scripts/admin';
import create from './create.vue'
import { onMounted, ref, watch } from 'vue';
import api from '../../../boot/api';

const { map_api_key, center } = useMap()
const { parking_zones, parking_zone_delete, parking_zone_edit, getParkingZones, pagination } = useAdmin()

const createOpen = ref(false)
const editOpen = ref(false)
const deleteOpen = ref(false)

const edit = (item) => {
    parking_zone_edit.value = item
    editOpen.value = true
}

const deleteRow = (id) => {
    parking_zone_delete.value = id
    deleteOpen.value = true
}

const confirmDelete = async () => {
    const fd = new FormData()
    fd.append('_method', 'DELETE')
    const { data } = api.post(`parking-zones/${parking_zone_delete.value}`, fd)
    await getParkingZones()
    deleteOpen.value = false
}

const rows = ref()

const refresh = async () => {
    await getParkingZones()
    createOpen.value = false
    editOpen.value = false
}

watch(parking_zones, () => {
    rows.value = parking_zones.value.data
    console.log(rows.value)
})

onMounted(async () => {
    await getParkingZones()
})
</script>