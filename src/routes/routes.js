const routes = [
    { name: 'Welcome', path: '/', meta: { requiresAuth: false }, component: () => import('../pages/Welcome.vue') },
    { 
        name: 'AuthLayout', 
        path: '/auth', 
        meta: { requiresAuth: true, roles: ['superadmin', 'owner', 'manager'] },
        component: () => import('../layouts/AuthLayout.vue'),
        children: [
            { name: 'Users', path: 'users', component: () => import('../pages/Auth/Users/index.vue') },
            { name: 'Parking Zones', path: 'parking-zones', component: () => import('../pages/Auth/ParkingZones/index.vue') },
            { name: 'Vehicles', path: 'vehicles', component: () => import('../pages/Auth/Vehicles/index.vue') },
            { name: 'Vehicle Types', path: 'vehicle-types', component: () => import('../pages/Auth/VehicleTypes/index.vue') },
            { name: 'Parking Zone', path: 'parking-zone', component: () => import('../pages/Auth/ParkingZone/index.vue') }
        ]
    },
    {
        name: 'CustomerLayout',
        path: '/customer',
        meta: { requiresAuth: true, roles: ['customer'] },
        component: () => import('../layouts/CustomerLayout.vue'),
        children: [
          { name: 'Parking', path: 'parking', component: () => import('../pages/Customer/Parking/index.vue') },
          { name: 'Wallet', path: 'wallet', component: () => import('../pages/Customer/Wallet/index.vue') },
          { name: 'Profile', path: 'profile', component: () => import('../pages/Customer/Profile/index.vue') },
          { name: 'Add Vehicle', path: 'profile/add-vehicle', component: () => import('../pages/Customer/Profile/addVehicle.vue') },
          { name: 'Customer Scan Qr', path: 'profile/scan-qr', component: () => import('../pages/Customer/Profile/scanQrCode.vue') },
        ]
      }
      
];

export default routes;
