const routes = [
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
            { name: 'Admin Intervals', path: 'settings-intervals', component: () => import('../pages/SuperAdmin/Intervals/index.vue') },
            { name: 'Admin Settlement', path: 'settlement', component: () => import('../pages/SuperAdmin/Settlement/index.vue') },
            { name: 'Admin Booking Intervals', path: 'booking-intervals', component: () => import('../pages/SuperAdmin/Bookings/index.vue') },
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
        ]
    },
    {
        name: 'CustomerLayout',
        path: '/',
        meta: { requiresAuth: false, roles: ['customer'] },
        component: () => import('../layouts/CustomerLayout.vue'),
        children: [
            { name: 'Home', path: '', component: () => import('../pages/Customer/Home/index.vue') },
            { name: 'Parking', path: 'customer/parking', component: () => import('../pages/Customer/Parking/index.vue') },
            { name: 'Wallet', path: 'customer/wallet', component: () => import('../pages/Customer/Wallet/index.vue') },
            { name: 'Customer Profile', path: 'customer/profile', component: () => import('../pages/Customer/Profile/index.vue') },
            { name: 'Park', path: 'customer/park', component: () => import('../pages/Customer/Parking/create.vue') },
        ]
    },
    {
        name: 'Customer Scan Qr',
        path: '/customer/profile/scan-qr',
        component: () => import('../pages/Customer/Profile/scanQrCode.vue'),
        meta: { requiresAuth: true, roles: ['customer'] }
    },
    {
        name: 'Add Vehicle',
        path: '/customer/profile/add-vehicle',
        component: () => import('../pages/Customer/Profile/addVehicle.vue'),
        meta: { requiresAuth: true, roles: ['customer'] } // Add meta here if needed
    },
    {
        name: 'ManagerLayout',
        path: '/manager',
        meta: { requiresAuth: true, roles: ['manager'] },
        component: () => import('../layouts/ManagerLayout.vue'),
        children: [
            { name: 'ManagerParking', path: '', component: () => import('../pages/Manager/index.vue') },
            { name: 'Check-in', path: 'scan/check-in', component: () => import('../pages/Manager/Scan/checkIn.vue') },
            { name: 'Check-out', path: 'scan/check-out', component: () => import('../pages/Manager/Scan/checkOut.vue') },
            { name: 'Entry', path: 'entry', component: () => import('../pages/Manager/Entry/index.vue') },
            { name: 'Manager Profile', path: 'profile', component: () => import('../pages/Manager/Profile/index.vue') },
        ]
    }
];

export default routes;
