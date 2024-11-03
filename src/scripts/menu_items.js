const menu_items = [
    {
        name: 'Parking Zones',
        path: '/parking-zones',
        icon: 'fa-solid fa-square-parking',
        role: ['super_admin']
    },
    {
        name: 'My Parking Zone',
        path: '/parking-zone/{id}',
        icon: 'fa-solid fa-car-side',
        role: ['owner', 'manager']
    },
    {
        name: 'Settings',
        path: '/settings',
        icon: 'fa-solid fa-gear',
        role: ['super_admin']
    },
]

export default menu_items