<template>
    <div class="relative">
        <div v-if="hasData" :ref="chartRef" :id="chartId" class="w-full"></div>
        <div v-else class="flex flex-col items-center justify-center py-12 px-4">
            <div class="bg-gray-100 rounded-full p-5 mb-3">
                <font-awesome-icon :icon="['fas', 'car']" class="text-gray-400 text-3xl"></font-awesome-icon>
            </div>
            <h3 class="text-base font-semibold text-gray-700 mb-1">No Vehicle Data</h3>
            <p class="text-gray-500 text-xs text-center">
                No vehicle type data available yet.
            </p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch, computed } from 'vue';
import ApexCharts from 'apexcharts';

const props = defineProps({
    title: String,
    data: {
        type: Array,
        default: () => []
    }
})

const chart = ref(null)
const chartRef = ref(null)
const chartId = ref(`vehicle-chart-${Math.random().toString(36).substr(2, 9)}`)

const hasData = computed(() => {
    return props.data && props.data.length > 0 && props.data.some(item => {
        const value = Object.values(item)[0]
        return value !== null && value !== undefined && value > 0
    })
})

const options = ref({
    chart: {
        type: 'donut',
        height: 300,
    },
    series: [],
    labels: [],
    title: {
        text: '',
        align: 'center',
        style: {
            fontSize: '16px',
            fontWeight: 600,
            color: '#1f2937'
        }
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
    legend: {
        position: 'bottom'
    },
    dataLabels: {
        enabled: true,
        formatter: function (val) {
            return val.toFixed(1) + "%"
        }
    },
    tooltip: {
        theme: 'light',
        y: {
            formatter: function (val) {
                return val + " vehicles"
            }
        }
    }
})

const renderChart = () => {
    if (chart.value) {
        chart.value.destroy()
    }

    if (!hasData.value) {
        return
    }

    // Reset data
    options.value.series = []
    options.value.labels = []

    props.data.forEach(element => {
        options.value.series.push(Object.values(element)[0])
        options.value.labels.push(Object.keys(element)[0])
    })

    options.value.title.text = props.title || 'Vehicle Types'

    setTimeout(() => {
        const chartElement = document.querySelector(`#${chartId.value}`)
        if (chartElement) {
            chart.value = new ApexCharts(chartElement, options.value)
            chart.value.render()
        }
    }, 100)
}

watch(() => props.data, () => {
    renderChart()
}, { deep: true })

watch(() => props.title, () => {
    if (hasData.value && chart.value) {
        options.value.title.text = props.title || 'Vehicle Types'
        chart.value.updateOptions(options.value)
    }
})

onMounted(() => {
    renderChart()
})
</script>