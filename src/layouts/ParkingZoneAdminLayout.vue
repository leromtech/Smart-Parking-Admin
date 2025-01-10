<template>
    <div class="flex flex-col w-full min-h-screen h-screen relative bg-slate-100">
        <div class="w-full border-b h-16 shadow-lg bg-white p-2 flex items-center justify-start">
            <font-awesome-icon :icon="['fas', 'bars']" class="w-8 h-8 cursor-pointer text-neutral-600"
                @click="() => open = !open" />
        </div>
        <div class="h-full w-full p-2">
            <router-view class="w-full h-full" />
        </div>
        <sidebar v-model:open="open">
            <div class="flex flex-row items-center justify-start gap-4 p-2 w-full h-16 text-white">
                <font-awesome-icon :icon="['fas', 'a']" class="w-6 h-6 hover:text-neutral-700 rounded-full border-2" />
                <p>Admin v.1.0</p>
            </div>
            <Divider />
            <div class="flex flex-row items-center justify-start gap-4 p-2 w-full h-16 text-white">
                <font-awesome-icon :icon="['fas', 'user']" class="h-6 w-6 rounded-full bg-white text-black p-1" />
                <p>{{ user.name }}</p>
            </div>
            <Divider />
            <div class="flex flex-col w-full text-white">
                <router-link v-for="link in links" :key="link.link" :to="link.link"
                    class="p-2 flex items-center justify-start gap-2 mt-2 hover:bg-slate-200 hover:text-neutral-700 mx-1 rounded-md cursor-pointer">
                    <font-awesome-icon :icon="['fas', link.icon]" class="h-5 w-5 rounded-full" />
                    {{ link.name }}
                </router-link>
            </div>
        </sidebar>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import sidebar from '../components/sidebar.vue';
import Divider from '../components/divider.vue';
import useAuth from '../scripts/auth';

const { user } = useAuth()
const open = ref(true)

const links = [
    { name: 'Dashboard', link: '/parking-zone/', icon: 'user' },
    { name: 'Capacity', link: '/parking-zone/capacity', icon: 'c' }
]
</script>