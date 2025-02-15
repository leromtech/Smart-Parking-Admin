<template>
    <div ref="chart1" id="chart1">
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ApexCharts from 'apexcharts';

const props = defineProps(['title', 'data'])
const chart = ref(null)

const options = ref({
    chart: {
        type: 'line',
        height: 200
    },
    series: [{
        name: 'series',
        data: []
    }],
    xaxis: {
        categories: []
    },
    title: {
        text: '',
        style: {
            fontSize: 16
        }
    }
})

onMounted(() => {
    props.data.forEach(element => {
        element.forEach(item => {
            options.value.series[0].data.push(Object.values(item)[0])
            options.value.xaxis.categories.push(Object.keys(item)[0])
        })
    })
    options.value.title.text = props.title
    chart.value = new ApexCharts(document.querySelector("#chart1"), options.value)
    chart.value.render()
})
</script>