import { ref } from "vue"

const charts = ref(0)

const addChart = () => {
    charts.value = charts.value++
}

const removeChart = () => {
    charts.value = charts.value--
}

const generateChartName = () => {
    return `chart${charts.value}`
}

export function useChart() {
    return {
        addChart,
        removeChart,
        generateChartName
    }
}