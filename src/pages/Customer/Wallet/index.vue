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
        <div v-for="plan in rechargeAmounts" :key="plan.id"
          class="bg-[#1D1D1D] rounded-lg p-4 flex justify-between items-center">
          <div>
            <p class="text-lg font-semibold">{{ plan.name ?? '' }}</p>
            <p class="text-sm text-gray-400">{{ plan.coins }}</p>
          </div>
          <div class="text-right">
            <p class="font-semibold">Rs. {{ plan.amount }}</p>
          </div>
          <button class="ml-4 bg-purple-400 text-white w-10 h-10 flex items-center justify-center rounded-full"
            @click="() => initiatePayment(plan)">
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
const rechargeAmounts = ref([])


const wallet = ref(0)

const getRechargeAmounts = async () => {
  const { data } = await api.get('wallet-recharge-amount')
  rechargeAmounts.value = data
}

const getWalletBalance = async () => {
  const { data } = await api.get('wallet', { params: { user_id: user.value.id } })
  wallet.value = data
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    document.body.appendChild(script);
  });
};

onMounted(async () => {
  await loadRazorpayScript();
});

const initiatePayment = async (plan) => {
  try {
    // Create order
    const { data } = await api.post('wallet', {
      amount: plan.amount
    });

    const orderId = data.order.id

    const options = {
      key: data.key,
      amount: plan.amount * 100,
      currency: "INR",
      name: "Your Company Name",
      description: `Wallet Recharge - ${plan.coins} coins`,
      order_id: data.order_id,
      handler: async function (response) {
        const { data } = await api.post('payments/wallet/verify-payment', {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: orderId,
          razorpay_signature: response.razorpay_signature
        });

        console.log(data)

        if (data.success) {
          await getWalletBalance();
          alert('Payment successful!');
        }
      },
      prefill: {
        name: user.value.name,
        email: user.value.email,
      },
      theme: {
        color: "#9333EA"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Payment failed:', error);
    alert('Payment failed. Please try again.');
  }
};

onMounted(async () => {
  getWalletBalance()
  getRechargeAmounts()
  await loadRazorpayScript()
})

</script>
