# ARCHITECTURE.md — Smart-Parking-Admin

> Rule: update this file only when physical project structure or core architecture changes (new dirs, routing model, state layer, build pipeline). Dependency-only changes go in `AGENTS.md`; work plans go in `PLAN.md`.

## 1. Repo type & entrypoints
- Single-project Vue 3 + Vite 5 SPA (hash history, client-only; backend is external Laravel API, no migrations/models in this repo).
- Entrypoints: `index.html` (`#app` + `#route-progress` bar + `/src/main.js`) → `src/main.js` (app, router, PrimeVue, Toast, globals, lazy Echo/Maps) → `src/App.vue` (`<Toast>` + `<router-view>`) → layouts → views.
- Build: `vite.config.js` (vue + `unplugin-vue-components` PrimeVue resolver, 600KB warn limit, manualChunks `vue-vendor/primevue-vendor/fortawesome-vendor/pusher-vendor`); `tailwind.config.js` (class dark mode + `dark` variant on `.my-app-dark`, brand/primary/surface/semantic tokens, Inter font); `postcss.config.js` (tailwind + autoprefixer).

## 2. Directory tree (exhaustive, `src/` = 102 files: ~70 `.vue`, ~28 `.js`)
- `index.html`, `public/{favicon.png,vite.svg}`, `src/style.css` (Inter import, Tailwind layers, CSS vars for design tokens).
- `src/main.js` — app bootstrap (see §5).
- `src/assets/{myPreset.js (PrimeVue Noir/Aura preset),doodle.jpg,wallet.png,vue.svg}`.
- `src/boot/api.js` — sole axios instance (baseURL `VITE_API_URL`, `authToken` Bearer, 10s timeout, 401 → clear + `/`).
- `src/routes/{routes.js (route table),router.js (guard + progress bar)}`.
- `src/scripts/` — API/composable layer (no Pinia/Vuex; module-scope `ref` singletons):
  - `auth.js` (user/roles/parkingZoneId, login/logout/fetchUser), `admin.js`, `floors.js`, `map.js` (lazy Google Maps loader, `VITE_GOOGLE_MAP_API_KEY`), `parking.js`, `parkingZone.js`, `chart.js`, `notification.js`, `utils.js`, `menu_items.js` (legacy, roles use `super_admin` spelling — do not trust for guard logic).
  - `admin/{users,vehicles,vehicleTypes,wallet,walletRechargePromotions}.js` — superadmin CRUD + wallet/promo API wrappers.
  - `parkingZoneOwner/{rate,closedDays,driverInstructions,bookableVehicleTypes}.js` — owner domain wrappers (note: `rate.js:deleteInterval` history of wrong endpoint — see `BUG_REPORT.md`).
  - `customer/{booking,login}.js`, `payments/payment.js`.
- `src/components/common/` — `d-table.vue` (global `d-table`), `Modal.vue` (global `Modal`), `d-input.vue`, `d-select.vue`, `dDrawer.vue`, `PageHeader.vue`, `StatCard.vue`, `Navbar.vue`, `Login.vue`, `Register.vue`, `tooltip.vue`, `divider.vue`.
- `src/components/layouts/` — `AuthLayout.vue`, `AdminLayout.vue` (legacy), `SuperAdminLayout.vue` (`/admin` shell), `ParkingZoneAdminLayout.vue` (`/parking-zone` shell).
- `src/components/OwnerDashboard/{BookingChart,EarningsReportChart,ParkingRecordChart,TotalVehicleMonthChart}.vue` — ApexCharts wrappers.
- `src/directives/clickOutside.js` (global `v-click-outside`).
- `src/views/auth/LoginView.vue`, `src/views/ContactUsView.vue`.
- `src/views/superAdmin/` — `Dashboard.vue`, `BookingsView.vue`, `ComissionView.vue`, `ParkingZoneCommissionView.vue`, `SettlementView.vue`, `settlement/SettlementBreakdown.vue`, `SettingsView.vue`, `parkingZone/{parkingZoneView.vue,ParkingZoneManagerCreate.vue,ParkingZoneRateCreate.vue}`, `parkingZones/{ParkingZonesView,ParkingZonesCreate,ParkingZonesEdit}.vue`, `users/{UsersView,UsersCreate,UsersEdit,UsersDetails}.vue`, `vehicles/{VehiclesView,VehiclesCreate,VehiclesEdit}.vue`, `vehicleTypes/{VehicleTypesView,VehicleTypesCreate,VehicleTypesEdit}.vue`, `wallet/{WalletView,WalletCreate,WalletRechargePromotionsView,WalletRechargePromotionForm}.vue`.
- `src/views/parkingZoneOwner/` — `ParkingZoneOwnerDashboard.vue`, `AccountView.vue`, `CapacityView.vue` (route commented out), `CarwashView.vue`, `ClosedDaysView.vue`, `DriverInstructionsView.vue`, `BookableVehicleTypesView.vue`, `EarningsView.vue`, `floors/{FloorsView,FloorsCreate}.vue`, `freeParking/{FreeParkingView,FreeParkingCreate}.vue`, `managers/{ManagersView,ManagersCreate}.vue`, `rates/{RatesView,RatesCreate}.vue`, `subscriptionRates/{SubscriptionRatesView,SubscriptionRatesCreate}.vue`, `subscriptions/{SubscriptionView,SubscriptionCreate}.vue`.

## 3. Routing conventions
- Hash history (`createWebHashHistory`, `src/routes/router.js:7`). Route table in `src/routes/routes.js:1-159`, lazy `() => import()` per view.
- `/` → `LoginView` (`requiresAuth:false`). `/admin` (layout `SuperAdminLayout`, `meta:{requiresAuth:true, roles:["superadmin"]}`) children: `dashboard, users, parking-zones, vehicles, vehicle-types, wallet, wallet-promotions, bookings, settlement, commission-rate, settings`.
- `/parking-zone` (layout `ParkingZoneAdminLayout`, `roles:["owner"]`) children: `"" (dashboard), account, carwash, managers, rates, earnings, free-parking-lists, closed-days, subscriptions, subscription-rates, floors, driver-instructions, bookable-vehicle-types`.
- Guard (`router.js:53-95`): unauthenticated + `requiresAuth` → `/`; lazy `fetchUser()` if token but no user; `superadmin` bypasses all role checks; else `requiredRoles.some(...)` or redirect via `roleRedirects {owner:/parking-zone, customer:/customer, manager:/manager}`. Progress bar driven by `startProgress/finishProgress` + `#route-progress` in `index.html:13-26`.
- Auth side-effects (`src/scripts/auth.js:46-61`): `customer`/`manager` → hard `window.location.href = VITE_FRONTEND_URL` (external Flutter app); `superadmin` → `/admin`; `owner` → `/parking-zone`.

## 4. State management & data flow
- No store library. Pattern: `export default function useX(){ return {refs, fns} }` over module-scope `ref`s (e.g. `auth.js:7-10` `user/roles/parkingZoneId/loading`). Components call `useAuth()` and share the same refs. `fetchUser()` caches `GET user` and derives `parkingZoneId` from `parkingZoneOwned|parkingZoneManaged`.
- API flow: view → `scripts/*` wrapper → `$api`/imported `api` (axios) → Laravel API (`VITE_API_URL`). Toast (`primevue/toastservice`) for feedback; inconsistent catch-block handling is a known debt (see `PLAN.md`).
- Realtime: no Echo instance at boot. On `router.isReady()`, if current route `matched.requiresAuth`, dynamically `import("pusher-js")` + `import("laravel-echo")`, `broadcaster:"reverb"`, `key/wsHost/wsPort` from env, `forceTLS:false`, `transports:["ws"]` (`main.js:37-57`). Maps: `googleMapInit()` once, only for `/admin/parking-zones`, `/admin/vehicles` (`main.js:59-63`).

## 5. App bootstrap (`src/main.js:1-83`)
- Imports: primeicons css, `style.css`, ToastService, router, FontAwesome subset (`faPenToSquare, faCheck, faXmark, faPlus, faChartLine, faCalendarCheck, faCar, faTrashCan`), `d-table`, `Modal`, `clickOutside`, `api`, PrimeVue `Noir` preset, `Tooltip`.
- Globals: `v-tooltip`, `v-click-outside`, `Modal`, `d-table`, `font-awesome-icon`, `$api`. PrimeVue theme `{preset: Noir, darkModeSelector: ".my-app-dark"}`, then `ToastService`, `mount("#app")`.

## 6. Core API data models (client-observed, no local schema)
- `User {id, name, email, roles:[{name: superadmin|owner|manager|customer}], parkingZoneOwned?{id,...}, parkingZoneManaged?{id,...}}` — `scripts/auth.js:20-35`.
- `ParkingZone {id, name, commission_rate, capacity, zones/floors[], vehicleTypes[], rates[], subscriptions[], carwash, closedDays[], managers[]}` — assembled across `views/parkingZoneOwner/*` + `views/superAdmin/parkingZones/*`.
- `Rate {id, interval, price, vehicle_type}`, `Subscription{...}`, `Booking {vehicle, zone, interval, amount, platform_share, zone_share}`, `Settlement {month, totals, breakdown[]}`, `Wallet {balance, promotions[]}`, `Vehicle {plate, type}`, `Manager {user_id, zone_id}`. Exact fields live in backend; frontend wrappers in `scripts/admin/*`, `scripts/parkingZoneOwner/*`, `scripts/payments/payment.js`, `scripts/customer/booking.js`.
- Conventions: token header `Authorization: Bearer <authToken>`; JSON `Accept/Content-Type`; 401 → logout redirect; search params debounced in list views (e.g. `UsersView`, `ParkingZonesView`); pagination client-driven via `d-table`.

## 7. Design system & conventions
- Tailwind tokens (`brand/primary/surface/success/warning/danger/info`) mirror CSS vars in `style.css:7-...`; dark mode only via `.my-app-dark` ancestor. PrimeVue unstyled? No — themed via `Noir` preset. Icons: FontAwesome subset (add new icons in `main.js:8-16`); PrimeIcons css imported for PrimeVue internals.
- File conventions: views `*View.vue` per route, `*Create.vue` for forms; scripts mirror domain (`admin/users.js` ↔ `views/superAdmin/users/`); layouts own nav for their role prefix.
