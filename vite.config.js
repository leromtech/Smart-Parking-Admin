import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
  ],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          "vue-vendor": ["vue", "vue-router"],
          "primevue-vendor": ["primevue"],
          "fortawesome-vendor": ["@fortawesome/fontawesome-svg-core", "@fortawesome/vue-fontawesome"],
          "pusher-vendor": ["pusher-js", "laravel-echo"],
        },
      },
    },
  },
});
