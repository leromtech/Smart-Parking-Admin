<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" v-if="modelValue"
        @click="close">
        <div @click.stop v-bind="$attrs">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);

const open = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});

const close = () => {
    open.value = false;
};
</script>

<script>
export default {
    inheritAttrs: false
};
</script>
