# PLAN.md — Smart-Parking-Admin

> Rule: update this file whenever new feature work or refactoring is planned. Always write out the detailed plan here before writing or executing code implementations.
> Context from `git log --oneline -30` (branch `qa`): recent work added bookable-vehicle-types, driver-instructions, active car-washes + subscription rejection, floor→zone rename, settlement/earnings breakdowns (platform/zone share, vehicle-type column), wallet promotions, commission-rate, ApexCharts dashboards. No tests/lint/format toolchain exists yet. `BUG_REPORT.md` lists 12 fixed issues and high-priority leftovers (console logs, bundle splitting, error handling) folded into PHASE 3-4 below.
> Constraint: do not edit existing files in this round; all required edits to existing files are specified below as copy-paste specs for a future execution pass.

## PHASE 1
- Step 1 : Foundational docs + bypassable hooks delivery (this round, new files only)
    - AGENTS.md
        - created compact stack/commands/env/gotchas with update-only-on-manifest-change rule
        - verified against `package.json`, `vite.config.js:13-24`, `src/main.js`, `src/routes/router.js:46-95`, `src/boot/api.js`
    - ARCHITECTURE.md
        - created exhaustive tree (102 files), layers, routing table from `src/routes/routes.js:1-159`, module-`ref` state pattern, client-observed API models
        - update-only-on-structure-change rule
    - .githooks/pre-commit
        - new executable hook detecting Vue/Vite staged files, prettier `--write` + `eslint --fix` with graceful skip when tools absent, re-stage via `git add`, bypass via `SMART_PARKING_SKIP_HOOKS=1` or `--no-verify`
    - .githooks/pre-push
        - new executable hook running `lint --if-present`, `vitest run --if-present`, `npm run build` gate, all bypassable same as pre-commit
    - opencode.json
        - new workspace defaults wiring `AGENTS.md`/`ARCHITECTURE.md`/`PLAN.md` triggers and hook enforcement
    - .env.example
        - new file documenting `VITE_API_URL`, `VITE_FRONTEND_URL`, `VITE_REVERB_APP_KEY/HOST/PORT/SCHEME`, `VITE_GOOGLE_MAP_API_KEY`

## PHASE 2
- Step 2 : Add formatter/linter/test toolchain (spec only — requires editing existing `package.json`, do not execute without approval)
    - package.json
        - add `devDependencies` spec: `prettier ^3.3`, `eslint ^9.12`, `eslint-plugin-vue ^9.28`, `eslint-config-prettier ^9.1`, `vitest ^2.1`, `@vue/test-utils ^2.4`, `jsdom ^24.1`
        - add `scripts` spec: `"format": "prettier --write ."`, `"format:check": "prettier --check ."`, `"lint": "eslint . --ext .js,.vue"`, `"lint:fix": "eslint . --ext .js,.vue --fix"`, `"test": "vitest run"`, `"test:watch": "vitest"`, `"verify": "npm run format:check && npm run lint && npm run build"`
        - run `npm install` then `npm run verify` to confirm green
    - .prettierrc
        - created (singleQuote, printWidth 100, vueIndentScriptAndStyle); pending `npm install` of `prettier` to take effect
    - eslint.config.js
        - created flat config (`vue3-recommended` + `eslint-config-prettier`, ignores `dist/`, warns `no-console`); pending `npm install` of `eslint` + `eslint-plugin-vue`
    - vitest.config.js
        - created (`jsdom`, `include: src/**/*.spec.js`); pending `npm install` of `vitest` + `@vue/test-utils` + `jsdom`
    - src/scripts/utils.spec.js
        - new smoke spec proving Vitest wiring (pure-function assertions only, no network)

## PHASE 3
- Step 3 : Console hygiene + consistent error feedback (BUG_REPORT short-term)
    - src/boot/api.js
        - remove `console.error` in request interceptor `23`
        - keep 401 clearing + redirect `34-38`, surface other errors to Toast via caller
    - src/routes/router.js
        - replace `console.error` in `fetchUser` catch `68` with silent redirect to `/` plus optional Toast
        - audit `startProgress`/`finishProgress` for missing `#route-progress` null-guard (already guarded, keep)
    - src/scripts/parkingZoneOwner/rate.js
        - remove `console.log` at `59` and add Toast success/error around rate-interval mutations
    - src/views/superAdmin/ParkingZone/index.vue
        - remove `console.log` at `371,440`, replace with Toast or delete
    - src/views/superAdmin/Wallet/index.vue
        - remove `console.log` at `197`, verify wallet totals still render
    - src/pages/scan.vue
        - remove `console.log` at `27` (or gate behind `import.meta.env.DEV`)
- Step 4 : Null-guards + import-path consistency (BUG_REPORT medium)
    - src/views/parkingZoneOwner/rates/index.vue
        - guard `parking_zone.value?.id` before `useCreateRate` call at `245` to avoid `undefined` id
        - standardize relative vs `@/` imports across edited views
    - src/scripts/auth.js
        - remove unused `import { data } from "autoprefixer"` at `5`
        - harden `fetchUser` against missing `roles` array before `.map`

## PHASE 4
- Step 5 : Resilience + performance + test expansion (BUG_REPORT medium/long-term)
    - src/main.js
        - add global `app.config.errorHandler` routing to Toast + optional error boundary component
        - confirm lazy Echo/Maps gates at `37-63` still skip on public `/` route after change
    - vite.config.js
        - extend existing `manualChunks` at `13-24` with lazy-route splitting for `superAdmin/*` heavy views if chunks still exceed 600KB
        - verify `npm run build` chunk report shrinks vs baseline
    - src/components/common/d-table.vue
        - evaluate virtual scroll for large settlement/booking tables, add pagination defaults if missing
    - src/views/superAdmin/SettlementView.vue
        - add Vitest specs for filter/month-selection logic and platform/zone share totals
    - src/views/parkingZoneOwner/EarningsView.vue
        - mirror settlement specs for earnings breakdown columns
