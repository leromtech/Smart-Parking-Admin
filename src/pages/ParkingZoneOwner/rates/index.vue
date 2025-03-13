<template>
    <div>
        <Panel>
            <template #header>
                <div class="flex flex-row items-center justify-between w-full">
                    <h1 class="font-semibold">Rates</h1>
                    <Button icon="pi pi-plus" rounded @click="addingPolicy = true"></Button>
                </div>
            </template>
            <div class="flex flex-col">

            </div>
        </Panel>

        <Dialog v-model:visible="addingPolicy" modal header="Create a new policy">
            <CreatePolicy />
        </Dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import CreatePolicy from './createPolicy.vue';

const addingPolicy = ref(false)
</script>