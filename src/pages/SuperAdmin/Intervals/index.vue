<template>
    <form v-if="intervals" class="flex flex-col" @submit.prevent="submit">
        <div class="flex items-center mt-2 w-full justify-end p-2">
            <Button type="submit" label="Submit" class="self-end"></Button>
        </div>
        <div v-for="(value, key, index) in intervals" :key="key">
            <InputGroup>
                <InputGroupAddon>
                    <Button icon="pi pi-times" @click="remove(index)" />
                </InputGroupAddon>
                <InputText v-model="Object.keys(intervals)[index]" />
            </InputGroup>
            <InputNumber v-model="intervals[key]" />
        </div>
        <div>
            <Button outlined icon="pi pi-plus" id="fw" @click="add" v-if="!adding"></Button>
            <Button outlined icon="pi pi-trash" id="fw" @click="cancel" v-else severity="danger"></Button>
        </div>
        <div v-if="adding" class="flex items-center mt-2 gap-4">
            <InputGroup>
                <InputGroupAddon>
                    <span>Name</span>
                </InputGroupAddon>
                <InputText v-model="newInterval.name" id="hf" />
            </InputGroup>
            <InputGroup>
                <InputGroupAddon>
                    <span>Value</span>
                </InputGroupAddon>
                <InputNumber v-model="newInterval.value" />
                <InputGroupAddon>
                    <Select size="small" v-model="selectedMult" :options="options" optionLabel="label"
                        optionValue="value"></Select>
                </InputGroupAddon>
            </InputGroup>
            <div class="flex w-1/4 items-center">
                <Button icon="pi pi-check" rounded outlined @click="addToIntervals" />
            </div>
        </div>

    </form>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../../../boot/api';
import { useToast } from 'primevue';

const toast = useToast()

const intervals = ref({})
const newInterval = ref(null)
const adding = ref()

const selectedMult = ref(1)

const options = [
    { label: 'Seconds', value: 1 },
    { label: 'Minutes', value: 60 },
    { label: 'Hours', value: 360 },
    { label: 'Days', value: 1440 },
    { label: 'Weeks', value: 10080 },
    { label: 'Months', value: 43200 },
    { label: 'Years', value: 525600 },
]


const getIntervals = async () => {
    const { data } = await api.get('settings', { params: { key: 'intervals' } })
    intervals.value = data.value
}

const cancel = () => {
    adding.value = false
    intervals.value.pop()
}

const add = () => {
    adding.value = true
    newInterval.value = { name: "", value: 0 }
}

const addToIntervals = () => {
    const value = newInterval.value.value * selectedMult.value
    intervals.value = { ...intervals.value, [newInterval.value.name]: value }
    console.log(intervals.value)
    adding.value = false
    newInterval.value = null
}

const submit = async () => {
    const fd = new FormData()
    fd.append('key', 'intervals')
    fd.append('value', intervals.value)
    const { data } = await api.post('settings', fd)

    toast.add({ summary: data.success ? 'Success' : 'Error', severity: data.success ? 'success' : 'error', detail: data.message, life: 3000 })
}

// onMounted(() => {
//     getIntervals()
// })
</script>

<style scoped>
#fw {
    width: 100%;
}
</style>