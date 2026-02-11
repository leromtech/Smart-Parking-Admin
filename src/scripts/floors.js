import { ref } from "vue";
import api from "../boot/api";

const floors = ref([]);
const loading = ref(false);
const editItem = ref(null);
const deleteItem = ref(null);
const availableVehicleTypes = ref([]);

const pagination = ref({
  per_page: 10,
  total_records: 0,
  page: 0,
});

/**
 * Get all floors for a parking zone
 */
const getFloors = async (parkingZoneId) => {
  try {
    loading.value = true;
    const { data } = await api.get(`parking-zones/${parkingZoneId}/floors`);
    if (data.success) {
      floors.value = data.data.floors;
      return data.data;
    }
  } catch (error) {
    console.error("Error fetching floors:", error);
    throw error;
  } finally {
    loading.value = false;
  }
};

/**
 * Create a new floor
 */
const createFloor = async (parkingZoneId, floorData) => {
  try {
    loading.value = true;
    const fd = new FormData();
    fd.append("name", floorData.name);
    fd.append("floor_number", floorData.floor_number);
    fd.append("total_capacity", floorData.total_capacity || 0);
    fd.append("reserved_for_app", floorData.resrved_for_app || 0);
    fd.append("declared_for_booking", floorData.declared_for_booking || 0);

    // Append vehicle type IDs as array
    if (
      floorData.vehicle_type_ids &&
      Array.isArray(floorData.vehicle_type_ids)
    ) {
      floorData.vehicle_type_ids.forEach((id) => {
        fd.append("vehicle_type_ids[]", id);
      });
    }

    const { data } = await api.post(
      `parking-zones/${parkingZoneId}/floors`,
      fd,
    );
    if (data.success) {
      return data;
    }
  } catch (error) {
    console.error("Error creating floor:", error);
    throw error;
  } finally {
    loading.value = false;
  }
};

/**
 * Update a floor
 */
const updateFloor = async (parkingZoneId, floorId, floorData) => {
  try {
    loading.value = true;
    const fd = new FormData();
    fd.append("name", floorData.name);
    fd.append("floor_number", floorData.floor_number);
    fd.append("total_capacity", floorData.total_capacity || 0);
    fd.append("reserved_for_app", floorData.reserved_for_app || 0);
    fd.append("declared_for_booking", floorData.declared_for_booking || 0);

    console.log(fd);
    // Append vehicle type IDs as array
    if (
      floorData.vehicle_type_ids &&
      Array.isArray(floorData.vehicle_type_ids)
    ) {
      floorData.vehicle_type_ids.forEach((id) => {
        fd.append("vehicle_type_ids[]", id);
      });
    }

    fd.append("_method", "PUT");
    const { data } = await api.post(
      `parking-zones/${parkingZoneId}/floors/${floorId}`,
      fd,
    );
    if (data.success) {
      return data;
    }
  } catch (error) {
    console.error("Error updating floor:", error);
    throw error;
  } finally {
    loading.value = false;
  }
};

/**
 * Delete a floor
 */
const deleteFloor = async (parkingZoneId, floorId) => {
  try {
    loading.value = true;
    const fd = new FormData();
    fd.append("_method", "DELETE");
    const { data } = await api.post(
      `parking-zones/${parkingZoneId}/floors/${floorId}`,
      fd,
    );
    if (data.success) {
      return data;
    }
  } catch (error) {
    console.error("Error deleting floor:", error);
    throw error;
  } finally {
    loading.value = false;
  }
};

/**
 * Get available vehicle types for assignment
 */
const getAvailableVehicleTypes = async () => {
  try {
    loading.value = true;
    // Try the floors-specific endpoint first
    try {
      const { data } = await api.get(
        "parking-zones/floors/available-vehicle-types",
      );
      if (data.success) {
        availableVehicleTypes.value = data.data;
        return data.data;
      }
    } catch (specificError) {
      // Fallback to general vehicle-types endpoint
      const { data } = await api.get("vehicle-types");
      if (data.vehicle_types) {
        availableVehicleTypes.value =
          data.vehicle_types.data || data.vehicle_types;
        return availableVehicleTypes.value;
      } else if (Array.isArray(data)) {
        availableVehicleTypes.value = data;
        return data;
      }
    }
  } catch (error) {
    console.error("Error fetching vehicle types:", error);
    throw error;
  } finally {
    loading.value = false;
  }
};

export default function useFloors() {
  return {
    floors,
    loading,
    editItem,
    deleteItem,
    availableVehicleTypes,
    pagination,
    getFloors,
    createFloor,
    updateFloor,
    deleteFloor,
    getAvailableVehicleTypes,
  };
}
