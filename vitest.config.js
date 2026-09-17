// Vitest config (requires PLAN.md Phase 2 devDependencies: vitest, @vue/test-utils, jsdom).
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.spec.js"],
  },
});
