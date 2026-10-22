import { ref } from "vue";
import api from "../../boot/api";

const alertMinutes = ref(null);
const loading = ref(false);
const saving = ref(false);

/**
 * Fetch how long a vehicle may stay parked before an alert is sent (null = off).
 */
const getLongParkingAlert = async (parkingZoneId) => {
  try {
    loading.value = true;
    const { data } = await api.get(
      `parking-zones/${parkingZoneId}/long-parking-alert`,
    );
    if (data?.success) {
      alertMinutes.value = data.data?.long_parking_alert_minutes ?? null;
      return data.data;
    }
    return data;
  } finally {
    loading.value = false;
  }
};

/**
 * Set the long-parking alert time in minutes. Pass null to turn the alert off.
 */
const updateLongParkingAlert = async (parkingZoneId, minutes) => {
  try {
    saving.value = true;
    const { data } = await api.put(
      `parking-zones/${parkingZoneId}/long-parking-alert`,
      {
        long_parking_alert_minutes: minutes,
      },
    );
    if (data?.success) {
      alertMinutes.value = data.data?.long_parking_alert_minutes ?? null;
    }
    return data;
  } finally {
    saving.value = false;
  }
};

export default function useLongParkingAlert() {
  return {
    alertMinutes,
    loading,
    saving,
    getLongParkingAlert,
    updateLongParkingAlert,
  };
}
