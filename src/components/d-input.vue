<template>
    <div class="flex flex-col w-full gap-2 mt-8">
        <label v-if="label" class="font-semibold" :for="label">{{ label.toUpperCase() }}</label>
        <input :type="type ?? 'text'" v-model="modelValue" :required="required ?? false"
            class="p-3 border-2 w-[400px] rounded-md bg-neutral-100" :maxlength="maxLength ?? 999">
    </div>
</template>

<script setup>
const props = defineProps(['label', 'type', 'required', 'maxLength'])
const modelValue = defineModel()
</script>