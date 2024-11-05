<template>
    <div @click.stop>
        <p class="text-xl font-semibold">
            CREATE PARKING ZONE
        </p>
        <form @submit.prevent="submit" class="flex flex-col">
            <div class="flex flex-row gap-4">
                <div class="w-full h-full">
                    <div class="flex flex-col w-full gap-2 mt-8">
                        <label for="name" class="font-semibold">NAME</label>
                        <input type="text" name="name" required class="p-3 border-2 w-[400px] rounded-md bg-neutral-100"
                            v-model="form.name">
                    </div>
                    <div class="flex flex-col w-full gap-2 mt-8">
                        <label for="address" class="font-semibold">Address</label>
                        <input type="address" name="address" required
                            class="p-3 border-2 w-[400px] rounded-md bg-neutral-100" v-model="form.address">
                    </div>
                    <div class="flex flex-col w-full gap-2 mt-8">
                        <label for="phone" class="font-semibold">Description</label>
                        <input type="text" name="description" required
                            class="p-3 border-2 w-[400px] rounded-md bg-neutral-100" v-model="form.description">
                    </div>
                    <div class="relative flex flex-col w-full gap-2 mt-8">
                        <label for="owner" class="font-semibold">Owner</label>
                        <dSelect :options="users" class="w-full" v-model:search="search" options-label="name"
                            options-value="id" v-model="form.owner_id" />
                    </div>

                    <div class="flex flex-row items-center justify-between mt-4">
                        <div class="flex flex-col gap-2">
                            <label for="latitude" class="font-semibold">Latitude</label>
                            <input type="text" disabled v-model="form.latitude"
                                class="p-3 border-2 w-[150px] rounded-md bg-neutral-100">
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="longitude" class="font-semibold">Longitude</label>
                            <input type="text" disabled v-model="form.longitude"
                                class="p-3 border-2 w-[150px] rounded-md bg-neutral-100">
                        </div>
                    </div>

                    <div class="w-full flex items-center justify-center text-red-600 font-normal">
                        {{ message }}
                    </div>
                </div>
                <div class="w-full h-full">
                    <template v-if="map_api_key.length > 0">
                        <GoogleMap :api-key="map_api_key"
                            :center="{ lat: parseFloat(form.latitude), lng: parseFloat(form.longitude) }" :zoom="16"
                            class="w-[500px] h-[500px]" @click="setPosition">
                            <Marker
                                :options="{ position: { lat: parseFloat(form.latitude), lng: parseFloat(form.longitude) }, label: { text: form.name, className: 'mb-[160%] font-normal' }, title: form.name }" />
                        </GoogleMap>
                    </template>
                </div>
            </div>
            <div class="flex flex-row items-center justify-end w-full mt-4">
                <button class="p-3 bg-blue-500 text-white rounded-sm hover:bg-blue-600">SUBMIT</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import dSelect from '../../../components/d-select.vue';
import api from '../../../boot/api';
import { GoogleMap, Marker } from 'vue3-google-map';
import useMap from '../../../scripts/map';
const message = ref()

const { map_api_key, center } = useMap()

const props = defineProps(['item'])

const emit = defineEmits(['updated']);

const showSearchOpts = ref(false)

const search = ref('')
const users = ref([])

onMounted(async () => {
    await fetchUsers()
    form.value.name = props.item.name
    form.value.address = props.item.address
    form.value.description = props.item.description
    form.value.owner_id = props.item.owner.id
    form.value.latitude = props.item.latitude
    form.value.longitude = props.item.longitude
})

const form = ref({
    name: '',
    address: '',
    description: '',
    owner_id: '',
    latitude: '',
    longitude: ''
})

const reset = () => {
    form.value.name = ''
    form.value.address = ''
    form.value.description = ''
    form.value.owner_id = ''
    form.value.latitude = ''
    form.value.longitude = ''
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
        fd.append('name', form.value.name)
        fd.append('address', form.value.address)
        fd.append('description', form.value.description)
        fd.append('owner_id', form.value.owner_id)
        fd.append('latitude', form.value.latitude)
        fd.append('longitude', form.value.longitude)
        fd.append('_method', 'PATCH')

        const { data } = await api.post(`/parking-zones/${props.item.id}`, fd)
        reset()
        emit('updated', data.message)
    } catch (error) {
        message.value = error.response.data.message
        reset()
    }
}

</script>