<template>
  <div class="card flex flex-row w-full gap-4">
    <Panel header="CAPACITY" class="w-[50%]">
      <div
        class="flex flex-row gap-2 border border-neutral-200 p-2 rounded-md mb-2">
        <p class="text-blue-500 font-semibold">Note:</p>
        <p>Space occupied is calculated as Two wheeler = 1 space</p>
      </div>

      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label>Total Capacity</label>
          <InputNumber v-model="capacity_total" @blur="validateAggregate" />
        </div>

        <div class="flex flex-col gap-2">
          <label>Declared for App</label>
          <InputNumber v-model="declared_for_app" @blur="onDeclaredBlur" />
        </div>

        <div class="flex flex-col gap-2">
          <label>Reserved for Booking</label>
          <InputNumber v-model="reserved_space" @blur="onReservedBlur" />
        </div>

        <div class="flex flex-col gap-2">
          <label>Reserved for Subscription</label>
          <InputNumber
            v-model="reserved_for_subscription"
            @blur="onSubscriptionBlur" />
        </div>

        <Button @click="submit" :disabled="!!error">Save</Button>
        <Message v-if="error" severity="error" variant="simple">{{
          error
        }}</Message>
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useToast } from "primevue";
import useAuth from "../../scripts/auth";
import { useParkingZone } from "../../scripts/parkingZone";

const { user } = useAuth();
const { updateParkingZone } = useParkingZone();
const toast = useToast();

const capacity_total = ref(0);
const declared_for_app = ref(0);
const reserved_space = ref(0);
const reserved_for_subscription = ref(0);
const error = ref(null);

/* ===== Canonical Aggregate Validator ===== */
const validateAggregate = () => {
  const total =
    declared_for_app.value +
    reserved_space.value +
    reserved_for_subscription.value;

  if (capacity_total.value < 0)
    return fail("Total capacity cannot be negative");
  if (declared_for_app.value < 0)
    return fail("Declared for App cannot be negative");
  if (reserved_space.value < 0)
    return fail("Reserved for Booking cannot be negative");
  if (reserved_for_subscription.value < 0)
    return fail("Reserved for Subscription cannot be negative");

  if (total > capacity_total.value) {
    return fail(
      `Total reserved (${total}) exceeds capacity (${capacity_total.value})`
    );
  }

  error.value = null;
  return true;
};

const fail = (msg) => {
  error.value = msg;
  return false;
};

/* ===== Smart Field Guards ===== */
const onDeclaredBlur = () => {
  const max =
    capacity_total.value -
    reserved_space.value -
    reserved_for_subscription.value;
  if (declared_for_app.value > max) declared_for_app.value = Math.max(0, max);
  validateAggregate();
};

const onReservedBlur = () => {
  const max =
    capacity_total.value -
    declared_for_app.value -
    reserved_for_subscription.value;
  if (reserved_space.value > max) reserved_space.value = Math.max(0, max);
  validateAggregate();
};

const onSubscriptionBlur = () => {
  const max =
    capacity_total.value - declared_for_app.value - reserved_space.value;
  if (reserved_for_subscription.value > max)
    reserved_for_subscription.value = Math.max(0, max);
  validateAggregate();
};

/* ===== Real-time Enforcement ===== */
watch(
  [capacity_total, declared_for_app, reserved_space, reserved_for_subscription],
  validateAggregate
);

/* ===== Submit ===== */
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

/* ===== Initial Load ===== */
onMounted(() => {
  const z = user.value.parking_zone_owned;
  capacity_total.value = z.capacity_total;
  declared_for_app.value = z.declared_for_app;
  reserved_space.value = z.reserved_space;
  reserved_for_subscription.value = z.reserved_for_subscription;
});
</script>
