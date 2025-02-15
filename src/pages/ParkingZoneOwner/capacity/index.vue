<template>
    <div class="card flex flex-row w-full gap-4">
        <Panel header="CAPACITY" class="w-[50%]">
            <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-2">
                    <label for="username">Capacity</label>
                    <InputNumber id="username" v-model="parking_zone.capacity_total" aria-describedby="username-help" />
                    <Message size="small" severity="secondary" variant="simple">Enter the total capacity
                    </Message>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="username">Reserved</label>
                    <InputNumber id="username" v-model="parking_zone.reserved_space" aria-describedby="username-help" />
                    <Message size="small" severity="secondary" variant="simple">Enter the capacity reserved for booking
                    </Message>
                </div>
                <Button @click="submit">Save</Button>
            </div>
        </Panel>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '../../../boot/api'
import useNotification from '../../../scripts/notification';
import useAuth from '../../../scripts/auth'
import { useParkingZone } from '../../../scripts/parkingZone';
import { InputNumber, useToast } from 'primevue';

const { notify } = useNotification()
const { user } = useAuth()
const { parking_zone, updateParkingZone } = useParkingZone(user.value.parking_zone_owned.id)
const toast = useToast()

const capacity_total = ref(0);
const reserved_space = ref(0);
const error = ref('');
const error_timer = ref(null);

// Form validity computed based on input values
const isFormValid = ref(true);

const validateCapacity = () => {
    if (capacity_total.value < 0) {
        error.value = 'Total capacity cannot be negative';
        capacity_total.value = 0;
    } else {
        error.value = '';
    }
};

const validateReserved = () => {
    if (reserved_space.value > capacity_total.value) {
        error.value = 'Reserved space cannot exceed total capacity';
        reserved_space.value = capacity_total.value;
    } else if (reserved_space.value < 0) {
        error.value = 'Reserved space cannot be negative';
        reserved_space.value = 0;
    } else {
        error.value = '';
    }
};

const submit = async () => {
    const data = await updateParkingZone({
        capacity_total: capacity_total.value,
        reserved_space: reserved_space.value
    })
    console.log(data)
    toast.add({ severity: data.success ? 'success' : 'error', summary: data.success ? 'Success' : 'Error', detail: data.message })
}

watch(parking_zone, () => {
    capacity_total.value = parking_zone.value.capacity_total
    reserved_space.value = parking_zone.value.reserved_space
}, { deep: true })

// Automatically clear error message after a delay
watch(error, (newError) => {
    if (newError) {
        clearTimeout(error_timer.value);
        error_timer.value = setTimeout(() => {
            error.value = '';
        }, 3000);
    }
});
</script>
