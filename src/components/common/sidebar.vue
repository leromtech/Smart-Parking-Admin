<template>
    <div ref="sidebarRef" :class="[
        'w-[200px] h-full absolute left-0 bg-[#2e313d] flex flex-col items-center justify-start transition-all duration-200',
        open ? 'translate-x-0' : '-translate-x-full'
    ]">
        <slot></slot>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'

const open = defineModel('open')
const sidebarRef = ref(null)
const sidebarWidth = ref(0)
const parent = ref(null)
const parentPadding = ref(0)

watch(open, (newVal) => {
    if (newVal) {
        parent.value.classList.add('pl-[200px]', 'transition-all', 'duration-200')
    } else {
        parent.value.classList.remove('pl-[200px]')
    }
})

onMounted(() => {
    // Get the width when component is mounted
    parent.value = sidebarRef.value.parentElement
    if (!parent.value.style.paddingLeft) {
        parentPadding.value = 0
    } else {
        parentPadding.value = parent.value.style.paddingLeft
    }
    if (sidebarRef.value) {
        sidebarWidth.value = sidebarRef.value.offsetWidth
        if (open.value) {
            parent.value.classList.add(`pl-[${sidebarWidth.value}px]`)
        }
    }
})

// Optional: Watch for resize events if you need to update width dynamically
const updateWidth = () => {
    if (sidebarRef.value) {
        sidebarWidth.value = sidebarRef.value.offsetWidth
    }
}

window.addEventListener('resize', updateWidth)

// Clean up event listener
onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
})
</script>