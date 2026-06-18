<template>
  <div class="w-full">
    <!-- Loading state -->
    <div v-if="loading" class="card animate-fade-in">
      <div class="p-4 space-y-3">
        <div v-for="n in 5" :key="n" class="flex gap-4">
          <div class="h-4 w-8 skeleton rounded"></div>
          <div class="h-4 flex-1 skeleton rounded"></div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="rows.length === 0" class="card empty-state">
      <div class="empty-state-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
          <polyline points="13 2 13 9 20 9"></polyline>
        </svg>
      </div>
      <p class="empty-state-title">No data available</p>
      <p class="empty-state-desc" v-if="emptyMessage">{{ emptyMessage }}</p>
    </div>

    <!-- Table -->
    <div v-else class="card overflow-hidden animate-fade-in">
      <div class="overflow-x-auto">
        <table class="w-full" role="table">
          <thead>
            <tr class="border-b border-surface-100 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/50">
              <!-- Checkbox column -->
              <th v-if="selectable" class="w-12 py-3 px-4 text-left">
                <input
                  type="checkbox"
                  class="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  :checked="allSelected"
                  @change="toggleAll"
                  aria-label="Select all rows"
                />
              </th>
              <th
                v-for="column in columns"
                :key="column.name || column.field"
                :class="[
                  'py-3 px-4 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider',
                  column.sortable ? 'cursor-pointer select-none hover:text-surface-700 dark:hover:text-surface-300 transition-colors' : '',
                ]"
                @click="column.sortable && toggleSort(column)"
              >
                <span class="inline-flex items-center gap-1.5">
                  {{ column.label || column.name }}
                  <span v-if="column.sortable && sortField === (column.sortField || column.field)" class="text-primary-500">
                    <svg
                      v-if="sortDirection === 'asc'"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="6 15 12 9 18 15"></polyline>
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </span>
              </th>
              <!-- Actions column -->
              <th
                v-if="$slots.actions"
                class="py-3 px-4 text-right text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider w-px"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-50 dark:divide-surface-700">
            <tr
              v-for="row in rows"
              :key="row.id"
              :class="[
                'transition-colors duration-150',
                'hover:bg-surface-50/70 dark:hover:bg-surface-700/50',
                isSelected(row) ? 'bg-primary-50/40 dark:bg-primary-400/10' : '',
              ]"
            >
              <!-- Checkbox -->
              <td v-if="selectable" class="py-3 px-4">
                <input
                  type="checkbox"
                  class="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  :checked="isSelected(row)"
                  @change="toggleRow(row)"
                  :aria-label="`Select row ${row.id}`"
                />
              </td>
              <!-- Data cells -->
              <td
                v-for="col in columns"
                :key="col.name || col.field"
                class="py-3 px-4 text-sm text-surface-700 dark:text-surface-300"
                :class="col.class || ''"
              >
                <slot :name="`cell-${col.field}`" :row="row">
                  {{ typeof col.field === "function" ? col.field(row) : getNestedField(row, col.field) }}
                </slot>
              </td>
              <!-- Actions -->
              <td v-if="$slots.actions" class="py-3 px-4 text-right">
                <slot name="actions" :row="row" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="paginate && totalPages > 1"
        class="flex items-center justify-between px-4 py-3 border-t border-surface-100 dark:border-surface-700 bg-surface-50/30 dark:bg-surface-800/30"
      >
        <p class="text-xs text-surface-400 dark:text-surface-500">
          Showing {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, rows.length) }} of {{ rows.length }}
        </p>
        <div class="flex items-center gap-1">
          <button
            :disabled="currentPage === 1"
            class="p-1.5 rounded-md text-surface-400 dark:text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-600 dark:hover:text-surface-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
            @click="goToPage(currentPage - 1)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            :class="[
              'w-8 h-8 text-xs font-medium rounded-md transition-colors',
              page === currentPage
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-700 dark:hover:text-surface-200',
            ]"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            :disabled="currentPage === totalPages"
            class="p-1.5 rounded-md text-surface-400 dark:text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-600 dark:hover:text-surface-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
            @click="goToPage(currentPage + 1)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  rows: { type: Array, required: true },
  columns: { type: Array, required: true },
  selectable: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  emptyMessage: { type: String, default: "" },
  paginate: { type: Boolean, default: false },
  perPage: { type: Number, default: 10 },
});

const emit = defineEmits(["selection-change"]);

const selected = ref([]);
const sortField = ref("");
const sortDirection = ref("asc");
const currentPage = ref(1);

const getNestedField = (row, field) => {
  if (!field) return "";
  const fields = field.split(".");
  return fields.reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : null), row);
};

const isSelected = (row) => {
  return selected.value.some((item) => item.id === row.id);
};

const allSelected = computed(() => {
  return props.rows.length > 0 && selected.value.length === props.rows.length;
});

const toggleAll = () => {
  if (allSelected.value) {
    selected.value = [];
  } else {
    selected.value = [...props.rows];
  }
  emit("selection-change", selected.value);
};

const toggleRow = (row) => {
  const idx = selected.value.findIndex((item) => item.id === row.id);
  if (idx >= 0) {
    selected.value.splice(idx, 1);
  } else {
    selected.value.push(row);
  }
  emit("selection-change", selected.value);
};

const toggleSort = (column) => {
  const field = column.sortField || column.field;
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

const totalPages = computed(() => {
  if (!props.paginate) return 1;
  return Math.ceil(props.rows.length / props.perPage);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;
  let start = Math.max(1, current - 2);
  let end = Math.min(total, current + 2);
  if (end - start < 4) {
    if (start === 1) end = Math.min(5, total);
    else if (end === total) start = Math.max(1, total - 4);
  }
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
</script>
