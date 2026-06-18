<template>
  <div class="flex flex-col h-screen bg-surface-50 dark:bg-surface-900 overflow-hidden">
    <!-- ===== Skip to Content (Accessibility) ===== -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md focus:shadow-lg"
    >
      Skip to content
    </a>

    <!-- ===== Top Header Bar ===== -->
    <header class="header-bar text-white shadow-lg z-30 flex-shrink-0" role="banner">
      <div class="flex items-center justify-between px-4 lg:px-6 h-15">
        <!-- Left: Toggle + Brand -->
        <div class="flex items-center gap-3">
          <!-- Mobile menu toggle -->
          <button
            class="lg:hidden p-2 -ml-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
            aria-label="Open sidebar menu"
            @click="sidebarOpen = true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>

          <!-- Desktop sidebar collapse -->
          <button
            class="hidden lg:flex p-2 -ml-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
            :aria-label="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
            @click="sidebarCollapsed = !sidebarCollapsed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>

          <!-- Brand Vehicle Icon + Title -->
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 17h14v-5H5v5z" />
                <path d="M7 12L8 8h8l1 4" />
                <circle cx="7.5" cy="17.5" r="1.5" fill="currentColor" />
                <circle cx="16.5" cy="17.5" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div class="min-w-0 hidden sm:block">
              <h1 class="font-bold text-base lg:text-lg truncate tracking-tight">
                {{ title }}
              </h1>
              <p class="text-xs text-primary-200/90 truncate">{{ subtitle }}</p>
            </div>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-1.5">
          <!-- Dark Mode Toggle -->
          <button
            class="p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleDarkMode"
          >
            <svg
              v-if="isDark"
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="animate-scale-in"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="animate-scale-in"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          <!-- Notification Bell -->
          <div class="relative">
            <button
              class="p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
              aria-label="Notifications"
              @click="notificationOpen = !notificationOpen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span
                v-if="notificationCount > 0"
                class="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4.5 h-4.5 text-2xs font-bold bg-danger-500 text-white rounded-full ring-2 ring-white/20"
              >
                {{ notificationCount > 9 ? "9+" : notificationCount }}
              </span>
            </button>
          </div>

          <!-- User Avatar + Dropdown -->
          <div class="relative ml-1">
            <button
              class="flex items-center gap-2 p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
              aria-label="User menu"
              aria-haspopup="true"
              :aria-expanded="userMenuOpen"
              @click="userMenuOpen = !userMenuOpen"
            >
              <div class="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center text-sm font-bold text-primary-900 flex-shrink-0">
                {{ userInitials }}
              </div>
              <span class="hidden md:block text-sm font-medium truncate max-w-[120px]">
                {{ userName }}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="hidden md:block transition-transform duration-200"
                :class="{ 'rotate-180': userMenuOpen }"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <!-- Dropdown -->
            <Transition name="dropdown">
              <div
                v-if="userMenuOpen"
                v-click-outside="closeUserMenu"
                class="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-surface-800 rounded-xl shadow-dropdown border border-surface-100 dark:border-surface-700 py-1.5 z-50"
                role="menu"
                aria-label="User menu"
              >
                <div class="px-4 py-2.5 border-b border-surface-100 dark:border-surface-700">
                  <p class="text-sm font-semibold text-surface-800 dark:text-surface-200">{{ userName }}</p>
                  <p class="text-xs text-surface-400 dark:text-surface-500">{{ userRole }}</p>
                </div>
                <button
                  role="menuitem"
                  class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors duration-150"
                  @click="userMenuOpen = false"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile
                </button>
                <button
                  role="menuitem"
                  class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors duration-150"
                  @click="userMenuOpen = false"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path
                      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                    />
                  </svg>
                  Settings
                </button>
                <div class="border-t border-surface-100 dark:border-surface-700 my-1"></div>
                <button
                  role="menuitem"
                  class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-400/15 transition-colors duration-150"
                  @click="handleLogout"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>

    <!-- ===== Body: Sidebar + Content ===== -->
    <div class="flex flex-1 overflow-hidden relative">
      <!-- Mobile Overlay -->
      <Transition name="overlay">
        <div v-if="sidebarOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" aria-hidden="true" @click="sidebarOpen = false" />
      </Transition>

      <!-- Sidebar -->
      <aside
        :class="[
          'flex flex-col bg-white dark:bg-surface-800 shadow-sidebar dark:shadow-sidebar-dark z-50 flex-shrink-0',
          'fixed lg:static inset-y-0 left-0',
          'transition-all duration-300 ease-out-expo',
          sidebarCollapsed ? 'w-[--sidebar-collapsed-width]' : 'w-[--sidebar-width]',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
        role="navigation"
        aria-label="Sidebar navigation"
      >
        <!-- Sidebar Header -->
        <div
          class="flex items-center h-15 px-4 border-b border-surface-100 dark:border-surface-700 flex-shrink-0 gap-2"
          :class="sidebarCollapsed ? 'justify-center' : 'justify-between'"
        >
          <h2 v-if="!sidebarCollapsed" class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">Navigation</h2>
          <button
            v-if="sidebarOpen"
            class="lg:hidden p-1.5 rounded-md text-surface-400 dark:text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
            aria-label="Close sidebar"
            @click="sidebarOpen = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 overflow-y-auto py-3 px-2.5" aria-label="Main navigation">
          <template v-for="(item, idx) in menuItems" :key="idx">
            <!-- Section label -->
            <div
              v-if="item.items && !sidebarCollapsed"
              class="text-2xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-wider px-3 pt-3 pb-1.5 first:pt-0"
            >
              {{ item.label }}
            </div>
            <div v-else-if="item.items && sidebarCollapsed" class="border-t border-surface-100 dark:border-surface-700 my-2 mx-2"></div>

            <!-- Menu items -->
            <template v-if="item.items">
              <template v-for="(child, childIdx) in item.items" :key="childIdx">
                <router-link v-if="child.route" :to="child.route" v-slot="{ isActive, navigate, href }" custom>
                  <a
                    :href="href"
                    :class="[
                      'flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-lg transition-all duration-200 text-sm font-medium group',
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-400/15 text-primary-700 dark:text-primary-400 border-l-3 border-l-primary-600 shadow-sm'
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700/50 hover:text-surface-800 dark:hover:text-surface-200 border-l-3 border-l-transparent',
                      sidebarCollapsed ? 'justify-center px-2' : '',
                    ]"
                    :title="sidebarCollapsed ? child.label : ''"
                    :aria-current="isActive ? 'page' : undefined"
                    @click="
                      navigate;
                      onNavClick();
                    "
                  >
                    <span
                      :class="[
                        child.icon,
                        'text-lg flex-shrink-0 transition-colors',
                        isActive
                          ? 'text-primary-600'
                          : 'text-surface-400 dark:text-surface-500 group-hover:text-surface-600 dark:group-hover:text-surface-300',
                      ]"
                    />
                    <span v-if="!sidebarCollapsed" class="truncate">{{ child.label }}</span>
                  </a>
                </router-link>
              </template>
            </template>

            <!-- Direct menu item (no group) -->
            <router-link v-else-if="item.route" :to="item.route" v-slot="{ isActive, navigate, href }" custom>
              <a
                :href="href"
                :class="[
                  'flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-lg transition-all duration-200 text-sm font-medium group',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-400/15 text-primary-700 dark:text-primary-400 border-l-3 border-l-primary-600 shadow-sm'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700/50 hover:text-surface-800 dark:hover:text-surface-200 border-l-3 border-l-transparent',
                  sidebarCollapsed ? 'justify-center px-2' : '',
                ]"
                :title="sidebarCollapsed ? item.label : ''"
                :aria-current="isActive ? 'page' : undefined"
                @click="
                  navigate;
                  onNavClick();
                "
              >
                <span
                  :class="[
                    item.icon,
                    'text-lg flex-shrink-0 transition-colors',
                    isActive
                      ? 'text-primary-600'
                      : 'text-surface-400 dark:text-surface-500 group-hover:text-surface-600 dark:group-hover:text-surface-300',
                  ]"
                />
                <span v-if="!sidebarCollapsed" class="truncate">{{ item.label }}</span>
              </a>
            </router-link>
          </template>
        </nav>

        <!-- Sidebar Footer: Logout -->
        <div class="flex-shrink-0 border-t border-surface-100 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/50 p-3">
          <button
            :class="[
              'flex items-center gap-3 w-full rounded-lg transition-all duration-200 text-sm font-medium text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-400/15',
              sidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5',
            ]"
            :title="sidebarCollapsed ? 'Sign Out' : ''"
            @click="handleLogout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span v-if="!sidebarCollapsed">Sign Out</span>
          </button>
        </div>
      </aside>

      <!-- ===== Main Content ===== -->
      <main id="main-content" class="flex-1 overflow-auto bg-surface-50 dark:bg-surface-900" role="main">
        <div class="p-4 lg:p-6 animate-fade-in-up">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import "primeicons/primeicons.css";
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  menuItems: { type: Array, required: true },
});

const emit = defineEmits(["logout"]);

// ===== State =====
const sidebarOpen = ref(false);
const sidebarCollapsed = ref(false);
const isDark = ref(false);
const userMenuOpen = ref(false);
const notificationOpen = ref(false);
const notificationCount = ref(0);
const isMobile = ref(false);

// ===== Computed User Info =====
const userInitials = computed(() => {
  const name = props.title || "Admin";
  const parts = name.split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
});

const userName = computed(() => props.title || "Administrator");
const userRole = computed(() => props.subtitle || "Admin");

// ===== Methods =====
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024;
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = false;
  }
};

const toggleDarkMode = () => {
  document.documentElement.classList.toggle("my-app-dark");
  isDark.value = document.documentElement.classList.contains("my-app-dark");
  try {
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
  } catch (e) {
    /* noop */
  }
};

const closeUserMenu = () => {
  userMenuOpen.value = false;
};

const handleLogout = () => {
  userMenuOpen.value = false;
  emit("logout");
};

const onNavClick = () => {
  if (isMobile.value) {
    sidebarOpen.value = false;
  }
};

// ===== Lifecycle =====
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);

  // Dark mode init
  isDark.value = document.documentElement.classList.contains("my-app-dark");
  if (!isDark.value) {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") toggleDarkMode();
    } catch (e) {
      /* noop */
    }
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<style scoped>
/* Dropdown transition */
.dropdown-enter-active {
  animation: scale-in 0.15s ease-out;
}
.dropdown-leave-active {
  animation: scale-in 0.1s ease-in reverse;
}

/* Overlay transition */
.overlay-enter-active {
  animation: fade-in 0.2s ease-out;
}
.overlay-leave-active {
  animation: fade-in 0.15s ease-in reverse;
}

/* Custom border-l width */
.border-l-3 {
  border-left-width: 3px;
}
</style>
