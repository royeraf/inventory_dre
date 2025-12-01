<template>
    <div v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md overflow-y-auto">
        <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold text-gray-800">Generar Reporte PDF</h3>
                <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
                    <i class="pi pi-times text-xl"></i>
                </button>
            </div>

            <form @submit.prevent="generateReport" class="space-y-4">
                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700">Detalle del Bien</label>
                    <select v-model="form.detalle"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                        <option value="">Todos los detalles</option>
                        <option v-for="detalle in detallesOptions" :key="detalle" :value="detalle">
                            {{ detalle }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700">Estado</label>
                    <select v-model="form.estado"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                        <option value="">Todos los estados</option>
                        <option value="Bueno">Bueno</option>
                        <option value="Regular">Regular</option>
                        <option value="Malo">Malo</option>
                    </select>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" :disabled="isLoading"
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <i v-if="isLoading" class="pi pi-spin pi-spinner"></i>
                        <i v-else class="pi pi-file-pdf"></i>
                        {{ isLoading ? 'Generando...' : 'Descargar PDF' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { bienService } from '../services/bienService';

const props = defineProps({
    isOpen: Boolean,
});

const emit = defineEmits(['close']);

const isLoading = ref(false);
const detallesOptions = ref<string[]>([]);

const form = reactive({
    detalle: '',
    estado: ''
});

// Fetch options when component mounts
const fetchOptions = async () => {
    try {
        const res = await bienService.getDetallesOptions();
        detallesOptions.value = res;
    } catch (error) {
        console.error('Error fetching details:', error);
    }
};

onMounted(() => {
    fetchOptions();
});

const generateReport = async () => {
    isLoading.value = true;
    try {
        const blob = await bienService.generatePdfReport(form);

        // Create a link to download the blob
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `reporte_bienes_${new Date().getTime()}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        await Swal.fire({
            icon: 'success',
            title: '¡Reporte Generado!',
            text: 'El archivo PDF se ha descargado correctamente.',
            timer: 2000,
            showConfirmButton: false
        });
        emit('close');

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al generar el reporte.',
        });
    } finally {
        isLoading.value = false;
    }
};
</script>
