<template>
    <div class="flex flex-col relative cursor-pointer" @mouseenter="() => openTooltip = true"
        @mouseleave="() => openTooltip = false">
        <slot name="content" />
        <div
            :class="['absolute p-1 px-2 bottom-[100%] rounded-md bg-neutral-700 text-white', openTooltip ? 'flex' : 'hidden']">
            <slot name="tooltip" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    position: {
        type: String,
        default: 'top'
    }
})

const openTooltip = ref(false)
</script>