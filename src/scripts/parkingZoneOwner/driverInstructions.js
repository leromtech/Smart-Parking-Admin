import { ref } from "vue";
import api from "../../boot/api";

const driverInstructions = ref("");
const loading = ref(false);
const saving = ref(false);

/**
 * Fetch the currently configured driver instructions for a parking zone.
 */
const getDriverInstructions = async (parkingZoneId) => {
  try {
    loading.value = true;
    const { data } = await api.get(
      `parking-zones/${parkingZoneId}/driver-instructions`,
    );
    if (data?.success) {
      driverInstructions.value = data.data?.driver_instructions ?? "";
      return data.data;
    }
    return data;
  } catch (error) {
    console.error("Error fetching driver instructions:", error);
    throw error;
  } finally {
    loading.value = false;
  }
};

/**
 * Set/update driver instructions. Pass null (or an empty string) to clear.
 */
const updateDriverInstructions = async (parkingZoneId, instructions) => {
  try {
    saving.value = true;
    const { data } = await api.put(
      `parking-zones/${parkingZoneId}/driver-instructions`,
      {
        driver_instructions: instructions || null,
      },
    );
    if (data?.success) {
      driverInstructions.value = data.data?.driver_instructions ?? "";
    }
    return data;
  } catch (error) {
    console.error("Error updating driver instructions:", error);
    throw error;
  } finally {
    saving.value = false;
  }
};

export default function useDriverInstructions() {
  return {
    driverInstructions,
    loading,
    saving,
    getDriverInstructions,
    updateDriverInstructions,
  };
}
