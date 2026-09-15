import { ref } from "vue";
import api from "../../boot/api";

const vehicleTypes = ref([]);
const enabledIds = ref([]);
const loading = ref(false);
const saving = ref(false);

/**
 * Fetch all vehicle types plus the currently bookable (enabled) ids for a parking zone.
 */
const getBookableVehicleTypes = async (parkingZoneId) => {
  try {
    loading.value = true;
    const { data } = await api.get(
      `parking-zones/${parkingZoneId}/bookable-vehicle-types`,
    );
    if (data?.success) {
      vehicleTypes.value = data.data?.vehicle_types ?? [];

      const ids = data.data?.bookable_vehicle_type_ids;
      if (Array.isArray(ids)) {
        enabledIds.value = ids;
      } else if (Array.isArray(vehicleTypes.value)) {
        // Fallback: derive from a per-type `bookable` flag if present.
        enabledIds.value = vehicleTypes.value
          .filter((type) => type?.bookable === true)
          .map((type) => type.id);
      }
      return data.data;
    }
    return data;
  } catch (error) {
    console.error("Error fetching bookable vehicle types:", error);
    throw error;
  } finally {
    loading.value = false;
  }
};

/**
 * Set/update the bookable vehicle types. Pass an array of vehicle type ids.
 */
const updateBookableVehicleTypes = async (parkingZoneId, vehicleTypeIds) => {
  try {
    saving.value = true;
    const { data } = await api.put(
      `parking-zones/${parkingZoneId}/bookable-vehicle-types`,
      {
        vehicle_type_ids: vehicleTypeIds ?? [],
      },
    );
    if (data?.success) {
      enabledIds.value = vehicleTypeIds ?? [];
    }
    return data;
  } catch (error) {
    console.error("Error updating bookable vehicle types:", error);
    throw error;
  } finally {
    saving.value = false;
  }
};

export default function useBookableVehicleTypes() {
  return {
    vehicleTypes,
    enabledIds,
    loading,
    saving,
    getBookableVehicleTypes,
    updateBookableVehicleTypes,
  };
}
