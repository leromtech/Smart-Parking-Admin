<template>
    <div class="flex flex-col w-full h-full" @click="profileMenuOpen = false">
        <div class="w-full items-center grid grid-cols-5 h-[60px] border-b-2">
            <!-- Logo -->
            <div class="justify-self-end col-span-1 md:flex hidden">

            </div>

            <!-- Navigation (hidden on small screens) -->
            <div class="justify-self-start col-span-3 h-full px-6 hidden md:flex">
                <nav class="flex flex-row h-full">
                    <ul class="h-full flex items-center">
                        <li v-for="item in navItems" :key="item.name"
                            :class="['h-full flex items-center hover:text-red-950', item.name === currentPage ? 'border-b-2 border-blue-600' : '']">
                            <router-link :to="item.link" class="h-full flex items-center p-2"
                                v-if="roles.includes(item.role)">
                                {{ item.name }}
                            </router-link>
                        </li>
                    </ul>
                </nav>
            </div>

            <!-- Hamburger Icon (visible on small screens) -->
            <div class="md:hidden flex justify-self-start col-span-3 px-6 items-center">
                <button @click.stop="menuOpen = !menuOpen" class="focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            <!-- Profile Menu -->
            <div class="justify-self-start col-span-1 relative md:flex hidden">
                <div class="cursor-pointer hover:text-red-950" @click.stop="profileMenuOpen = true">
                    {{ user.name }}
                </div>
                <div
                    :class="['w-[200px] absolute border bg-white z-20 flex-col gap-2 top-[190%] p-2', !profileMenuOpen ? 'hidden' : 'flex']">
                    <button class="hover:text-red-800">My Profile</button>
                    <button class="hover:text-red-800" @click="logout">Logout</button>
                </div>
            </div>
        </div>

        <!-- Collapsible Menu for Small Screens -->
        <div v-if="menuOpen" class="md:hidden border-t">
            <nav>
                <ul>
                    <li v-for="item in navItems" :key="item.name" class="p-4 hover:text-red-950 border-b">
                        <router-link :to="item.link" class="block" v-if="roles.includes(item.role)">
                            {{ item.name }}
                        </router-link>
                    </li>
                    <li>
                        <div class="flex bg-neutral-200 p-4 hover:text-red-950 border-b" v-if="user && user.name">
                            {{ user.name }}
                        </div>
                    </li>
                    <li>
                        <button class="flex bg-neutral-100 p-4 hover:text-red-950 border-b w-full">My Profile</button>
                    </li>
                    <li>
                        <button class="flex bg-neutral-100 p-4 hover:text-red-950 border-b w-full"
                            @click="logout">Logout</button>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- Page Content -->
        <div class="md:px-[20%] px-2 py-2 h-full">
            <router-view />
        </div>
    </div>
</template>


<script setup>
import { onMounted, ref, watch } from 'vue';
import useAuth from '../scripts/auth';
import { useRoute } from 'vue-router';

const { user, logout, roles } = useAuth()

const page = useRoute()
const currentPage = ref()
watch(page, (newVal) => {
    currentPage.value = newVal.name
}, { deep: true })

onMounted(() => {
    currentPage.value = page.name
})

const profileMenuOpen = ref(false)
const menuOpen = ref(false)  // This controls the mobile menu open/close state

const navItems = [
    { name: 'Users', link: 'users', role: 'superadmin' },
    { name: 'Parking Zones', link: 'parking-zones', role: 'superadmin' },
    { name: 'Vehicles', link: 'vehicles', role: 'superadmin' },
    { name: 'Vehicle Types', link: 'vehicle-types', role: 'superadmin' },
    { name: 'Parking Zone', link: 'parking-zone', role: 'owner' },
]
</script>
