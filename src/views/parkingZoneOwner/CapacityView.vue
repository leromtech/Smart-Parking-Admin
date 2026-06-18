<template>
  <div class="flex flex-col gap-6">
    <PageHeader title="Capacity Management" subtitle="Configure your parking zone capacity settings" :breadcrumbs="['Parking Zone', 'Capacity']" />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Capacity Form -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-surface-900 mb-1">Capacity Configuration</h2>
        <p class="text-sm text-surface-400 mb-6">Set the total and reserved parking capacities</p>

        <!-- Note -->
        <div class="p-3 rounded-lg bg-info-50 text-info-700 text-sm border border-info-100 flex items-start gap-2.5 mb-5">
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
            class="mt-0.5 flex-shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Space occupied is calculated as Two wheeler = 1 space</span>
        </div>

        <div class="space-y-5">
          <div>
            <label for="cap-total" class="block text-sm font-medium text-surface-700 mb-1.5"> Total Capacity </label>
            <InputNumber inputId="cap-total" v-model="capacity_total" class="w-full" @blur="validateAggregate" />
          </div>

          <div>
            <label for="cap-app" class="block text-sm font-medium text-surface-700 mb-1.5"> Declared for App </label>
            <InputNumber inputId="cap-app" v-model="declared_for_app" class="w-full" @blur="onDeclaredBlur" />
          </div>

          <div>
            <label for="cap-sub" class="block text-sm font-medium text-surface-700 mb-1.5"> Reserved for Subscription </label>
            <InputNumber inputId="cap-sub" v-model="reserved_for_subscription" class="w-full" @blur="onSubscriptionBlur" />
          </div>

          <!-- Error -->
          <Message v-if="error" severity="error" variant="simple" :closable="false">
            {{ error }}
          </Message>

          <!-- Actions -->
          <div class="pt-2">
            <Button label="Save Changes" icon="pi pi-check" :disabled="!!error" @click="submit" class="w-full sm:w-auto" />
          </div>
        </div>
      </div>

      <!-- Capacity Summary Card -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-surface-900 mb-1">Capacity Summary</h2>
        <p class="text-sm text-surface-400 mb-6">At a glance view of your allocations</p>

        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
            <span class="text-sm font-medium text-surface-600">Total Capacity</span>
            <span class="text-lg font-bold text-surface-900">{{ capacity_total || 0 }}</span>
          </div>
          <div class="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
            <span class="text-sm font-medium text-surface-600">Declared for App</span>
            <span class="text-lg font-bold text-info-600">{{ declared_for_app || 0 }}</span>
          </div>
          <div class="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
            <span class="text-sm font-medium text-surface-600">Reserved Space</span>
            <span class="text-lg font-bold text-warning-600">{{ reserved_space || 0 }}</span>
          </div>
          <div class="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
            <span class="text-sm font-medium text-surface-600">Reserved for Subscription</span>
            <span class="text-lg font-bold text-success-600">{{ reserved_for_subscription || 0 }}</span>
          </div>
          <div class="border-t border-surface-100 pt-4 flex items-center justify-between">
            <span class="text-sm font-semibold text-surface-700">Remaining</span>
            <span :class="['text-lg font-bold', remainingCapacity < 0 ? 'text-danger-600' : 'text-primary-600']">
              {{ remainingCapacity }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useToast } from "primevue";
import useAuth from "../../scripts/auth";
import { useParkingZone } from "../../scripts/parkingZone";
import PageHeader from "../../components/common/PageHeader.vue";

const { user } = useAuth();
const { updateParkingZone } = useParkingZone();
const toast = useToast();

const capacity_total = ref(0);
const declared_for_app = ref(0);
const reserved_space = ref(0);
const reserved_for_subscription = ref(0);
const error = ref(null);

const remainingCapacity = computed(() => {
  return capacity_total.value - declared_for_app.value - reserved_space.value - reserved_for_subscription.value;
});

const validateAggregate = () => {
  const total = declared_for_app.value + reserved_space.value + reserved_for_subscription.value;

  if (capacity_total.value < 0) return fail("Total capacity cannot be negative");
  if (declared_for_app.value < 0) return fail("Declared for App cannot be negative");
  if (reserved_space.value < 0) return fail("Reserved for Booking cannot be negative");
  if (reserved_for_subscription.value < 0) return fail("Reserved for Subscription cannot be negative");

  if (total > capacity_total.value) {
    return fail(`Total reserved (${total}) exceeds capacity (${capacity_total.value})`);
  }

  error.value = null;
  return true;
};

const fail = (msg) => {
  error.value = msg;
  return false;
};

const onDeclaredBlur = () => {
  const max = capacity_total.value - reserved_space.value - reserved_for_subscription.value;
  if (declared_for_app.value > max) declared_for_app.value = Math.max(0, max);
  validateAggregate();
};

const onSubscriptionBlur = () => {
  const max = capacity_total.value - declared_for_app.value - reserved_space.value;
  if (reserved_for_subscription.value > max) reserved_for_subscription.value = Math.max(0, max);
  validateAggregate();
};

watch([capacity_total, declared_for_app, reserved_space, reserved_for_subscription], validateAggregate);

const submit = async () => {
  if (!validateAggregate()) return;

  const data = await updateParkingZone({
    capacity_total: capacity_total.value,
    declared_for_app: declared_for_app.value,
    reserved_space: reserved_space.value,
    reserved_for_subscription: reserved_for_subscription.value,
  });

  toast.add({
    severity: data.success ? "success" : "error",
    summary: data.success ? "Success" : "Error",
    detail: data.message,
  });
};

onMounted(() => {
  const z = user.value.parking_zone_owned;
  if (z) {
    capacity_total.value = z.capacity_total ?? 0;
    declared_for_app.value = z.declared_for_app ?? 0;
    reserved_space.value = z.reserved_space ?? 0;
    reserved_for_subscription.value = z.reserved_for_subscription ?? 0;
  }
});
</script>
