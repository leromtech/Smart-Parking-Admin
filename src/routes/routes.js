const routes = [
    { name: 'Welcome', path: '/', meta: { requiresAuth: false }, component: () => import('../pages/Welcome.vue') },
    { name: 'RootScan', path: '/root-scan', meta: { requiresAuth: false }, component: () => import('../pages/scan.vue') },
    { 
        name: 'AuthLayout', 
        path: '/auth', 
        meta: { requiresAuth: true, roles: ['superadmin', 'owner'] },
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
          { name: 'Home', path: '', component: () => import('../pages/Customer/Home/index.vue') },
          { name: 'Parking', path: 'parking', component: () => import('../pages/Customer/Parking/index.vue') },
          { name: 'Wallet', path: 'wallet', component: () => import('../pages/Customer/Wallet/index.vue') },
          { name: 'Profile', path: 'profile', component: () => import('../pages/Customer/Profile/index.vue') },
          { name: 'Park', path: '/park', component: () => import('../pages/Customer/Parking/create.vue') },
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
            { name: 'Parking', path: '', component: () => import('../pages/Manager/index.vue') },
            { name: 'Scan', path: 'scan', component: () => import('../pages/Manager/Scan/index.vue') },
            { name: 'Entry', path: 'entry', component: () => import('../pages/Manager/Entry/index.vue') },
        ]
    }
      
];

export default routes;
