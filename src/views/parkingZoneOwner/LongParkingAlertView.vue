<template>
  <div class="card flex flex-col w-full gap-4">
    <Panel header="LONG PARKING ALERT" class="w-full max-w-2xl">
      <div class="flex flex-col gap-4">
        <div class="flex flex-row gap-2 border border-neutral-200 p-2 rounded-md">
          <p class="text-blue-500 font-semibold">Note:</p>
          <p>
            When a vehicle stays parked longer than this time, the driver and
            this zone's owner and managers receive a notification. Each parking
            session is alerted once, within about 5 minutes of reaching the limit.
          </p>
        </div>

        <div v-if="loading" class="flex flex-col gap-4">
          <div class="skeleton h-24 w-full"></div>
        </div>

        <div v-else class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <ToggleSwitch
              v-model="enabled"
              input-id="long-parking-enabled"
              :disabled="saving" />
            <label
              for="long-parking-enabled"
              class="text-sm font-medium text-surface-700">
              {{ enabled ? "Alert is on" : "Alert is off" }}
            </label>
          </div>

          <div v-if="enabled" class="flex flex-col gap-2">
            <p class="text-sm font-medium text-surface-700">
              Alert after the vehicle has been parked for
            </p>
            <div class="flex flex-wrap items-end gap-4">
              <div class="flex flex-col gap-1">
                <label for="long-parking-hours" class="text-xs text-gray-500">
                  Hours
                </label>
                <InputNumber
                  v-model="hours"
                  input-id="long-parking-hours"
                  :min="0"
                  :max="MAX_HOURS"
                  show-buttons
                  :disabled="saving" />
              </div>
              <div class="flex flex-col gap-1">
                <label for="long-parking-minutes" class="text-xs text-gray-500">
                  Minutes
                </label>
                <InputNumber
                  v-model="minutes"
                  input-id="long-parking-minutes"
                  :min="0"
                  :max="59"
                  show-buttons
                  :disabled="saving" />
              </div>
            </div>
            <p class="text-xs text-gray-500">
              Between 1 minute and 30 days.
            </p>
          </div>

          <Message v-if="submitError" severity="error" variant="simple">
            {{ submitError }}
          </Message>

          <div class="flex gap-2">
            <Button
              label="Save"
              icon="pi pi-save"
              :loading="saving"
              :disabled="saving"
              @click="submit" />
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
import useLongParkingAlert from "../../scripts/parkingZoneOwner/longParkingAlert";

const MAX_MINUTES = 43200;
const MAX_HOURS = MAX_MINUTES / 60;
const DEFAULT_MINUTES = 240;

const toast = useToast();
const { user } = useAuth();

const { alertMinutes, loading, saving, getLongParkingAlert, updateLongParkingAlert } =
  useLongParkingAlert();

const enabled = ref(false);
const hours = ref(0);
const minutes = ref(0);
const submitError = ref(null);

const parkingZoneId = computed(() => user.value?.parking_zone_owned?.id ?? null);

const applyMinutes = (total) => {
  enabled.value = total !== null;
  const value = total ?? DEFAULT_MINUTES;
  hours.value = Math.floor(value / 60);
  minutes.value = value % 60;
};

const errorMessage = (e, fallback) =>
  e?.response?.data?.errors?.long_parking_alert_minutes?.[0] ||
  e?.response?.data?.message ||
  fallback;

const submit = async () => {
  submitError.value = null;

  if (!parkingZoneId.value) {
    submitError.value = "Parking zone not found.";
    return;
  }

  const total = enabled.value
    ? (hours.value ?? 0) * 60 + (minutes.value ?? 0)
    : null;

  if (total !== null && (total < 1 || total > MAX_MINUTES)) {
    submitError.value = "The alert time must be between 1 minute and 30 days.";
    return;
  }

  try {
    const data = await updateLongParkingAlert(parkingZoneId.value, total);
    applyMinutes(alertMinutes.value);
    toast.add({
      severity: data?.success ? "success" : "error",
      summary: data?.success ? "Success" : "Error",
      detail: data?.message || "Long parking alert updated successfully",
      life: 3000,
    });
  } catch (e) {
    submitError.value = errorMessage(e, "Failed to update long parking alert");
    toast.add({
      severity: "error",
      summary: "Error",
      detail: submitError.value,
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
    await getLongParkingAlert(parkingZoneId.value);
    applyMinutes(alertMinutes.value);
  } catch (e) {
    submitError.value = errorMessage(e, "Failed to load long parking alert");
  }
});
</script>
