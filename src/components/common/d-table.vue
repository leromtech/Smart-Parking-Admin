<template>
    <div class="w-full max-h-[500px] overflow-y-scroll mt-6 text-black border">
        <table class="w-full h-max-[500px]">
            <thead class="bg-neutral-100 sticky top-0">
                <tr class="border-b-2">
                    <th align="left">
                        <input type="checkbox" class="ml-2 w-4 h-4">
                    </th>
                    <th v-for="column in columns" :key="column" align="left" class="py-2">
                        {{ column.label ?? column.name }}
                    </th>
                    <th v-if="$slots.actions"></th>
                </tr>
            </thead>
            <tbody class="w-full overflow-scroll">
                <template v-if="rows.length > 0">
                    <tr class="border-y hover:bg-neutral-100" v-for="row in rows" :key="row.id">
                        <td align="" class="py-4 pr-4">
                            <input type="checkbox" class="ml-2 w-4 h-4"
                                :value="selected.find((item) => item.id === row.id) ? true : false">
                        </td>
                        <td v-for="col in columns" :key="col.name" align="left">
                            {{ typeof col.field === 'function' ? col.field(row) : row[col.field] }}
                        </td>

                        <slot name="actions" :row="row" />
                    </tr>
                </template>
                <template v-else>
                    <div class="p-2 w-full flex items-center justify-start font-semibold">
                        No Items
                    </div>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({ rows: Array, columns: Array });
const selected = ref([]);

const getNestedField = (row, field) => {
    const fields = field.split('.');

    return fields.reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : null), row);
};

onMounted(() => {
    // Any additional logic you want to perform on mount
});
</script>
