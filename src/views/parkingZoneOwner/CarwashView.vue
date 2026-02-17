<template>
  <div class="card flex flex-col w-full gap-4">
    <Panel header="CARWASH" class="w-[80%] gap-2">
      <div
        class="flex flex-row gap-2 border border-neutral-200 p-2 rounded-md mb-2">
        <p class="text-blue-500 font-semibold">Note:</p>
        <p>Space occupied is calculated as Two wheeler = 1 space</p>
      </div>

      <div class="flex flex-col gap-2">
        <label>Carwash Capacity</label>
        <InputNumber v-model="carwash_capacity" />
      </div>

      <Button @click="submit">Save</Button>

      <Message v-if="error" severity="error" variant="simple">{{
        error
      }}</Message>
    </Panel>

    <Panel header="CARWASH HISTORY" class="w-[90%]">
      <div class="flex flex-col gap-2 mb-3">
        <InputText v-model="filters.search" placeholder="Search vehicle/user" />

        <Dropdown
          v-model="filters.status"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Status" />

        <Calendar v-model="filters.date" dateFormat="yy-mm-dd" showIcon />

        <Button label="Apply" size="small" @click="fetchHistory" />
      </div>

      <DataTable
        :value="history.data"
        :loading="loading"
        paginator
        :rows="pagination.per_page"
        :totalRecords="history.total"
        @page="onPage"
        class="text-sm">
        <Column field="vehicle.registration_no" header="Vehicle" />
        <Column field="user.name" header="User" />
        <Column field="status" header="Status" />
        <Column field="created_at" header="Date" />
      </DataTable>
    </Panel>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useParkingZone } from "../../scripts/parkingZone";
import useVehicleTypes from "../../scripts/admin/vehicleTypes";
import { useToast } from "primevue";

const { updateParkingZone, getParkingZone, parking_zone } = useParkingZone();
const { getVehicleTypes } = useVehicleTypes();
const toast = useToast();

const statusOptions = [
  { label: "Completed", value: "completed" },
  { label: "Ended", value: "ended" },
];

const carwash_capacity = ref(0);
const loading = ref(false);

const pagination = ref({
  page: 1,
  per_page: 10,
});

const history = ref({
  data: [],
  total: 0,
});

const filters = ref({
  search: null,
  status: null,
  date: null,
});

const error = ref(null);

const submit = async () => {
  error.value = null;

  try {
    const response = await updateParkingZone({
      carwash_capacity: carwash_capacity.value,
    });

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Carwash capacity updated",
      life: 3000,
    });
  } catch (e) {
    error.value = e?.response?.data?.message || "Update failed";
  }
};

const populateCarwashCapacity = () => {
  if (parking_zone.value) {
    carwash_capacity.value = parking_zone.value.carwash_capacity;
  }
};

const getCarwashHistory = (params) => {
  const { data } = api.get("/car-washes/history", { params });
  console.log(data);
  return data.car_washes;
};

const fetchHistory = async () => {
  loading.value = true;

  try {
    const response = await getCarwashHistory({
      ...filters.value,
      pagination: pagination.value,
    });

    history.value = response.data.car_washes;
  } catch (e) {
    error.value = e?.response?.data?.message || "Failed to load history";
  } finally {
    loading.value = false;
  }
};

const onPage = (event) => {
  pagination.value.page = event.page + 1;
  pagination.value.per_page = event.rows;
  fetchHistory();
};

onMounted(async () => {
  await getParkingZone();
  await getVehicleTypes();
  await fetchHistory();
  populateCarwashCapacity();
});
</script>
