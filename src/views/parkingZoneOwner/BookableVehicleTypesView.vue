<template>
  <div class="card flex flex-col w-full gap-4">
    <Panel header="BOOKABLE VEHICLE TYPES" class="w-full max-w-2xl">
      <div class="flex flex-col gap-4">
        <div class="flex flex-row gap-2 border border-neutral-200 p-2 rounded-md">
          <p class="text-blue-500 font-semibold">Note:</p>
          <p>
            These are the vehicle types that can be booked in this parking zone.
            This setting is independent of floor-to-vehicle-type routing and
            starts empty — enable the types you want to allow here. Booking a
            vehicle type that is not enabled will be rejected.
          </p>
        </div>

        <div v-if="loading" class="flex flex-col gap-4">
          <div class="skeleton h-32 w-full"></div>
        </div>

        <div v-else class="flex flex-col gap-2">
          <p class="text-sm font-medium text-surface-700">
            Bookable vehicle types
          </p>

          <div
            v-if="vehicleTypes.length === 0"
            class="text-sm text-gray-500 border border-dashed border-neutral-300 rounded-md p-4 text-center">
            No vehicle types configured yet.
          </div>

          <div v-else class="flex flex-col gap-2">
            <div
              v-for="type in vehicleTypes"
              :key="type.id"
              class="flex items-center gap-2">
              <Checkbox
                :input-id="`bookable-type-${type.id}`"
                :model-value="enabledIds.includes(type.id)"
                :binary="true"
                :disabled="saving"
                @update:model-value="(checked) => setType(type.id, checked)" />
              <label
                :for="`bookable-type-${type.id}`"
                class="cursor-pointer">
                {{ type.name }}
              </label>
            </div>
          </div>

          <Message v-if="submitError" severity="error" variant="simple" class="mt-1">
            {{ submitError }}
          </Message>

          <div class="flex gap-2 mt-2">
            <Button
              label="Save Bookable Types"
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
import useBookableVehicleTypes from "../../scripts/parkingZoneOwner/bookableVehicleTypes";

const toast = useToast();
const { user } = useAuth();

const {
  vehicleTypes,
  enabledIds,
  loading,
  saving,
  getBookableVehicleTypes,
  updateBookableVehicleTypes,
} = useBookableVehicleTypes();

const submitError = ref(null);

const parkingZoneId = computed(() => user.value?.parking_zone_owned?.id ?? null);

const setType = (id, checked) => {
  if (checked) {
    if (!enabledIds.value.includes(id)) {
      enabledIds.value = [...enabledIds.value, id];
    }
  } else {
    enabledIds.value = enabledIds.value.filter((item) => item !== id);
  }
};

const submit = async () => {
  submitError.value = null;

  if (!parkingZoneId.value) {
    submitError.value = "Parking zone not found.";
    return;
  }

  try {
    const data = await updateBookableVehicleTypes(
      parkingZoneId.value,
      enabledIds.value,
    );
    toast.add({
      severity: data?.success ? "success" : "error",
      summary: data?.success ? "Success" : "Error",
      detail: data?.message || "Bookable vehicle types updated successfully",
      life: 3000,
    });
  } catch (e) {
    submitError.value =
      e?.response?.data?.message || "Failed to update bookable vehicle types";
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        e?.response?.data?.message || "Failed to update bookable vehicle types",
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
    await getBookableVehicleTypes(parkingZoneId.value);
  } catch (e) {
    submitError.value =
      e?.response?.data?.message || "Failed to load bookable vehicle types";
  }
});
</script>
