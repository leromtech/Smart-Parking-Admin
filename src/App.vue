<template>
  <div>
    <div id="notification-card" :class="[
      'fixed w-[300px] h-[60px] flex items-center justify-center bg-green-400 text-white rounded-sm font-semibold transition-all duration-300 left-1/2 -translate-x-1/2',
      _message !== '' ? 'top-4' : '-top-full'
    ]">
      {{ _message }}
    </div>
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import useNotification from './scripts/notification';

const notifyCard = ref()
const { _message, _type, notify } = useNotification()

onMounted(() => {
  notifyCard.value = document.querySelector('#notification-card')
})
</script>