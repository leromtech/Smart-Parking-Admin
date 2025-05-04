const routes = [
    { name: 'login', path: '/', meta: { requiresAuth: false }, component: () => import('../pages/auth/login.vue') },
    {
        name: 'AdminLayout',
        path: '/admin',
        meta: { requiresAuth: true, roles: ['superadmin'] },
        component: () => import('../layouts/SuperAdminLayout.vue'),
        children: [
            { name: 'Users', path: 'users', component: () => import('../pages/SuperAdmin/Users/index.vue') },
            { name: 'Parking Zones', path: 'parking-zones', component: () => import('../pages/SuperAdmin/ParkingZones/index.vue') },
            { name: 'Vehicles', path: 'vehicles', component: () => import('../pages/SuperAdmin/Vehicles/index.vue') },
            { name: 'Vehicle Types', path: 'vehicle-types', component: () => import('../pages/SuperAdmin/VehicleTypes/index.vue') },
            { name: 'Admin Wallet', path: 'wallet', component: () => import('../pages/SuperAdmin/Wallet/index.vue') },
            { name: 'Admin Bookings', path: 'bookings', component: () => import('../pages/SuperAdmin/Bookings/index.vue') },
            { name: 'Admin Settlement', path: 'settlement', component: () => import('../pages/SuperAdmin/Settlement/index.vue') },
            { name: 'Admin Booking Intervals', path: 'booking-intervals', component: () => import('../pages/SuperAdmin/Bookings/index.vue') },
            { name: 'Admin Comission Rate', path: 'commission-rate', component: () => import('../pages/SuperAdmin/Comission/index.vue') },
        ]
    },
    {
        name: 'ParkingZoneOwnerLayout',
        path: '/parking-zone',
        meta: { requiresAuth: true, roles: ['owner'] },
        component: () => import('../layouts/ParkingZoneAdminLayout.vue'),
        children: [
            { name: 'Parking Zone', path: '', component: () => import('../pages/ParkingZoneOwner/index.vue') },
            { name: 'Parking Zone Account', path: 'account', component: () => import('../pages/ParkingZoneOwner/account/index.vue') },
            { name: 'Parking Zone Capacity', path: 'capacity', component: () => import('../pages/ParkingZoneOwner/capacity/index.vue') },
            { name: 'Parking Zone Managers', path: 'managers', component: () => import('../pages/ParkingZoneOwner/managers/index.vue') },
            { name: 'Parking Zone Rates', path: 'rates', component: () => import('../pages/ParkingZoneOwner/rates/index.vue') },
            { name: 'Parking Zone Earnings', path: 'earnings', component: () => import('../pages/ParkingZoneOwner/earnings/index.vue') },
            { name: 'parking Zone Free Parking List', path: 'free-parking-lists', component: () => import('../pages/ParkingZoneOwner/freeParkingList/index.vue') },
            { name: 'parking Zone Closed Days', path: 'closed-days', component: () => import('../pages/ParkingZoneOwner/closedDays/index.vue') },
        ]
    },
];

export default routes;
