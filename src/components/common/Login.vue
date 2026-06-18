<template>
  <Modal v-model="open" :ariaLabel="'Login'" :ariaLabelledby="'login-title'">
    <div class="p-6 md:p-8">
      <!-- Close button -->
      <button
        class="absolute top-3 right-3 p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors"
        aria-label="Close login dialog"
        @click="open = false"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <!-- Brand -->
      <div class="flex items-center gap-2.5 mb-2">
        <div class="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 17h14v-5H5v5z" />
            <path d="M7 12L8 8h8l1 4" />
            <circle cx="7.5" cy="17.5" r="1.5" fill="white" />
            <circle cx="16.5" cy="17.5" r="1.5" fill="white" />
          </svg>
        </div>
        <div>
          <h2 id="login-title" class="text-xl font-bold text-surface-900">Welcome Back</h2>
          <p class="text-sm text-surface-400">Sign in to your account</p>
        </div>
      </div>

      <!-- Error message -->
      <div v-if="message" class="mb-4 p-3 rounded-lg bg-danger-50 text-danger-700 text-sm border border-danger-100 flex items-center gap-2">
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
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        {{ message }}
      </div>

      <!-- Form -->
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label for="login-phone" class="block text-sm font-medium text-surface-700 mb-1.5"> Phone Number </label>
          <input
            id="login-phone"
            type="tel"
            name="phone"
            maxlength="10"
            required
            v-model="form.phone"
            placeholder="Enter your phone number"
            class="input"
            autocomplete="tel"
          />
        </div>

        <div>
          <label for="login-password" class="block text-sm font-medium text-surface-700 mb-1.5"> Password </label>
          <input
            id="login-password"
            type="password"
            name="password"
            required
            v-model="form.password"
            placeholder="Enter your password"
            class="input"
            autocomplete="current-password"
          />
        </div>

        <button type="submit" class="w-full btn-primary btn-lg justify-center" :disabled="submitting">
          <svg v-if="submitting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span v-else>Sign In</span>
        </button>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import useAuth from "../../scripts/auth";
import Modal from "./Modal.vue";

const { login } = useAuth();

const form = ref({
  phone: "",
  password: "",
});

const message = ref("");
const submitting = ref(false);

const submit = async () => {
  submitting.value = true;
  message.value = "";
  try {
    const fd = new FormData();
    fd.append("phone", form.value.phone);
    fd.append("password", form.value.password);
    const error = await login(fd);
    if (error) {
      message.value = error;
    }
  } catch (e) {
    message.value = "An unexpected error occurred";
  } finally {
    submitting.value = false;
  }
};

const open = defineModel("open", false);
</script>
