<template>
    <div v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md overflow-y-auto">
        <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold text-gray-800">Generar Reporte Excel</h3>
                <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
                    <i class="pi pi-times text-xl"></i>
                </button>
            </div>

            <form @submit.prevent="generateReport" class="space-y-4">
                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700">Sede</label>
                    <input v-model="form.sede" type="text" placeholder="Ingrese sede"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        required />
                </div>

                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700">Área</label>
                    <select v-model="form.area"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                        required>
                        <option value="" disabled>Seleccione área</option>
                        <option v-for="area in options.areas" :key="area" :value="area">
                            {{ area }}
                        </option>
                    </select>
                </div>



                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700">Responsable</label>
                    <select v-model="form.responsable" :disabled="!form.area"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white disabled:bg-gray-100 disabled:text-gray-400"
                        required>
                        <option value="" disabled>Seleccione responsable</option>
                        <option v-for="responsable in options.currentResponsables" :key="responsable"
                            :value="responsable">
                            {{ responsable }}
                        </option>
                    </select>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" :disabled="isLoading"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <i v-if="isLoading" class="pi pi-spin pi-spinner"></i>
                        <i v-else class="pi pi-download"></i>
                        {{ isLoading ? 'Generando...' : 'Descargar Reporte' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';

const props = defineProps({
    isOpen: Boolean,
});

const emit = defineEmits(['close']);

const isLoading = ref(false);
const isLoadingOptions = ref(false);

const options = reactive({
    responsables_by_area: {} as Record<string, string[]>,
    areas: [] as string[],
    currentResponsables: [] as string[]
});

const form = reactive({
    sede: '',
    area: '',
    responsable: ''
});

const fetchOptions = async () => {
    isLoadingOptions.value = true;
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/reportes/options`);
        if (response.ok) {
            const data = await response.json();
            options.areas = data.areas || [];
            options.responsables_by_area = data.responsables_by_area || {};
        } else {
            console.error('Error fetching options');
        }
    } catch (error) {
        console.error('Error fetching options:', error);
    } finally {
        isLoadingOptions.value = false;
    }
};

watch(() => form.area, (newArea) => {
    form.responsable = '';
    if (newArea && options.responsables_by_area[newArea]) {
        options.currentResponsables = options.responsables_by_area[newArea];
    } else {
        options.currentResponsables = [];
    }
});

onMounted(() => {
    fetchOptions();
});

const generateReport = async () => {
    isLoading.value = true;
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/reportes/bienes-responsable`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte_bienes_${new Date().getTime()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            await Swal.fire({
                icon: 'success',
                title: '¡Reporte Generado!',
                text: 'El archivo Excel se ha descargado correctamente.',
                timer: 2000,
                showConfirmButton: false
            });
            emit('close');
        } else {
            console.error('Error generating report');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al generar el reporte. Por favor intente nuevamente.',
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de Conexión',
            text: 'Ocurrió un error al conectar con el servidor.',
        });
    } finally {
        isLoading.value = false;
    }
};
</script>
