<template>
    <div>
        <img :src="qr_code" alt="asd" class="w-full h-full" v-if="qr_code !== null">
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../../../boot/api';

const props = defineProps(['user'])

const qr_code = ref(null)

onMounted(async () => {
    const { data } = await api.get(`/user/qr-code?user_id=${props.user.id}&vehicle_id=${1}`)
    qr_code.value = data.qr_code
})

</script>