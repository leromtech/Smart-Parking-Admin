<template>
    <form @submit.prevent="submit" class="flex flex-col">
        <div class="flex flex-row gap-4">
            <div class="w-full h-full">
                <div class="flex flex-col w-full gap-2">
                    <label for="name" class="font-semibold">Name</label>
                    <InputText type="text" name="name" required class="p-3 border-2 w-[400px] rounded-md bg-neutral-100"
                        v-model="form.name" />
                </div>
                <div class="flex flex-col w-full gap-2 mt-8">
                    <label for="address" class="font-semibold">Address</label>
                    <InputText type="address" name="address" required
                        class="p-3 border-2 w-[400px] rounded-md bg-neutral-100" v-model="form.address" />
                </div>
                <div class="flex flex-col w-full gap-2 mt-8">
                    <label for="phone" class="font-semibold">Description</label>
                    <InputText type="text" name="description" required
                        class="p-3 border-2 w-[400px] rounded-md bg-neutral-100" v-model="form.description" />
                </div>
                <div class="relative flex flex-col w-full gap-2 mt-8">
                    <label for="owner" class="font-semibold">Owner</label>
                    <Select :options="users"  @update:modelValue="(e) => {form.owner_id = e.id}">
                        <template #header="slotProps">
                            <div class="flex items-center justify-center">
                                <InputText v-model="search" class="w-full m-2" placeholder="Search User..."/>
                            </div>
                        </template>

                        <template #value="slotProps">
                            <div class="flex flex-row items-start justify-center gap-2" v-if="slotProps.value">
                                <span>{{ slotProps.value.name }}</span>
                                <span>( {{ slotProps.value.phone }} )</span>
                            </div>
                            <div v-else>
                                Select the owner 
                            </div>
                        </template>

                        <template #option="slotProps">
                            <div class="flex flex-row items-start justify-center gap-2">
                                <span>{{ slotProps.option.name }}</span>
                                <span>( {{ slotProps.option.phone }} )</span>
                            </div>
                        </template>
                    </Select>
                </div>

                <div class="flex flex-row items-center justify-between mt-4">
                    <div class="flex flex-col gap-2">
                        <label for="latitude" class="font-semibold">Latitude</label>
                        <InputText type="text" disabled v-model="form.latitude"
                            class="p-3 border-2 w-[150px] rounded-md bg-neutral-100" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="longitude" class="font-semibold">Longitude</label>
                        <InputText type="text" disabled v-model="form.longitude"
                            class="p-3 border-2 w-[150px] rounded-md bg-neutral-100" />
                    </div>
                </div>

                <div class="w-full flex items-center justify-center text-red-600 font-normal">
                    {{ message }}
                </div>
            </div>
            <div class="w-full h-full">
                <template v-if="map_api_key.length > 0">
                    <GoogleMap :api-key="map_api_key" :center="{ lat: center.lat, lng: center.lng }" :zoom="map.zoom"
                        class="w-[500px] h-[500px]" @click="setPosition">
                        <Marker v-if="form.latitude"
                                :options="{ position: { lat: parseFloat(form.latitude), lng: parseFloat(form.longitude) }, label: { text: form.name, className: 'mb-[160%] font-normal' }, title: form.name }" />
                    </GoogleMap>
                </template>
            </div>
        </div>
        <div class="flex flex-row items-center justify-end w-full mt-4">
            <button class="p-3 bg-blue-500 text-white rounded-sm hover:bg-blue-600">SUBMIT</button>
        </div>
    </form>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import dSelect from '../../../components/d-select.vue';
import api from '../../../boot/api';
import { GoogleMap, Marker } from 'vue3-google-map';
import useMap from '../../../scripts/map';
import { faF } from '@fortawesome/free-solid-svg-icons';
import useAdmin from '../../../scripts/admin';
const message = ref()
const map = ref({
    center: { lat: '', lng: '' },
    zoom: 12
})

const { parking_zone_edit } = useAdmin()


const { map_api_key, center } = useMap()

const emit = defineEmits(['created']);

const showSearchOpts = ref(false)

const search = ref('')
const users = ref([])

const form = ref({
    id: null,
    name: '',
    address: '',
    description: '',
    owner_id: '',
    latitude: 0,
    longitude: 0
})

const reset = () => {
    form.value.id = ''
    form.value.name = ''
    form.value.address = ''
    form.value.description = ''
    form.value.owner_id = ''
    form.value.latitude = 0
    form.value.longitude = 0
}

watch(search, async (newVal) => {
    if (newVal != '') {
        await fetchUsers()
    } else {
        users.value = []
    }
})

const setPosition = (e) => {
    form.value.latitude = e.latLng.lat()
    form.value.longitude = e.latLng.lng()
}

const fetchUsers = async () => {
    const { data } = await api('users', { params: { filters: { search: search.value } } })
    users.value = data.data
    if (users.value.length > 0) {
        showSearchOpts.value = true
    } else {
        showSearchOpts.value = false
    }
}

const submit = async () => {
    try {
        const fd = new FormData()
        if (form.value.id !== null) {
            fd.append('id', form.value.id)
            fd.append('_method', 'PATCH')
        }
        fd.append('name', form.value.name)
        fd.append('address', form.value.address)
        fd.append('description', form.value.description)
        fd.append('owner_id', form.value.owner_id)
        fd.append('latitude', form.value.latitude)
        fd.append('longitude', form.value.longitude)

        const { data } = await api.post('/parking-zones', fd)
        reset()
        emit('created', data.message)
    } catch (error) {
        message.value = error.response.data.message
        reset()
    }
}

onMounted(() => {
    if (parking_zone_edit.value) {
        form.value = {
            id: parking_zone_edit.value.id || '',
            name: parking_zone_edit.value.name || '',
            address: parking_zone_edit.value.address || '',
            description: parking_zone_edit.value.description || '',
            owner_id: parking_zone_edit.value.owner_id || '',
            latitude: parking_zone_edit.value.latitude || '',
            longitude: parking_zone_edit.value.longitude || '',
        };
        // Optionally, set the map center based on the provided latitude and longitude
        map.value.center = {
            lat: parseFloat(parking_zone_edit.value.latitude) || center.lat,
            lng: parseFloat(parking_zone_edit.value.longitude) || center.lng,
        };

        users.value = [parking_zone_edit.value.owner]
    }
});

onUnmounted(() => {
    if (parking_zone_edit.value) {
        parking_zone_edit.value = null
    }
})

</script>