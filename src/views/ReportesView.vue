<template>
    <div class="p-6 space-y-6">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">Panel de Reportes</h1>
                <p class="text-gray-500">Resumen general del inventario y movimientos</p>
            </div>
            <div class="flex gap-2">
                <button @click="isBarcodeModalOpen = true"
                    class="px-4 py-2 bg-purple-600 border border-purple-600 rounded-lg text-white hover:bg-purple-700 font-medium text-sm flex items-center gap-2">
                    <i class="pi pi-barcode"></i>
                    Códigos de Barras
                </button>
                <button @click="isPdfModalOpen = true"
                    class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm flex items-center gap-2">
                    <i class="pi pi-download"></i>
                    Exportar PDF
                </button>
                <button @click="isReportModalOpen = true"
                    class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm flex items-center gap-2">
                    <i class="pi pi-file-excel"></i>
                    Exportar Excel
                </button>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <template v-if="isLoadingStats">
                <div v-for="i in 4" :key="i"
                    class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                    <div class="flex items-start justify-between">
                        <div class="w-full">
                            <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div class="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div class="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                        <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div v-for="(stat, index) in stats" :key="index"
                    class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div class="flex items-start justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500">{{ stat.title }}</p>
                            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ stat.value }}</h3>
                            <p
                                :class="[stat.trend > 0 ? 'text-green-600' : 'text-red-600', 'text-xs font-medium mt-2 flex items-center gap-1']">
                                <i :class="[stat.trend > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down', 'text-[10px]']"></i>
                                {{ Math.abs(stat.trend) }}% vs mes anterior
                            </p>
                        </div>
                        <div :class="[stat.color, 'p-3 rounded-lg']">
                            <i :class="[stat.icon, stat.textColor, 'text-xl']"></i>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Chart -->
            <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 class="text-lg font-bold text-gray-800 mb-6">Movimientos por Mes</h3>
                <div v-if="isLoadingCharts" class="h-64 w-full animate-pulse bg-gray-100 rounded-lg"></div>
                <div v-else ref="barChartRef" class="h-64 w-full"></div>
            </div>

            <!-- Donut Chart -->
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 class="text-lg font-bold text-gray-800 mb-6">Estado de Bienes</h3>
                <div v-if="isLoadingStats" class="h-48 w-full flex justify-center items-center animate-pulse">
                    <div class="w-32 h-32 rounded-full border-8 border-gray-200"></div>
                </div>
                <div v-else ref="donutChartRef" class="h-48 w-full flex justify-center"></div>

                <div v-if="isLoadingStats" class="mt-6 space-y-3 animate-pulse">
                    <div v-for="i in 3" :key="i" class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-gray-200"></div>
                            <div class="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div class="h-4 bg-gray-200 rounded w-8"></div>
                    </div>
                </div>
                <div v-else class="mt-6 space-y-3">
                    <div class="flex items-center justify-between text-sm">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-green-500"></div>
                            <span class="text-gray-600">Buenos</span>
                        </div>
                        <span class="font-medium text-gray-800">{{ donutStats.buenosPct }}%</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span class="text-gray-600">Regulares</span>
                        </div>
                        <span class="font-medium text-gray-800">{{ donutStats.regularesPct }}%</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-red-500"></div>
                            <span class="text-gray-600">Malos</span>
                        </div>
                        <span class="font-medium text-gray-800">{{ donutStats.malosPct }}%</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Activity Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100">
                <h3 class="text-lg font-bold text-gray-800">Actividad Reciente</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3">Bien</th>
                            <th class="px-6 py-3">Acción</th>
                            <th class="px-6 py-3">Usuario</th>
                            <th class="px-6 py-3">Fecha</th>
                            <th class="px-6 py-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <template v-if="isLoadingActivity">
                            <tr v-for="i in 5" :key="i" class="animate-pulse">
                                <td class="px-6 py-4">
                                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <div class="w-6 h-6 rounded-full bg-gray-200"></div>
                                        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="h-4 bg-gray-200 rounded w-24"></div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="h-6 bg-gray-200 rounded-full w-20"></div>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr v-for="(activity, index) in recentActivity" :key="index"
                                class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 font-medium text-gray-800">{{ activity.bien }}</td>
                                <td class="px-6 py-4">{{ activity.accion }}</td>
                                <td class="px-6 py-4 flex items-center gap-2">
                                    <div
                                        class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                        {{ activity.usuario.charAt(0) }}
                                    </div>
                                    {{ activity.usuario }}
                                </td>
                                <td class="px-6 py-4 text-gray-500">{{ activity.fecha }}</td>
                                <td class="px-6 py-4">
                                    <span :class="[activity.statusColor, 'px-2 py-1 rounded-full text-xs font-medium']">
                                        {{ activity.status }}
                                    </span>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
        <ModalReporteExcel :is-open="isReportModalOpen" @close="isReportModalOpen = false" />
        <ModalReportePDF :is-open="isPdfModalOpen" @close="isPdfModalOpen = false" />
        <ModalCodigosBarras :is-open="isBarcodeModalOpen" @close="isBarcodeModalOpen = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import ModalReporteExcel from '../components/ModalReporteExcel.vue';
import ModalReportePDF from '../components/ModalReportePDF.vue';
import ModalCodigosBarras from '../components/ModalCodigosBarras.vue';
import { bienService } from '../services/bienService';
import * as d3 from 'd3';

const stats = ref([
    {
        title: 'Total Bienes',
        value: '0',
        trend: 0,
        icon: 'pi pi-box',
        color: 'bg-blue-100',
        textColor: 'text-blue-600'
    },
    {
        title: 'Buenos',
        value: '0',
        trend: 0,
        icon: 'pi pi-check-circle',
        color: 'bg-green-100',
        textColor: 'text-green-600'
    },
    {
        title: 'Regulares',
        value: '0',
        trend: 0,
        icon: 'pi pi-exclamation-circle',
        color: 'bg-yellow-100',
        textColor: 'text-yellow-600'
    },
    {
        title: 'Malos',
        value: '0',
        trend: 0,
        icon: 'pi pi-times-circle',
        color: 'bg-red-100',
        textColor: 'text-red-600'
    },
]);

const chartData = ref<any[]>([]);
const barChartRef = ref<HTMLElement | null>(null);
const donutChartRef = ref<HTMLElement | null>(null);

const recentActivity = ref<any[]>([]);

const isReportModalOpen = ref(false);
const isPdfModalOpen = ref(false);
const isBarcodeModalOpen = ref(false);

const isLoadingStats = ref(true);
const isLoadingCharts = ref(true);
const isLoadingActivity = ref(true);

const donutStats = ref({
    total: 0,
    buenos: 0,
    regulares: 0,
    malos: 0,
    buenosPct: 0,
    regularesPct: 0,
    malosPct: 0
});

const renderBarChart = async () => {
    await nextTick();
    if (!barChartRef.value) return;

    // Clear previous chart
    d3.select(barChartRef.value).selectAll("*").remove();

    if (chartData.value.length === 0) {
        d3.select(barChartRef.value)
            .append("div")
            .attr("class", "flex items-center justify-center h-full text-gray-400")
            .text("No hay datos disponibles");
        return;
    }

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const containerWidth = barChartRef.value.clientWidth || 600; // Fallback width
    const containerHeight = barChartRef.value.clientHeight || 256; // Fallback height

    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    if (width <= 0 || height <= 0) return;

    const svg = d3.select(barChartRef.value)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.3);

    const y = d3.scaleLinear()
        .range([height, 0]);

    x.domain(chartData.value.map(d => d.label));
    y.domain([0, d3.max(chartData.value, d => Number(d.value)) || 100]); // Ensure number and fallback

    // Add X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "middle");

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5));

    // Bars
    svg.selectAll(".bar")
        .data(chartData.value)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d: any) => x(d.label) as number)
        .attr("width", x.bandwidth())
        .attr("y", (d: any) => y(Number(d.value)))
        .attr("height", (d: any) => height - y(Number(d.value)))
        .attr("fill", "#9333ea") // purple-600
        .attr("rx", 4)
        .on("mouseover", function (_event, d) {
            d3.select(this).attr("fill", "#7e22ce"); // purple-700

            // Tooltip
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", (x(d.label) as number) + x.bandwidth() / 2)
                .attr("y", y(Number(d.value)) - 5)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("fill", "#1f2937")
                .text(d.value);
        })
        .on("mouseout", function () {
            d3.select(this).attr("fill", "#9333ea");
            d3.select("#tooltip").remove();
        });
};

const renderDonutChart = async () => {
    await nextTick();
    if (!donutChartRef.value) return;

    // Clear previous chart
    d3.select(donutChartRef.value).selectAll("*").remove();

    const width = 200;
    const height = 200;
    const margin = 10;

    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(donutChartRef.value)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const data = {
        Buenos: donutStats.value.buenos,
        Regulares: donutStats.value.regulares,
        Malos: donutStats.value.malos
    };

    const color = d3.scaleOrdinal()
        .domain(["Buenos", "Regulares", "Malos"])
        .range(["#22c55e", "#eab308", "#ef4444"]); // green-500, yellow-500, red-500

    const pie = d3.pie()
        .value((d: any) => d[1])
        .sort(null);

    const data_ready = pie(Object.entries(data) as any);

    const arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.9); // Slightly thinner ring

    // Background circle (optional, for aesthetics)
    svg.append("circle")
        .attr("r", radius * 0.9)
        .attr("fill", "none")
        .attr("stroke", "#f3f4f6")
        .attr("stroke-width", radius * 0.3);

    svg.selectAll('allSlices')
        .data(data_ready)
        .join('path')
        .attr('d', arc as any)
        .attr('fill', (d: any) => color(d.data[0]) as string)
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.9)
        .on("mouseover", function () {
            d3.select(this).style("opacity", 1);
        })
        .on("mouseout", function () {
            d3.select(this).style("opacity", 0.9);
        });

    // Center text
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.5em")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .style("fill", "#1f2937")
        .text(donutStats.value.total);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1.0em")
        .style("font-size", "12px")
        .style("fill", "#6b7280")
        .text("Total Bienes");
};

const fetchStats = async () => {
    isLoadingStats.value = true;
    try {
        const res: any = await bienService.getStats();
        if (res.success) {
            const data = res.data;
            const total = data.total || 0;
            const buenos = data.buenos || 0;
            const regulares = data.regulares || 0;
            const malos = data.malos || 0;

            stats.value[0]!.value = total;
            stats.value[1]!.value = buenos;
            stats.value[2]!.value = regulares;
            stats.value[3]!.value = malos;

            donutStats.value = {
                total,
                buenos,
                regulares,
                malos,
                buenosPct: total > 0 ? Math.round((buenos / total) * 100) : 0,
                regularesPct: total > 0 ? Math.round((regulares / total) * 100) : 0,
                malosPct: total > 0 ? Math.round((malos / total) * 100) : 0
            };

            renderDonutChart();
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
    } finally {
        isLoadingStats.value = false;
    }
};

const fetchRecentActivity = async () => {
    isLoadingActivity.value = true;
    try {
        const res: any = await bienService.getRecentActivity();
        if (res.success) {
            recentActivity.value = res.data;
        }
    } catch (error) {
        console.error('Error fetching recent activity:', error);
    } finally {
        isLoadingActivity.value = false;
    }
};

const fetchChartData = async () => {
    isLoadingCharts.value = true;
    try {
        const res: any = await bienService.getMovementsChart();
        if (res.success) {
            chartData.value = res.data;
            renderBarChart();
        }
    } catch (error) {
        console.error('Error fetching chart data:', error);
    } finally {
        isLoadingCharts.value = false;
    }
};

// Handle resize
const handleResize = () => {
    renderBarChart();
    renderDonutChart();
};

onMounted(() => {
    fetchStats();
    fetchRecentActivity();
    fetchChartData();
    window.addEventListener('resize', handleResize);
});

watch(chartData, () => {
    renderBarChart();
});

watch(donutStats, () => {
    renderDonutChart();
});
</script>