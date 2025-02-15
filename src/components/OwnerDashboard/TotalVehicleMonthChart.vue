<template>
    <div ref="chart2" id="chart2">
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import ApexCharts from 'apexcharts';

const props = defineProps(['title', 'data'])
const chart = ref(null)

const options = ref({
    chart: {
        type: 'donut',
        height: 200,
    },
    series: [],
    labels: [],
    title: {
        text: '',
        style: {
            fontSize: 16
        }
    }
})

onMounted(() => {
    props.data.forEach(element => {
        options.value.series.push(Object.values(element)[0])
        options.value.labels.push(Object.keys(element)[0])
    })
    options.value.title.text = props.title
    chart.value = new ApexCharts(document.querySelector('#chart2'), options.value)
    console.log(chart.value)
    chart.value.render()
})
</script>