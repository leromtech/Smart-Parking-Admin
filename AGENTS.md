# AGENTS.md — Smart-Parking-Admin

> Rule: update this file only when `package.json` / `package-lock.json` (dependencies or scripts) change. Structure/architecture goes in `ARCHITECTURE.md`; roadmap goes in `PLAN.md`.

## Stack (from `package.json`)
- Vue 3.5 `<script setup>` SFCs + Vite 5 + `vue-router` 4 (hash history) — `src/main.js`, `src/routes/router.js:7`.
- UI: PrimeVue 4 (Aura `Noir` preset, dark selector `.my-app-dark`) + `primeicons` + Tailwind 3 + FontAwesome (`src/assets/myPreset.js`, `src/main.js:18-81`).
- Data/realtime: `axios` singleton (`src/boot/api.js`) + `laravel-echo`/`pusher-js` lazily loaded only on auth routes (`src/main.js:37-57`, Reverb broadcaster).
- Domain libs: `@googlemaps/js-api-loader` + `vue3-google-map` (lazy via `src/scripts/map.js`, routes `/admin/parking-zones`, `/admin/vehicles`), `apexcharts` (owner/superadmin dashboards), `@zxing/browser` + `vue-qrcode-reader` (scan flow), `vue3-colorpicker`.
- No TypeScript, no tests, no lint/format scripts today — see `PLAN.md` Phase 2 for pending `prettier`/`eslint`/`vitest` additions.

## Commands
- `npm ci` (Node 22 verified), `npm run dev`, `npm run build` (warn limit 600KB, manualChunks `vue/primevue/fontawesome/pusher` in `vite.config.js:13-24`), `npm run preview`.
- Future (not yet in `package.json`, specified in `PLAN.md`): `npm run format`, `format:check`, `lint`, `lint:fix`, `test`, `verify`. Hooks skip gracefully until installed.
- No single-test command yet; after Vitest lands: `npx vitest run <path>`.

## Env (see `.env.example`)
- Required `VITE_*`: `VITE_API_URL` (`src/boot/api.js:6`), `VITE_FRONTEND_URL` (`src/scripts/auth.js:50`), `VITE_REVERB_APP_KEY/HOST/PORT` (`src/main.js:49-51`), `VITE_GOOGLE_MAP_API_KEY` (`src/scripts/map.js:10`), `VITE_REVERB_SCHEME` (prod parity per `BUG_REPORT.md`).

## Gotchas agents miss
- Hash router + role guard: `requiresAuth` + `roles`, `superadmin` bypasses all, others redirect via `roleRedirects` to `/parking-zone|/customer|/manager` (`src/routes/router.js:46-95`). Customer/manager logins hard-redirect to `VITE_FRONTEND_URL` (`src/scripts/auth.js:46-51`).
- Auth token key is `authToken` in `localStorage`; 401 clears it and forces `/` (`src/boot/api.js:14-41`).
- Globals registered in `src/main.js:66-72`: `d-table`, `Modal`, `font-awesome-icon`, `v-tooltip`, `v-click-outside`, `$api`. Don't re-register per-file.
- PrimeVue dark mode is class-based (`.my-app-dark`), Tailwind `darkMode: "class"` + custom variant (`tailwind.config.js:221-224`).
- Backend is external (Laravel API, not in this repo). Don't invent migrations; API models are in `ARCHITECTURE.md`.
- Console hygiene: 20+ `console.log/error` remain (see `BUG_REPORT.md`); remove in new code, use Toast.
