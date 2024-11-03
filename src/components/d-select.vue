<template>
    <div class="relative">
        <input type="text" class="p-3 border-2 w-[400px] rounded-md bg-neutral-100" v-model="search"
            @input="() => { selected = null }">
        <div class="absolute w-full p-2 bg-slate-50" v-if="selected == null && options.length > 0">
            <div v-for="item in props.options" :key="item" @click="() => { selected = item }"
                class="p-2 hover:bg-neutral-50 cursor-pointer">
                {{ item[optionsLabel] }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const props = defineProps(['options', 'options-value', 'options-label'])
const modelValue = defineModel()

const selected = defineModel('selected')
const search = defineModel('search')

watch(modelValue, (model) => {
    if (!selected.value) {
        const item = props.options.find((item) => { return item.id === model })
        selected.value = item
    }
})

watch(selected, (item) => {
    if (item !== null) {
        modelValue.value = item[props.optionsValue]
        search.value = item[props.optionsLabel]
    }
})

</script>