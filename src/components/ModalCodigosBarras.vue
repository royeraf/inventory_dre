<template>
    <div v-if="isOpen" @click="close"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md overflow-y-auto p-4">
        <div @click.stop class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Generar Códigos de Barras</h2>
                    <p class="text-sm text-gray-500 mt-1">Seleccione bienes para generar etiquetas PDF</p>
                </div>
                <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <i class="pi pi-times text-2xl"></i>
                </button>
            </div>

            <!-- Tabs -->
            <div class="px-6 py-3 border-b border-gray-200 flex gap-2 flex-shrink-0">
                <button @click="currentTab = 'selection'"
                    :class="currentTab === 'selection' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    class="px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                    <i class="pi pi-check-square mr-2"></i>
                    Selección Personalizada
                </button>
                <button @click="currentTab = 'offices'"
                    :class="currentTab === 'offices' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    class="px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                    <i class="pi pi-building mr-2"></i>
                    Por Oficinas
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6">
                <!-- Tab: Selección Personalizada -->
                <div v-if="currentTab === 'selection'" class="space-y-4">
                    <!-- Filters -->
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Oficina</label>
                                <select v-model="filters.office" @change="fetchBienes"
                                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                                    <option value="">Todas las oficinas</option>
                                    <option v-for="office in offices" :key="office" :value="office">{{ office }}
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                                <div class="relative">
                                    <input v-model="filters.search" @input="debouncedSearch" type="text"
                                        placeholder="Buscar por código o descripción..."
                                        class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                                    <i
                                        class="pi pi-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Loading -->
                    <div v-if="loading" class="text-center py-12">
                        <i class="pi pi-spin pi-spinner text-4xl text-blue-600"></i>
                        <p class="text-gray-600 mt-4">Cargando bienes...</p>
                    </div>

                    <!-- Dual List Picker -->
                    <div v-else class="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4">
                        <!-- Lista de Bienes Disponibles -->
                        <div class="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                            <div class="bg-gray-100 px-4 py-3 border-b border-gray-200">
                                <h4 class="font-semibold text-gray-700 flex items-center gap-2">
                                    <i class="pi pi-list text-blue-600"></i>
                                    Bienes Disponibles
                                    <span class="ml-auto text-sm font-normal text-gray-500">
                                        {{ availableBienes.length }} disponible(s)
                                    </span>
                                </h4>
                            </div>
                            <div class="p-2 border-b border-gray-200 bg-gray-50">
                                <input type="text" v-model="availableSearch" placeholder="Filtrar disponibles..."
                                    class="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                            </div>
                            <div class="flex-1 overflow-y-auto max-h-72 min-h-[200px]">
                                <div v-for="bien in filteredAvailableBienes" :key="bien.codigo_completo"
                                    @click="toggleAvailableSelection(bien)" :class="['px-3 py-2 cursor-pointer border-b border-gray-100 hover:bg-blue-50 transition-colors',
                                        tempSelectedAvailable.includes(bien) ? 'bg-blue-100' : '']">
                                    <div class="flex items-start gap-2">
                                        <input type="checkbox" :checked="tempSelectedAvailable.includes(bien)"
                                            @click.stop="toggleAvailableSelection(bien)"
                                            class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <div class="min-w-0 flex-1">
                                            <div class="text-sm font-mono font-medium text-gray-900">
                                                {{ bien.codigo_completo }}
                                            </div>
                                            <div class="text-xs text-gray-500 truncate" :title="bien.detalle_bien">
                                                {{ bien.detalle_bien }}
                                            </div>
                                            <div class="flex items-center gap-2 mt-1">
                                                <span class="text-xs text-gray-400">{{ bien.oficina }}</span>
                                                <span
                                                    :class="bien.tipo_registro === 'SIGA' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'"
                                                    class="px-1.5 py-0.5 rounded text-xs font-medium">
                                                    {{ bien.tipo_registro }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="filteredAvailableBienes.length === 0"
                                    class="px-4 py-8 text-center text-gray-400">
                                    <i class="pi pi-inbox text-3xl mb-2"></i>
                                    <p class="text-sm">No hay bienes disponibles</p>
                                </div>
                            </div>
                        </div>

                        <!-- Botones de Acción -->
                        <div class="flex lg:flex-col items-center justify-center gap-2 py-4">
                            <button @click="addSelected" :disabled="tempSelectedAvailable.length === 0"
                                class="w-12 h-10 lg:w-10 lg:h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                title="Agregar seleccionados">
                                <i class="pi pi-angle-right lg:pi-angle-right"></i>
                            </button>
                            <button @click="addAll" :disabled="availableBienes.length === 0"
                                class="w-12 h-10 lg:w-10 lg:h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                title="Agregar todos">
                                <i class="pi pi-angle-double-right"></i>
                            </button>
                            <button @click="removeSelected" :disabled="tempSelectedChosen.length === 0"
                                class="w-12 h-10 lg:w-10 lg:h-10 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                title="Quitar seleccionados">
                                <i class="pi pi-angle-left"></i>
                            </button>
                            <button @click="removeAll" :disabled="selectedBienes.length === 0"
                                class="w-12 h-10 lg:w-10 lg:h-10 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                title="Quitar todos">
                                <i class="pi pi-angle-double-left"></i>
                            </button>
                        </div>

                        <!-- Lista de Bienes Seleccionados -->
                        <div class="border border-green-200 rounded-lg overflow-hidden flex flex-col bg-green-50/30">
                            <div class="bg-green-100 px-4 py-3 border-b border-green-200">
                                <h4 class="font-semibold text-green-700 flex items-center gap-2">
                                    <i class="pi pi-check-circle text-green-600"></i>
                                    Bienes Seleccionados
                                    <span class="ml-auto text-sm font-normal text-green-600">
                                        {{ selectedBienes.length }} seleccionado(s)
                                    </span>
                                </h4>
                            </div>
                            <div class="p-2 border-b border-green-200 bg-green-50">
                                <input type="text" v-model="selectedSearch" placeholder="Filtrar seleccionados..."
                                    class="w-full border border-green-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                            </div>
                            <div class="flex-1 overflow-y-auto max-h-72 min-h-[200px]">
                                <div v-for="bien in filteredSelectedBienes" :key="bien.codigo_completo"
                                    @click="toggleChosenSelection(bien)" :class="['px-3 py-2 cursor-pointer border-b border-green-100 hover:bg-green-100 transition-colors',
                                        tempSelectedChosen.includes(bien) ? 'bg-green-200' : '']">
                                    <div class="flex items-start gap-2">
                                        <input type="checkbox" :checked="tempSelectedChosen.includes(bien)"
                                            @click.stop="toggleChosenSelection(bien)"
                                            class="mt-1 rounded border-green-300 text-green-600 focus:ring-green-500" />
                                        <div class="min-w-0 flex-1">
                                            <div class="text-sm font-mono font-medium text-gray-900">
                                                {{ bien.codigo_completo }}
                                            </div>
                                            <div class="text-xs text-gray-600 truncate" :title="bien.detalle_bien">
                                                {{ bien.detalle_bien }}
                                            </div>
                                            <div class="flex items-center gap-2 mt-1">
                                                <span class="text-xs text-gray-400">{{ bien.oficina }}</span>
                                                <span
                                                    :class="bien.tipo_registro === 'SIGA' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'"
                                                    class="px-1.5 py-0.5 rounded text-xs font-medium">
                                                    {{ bien.tipo_registro }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="filteredSelectedBienes.length === 0"
                                    class="px-4 py-8 text-center text-gray-400">
                                    <i class="pi pi-inbox text-3xl mb-2"></i>
                                    <p class="text-sm">No hay bienes seleccionados</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div v-if="pagination.total_pages > 1" class="flex justify-between items-center">
                        <div class="text-sm text-gray-600">
                            Mostrando {{ bienes.length }} de {{ pagination.total }} bienes
                        </div>
                        <div class="flex gap-2">
                            <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1"
                                class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Anterior
                            </button>
                            <span class="px-4 py-2 text-sm font-medium text-gray-700">
                                Página {{ pagination.page }} de {{ pagination.total_pages }}
                            </span>
                            <button @click="changePage(pagination.page + 1)"
                                :disabled="pagination.page === pagination.total_pages"
                                class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Tab: Por Oficinas -->
                <div v-if="currentTab === 'offices'" class="space-y-4">
                    <p class="text-sm text-gray-600">Seleccione una o más oficinas para generar códigos de barras de
                        todos sus
                        bienes.</p>

                    <div v-if="loadingOffices" class="text-center py-12">
                        <i class="pi pi-spin pi-spinner text-4xl text-blue-600"></i>
                        <p class="text-gray-600 mt-4">Cargando oficinas...</p>
                    </div>

                    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <label v-for="office in offices" :key="office"
                            class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <input type="checkbox" :value="office" v-model="selectedOffices"
                                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span class="text-sm font-medium text-gray-700">{{ office }}</span>
                        </label>
                    </div>

                    <div v-if="selectedOffices.length > 0"
                        class="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center">
                        <span class="text-sm font-medium text-blue-800">
                            {{ selectedOffices.length }} oficina(s) seleccionada(s)
                        </span>
                        <button @click="selectedOffices = []"
                            class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            Limpiar selección
                        </button>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
                <button @click="close"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                    Cancelar
                </button>
                <button @click="generatePDF" :disabled="isGenerating || !canGenerate"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <i v-if="isGenerating" class="pi pi-spin pi-spinner"></i>
                    <i v-else class="pi pi-file-pdf"></i>
                    {{ isGenerating ? 'Generando...' : 'Generar PDF' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';

interface Bien {
    codigo_completo: string;
    codigo_patrimonio: string;
    codigo_interno: string;
    detalle_bien: string;
    descripcion: string;
    oficina: string;
    fuente: string;
    tipo_registro: string;
}

const props = defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits(['close']);

const currentTab = ref<'selection' | 'offices'>('selection');
const offices = ref<string[]>([]);
const bienes = ref<Bien[]>([]);
const selectedBienes = ref<Bien[]>([]);
const selectedOffices = ref<string[]>([]);
const loading = ref(false);
const loadingOffices = ref(false);
const isGenerating = ref(false);

const filters = ref({
    office: '',
    search: ''
});

const pagination = ref({
    total: 0,
    page: 1,
    per_page: 50,
    total_pages: 0
});

// Dual list picker state
const availableSearch = ref('');
const selectedSearch = ref('');
const tempSelectedAvailable = ref<Bien[]>([]);
const tempSelectedChosen = ref<Bien[]>([]);

// Computed: bienes disponibles (los que no están seleccionados)
const availableBienes = computed(() => {
    return bienes.value.filter(b =>
        !selectedBienes.value.some(s => s.codigo_completo === b.codigo_completo)
    );
});

// Computed: filtrar bienes disponibles por búsqueda local
const filteredAvailableBienes = computed(() => {
    if (!availableSearch.value) return availableBienes.value;
    const search = availableSearch.value.toLowerCase();
    return availableBienes.value.filter(b =>
        b.codigo_completo.toLowerCase().includes(search) ||
        b.detalle_bien.toLowerCase().includes(search) ||
        b.oficina.toLowerCase().includes(search)
    );
});

// Computed: filtrar bienes seleccionados por búsqueda local
const filteredSelectedBienes = computed(() => {
    if (!selectedSearch.value) return selectedBienes.value;
    const search = selectedSearch.value.toLowerCase();
    return selectedBienes.value.filter(b =>
        b.codigo_completo.toLowerCase().includes(search) ||
        b.detalle_bien.toLowerCase().includes(search) ||
        b.oficina.toLowerCase().includes(search)
    );
});

// Toggle selección temporal en lista disponibles
const toggleAvailableSelection = (bien: Bien) => {
    const index = tempSelectedAvailable.value.findIndex(b => b.codigo_completo === bien.codigo_completo);
    if (index > -1) {
        tempSelectedAvailable.value.splice(index, 1);
    } else {
        tempSelectedAvailable.value.push(bien);
    }
};

// Toggle selección temporal en lista seleccionados
const toggleChosenSelection = (bien: Bien) => {
    const index = tempSelectedChosen.value.findIndex(b => b.codigo_completo === bien.codigo_completo);
    if (index > -1) {
        tempSelectedChosen.value.splice(index, 1);
    } else {
        tempSelectedChosen.value.push(bien);
    }
};

// Agregar seleccionados temporales a la lista de seleccionados
const addSelected = () => {
    selectedBienes.value.push(...tempSelectedAvailable.value);
    tempSelectedAvailable.value = [];
};

// Agregar todos los disponibles
const addAll = () => {
    selectedBienes.value.push(...availableBienes.value);
    tempSelectedAvailable.value = [];
};

// Quitar seleccionados temporales de la lista de seleccionados
const removeSelected = () => {
    selectedBienes.value = selectedBienes.value.filter(b =>
        !tempSelectedChosen.value.some(t => t.codigo_completo === b.codigo_completo)
    );
    tempSelectedChosen.value = [];
};

// Quitar todos los seleccionados
const removeAll = () => {
    selectedBienes.value = [];
    tempSelectedChosen.value = [];
};

const canGenerate = computed(() => {
    if (currentTab.value === 'selection') {
        return selectedBienes.value.length > 0;
    } else {
        return selectedOffices.value.length > 0;
    }
});

const close = () => {
    emit('close');
    resetForm();
};

const resetForm = () => {
    currentTab.value = 'selection';
    selectedBienes.value = [];
    selectedOffices.value = [];
    filters.value = { office: '', search: '' };
    pagination.value.page = 1;
    // Limpiar estado del dual list picker
    availableSearch.value = '';
    selectedSearch.value = '';
    tempSelectedAvailable.value = [];
    tempSelectedChosen.value = [];
};

const fetchOffices = async () => {
    loadingOffices.value = true;
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/barcode/offices`);
        const data = await response.json();
        if (data.success) {
            offices.value = data.offices || [];
        }
    } catch (error) {
        console.error('Error fetching offices:', error);
    } finally {
        loadingOffices.value = false;
    }
};

const fetchBienes = async () => {
    loading.value = true;
    try {
        const params = new URLSearchParams({
            page: pagination.value.page.toString(),
            per_page: pagination.value.per_page.toString()
        });

        if (filters.value.office) params.append('office', filters.value.office);
        if (filters.value.search) params.append('search', filters.value.search);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/barcode/bienes?${params}`);
        const data = await response.json();

        if (data.success) {
            bienes.value = data.data || [];
            pagination.value = data.pagination;
        }
    } catch (error) {
        console.error('Error fetching bienes:', error);
    } finally {
        loading.value = false;
    }
};

let searchTimeout: number;
const debouncedSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = window.setTimeout(() => {
        pagination.value.page = 1;
        fetchBienes();
    }, 500);
};

const changePage = (page: number) => {
    pagination.value.page = page;
    fetchBienes();
};

const generatePDF = async () => {
    isGenerating.value = true;
    try {
        let endpoint = '';
        let body = {};

        if (currentTab.value === 'selection') {
            endpoint = '/barcode/generate/selection';
            body = {
                bienes: selectedBienes.value.map(b => ({
                    codigo: b.codigo_completo,
                    detalle_bien: b.detalle_bien,
                    tipo_registro: b.tipo_registro,
                    oficina: b.oficina
                }))
            };
        } else {
            endpoint = '/barcode/generate/offices';
            body = {
                offices: selectedOffices.value
            };
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `codigos_barras_${new Date().getTime()}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            await Swal.fire({
                icon: 'success',
                title: '¡PDF Generado!',
                text: 'El archivo se ha descargado correctamente.',
                timer: 2000,
                showConfirmButton: false
            });
            close();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al generar el PDF',
            });
        }
    } catch (error) {
        console.error('Error generating PDF:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error inesperado al generar el PDF',
        });
    } finally {
        isGenerating.value = false;
    }
};

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        fetchOffices();
        fetchBienes();
    }
});

onMounted(() => {
    if (props.isOpen) {
        fetchOffices();
        fetchBienes();
    }
});
</script>
