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
            <template #header>
                <div class="flex flex-row items-center justify-between w-full">
                    <div>Booking Rate</div>
                    <div class="flex flex-row items-center gap-2">
                        <Button icon="pi pi-save" @click="saveRate"></Button>
                    </div>
                </div>
            </template>
            <div>
                <InputGroup>
                    <InputNumber v-model="bookingRate" mode="currency" currency="INR" locale="en-IN" :min="0"
                        :max="1000000" :style="{ width: '100%' }">
                        <template #prefix>
                            <i class="pi pi-rupee"></i>
                        </template>
                    </InputNumber>
                    <InputGroupAddon>
                        <span>Minute</span>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </Panel>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../../../boot/api';
import { useToast } from 'primevue';

const bookingIntervals = ref([]);

const toast = useToast()
const bookingRate = ref(0)
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
    bookingIntervals.value.push(0); // Access the .value property to manipulate the array
}

const getBookingIntervals = async () => {
    try {
        const { data } = await api.get('settings', {
            params: {
                key: 'booking_reminder_intervals'
            }
        });

        bookingIntervals.value = JSON.parse(data.value); // Convert string to array of numbers

    } catch (error) {
        console.error('Error fetching booking intervals:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch booking intervals'
        });
    }
};

const saveRate = async () => {
    const fd = new FormData()
    fd.append('key', 'booking_rate')
    fd.append('value', bookingRate.value)
    try {
        await api.post('settings', fd)

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Booking rate saved successfully',
            life: 3000
        })
        await getbookingRate()
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save booking rate',
            life: 3000
        })
    }
}

const save = async () => {
    const fd = new FormData()
    fd.append('key', 'booking_reminder_intervals')
    fd.append('value', (JSON.stringify(bookingIntervals.value)))

    try {
        await api.post('settings', fd)

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Booking intervals saved successfully',
            life: 3000
        })
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save booking intervals',
            life: 3000
        })
    }
}

const getbookingRate = async () => {
    const { data } = await api.get('settings', {
        params: {
            key: 'booking_rate'
        }
    })
    bookingRate.value = data.value

}

onMounted(async () => {
    await getBookingIntervals()
    await getbookingRate()
})
</script>