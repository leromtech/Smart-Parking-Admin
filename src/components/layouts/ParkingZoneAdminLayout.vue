<template>
  <AdminLayout :title="parking_zone?.name || 'Parking Zone'" subtitle="Owner Admin Panel" :menuItems="menuItems" @logout="logout" />
</template>

<script setup>
import { ref } from "vue";
import AdminLayout from "./AdminLayout.vue";
import useAuth from "../../scripts/auth";
import { useParkingZone } from "../../scripts/parkingZone";

const { parking_zone } = useParkingZone();
const { logout } = useAuth();

const menuItems = ref([
  {
    label: "Home",
    items: [
      {
        label: "Dashboard",
        route: "/parking-zone",
        icon: "pi pi-home",
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "Account",
        route: "/parking-zone/account",
        icon: "pi pi-user",
      },
      {
        label: "Carwash",
        route: "/parking-zone/carwash",
        icon: "pi pi-th-large",
      },
      {
        label: "Managers",
        route: "/parking-zone/managers",
        icon: "pi pi-users",
      },
      {
        label: "Rates",
        route: "/parking-zone/rates",
        icon: "pi pi-dollar",
      },
      {
        label: "Subscription Rates",
        route: "/parking-zone/subscription-rates",
        icon: "pi pi-tag",
      },
      {
        label: "Subscriptions",
        route: "/parking-zone/subscriptions",
        icon: "pi pi-id-card",
      },
      {
        label: "Earnings Report",
        route: "/parking-zone/earnings",
        icon: "pi pi-chart-line",
      },
      {
        label: "Closed Days",
        route: "/parking-zone/closed-days",
        icon: "pi pi-ban",
      },
      {
        label: "Free Parking Lists",
        route: "/parking-zone/free-parking-lists",
        icon: "pi pi-list",
      },
      {
        label: "Floors",
        route: "/parking-zone/floors",
        icon: "pi pi-building",
      },
    ],
  },
]);
</script>
