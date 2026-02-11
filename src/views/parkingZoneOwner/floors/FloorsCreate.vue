<template>
  <div>
    <form @submit.prevent="submit" class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="name" class="font-semibold"
          >Floor Name <span class="text-red-500">*</span></label
        >
        <InputText
          id="name"
          v-model="form.name"
          placeholder="e.g., Ground Floor, First Floor"
          class="w-full"
          :class="{ 'p-invalid': errors.name }" />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="floor_number" class="font-semibold"
          >Floor Number <span class="text-red-500">*</span></label
        >
        <InputNumber
          id="floor_number"
          v-model="form.floor_number"
          :min="0"
          :max="100"
          placeholder="Enter floor number"
          class="w-full"
          :class="{ 'p-invalid': errors.floor_number }" />
        <small v-if="errors.floor_number" class="p-error">{{
          errors.floor_number
        }}</small>
        <small class="text-gray-500"
          >Floor numbers must be unique within a parking zone</small
        >
      </div>

      <div class="flex flex-col gap-2">
        <label for="capacity" class="font-semibold">Capacity</label>
        <InputNumber
          id="capacity"
          v-model="form.capacity"
          :min="0"
          placeholder="Enter capacity"
          class="w-full" />
        <small class="text-gray-500"
          >Total number of parking spaces on this floor</small
        >
      </div>

      <div class="flex flex-col gap-2">
        <label for="reserved_for_app" class="font-semibold">
          Reserved For App
        </label>
        <InputNumber
          id="reserved_for_app"
          v-model="form.reserved_for_app"
          :min="0"
          placeholder="Enter app reserved slots"
          class="w-full" />
        <small class="text-gray-500">
          Slots reserved exclusively for app users
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="reserved_for_booking" class="font-semibold">
          Reserved For Booking
        </label>
        <InputNumber
          id="reserved_for_booking"
          v-model="form.reserved_for_booking"
          :min="0"
          placeholder="Enter reserved booking slots"
          class="w-full" />
        <small class="text-gray-500">
          Slots reserved exclusively for advance bookings
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="vehicle_types" class="font-semibold">Vehicle Types</label>
        <MultiSelect
          v-model="form.vehicle_type_ids"
          :options="vehicleTypeOptions"
          optionLabel="name"
          optionValue="id"
          placeholder="Select vehicle types"
          display="chip"
          class="w-full"
          :loading="loadingVehicleTypes" />
        <small class="text-gray-500"
          >Select which vehicle types can park on this floor</small
        >
      </div>

      <div
        v-if="message"
        class="p-3 rounded"
        :class="
          messageType === 'error'
            ? 'bg-red-100 text-red-700'
            : 'bg-green-100 text-green-700'
        ">
        {{ message }}
      </div>

      <div class="flex flex-row justify-end gap-2 mt-4">
        <Button label="Cancel" outlined @click="$emit('close')" />
        <Button
          type="submit"
          :label="form.id ? 'Update' : 'Create'"
          :loading="loading" />
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import useFloors from "../../../scripts/floors";
import { useToast } from "primevue";

const props = defineProps({
  parkingZoneId: {
    type: [String, Number],
    required: true,
  },
  floor: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["created", "close"]);

const toast = useToast();
const {
  createFloor,
  updateFloor,
  getAvailableVehicleTypes,
  availableVehicleTypes,
  loading,
} = useFloors();

const form = ref({
  id: null,
  name: "",
  floor_number: null,
  capacity: 0,
  reserved_for_booking: 0,
  reserved_for_app: 0,
  vehicle_type_ids: [],
});

const errors = ref({});
const message = ref("");
const messageType = ref("error");
const vehicleTypeOptions = ref([]);
const loadingVehicleTypes = ref(false);

const reset = () => {
  form.value = {
    id: null,
    name: "",
    floor_number: null,
    capacity: 0,
    reserved_for_booking: 0,
    reserved_for_app: 0,
    vehicle_type_ids: [],
  };
  errors.value = {};
  message.value = "";
};

const loadVehicleTypes = async () => {
  try {
    loadingVehicleTypes.value = true;
    await getAvailableVehicleTypes();
    vehicleTypeOptions.value = availableVehicleTypes.value;
  } catch (error) {
    console.error("Error loading vehicle types:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load vehicle types",
      life: 3000,
    });
  } finally {
    loadingVehicleTypes.value = false;
  }
};

const submit = async () => {
  try {
    errors.value = {};
    message.value = "";

    // Validation
    if (!form.value.name || form.value.name.trim() === "") {
      errors.value.name = "Floor name is required";
      return;
    }

    if (
      form.value.floor_number === null ||
      form.value.floor_number === undefined
    ) {
      errors.value.floor_number = "Floor number is required";
      return;
    }

    const floorData = {
      name: form.value.name.trim(),
      floor_number: form.value.floor_number,
      capacity: form.value.capacity || 0,
      reserved_for_booking: form.value.reserved_for_booking || 0,
      reserved_for_app: form.value.reserved_for_app || 0,
      vehicle_type_ids: form.value.vehicle_type_ids || [],
    };

    let data;
    if (form.value.id) {
      // Update existing floor
      data = await updateFloor(props.parkingZoneId, form.value.id, floorData);
    } else {
      // Create new floor
      data = await createFloor(props.parkingZoneId, floorData);
    }

    if (data.success) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail:
          data.message ||
          (form.value.id
            ? "Floor updated successfully"
            : "Floor created successfully"),
        life: 3000,
      });
      reset();
      emit("created");
    }
  } catch (error) {
    const errorResponse = error.response?.data;
    const errorMessage = errorResponse?.message || "An error occurred";

    // Handle validation errors
    if (errorResponse?.errors) {
      errors.value = errorResponse.errors;
    }

    message.value = errorMessage;
    messageType.value = "error";
    toast.add({
      severity: "error",
      summary: "Error",
      detail: errorMessage,
      life: 3000,
    });
  }
};

onMounted(async () => {
  await loadVehicleTypes();

  if (props.floor) {
    form.value = {
      id: props.floor.id || null,
      name: props.floor.name || "",
      floor_number: props.floor.floor_number || null,
      capacity: props.floor.capacity || 0,
      reserved_for_booking: props.floor.reserved_for_booking || 0,
      reserved_for_app: props.floor.reserved_for_app || 0,
      vehicle_type_ids: props.floor.vehicle_types
        ? props.floor.vehicle_types.map((vt) => vt.id)
        : [],
    };
  }
});

onUnmounted(() => {
  reset();
});
</script>
