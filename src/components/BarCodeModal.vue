<template>
  <Transition
    :show="isOpen"
    appear
    enter-active-class="transition-opacity ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      @click="close"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 px-4"
    >
      <Transition
        :show="isOpen"
        appear
        enter-active-class="transition-all ease-out duration-300 transform"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="transition-all ease-in duration-200 transform"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div
          v-if="isOpen"
          @click.stop
          class="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <button
            @click="close"
            class="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Cerrar modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div class="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-6 w-6 text-blue-600"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <h2 id="modal-title" class="text-xl font-semibold text-gray-800">
              Buscar Bien
            </h2>
          </div>

          <div class="mt-6 space-y-4">
            <div>
              <label
                for="barcode"
                class="mb-1 block text-sm font-medium text-gray-700"
              >
                Código de Barras
              </label>
              <input
                id="barcode"
                type="text"
                v-model="barcode"
                placeholder="Escanee o escriba el código..."
                class="w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label
                for="searchType"
                class="mb-1 block text-sm font-medium text-gray-700"
              >
                Otras Opciones de Búsqueda
              </label>
              <select
                id="searchType"
                v-model="searchType"
                class="w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value="codigo_interno">Código Interno</option>
                <option value="descripcion">Descripción</option>
                <option value="categoria">Categoría</option>
              </select>
            </div>
          </div>

          <div class="mt-8 flex justify-end space-x-3">
            <button
              @click="close"
              type="button"
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              @click="search"
              type="button"
              class="rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Buscar
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, defineEmits, defineProps, watchEffect } from "vue";

const props = defineProps({
  isOpen: Boolean, // Estado del modal controlado por el padre
});

const emit = defineEmits(["close", "search"]);

const barcode = ref("");
const searchType = ref("codigo_interno"); // Valor por defecto

const close = () => emit("close");

const search = () => {
  emit("search", { barcode: barcode.value, searchType: searchType.value });
  // Opcional: Limpiar campos después de buscar
  // barcode.value = "";
  // searchType.value = "codigo_interno";
  close();
};

// --- MEJORA: Cerrar con la tecla "Escape" ---
watchEffect((onCleanup) => {
  const handleEscape = (e) => {
    if (e.key === "Escape" && props.isOpen) {
      close();
    }
  };

  if (props.isOpen) {
    document.addEventListener("keydown", handleEscape);
  }

  // La función 'onCleanup' se ejecuta cuando el 'watchEffect'
  // se vuelve a ejecutar o el componente se desmonta.
  onCleanup(() => {
    document.removeEventListener("keydown", handleEscape);
  });
});
</script>