<template>
    <div @click.stop>
        <p class="text-xl font-semibold">
            {{ form.id ? 'EDIT ' : 'CREATE A ' }} VEHICLE TYPE
        </p>
        <form @submit.prevent="submit" class="flex flex-col">
            <div class="flex flex-row gap-4">
                <div class="w-full h-full">
                    <div class="flex flex-col w-full gap-2 mt-8">
                        <label>Name</label>
                        <InputText v-model="form.name" />
                    </div>

                    <div class="flex flex-col w-full gap-2 mt-8">
                        <label>Space Occupied</label>
                        <InputText v-model="form.space_occupied" />
                    </div>

                    <div class="w-full flex items-center justify-center text-red-600 font-normal">
                        {{ message }}
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center justify-end w-full mt-4">
                <Button @click="submit">Submit</Button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import api from '../../../boot/api';
import useVehicleTypes from '../../../scripts/admin/vehicleTypes';
import { useToast } from 'primevue';
const message = ref()

const toast = useToast()
const { editItem, getVehicleTypes } = useVehicleTypes()

const emit = defineEmits(['created']);

const search = ref('')
const users = ref([])

const form = ref({
    id: null,
    name: '',
    space_occupied: '',
})

const reset = () => {
    form.value.name = ''
    form.value.space_occupied = ''
}

watch(search, async (newVal) => {
    if (newVal != '') {
        await fetchUsers()
    } else {
        users.value = []
    }
})


const submit = async () => {
    try {
        const fd = new FormData()
        if (editItem.value) {
            fd.append('_method', 'PATCH')
            fd.append('id', editItem.value.id)
        }
        fd.append('name', form.value.name)
        fd.append('space_occupied', form.value.space_occupied)

        const path = form.value.id ? `/vehicle-types/${form.value.id}` : '/vehicle-types'

        const { data } = await api.post(path, fd)
        toast.add({ severity: 'success', summary: 'Success', detail: data.message, life: 3000 });

        reset()
        await getVehicleTypes()
        emit('created')
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
        reset()
    }
}

onMounted(() => {
    if (editItem.value) {
        form.value.id = editItem.value.id
        form.value.name = editItem.value.name
        form.value.space_occupied = editItem.value.space_occupied
    }
})

onUnmounted(() => {
    editItem.value = null
})
</script>