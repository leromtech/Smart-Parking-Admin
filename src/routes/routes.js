const routes = [
  {
    name: "login",
    path: "/",
    meta: { requiresAuth: false },
    component: () => import("../views/auth/LoginView.vue"),
  },
  {
    name: "AdminLayout",
    path: "/admin",
    meta: { requiresAuth: true, roles: ["superadmin"] },
    component: () => import("../components/layouts/SuperAdminLayout.vue"),
    children: [
      {
        name: "Users",
        path: "users",
        component: () => import("../views/superAdmin/users/UsersView.vue"),
      },
      {
        name: "Parking Zones",
        path: "parking-zones",
        component: () =>
          import("../views/superAdmin/parkingZones/ParkingZonesView.vue"),
      },
      {
        name: "Vehicles",
        path: "vehicles",
        component: () =>
          import("../views/superAdmin/vehicles/VehiclesView.vue"),
      },
      {
        name: "Vehicle Types",
        path: "vehicle-types",
        component: () =>
          import("../views/superAdmin/vehicleTypes/VehicleTypesView.vue"),
      },
      {
        name: "Admin Wallet",
        path: "wallet",
        component: () => import("../views/superAdmin/wallet/WalletView.vue"),
      },
      {
        name: "Admin Bookings",
        path: "bookings",
        component: () => import("../views/superAdmin/BookingsView.vue"),
      },
      {
        name: "Admin Settlement",
        path: "settlement",
        component: () => import("../views/superAdmin/SettlementView.vue"),
      },
      {
        name: "Admin Comission Rate",
        path: "commission-rate",
        component: () => import("../views/superAdmin/ComissionView.vue"),
      },
      {
        name: "Settings",
        path: "settings",
        component: () => import("../views/superAdmin/SettingsView.vue"),
      },
    ],
  },
  {
    name: "ParkingZoneOwnerLayout",
    path: "/parking-zone",
    meta: { requiresAuth: true, roles: ["owner"] },
    component: () => import("../components/layouts/ParkingZoneAdminLayout.vue"),
    children: [
      {
        name: "Parking Zone",
        path: "",
        component: () =>
          import("../views/parkingZoneOwner/ParkingZoneOwnerDashboard.vue"),
      },
      {
        name: "Parking Zone Account",
        path: "account",
        component: () => import("../views/parkingZoneOwner/AccountView.vue"),
      },
      // { name: 'Parking Zone Capacity', path: 'capacity', component: () => import('../views/parkingZoneOwner/CapacityView.vue') },
      {
        name: "Parking Zone Managers",
        path: "managers",
        component: () =>
          import("../views/parkingZoneOwner/managers/ManagersView.vue"),
      },
      {
        name: "Parking Zone Rates",
        path: "rates",
        component: () =>
          import("../views/parkingZoneOwner/rates/RatesView.vue"),
      },
      {
        name: "Parking Zone Earnings",
        path: "earnings",
        component: () => import("../views/parkingZoneOwner/EarningsView.vue"),
      },
      {
        name: "parking Zone Free Parking List",
        path: "free-parking-lists",
        component: () =>
          import("../views/parkingZoneOwner/freeParking/FreeParkingView.vue"),
      },
      {
        name: "parking Zone Closed Days",
        path: "closed-days",
        component: () => import("../views/parkingZoneOwner/ClosedDaysView.vue"),
      },
      {
        name: "parking Zone Subscription",
        path: "subscriptions",
        component: () =>
          import("../views/parkingZoneOwner/subscriptions/SubscriptionView.vue"),
      },
      {
        name: "parking Zone Subscription Rates",
        path: "subscription-rates",
        component: () =>
          import("../views/parkingZoneOwner/subscriptionRates/SubscriptionRatesView.vue"),
      },
      {
        name: "Parking Zone Floors",
        path: "floors",
        component: () =>
          import("../views/parkingZoneOwner/floors/FloorsView.vue"),
      },
    ],
  },
];

export default routes;
