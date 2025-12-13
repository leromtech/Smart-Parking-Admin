<template>
    <div class="relative">
        <div v-if="hasData" :ref="chartRef" :id="chartId" class="w-full"></div>
        <div v-else class="flex flex-col items-center justify-center py-16 px-4">
            <div class="bg-gray-100 rounded-full p-6 mb-4">
                <font-awesome-icon :icon="['fas', 'calendar-check']" class="text-gray-400 text-4xl"></font-awesome-icon>
            </div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">No Booking Data Available</h3>
            <p class="text-gray-500 text-sm text-center max-w-md">
                There are no booking records for {{ year }} yet. Data will appear here once bookings are created.
            </p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import ApexCharts from 'apexcharts';

const props = defineProps({
    title: String,
    data: {
        type: Array,
        default: () => []
    },
    year: {
        type: Number,
        default: new Date().getFullYear()
    }
})

const chart = ref(null)
const chartRef = ref(null)
const chartId = ref(`booking-chart-${Math.random().toString(36).substr(2, 9)}`)

const hasData = computed(() => {
    return props.data && props.data.length > 0 && props.data.some(item => {
        const value = Object.values(item)[0]
        return value !== null && value !== undefined && value > 0
    })
})

const options = ref({
    chart: {
        type: 'bar',
        height: 350,
        toolbar: {
            show: true
        },
        zoom: {
            enabled: false
        }
    },
    series: [{
        name: 'Bookings',
        data: []
    }],
    xaxis: {
        categories: [],
        title: {
            text: 'Month'
        }
    },
    yaxis: {
        title: {
            text: 'Number of Bookings'
        },
        min: 0
    },
    title: {
        text: '',
        align: 'left',
        style: {
            fontSize: '18px',
            fontWeight: 600,
            color: '#1f2937'
        }
    },
    colors: ['#10b981'],
    plotOptions: {
        bar: {
            borderRadius: 6,
            dataLabels: {
                position: 'top'
            }
        }
    },
    dataLabels: {
        enabled: true,
        formatter: function (val) {
            return val
        },
        offsetY: -20,
        style: {
            fontSize: '12px',
            colors: ['#6b7280']
        }
    },
    grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 4
    },
    tooltip: {
        theme: 'light',
        y: {
            formatter: function (val) {
                return val + " bookings"
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
    options.value.series[0].data = []
    options.value.xaxis.categories = []

    props.data.forEach(item => {
        // Extract key and value from the object
        const month = Object.keys(item)[0] // e.g., "Jan 2025"
        const value = Object.values(item)[0] // e.g., 0

        options.value.series[0].data.push(value)
        options.value.xaxis.categories.push(month)
    })

    options.value.title.text = props.title || 'Booking Records'

    // Use nextTick to ensure DOM is ready
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
        options.value.title.text = props.title || 'Booking Records'
        chart.value.updateOptions(options.value)
    }
})

onMounted(() => {
    renderChart()
})
</script>
