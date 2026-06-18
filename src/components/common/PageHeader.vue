<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div class="flex-1 min-w-0">
      <!-- Breadcrumb -->
      <nav v-if="breadcrumbs?.length" class="flex items-center gap-1.5 mb-1.5" aria-label="Breadcrumb">
        <template v-for="(crumb, idx) in breadcrumbs" :key="idx">
          <span class="text-xs" :class="idx === breadcrumbs.length - 1 ? 'text-surface-600 font-medium' : 'text-surface-400'">
            {{ crumb }}
          </span>
          <svg
            v-if="idx < breadcrumbs.length - 1"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-surface-300 flex-shrink-0"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </template>
      </nav>

      <!-- Title -->
      <h1 class="text-2xl font-bold text-surface-900 tracking-tight">
        {{ title }}
      </h1>

      <!-- Subtitle -->
      <p v-if="subtitle" class="text-sm text-surface-500 mt-1">
        {{ subtitle }}
      </p>
    </div>

    <!-- Action slot (buttons, filters, etc.) -->
    <div v-if="$slots.actions" class="flex items-center gap-3 flex-shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  breadcrumbs: { type: Array, default: undefined },
});
</script>
