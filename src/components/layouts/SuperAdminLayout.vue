<template>
  <AdminLayout title="Super Admin Panel" subtitle="v1.0" :menuItems="menuItems" @logout="logout" />
</template>

<script setup>
import { ref } from "vue";
import AdminLayout from "./AdminLayout.vue";
import useAuth from "../../scripts/auth";

const { logout } = useAuth();

const menuItems = ref([
  {
    label: "Dashboard",
    route: "/admin/dashboard",
    icon: "pi pi-home",
  },
  {
    label: "Users",
    route: "/admin/users",
    icon: "pi pi-users",
  },
  {
    label: "Parking Zones",
    route: "/admin/parking-zones",
    icon: "pi pi-map",
  },
  {
    label: "Vehicles",
    route: "/admin/vehicles",
    icon: "pi pi-car",
  },
  {
    label: "Vehicle Types",
    route: "/admin/vehicle-types",
    icon: "pi pi-tags",
  },
  {
    label: "Zone Commission Rates",
    route: "/admin/commission-rate",
    icon: "pi pi-percentage",
  },
  {
    label: "Wallet",
    route: "/admin/wallet",
    icon: "pi pi-wallet",
  },
  {
    label: "Wallet Promotions",
    route: "/admin/wallet-promotions",
    icon: "pi pi-gift",
  },
  {
    label: "Bookings",
    route: "/admin/bookings",
    icon: "pi pi-calendar",
  },
  {
    label: "Settlement",
    route: "/admin/settlement",
    icon: "pi pi-money-bill",
  },
  {
    label: "Settings",
    route: "/admin/settings",
    icon: "pi pi-cog",
  },
]);
</script>
