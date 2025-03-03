<template>
    <div class="flex flex-row gap-4 w-full">
        <Panel class="w-full">
            <template #header>
                <div class="flex flex-row items-center justify-between w-full">
                    <div>Booking Reminder Intervals</div>
                    <div class="flex flex-row items-center gap-2">
                        <Button icon="pi pi-save" @click="save"></Button>
                    </div>
                </div>
            </template>
            <form class="flex flex-col gap-2">
                <div v-for="(interval, index) in bookingIntervals" :key="index" class="flex flex-col gap-2">
                    <label for="booking_interval"> {{ addPrefix(index) }}</label>
                    <div class="flex flex-row gap-2 w-full">
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-stopwatch"></i>
                            </InputGroupAddon>
                            <InputNumber v-model="bookingIntervals[index]" />
                            <InputGroupAddon>
                                <span>Minute</span>
                            </InputGroupAddon>
                        </InputGroup>
                        <Button rounded outlined icon="pi pi-trash" severity="danger"
                            @click="deleteInterval(index)"></Button>
                    </div>
                </div>
            </form>
            <div class="flex flex-row items-center justify-center mt-2 w-full">
                <Button outlined icon="pi pi-plus" :style="{ width: '100%' }" @click="add"></Button>
            </div>
        </Panel>
        <Panel class="w-full">
            Right Side
        </Panel>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../../../boot/api';
import { useToast } from 'primevue';

const bookingIntervals = ref([])

const toast = useToast()

const deleteInterval = (index) => {
    bookingIntervals.value.splice(index, 1)
}

const addPrefix = (index) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = index + 1;
    const suffix = (v % 100 >= 11 && v % 100 <= 13) ? 'th' : suffixes[v % 10] || 'th';
    return `${v}${suffix} reminder`;
};

const add = () => {
    bookingIntervals.value.push(0)
}

const getBookingIntervals = async () => {
    const { data } = await api.get('settings', {
        params: {
            key: 'booking_reminder_intervals'
        }
    })
    bookingIntervals.value = data.value
}

const save = async () => {
    const fd = new FormData()
    fd.append('key', 'booking_reminder_intervals')
    fd.append('value', JSON.stringify(bookingIntervals.value))
    const { data } = await api.post('settings', fd)

    console.log(data)

    toast.add({
        severity: data.success ? 'success' : 'error',
        summary: data.success ? 'Success' : 'Error',
        detail: data.message
    })
}

onMounted(() => [
    getBookingIntervals()
])
</script>