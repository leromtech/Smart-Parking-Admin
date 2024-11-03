<template>
    <div class="w-full h-full flex fixed top-0 left-0 bg-[rgb(0,0,0,0.2)] z-40 items-center justify-center" v-if="open"
        @click="open = false">
        <div class="fixed flex top-0 left-0 bottom-0 right-0 items-center justify-center">
            <slot />
        </div>
    </div>
</template>

<script setup>
const open = defineModel('open', false)
</script>
