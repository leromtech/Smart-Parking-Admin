<template>
  <div class="flex flex-col items-center justify-between h-screen w-full relative">
    <div class="flex flex-col h-full bg-slate-200 w-full items-center justify-center
    0/">
      <router-view class="flex h-full w-full"></router-view>
    </div>
    <div
      class="absolute bottom-0 bg-[#1D1D1D] rounded-full w-[90%] mb-[5%] py-4 flex flex-row items-center justify-evenly z-40">
      <router-link :to="option.link" v-for="option in menuOptions" :key="option.name"
        class="text-white w-full h-full text-center">
        {{ option.name }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
const menuOptions = [
  { name: 'Parking', link: '/manager' },
  { name: 'Entry', link: '/manager/entry' },
  { name: 'Profile', link: '/manager/profile' },
]
</script>