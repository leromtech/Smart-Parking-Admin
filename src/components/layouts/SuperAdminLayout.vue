<template>
    <div class="flex flex-col min-h-screen h-screen bg-neutral-100">
        <!-- Top Navigation Bar -->
        <div class="bg-gradient-to-tr from-sky-900 to-sky-600 text-white shadow-lg z-10">
            <div class="flex items-center justify-between px-6 py-4">
                <div class="flex items-center gap-3">
                    <!-- Car SVG Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="text-white">
                        <path d="M5 17h14v-5H5v5z" />
                        <path d="M7 12L8 8h8l1 4" />
                        <circle cx="7.5" cy="17.5" r="1.5" fill="currentColor" />
                        <circle cx="16.5" cy="17.5" r="1.5" fill="currentColor" />
                        <rect x="6" y="12" width="3" height="3" stroke="none" fill="white" opacity="0.3" />
                        <rect x="15" y="12" width="3" height="3" stroke="none" fill="white" opacity="0.3" />
                        <rect x="5" y="14" width="1" height="1" fill="white" />
                        <rect x="18" y="14" width="1" height="1" fill="white" />
                    </svg>
                    <h1 class="font-bold text-xl">Super Admin Panel</h1>
                    <span class="text-sm text-sky-200 ml-2">v.1.0</span>
                </div>
                <Button :icon="darkModeIcon" severity="secondary" outlined
                    class="text-white border-white hover:bg-white/20" @click="toggleDarkMode()" />
            </div>
        </div>

        <div class="flex flex-row h-full overflow-hidden">
            <!-- Sidebar Menu -->
            <div class="w-64 bg-white shadow-lg flex flex-col">
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Navigation</h2>
                </div>
                <div class="flex-1 overflow-y-auto py-2">
                    <Menu :model="menuItems" class="border-none w-full">
                        <template #submenulabel="{ item }">
                            <span class="text-sky-700 font-bold">{{ item.label }}</span>
                        </template>
                        <template #item="{ item, props }">
                            <router-link v-if="item.route" v-slot="{ href, navigate, isActive }" :to="item.route"
                                custom>
                                <a v-ripple :href="href" v-bind="props.action" @click="navigate" :class="[
                                    'flex items-center px-4 py-3 mx-2 my-1 rounded-lg transition-all duration-200',
                                    isActive
                                        ? 'bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-sky-50 hover:text-sky-700'
                                ]">
                                    <span :class="[item.icon, 'text-lg', isActive ? 'text-white' : 'text-sky-600']" />
                                    <span class="ml-3 font-medium">{{ item.label }}</span>
                                </a>
                            </router-link>
                        </template>
                    </Menu>
                </div>

                <!-- Logout Button -->
                <div class="mt-auto p-4 border-t border-gray-200 bg-gray-50">
                    <Button severity="danger" outlined icon="pi pi-sign-out" label="Logout"
                        class="w-full justify-center font-medium" @click="logout" />
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="flex-1 h-full overflow-auto bg-neutral-50">
                <div class="p-6">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import 'primeicons/primeicons.css'
import { ref } from 'vue';
import useAuth from '../../scripts/auth';

const { logout } = useAuth()

const darkModeIcon = ref('pi pi-sun')

const toggleDarkMode = () => {
    document.documentElement.classList.toggle('my-app-dark');
    darkModeIcon.value = document.documentElement.classList.contains('my-app-dark') ? 'pi pi-sun' : 'pi pi-moon';
}

const menuItems = ref([
    {
        label: 'Users',
        route: '/admin/users',
        icon: 'pi pi-users'
    },
    {
        label: 'Parking Zones',
        route: '/admin/parking-zones',
        icon: 'pi pi-map'
    },
    {
        label: 'Vehicles',
        route: '/admin/vehicles',
        icon: 'pi pi-car'
    },
    {
        label: 'Vehicle Types',
        route: '/admin/vehicle-types',
        icon: 'pi pi-tags'
    },
    {
        label: 'Comission Rate',
        route: '/admin/commission-rate',
        icon: 'pi pi-percentage'
    },
    {
        label: 'Wallet',
        route: '/admin/wallet',
        icon: 'pi pi-wallet'
    },
    {
        label: 'Bookings',
        route: '/admin/bookings',
        icon: 'pi pi-calendar'
    },
    {
        label: 'Settlement',
        route: '/admin/settlement',
        icon: 'pi pi-money-bill'
    },
    {
        label: 'Settings',
        route: '/admin/settings',
        icon: 'pi pi-cog'
    },
]) 
</script>