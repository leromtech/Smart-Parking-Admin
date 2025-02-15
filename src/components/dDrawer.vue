<template>
    <div class="bg-[#000000b0] p-2 w-full z-10 mt-auto rounded-t-xl flex flex-col items-center justify-start"
        :style="{ top: drawerTop + 'px', maxHeight: '100vh', height: '100vh', position: 'absolute' }"
        @mousedown="startDrag" @touchstart="startDrag" v-show="isDrawerVisible">
        <div class="bg-white h-1 w-[30%] mb-1 cursor-pointer"></div>
        <div class="flex flex-col w-full px-4">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    initialDrawerTop: Number,
});

const emit = defineEmits(['closeDrawer']);

const drawerOpen = ref(props.drawerOpen)
const drawerTop = ref(props.initialDrawerTop);
const isDrawerVisible = ref(true); // Controls drawer visibility

let startY = 0;
let initialTop = 0;

const startDrag = (event) => {
    startY = event.touches ? event.touches[0].clientY : event.clientY;
    initialTop = drawerTop.value;
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', onDrag);
    document.addEventListener('touchend', stopDrag);
};

const onDrag = (event) => {
    const currentY = event.touches ? event.touches[0].clientY : event.clientY;
    const deltaY = currentY - startY;
    drawerTop.value = Math.min(window.innerHeight * 0.8, initialTop + deltaY);
};

const stopDrag = () => {
    const draggedPos = drawerTop.value;
    const originalPosition = window.innerHeight * 0.8;
    const closeThreshold = window.innerHeight * 0.4; // Threshold to hide the drawer

    if (draggedPos > closeThreshold) {
        isDrawerVisible.value = false;
        emit('closeDrawer');
    } else {
        drawerTop.value = originalPosition;
    }

    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', stopDrag);
};
</script>
