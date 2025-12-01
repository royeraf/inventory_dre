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

                    <!-- Selected Count -->
                    <div v-if="selectedBienes.length > 0"
                        class="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center">
                        <span class="text-sm font-medium text-blue-800">
                            {{ selectedBienes.length }} bien(es) seleccionado(s)
                        </span>
                        <button @click="selectedBienes = []"
                            class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            Limpiar selección
                        </button>
                    </div>

                    <!-- Loading -->
                    <div v-if="loading" class="text-center py-12">
                        <i class="pi pi-spin pi-spinner text-4xl text-blue-600"></i>
                        <p class="text-gray-600 mt-4">Cargando bienes...</p>
                    </div>

                    <!-- Bienes Table -->
                    <div v-else class="border border-gray-200 rounded-lg overflow-hidden">
                        <div class="overflow-x-auto max-h-96">
                            <table class="w-full">
                                <thead class="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th class="px-4 py-3 text-left">
                                            <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected"
                                                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        </th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                            Código</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                            Detalle</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                            Oficina</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                            Tipo</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200">
                                    <tr v-for="bien in bienes" :key="bien.codigo_completo" class="hover:bg-gray-50">
                                        <td class="px-4 py-3">
                                            <input type="checkbox" :value="bien" v-model="selectedBienes"
                                                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        </td>
                                        <td class="px-4 py-3">
                                            <span class="font-mono text-sm font-medium text-gray-900">{{
                                                bien.codigo_completo }}</span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <div class="text-sm text-gray-900 max-w-xs truncate"
                                                :title="bien.detalle_bien">
                                                {{ bien.detalle_bien }}
                                            </div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span class="text-sm text-gray-700">{{ bien.oficina }}</span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span
                                                :class="bien.tipo_registro === 'SIGA' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'"
                                                class="px-2 py-1 rounded-full text-xs font-medium">
                                                {{ bien.tipo_registro }}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr v-if="bienes.length === 0">
                                        <td colspan="5" class="px-4 py-12 text-center text-gray-500">
                                            No se encontraron bienes
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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

const isAllSelected = computed(() => {
    return bienes.value.length > 0 && selectedBienes.value.length === bienes.value.length;
});

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

const toggleSelectAll = () => {
    if (isAllSelected.value) {
        selectedBienes.value = [];
    } else {
        selectedBienes.value = [...bienes.value];
    }
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
