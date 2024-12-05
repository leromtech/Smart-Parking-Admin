<template>
  <div class="wallet-page bg-black text-white flex flex-col min-h-screen">
    <!-- Header -->
    <header class="text-center text-2xl font-bold py-4">Wallet</header>

    <!-- Wallet Balance Section -->
    <section class="mb-8 px-4">
      <div class="bg-[#1D1D1D] rounded-lg p-4 flex justify-between items-center">
        <div>
          <p class="text-gray-400 text-sm">Your Wallet Balance</p>
          <h1 class="text-4xl text-purple-400 font-bold">
            {{ wallet.balance }} <span class="text-lg">coins</span>
          </h1>
        </div>
        <div>
          <img src="" alt="Wallet Icon" class="w-12" />
        </div>
      </div>
    </section>

    <!-- Recharge Section -->
    <section class="flex-1 px-4">
      <h2 class="text-lg text-gray-400 mb-1">Our Plan</h2>
      <h3 class="text-2xl font-semibold mb-4">Recharge now</h3>
      <div class="space-y-4">
        <div v-for="plan in rechargePlans" :key="plan.id"
          class="bg-[#1D1D1D] rounded-lg p-4 flex justify-between items-center">
          <div>
            <p class="text-lg font-semibold">{{ plan.title }}</p>
            <p class="text-sm text-gray-400">{{ plan.description }}</p>
          </div>
          <div class="text-right">
            <p class="font-semibold">Rs. {{ plan.price }}</p>
          </div>
          <button class="ml-4 bg-purple-400 text-white w-10 h-10 flex items-center justify-center rounded-full">
            →
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../../../boot/api';
import useAuth from '../../../scripts/auth';

const { user } = useAuth()



const wallet = ref(0)

const getWalletBalance = async () => {
  const { data } = await api.get('wallet', { params: { user_id: user.value.id } })
  wallet.value = data
}

onMounted(() => {
  getWalletBalance()
})
</script>
