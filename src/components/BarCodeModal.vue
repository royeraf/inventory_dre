<template>
  <Transition :show="isOpen" appear enter-active-class="transition-opacity ease-out duration-300"
    enter-from-class="opacity-0" enter-to-class="opacity-100"
    leave-active-class="transition-opacity ease-in duration-200" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="isOpen" @click="close"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 px-4">
      <Transition :show="isOpen" appear enter-active-class="transition-all ease-out duration-300 transform"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="transition-all ease-in duration-200 transform"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
        <div v-if="isOpen" @click.stop
          class="relative w-full max-w-md rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh]" role="dialog"
          aria-modal="true" aria-labelledby="modal-title">

          <!-- Header Fijo -->
          <div class="px-6 pt-6 pb-2 flex-shrink-0">
            <button @click="close"
              class="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Cerrar modal">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-6 w-6 text-blue-600">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <h2 id="modal-title" class="text-xl font-semibold text-gray-800">
                Buscar Bien
              </h2>
            </div>
          </div>

          <!-- Contenido Scrollable -->
          <div class="px-6 pb-6 overflow-y-auto">
            <div class="mt-4">
              <div>
                <label for="barcode" class="mb-2 block text-sm font-semibold text-gray-700">
                  Código de Barras / Patrimonial
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="pi pi-barcode text-gray-400"></i>
                  </div>
                  <input id="barcode" type="text" v-model="barcode" @keyup.enter="handleSearch"
                    placeholder="Escanee o escriba el código..."
                    class="w-full pl-10 pr-4 py-3 rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-lg"
                    :disabled="loading" />
                  <div v-if="loading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                  </div>
                </div>
                <p class="mt-2 text-xs text-gray-500">
                  Presione <kbd class="px-2 py-1 bg-gray-100 rounded text-gray-600 font-mono">Enter</kbd> para buscar
                </p>
              </div>
            </div>

            <div class="mt-8 flex justify-end space-x-3">
              <button @click="close" type="button"
                class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                :disabled="loading">
                Cancelar
              </button>
              <button @click="handleSearch" type="button"
                class="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="loading || !barcode">
                <span v-if="!loading">Buscar</span>
                <span v-else>Buscando...</span>
              </button>
            </div>

            <!-- Resultados de búsqueda -->
            <Transition enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2">
              <div v-if="foundBien" class="mt-6 border-t border-gray-100 pt-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <i class="pi pi-check-circle text-green-500"></i>
                    Bien Encontrado
                  </h3>
                  <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {{ foundBien.codigo_patrimonio }}
                  </span>
                </div>

                <div class="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3 shadow-inner">
                  <div class="grid grid-cols-1 gap-3">
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="text-xs text-gray-500 uppercase tracking-wide font-semibold">Código Completo</p>
                        <p class="text-gray-900 font-bold font-mono text-lg">{{ foundBien.codigo_completo }}</p>
                      </div>
                      <span class="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded">
                        {{ foundBien.tipo_origen }}
                      </span>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-gray-500 uppercase tracking-wide font-semibold">C. Patrimonial</p>
                        <p class="text-gray-900 font-medium">{{ foundBien.codigo_patrimonio }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 uppercase tracking-wide font-semibold">C. Interno</p>
                        <p class="text-gray-900 font-medium">{{ foundBien.codigo_interno }}</p>
                      </div>
                    </div>

                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide font-semibold">Detalle</p>
                      <p class="text-gray-900 font-medium">{{ foundBien.detalle_bien }}</p>
                    </div>

                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide font-semibold">Descripción</p>
                      <p class="text-gray-900">{{ foundBien.descripcion }}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                      <div>
                        <p class="text-xs text-gray-500 uppercase tracking-wide font-semibold">Responsable</p>
                        <p class="text-gray-900">{{ foundBien.responsable }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 uppercase tracking-wide font-semibold">Ubicación</p>
                        <p class="text-gray-900">{{ foundBien.ubicacion }}</p>
                      </div>
                    </div>
                  </div>

                  <button @click="modificarMovimiento"
                    class="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    <i class="pi pi-truck text-xl"></i>
                    Gestionar Movimiento
                  </button>
                </div>
              </div>
            </Transition>

            <Transition enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0">
              <div v-if="error" class="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-700 font-medium">{{ error }}</p>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watchEffect, nextTick, watch } from "vue";
import { bienService } from "../services/bienService";

interface Bien {
  id: number;
  codigo_patrimonio: string;
  descripcion: string;
  responsable_nombre?: string;
  responsable?: string;
  ubicacion_nombre?: string;
  ubicacion?: string;
  [key: string]: any;
}

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close", "open-movimientos"]);

const barcode = ref("");
const foundBien = ref<Bien | null>(null);
const error = ref<string | null>(null);
const loading = ref(false);

const close = () => {
  barcode.value = "";
  foundBien.value = null;
  error.value = null;
  loading.value = false;
  emit("close");
};

const handleSearch = async () => {
  if (!barcode.value) return;

  error.value = null;
  foundBien.value = null;
  loading.value = true;

  try {
    // Usamos verifyCode ya que busca por código completo
    const res = await bienService.verifyCode(barcode.value) as any;

    if (res.success && res.data.exists) {
      foundBien.value = res.data.bien;
    } else {
      error.value = "No se encontró ningún bien con ese código.";
    }
  } catch (e) {
    console.error(e);
    error.value = "Error al buscar el bien.";
  } finally {
    loading.value = false;
  }
};

const modificarMovimiento = () => {
  if (foundBien.value) {
    emit("open-movimientos", foundBien.value);
    close();
  }
};

// Autofocus cuando se abre el modal
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    await nextTick();
    // Pequeño delay para asegurar que la animación terminó o el elemento está renderizado
    setTimeout(() => {
      const input = document.getElementById('barcode');
      if (input) input.focus();
    }, 100);
  }
});

// Cerrar con Escape
watchEffect((onCleanup) => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && props.isOpen) {
      close();
    }
  };

  if (props.isOpen) {
    document.addEventListener("keydown", handleEscape);
  }

  onCleanup(() => {
    document.removeEventListener("keydown", handleEscape);
  });
});
</script>