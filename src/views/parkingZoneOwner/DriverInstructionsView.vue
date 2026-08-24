<template>
  <div class="card flex flex-col w-full gap-4">
    <Panel header="DRIVER INSTRUCTIONS" class="w-full max-w-2xl">
      <div class="flex flex-col gap-4">
        <div class="flex flex-row gap-2 border border-neutral-200 p-2 rounded-md">
          <p class="text-blue-500 font-semibold">Note:</p>
          <p>
            These instructions are pushed to the driver as a pop-up notification
            whenever a car is parked, via either the customer self check-in or the
            manager/owner scan.
          </p>
        </div>

        <div v-if="loading" class="flex flex-col gap-4">
          <div class="skeleton h-32 w-full"></div>
        </div>

        <div v-else class="flex flex-col gap-2">
          <label
            for="driver-instructions"
            class="text-sm font-medium text-surface-700">
            Instructions
          </label>

          <Textarea
            id="driver-instructions"
            v-model="driverInstructions"
            rows="8"
            :maxlength="MAX_LENGTH"
            :placeholder="placeholder"
            :disabled="saving" />

          <div class="flex items-center justify-between">
            <p class="text-xs text-gray-500">
              Leave empty and save to clear the instructions.
            </p>
            <p class="text-xs text-gray-500">
              {{ driverInstructions.length }} / {{ MAX_LENGTH }}
            </p>
          </div>

          <Message v-if="submitError" severity="error" variant="simple" class="mt-1">
            {{ submitError }}
          </Message>

          <div class="flex gap-2 mt-2">
            <Button
              label="Save Instructions"
              icon="pi pi-save"
              :loading="saving"
              :disabled="saving"
              @click="submit" />
            <Button
              label="Clear"
              icon="pi pi-trash"
              severity="secondary"
              outlined
              :disabled="saving || !driverInstructions"
              @click="clearInstructions" />
          </div>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import useAuth from "../../scripts/auth";
import { useToast } from "primevue";
import useDriverInstructions from "../../scripts/parkingZoneOwner/driverInstructions";

const MAX_LENGTH = 5000;

const placeholder =
  "1. Do not lock steering wheels.\n2. Leave the handbrake on.\n3. Keep windows rolled up.";

const toast = useToast();
const { user } = useAuth();

const {
  driverInstructions,
  loading,
  saving,
  getDriverInstructions,
  updateDriverInstructions,
} = useDriverInstructions();

const submitError = ref(null);

const parkingZoneId = computed(() => user.value?.parking_zone_owned?.id ?? null);

const submit = async () => {
  submitError.value = null;

  if (!parkingZoneId.value) {
    submitError.value = "Parking zone not found.";
    return;
  }

  if (driverInstructions.value.length > MAX_LENGTH) {
    submitError.value = `Driver instructions must not exceed ${MAX_LENGTH} characters.`;
    return;
  }

  try {
    const data = await updateDriverInstructions(
      parkingZoneId.value,
      driverInstructions.value,
    );
    toast.add({
      severity: data?.success ? "success" : "error",
      summary: data?.success ? "Success" : "Error",
      detail: data?.message || "Driver instructions updated successfully",
      life: 3000,
    });
  } catch (e) {
    submitError.value =
      e?.response?.data?.message || "Failed to update driver instructions";
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        e?.response?.data?.message || "Failed to update driver instructions",
      life: 3000,
    });
  }
};

const clearInstructions = async () => {
  submitError.value = null;

  if (!parkingZoneId.value) {
    submitError.value = "Parking zone not found.";
    return;
  }

  try {
    const data = await updateDriverInstructions(parkingZoneId.value, null);
    toast.add({
      severity: data?.success ? "success" : "error",
      summary: data?.success ? "Success" : "Error",
      detail: data?.message || "Driver instructions cleared",
      life: 3000,
    });
  } catch (e) {
    submitError.value =
      e?.response?.data?.message || "Failed to clear driver instructions";
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        e?.response?.data?.message || "Failed to clear driver instructions",
      life: 3000,
    });
  }
};

onMounted(async () => {
  if (!parkingZoneId.value) {
    submitError.value = "Parking zone not found.";
    return;
  }

  try {
    await getDriverInstructions(parkingZoneId.value);
  } catch (e) {
    submitError.value =
      e?.response?.data?.message || "Failed to load driver instructions";
  }
});
</script>
