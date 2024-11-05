<template>
  <div>
    <div id="notification-card"
      :class="['fixed w-[300px] h-[60px] flex items-center top-0 justify-center bg-green-400 text-white rounded-sm font-semibold bottom-0 transition-all duration-300', _message !== '' ? 'translate-y-4' : '-translate-y-full']">
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