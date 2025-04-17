<template>
    <div class="card flex flex-col min-h-screen h-screen">
        <Menubar>
            <template #start>
                <span>
                    Super Admin Panel v.1.0
                </span>
            </template>
            <template #end>
                <Button :icon="darkModeIcon" severity="warn" outlined @click="toggleDarkMode()"></Button>
            </template>
        </Menubar>
        <div class="flex flex-row h-full">
            <Menu :model="menuItems">
                <template #submenulabel="{ item }">
                    <span class="text-primary font-bold">{{ item.label }}</span>
                </template>
                <template #item="{ item, props }">
                    <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                            <span :class="item.icon" />
                            <span class="ml-2">{{ item.label }}</span>
                        </a>
                    </router-link>
                </template>
                <template #end>
                    <div class="w-full flex items-center justify-center">
                        <Button severity="danger" variant="text" class="w-full" @click="logout">Logout</Button>
                    </div>
                </template>
            </Menu>
            <div class="w-full h-full p-6">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import 'primeicons/primeicons.css'
import { ref } from 'vue';
import useAuth from '../scripts/auth';

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
        icon: 'pi pi-warehouse'
    },
    {
        label: 'Parking Zones',
        route: '/admin/parking-zones',
        icon: 'pi pi-user'
    },
    {
        label: 'Comission Rate',
        route: '/admin/commission-rate',
        icon: 'pi pi-user'
    },
    {
        label: 'Vehicles',
        route: '/admin/vehicles',
        icon: 'pi pi-user'
    },
    {
        label: 'Vehicle Types',
        route: '/admin/vehicle-types',
        icon: 'pi pi-user'
    },
    {
        label: 'Wallet',
        route: '/admin/wallet',
        icon: 'pi pi-user'
    },
    {
        label: 'Bookings',
        route: '/admin/booking-intervals',
        icon: 'pi pi-user'
    },
    {
        label: 'Settlement',
        route: '/admin/settlement',
        icon: 'pi pi-user'
    },
]) 
</script>