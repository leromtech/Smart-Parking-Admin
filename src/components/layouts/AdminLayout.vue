<template>
  <div class="flex flex-col h-screen bg-surface-50">
    <!-- Top Navigation Bar -->
    <header class="header-bar text-white shadow-lg z-20 flex-shrink-0">
      <div class="flex items-center justify-between px-4 lg:px-6 py-3">
        <div class="flex items-center gap-3">
          <!-- Mobile sidebar toggle -->
          <Button icon="pi pi-bars" severity="secondary" text class="text-white lg:hidden" @click="sidebarOpen = !sidebarOpen" />

          <!-- Car SVG Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-white flex-shrink-0"
          >
            <path d="M5 17h14v-5H5v5z" />
            <path d="M7 12L8 8h8l1 4" />
            <circle cx="7.5" cy="17.5" r="1.5" fill="currentColor" />
            <circle cx="16.5" cy="17.5" r="1.5" fill="currentColor" />
            <rect x="6" y="12" width="3" height="3" stroke="none" fill="white" opacity="0.3" />
            <rect x="15" y="12" width="3" height="3" stroke="none" fill="white" opacity="0.3" />
            <rect x="5" y="14" width="1" height="1" fill="white" />
            <rect x="18" y="14" width="1" height="1" fill="white" />
          </svg>

          <div class="min-w-0">
            <h1 class="font-bold text-lg lg:text-xl truncate">{{ title }}</h1>
            <span class="text-xs lg:text-sm text-primary-200 block">{{ subtitle }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Button
            :icon="darkModeIcon"
            severity="secondary"
            text
            rounded
            class="text-white hover:bg-white/10"
            v-tooltip.bottom="darkModeIcon === 'pi pi-sun' ? 'Dark mode' : 'Light mode'"
            @click="toggleDarkMode"
          />
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden relative">
      <!-- Mobile overlay -->
      <div v-if="sidebarOpen" class="fixed inset-0 bg-black/40 z-30 lg:hidden" @click="sidebarOpen = false" />

      <!-- Sidebar -->
      <aside
        :class="[
          'flex flex-col bg-white shadow-sidebar z-40 transition-transform duration-300 ease-in-out flex-shrink-0',
          'fixed lg:static inset-y-0 left-0 w-64',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
      >
        <div class="p-4 border-b border-surface-100 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-surface-500 uppercase tracking-wider">Navigation</h2>
          <Button icon="pi pi-times" severity="secondary" text rounded size="small" class="lg:hidden" @click="sidebarOpen = false" />
        </div>

        <nav class="flex-1 overflow-y-auto py-2 px-2">
          <Menu :model="menuItems" class="border-none w-full">
            <template #submenulabel="{ item }">
              <span class="text-primary-700 font-bold text-xs uppercase tracking-wider px-2">
                {{ item.label }}
              </span>
            </template>
            <template #item="{ item, props }">
              <router-link v-if="item.route" v-slot="{ href, navigate, isActive }" :to="item.route" custom>
                <a
                  v-ripple
                  :href="href"
                  v-bind="props.action"
                  @click="navigate"
                  :class="[
                    'flex items-center px-3 py-2.5 my-0.5 rounded-lg transition-all duration-200 text-sm',
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md'
                      : 'text-surface-700 hover:bg-primary-50 hover:text-primary-700',
                  ]"
                >
                  <span :class="[item.icon, isActive ? 'text-white' : 'text-primary-600']" />
                  <span class="ml-3 font-medium">{{ item.label }}</span>
                </a>
              </router-link>
            </template>
          </Menu>
        </nav>

        <!-- Logout -->
        <div class="p-3 border-t border-surface-100 bg-surface-50">
          <Button
            severity="danger"
            text
            icon="pi pi-sign-out"
            label="Logout"
            class="w-full justify-start font-medium text-sm"
            @click="$emit('logout')"
          />
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto bg-surface-50">
        <div class="p-4 lg:p-6 animate-fade-in">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import "primeicons/primeicons.css";
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  menuItems: { type: Array, required: true },
});

defineEmits(["logout"]);

const sidebarOpen = ref(false);
const darkModeIcon = ref("pi pi-moon");
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024;
};

const toggleDarkMode = () => {
  document.documentElement.classList.toggle("my-app-dark");
  const isDark = document.documentElement.classList.contains("my-app-dark");
  darkModeIcon.value = isDark ? "pi pi-sun" : "pi pi-moon";
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
  // Init dark mode icon
  darkModeIcon.value = document.documentElement.classList.contains("my-app-dark") ? "pi pi-sun" : "pi pi-moon";
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>
