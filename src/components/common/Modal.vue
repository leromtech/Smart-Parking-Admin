<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="ariaLabelledby"
        :aria-label="ariaLabel"
        @click.self="close"
        @keydown.escape="close"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

        <!-- Content -->
        <div
          class="relative bg-white dark:bg-surface-800 rounded-xl shadow-2xl border border-surface-100 dark:border-surface-700 w-full max-w-lg max-h-[90vh] overflow-auto"
          v-bind="$attrs"
          @click.stop
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  ariaLabelledby: {
    type: String,
    default: "",
  },
  ariaLabel: {
    type: String,
    default: "Dialog",
  },
});

const emit = defineEmits(["update:modelValue"]);

const open = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const close = () => {
  open.value = false;
};
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>

<style scoped>
.modal-enter-active {
  animation: modalIn 0.2s ease-out;
}
.modal-leave-active {
  animation: modalIn 0.15s ease-in reverse;
}

.modal-enter-active .relative {
  animation: scale-in 0.2s ease-out;
}
.modal-leave-active .relative {
  animation: scale-in 0.15s ease-in reverse;
}

@keyframes modalIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
