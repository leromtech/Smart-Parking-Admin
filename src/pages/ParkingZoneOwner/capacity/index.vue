<template>
    <div class="card flex flex-row w-full gap-4">
        <Panel header="CAPACITY" class="w-[50%]">
            <div class="flex flex-row gap-2 border border-neutral-200 p-2 rounded-md mb-2">
                <p class="text-blue-500 font-semibold">Note:</p>
                <p>Space occupied is calculated as Two wheeler = 1 space</p>
            </div>
            <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-2">
                    <label for="capacity_total">Total Capacity</label>
                    <InputNumber id="capacity_total" v-model="capacity_total" aria-describedby="capacity-help"
                        @blur="validateCapacity" />
                    <Message size="small" severity="secondary" variant="simple">Enter the total capacity</Message>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="reserved_space">Declared for App</label>
                    <InputNumber id="reserved_space" v-model="declared_for_app" aria-describedby="reserved-help"
                        @blur="validateReservedForApp" />
                    <Message size="small" severity="secondary" variant="simple">Enter the capacity reserved for App
                    </Message>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="reserved_space">Reserved for Booking</label>
                    <InputNumber id="reserved_space" v-model="reserved_space" aria-describedby="reserved-help"
                        @blur="validateReserved" />
                    <Message size="small" severity="secondary" variant="simple">Enter the capacity reserved for
                        subscription
                    </Message>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="reserved_subscriptionß">Reserved for Subscription</label>
                    <InputNumber id="reserved_subscription" v-model="reserved_for_subscription"
                        aria-describedby="reserved-help" @blur="validateReserved" />
                    <Message size="small" severity="secondary" variant="simple">Enter the capacity reserved for booking
                    </Message>
                </div>
                <Button @click="submit" :disabled="error">Save</Button>
                <Message v-if="error" size="small" severity="error" variant="simple">{{ error }}</Message>
            </div>
        </Panel>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '../../../boot/api'
import useAuth from '../../../scripts/auth'
import { useParkingZone } from '../../../scripts/parkingZone';
import { InputNumber, useToast } from 'primevue';

const { user } = useAuth()
const { parking_zone, updateParkingZone } = useParkingZone()
const toast = useToast()

const capacity_total = ref(0);
const reserved_space = ref(0);
const declared_for_app = ref(0);
const reserved_for_subscription = ref(0)
const error = ref('');
const error_timer = ref(null);

const validateCapacity = () => {
    if (capacity_total.value < 0) {
        error.value = 'Total capacity cannot be negative';
        capacity_total.value = 0;
    } else {
        error.value = null;
    }
};

const validateReservedForApp = () => {
    if (declared_for_app.value > capacity_total.value) {
        error.value = 'Declared for App cannot exceed total capacity';
        declared_for_app.value = capacity_total.value;
    } else if (declared_for_app.value < 0) {
        error.value = 'Declared for App cannot be negative';
        declared_for_app.value = 0;
    } else {
        error.value = null;
    }
}

const validateReserved = () => {
    if (reserved_space.value > capacity_total.value) {
        error.value = 'Reserved space cannot exceed total capacity';
        reserved_space.value = capacity_total.value;
    } else if (reserved_space.value < 0) {
        error.value = 'Reserved space cannot be negative';
        reserved_space.value = 0;
    } else {
        error.value = null;
    }
};

const submit = async () => {
    if (!error.value) {
        const data = await updateParkingZone({
            capacity_total: capacity_total.value,
            reserved_space: reserved_space.value,
            declared_for_app: declared_for_app.value,
            reserved_for_subscription: reserved_for_subscription.value
        })
        toast.add({ severity: data.success ? 'success' : 'error', summary: data.success ? 'Success' : 'Error', detail: data.message })
    }
}

onMounted(() => {
    capacity_total.value = user.value.parking_zone_owned.capacity_total
    reserved_space.value = user.value.parking_zone_owned.reserved_space
    declared_for_app.value = user.value.parking_zone_owned.declared_for_app
    reserved_for_subscription.value = user.value.parking_zone_owned.reserved_for_subscription
})

// Automatically clear error message after a delay
watch(error, (newError) => {
    console.log(newError);
    if (newError) {
        clearTimeout(error_timer.value);
        error_timer.value = setTimeout(() => {
            error.value = '';
        }, 3000);
    }
});
</script>
