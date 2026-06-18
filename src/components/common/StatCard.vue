<template>
  <div :class="['card-interactive p-5 flex items-center gap-4', 'animate-fade-in-up', loading ? 'pointer-events-none' : '']">
    <!-- Icon -->
    <div :class="['flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300', iconBgClass]">
      <i :class="[icon, 'text-xl', iconColorClass]" />
    </div>

    <!-- Content -->
    <div class="min-w-0 flex-1">
      <!-- Label -->
      <p class="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1">
        {{ label }}
      </p>

      <!-- Skeleton or Value -->
      <div v-if="loading" class="h-7 w-20 skeleton rounded"></div>
      <div v-else class="flex items-baseline gap-2 flex-wrap">
        <span class="text-2xl font-bold text-surface-900 dark:text-surface-100 tabular-nums tracking-tight">
          <slot name="value">{{ formattedValue }}</slot>
        </span>
        <span
          v-if="trend !== undefined && trend !== null"
          :class="[
            'inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full',
            trend >= 0
              ? 'bg-success-50 dark:bg-success-400/15 text-success-700 dark:text-success-400'
              : 'bg-danger-50 dark:bg-danger-400/15 text-danger-700 dark:text-danger-400',
          ]"
        >
          <svg
            v-if="trend >= 0"
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          {{ Math.abs(trend) }}%
        </span>
      </div>

      <!-- Subtitle -->
      <p v-if="subtitle && !loading" class="text-xs text-surface-400 dark:text-surface-500 mt-1">
        {{ subtitle }}
      </p>
      <div v-else-if="loading" class="h-3.5 w-24 skeleton rounded mt-1"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: "" },
  icon: { type: String, default: "pi pi-chart-bar" },
  variant: {
    type: String,
    default: "primary",
    validator: (v) => ["primary", "success", "warning", "danger", "info"].includes(v),
  },
  trend: { type: Number, default: undefined },
  subtitle: { type: String, default: "" },
  loading: { type: Boolean, default: false },
});

const variantMap = {
  primary: { bg: "bg-primary-50 dark:bg-primary-400/15", color: "text-primary-600 dark:text-primary-400" },
  success: { bg: "bg-success-50 dark:bg-success-400/15", color: "text-success-600 dark:text-success-400" },
  warning: { bg: "bg-warning-50 dark:bg-warning-400/15", color: "text-warning-600 dark:text-warning-400" },
  danger: { bg: "bg-danger-50 dark:bg-danger-400/15", color: "text-danger-600 dark:text-danger-400" },
  info: { bg: "bg-info-50 dark:bg-info-400/15", color: "text-info-600 dark:text-info-400" },
};

const iconBgClass = computed(() => variantMap[props.variant]?.bg || variantMap.primary.bg);
const iconColorClass = computed(() => variantMap[props.variant]?.color || variantMap.primary.color);

const formattedValue = computed(() => {
  if (props.value === "" || props.value === null || props.value === undefined) return "—";
  return props.value;
});
</script>
