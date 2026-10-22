import { ref } from "vue";
import api from "../../boot/api";

const subscriptionsEnabled = ref(true);
const loading = ref(false);
const saving = ref(false);

/**
 * Fetch whether the zone accepts new subscription requests.
 */
const getSubscriptionsEnabled = async (parkingZoneId) => {
  try {
    loading.value = true;
    const { data } = await api.get(
      `parking-zones/${parkingZoneId}/subscriptions-enabled`,
    );
    if (data?.success) {
      subscriptionsEnabled.value = data.data?.subscriptions_enabled ?? true;
    }
    return data;
  } finally {
    loading.value = false;
  }
};

/**
 * Turn new subscription requests on or off. Existing subscriptions keep working.
 */
const updateSubscriptionsEnabled = async (parkingZoneId, enabled) => {
  try {
    saving.value = true;
    const { data } = await api.put(
      `parking-zones/${parkingZoneId}/subscriptions-enabled`,
      {
        subscriptions_enabled: enabled,
      },
    );
    if (data?.success) {
      subscriptionsEnabled.value = data.data?.subscriptions_enabled ?? enabled;
    }
    return data;
  } finally {
    saving.value = false;
  }
};

export default function useSubscriptionsEnabled() {
  return {
    subscriptionsEnabled,
    loading,
    saving,
    getSubscriptionsEnabled,
    updateSubscriptionsEnabled,
  };
}
