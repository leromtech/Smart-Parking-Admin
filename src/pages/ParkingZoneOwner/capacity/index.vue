<template>
    <div class="flex flex-col">
        <p class="text-xl font-bold text-neutral-600">
            Capacity
        </p>
        <div class="flex flex-col bg-white rounded-md shadow-md p-2">
            <span class="text-neutral-600 font-semibold">Total Capacty</span>
            <Divider />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Divider from '../../../components/divider.vue';

const form = ref({
    capacity: 0
})

</script>