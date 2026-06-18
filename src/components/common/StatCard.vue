<template>
  <div
    :class="[
      'card p-5 flex items-center gap-4 transition-all duration-250',
      'hover:shadow-card-hover hover:-translate-y-0.5',
      'cursor-default animate-slide-up',
    ]"
  >
    <div :class="['flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center', iconBgClass]">
      <i :class="[icon, 'text-xl', iconColorClass]" />
    </div>

    <div class="min-w-0 flex-1">
      <p class="text-xs font-medium text-surface-500 uppercase tracking-wider mb-0.5">
        {{ label }}
      </p>
      <div class="flex items-baseline gap-2">
        <span class="text-2xl font-bold text-surface-900 tabular-nums">
          <slot name="value">{{ value }}</slot>
        </span>
        <span
          v-if="trend !== undefined && trend !== null"
          :class="[
            'inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full',
            trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600',
          ]"
        >
          <i :class="trend >= 0 ? 'pi pi-arrow-up text-[10px]' : 'pi pi-arrow-down text-[10px]'" />
          {{ Math.abs(trend) }}%
        </span>
      </div>
      <p v-if="subtitle" class="text-xs text-surface-400 mt-0.5">{{ subtitle }}</p>
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
});

const variantMap = {
  primary: { bg: "bg-primary-50", color: "text-primary-600" },
  success: { bg: "bg-emerald-50", color: "text-emerald-600" },
  warning: { bg: "bg-amber-50", color: "text-amber-600" },
  danger: { bg: "bg-red-50", color: "text-red-600" },
  info: { bg: "bg-sky-50", color: "text-sky-600" },
};

const iconBgClass = computed(() => variantMap[props.variant]?.bg || variantMap.primary.bg);
const iconColorClass = computed(() => variantMap[props.variant]?.color || variantMap.primary.color);
</script>
