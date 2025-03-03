<template>
    <div class="card flex flex-col min-h-screen h-screen">
        <Menubar>
            <template #start>
                <span v-if="parking_zone">
                    {{ parking_zone?.name }} <br> <b>Owner Admin Panel</b>
                </span>
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
import { ref } from 'vue';
import useAuth from '../scripts/auth';
import { useParkingZone } from '../scripts/parkingZone';

const { parking_zone } = useParkingZone()
const { logout } = useAuth()

const menuItems = ref([
    {
        label: 'Home',
        items: [
            {
                label: 'Dashboard',
                route: '/parking-zone',
                icon: 'pi pi-home'
            }
        ]
    },
    {
        label: 'Settings',
        items: [
            {
                label: 'Account',
                route: '/parking-zone/account',
                icon: 'pi pi-warehouse'
            },
            {
                label: 'Capacity',
                route: '/parking-zone/capacity',
                icon: 'pi pi-warehouse'
            },
            {
                label: 'Managers',
                route: '/parking-zone/managers',
                icon: 'pi pi-user'
            },
            {
                label: 'Rates',
                route: '/parking-zone/rates',
                icon: 'pi pi-user'
            },
            {
                label: 'Earnings Report',
                route: '/parking-zone/earnings',
                icon: 'pi pi-user'
            }
        ]
    }

]) 
</script>