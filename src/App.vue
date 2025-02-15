<template>
  <div>
    <Toast></Toast>
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import useNotification from './scripts/notification';

const notifyCard = ref()

onMounted(() => {
  notifyCard.value = document.querySelector('#notification-card')
})
</script>