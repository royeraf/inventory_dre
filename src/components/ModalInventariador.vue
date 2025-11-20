<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto"
  >
    <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6">
      <h3 class="text-xl font-semibold mb-4">Agregar inventariador</h3>
      <div class="col-span-2">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 "
        >
          Nombres
        </label>
        <input
          type="text"
          placeholder="Ingrese nombres"
          class="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        />
      </div>
      <div class="col-span-2">
        <label
          class="block mb-2 text-sm font-medium text-gray-900"
        >
          Primer Apellido
        </label>
        <input
          type="text"
          placeholder="Ingrese primer apellido"
          class="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        />
      </div>
      <div class="col-span-2">
        <label
          class="block mb-2 text-sm font-medium text-gray-900"
          >Segundo Apellido</label
        >
        <input
          type="text"
          placeholder="Ingrese segundo apellido"
          class="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        />
      </div>

      <button class="bg-green-600 text-white px-4 py-2 rounded mb-4">
        Guardar inventariador
      </button>
      <div class="flex justify-end">
        <button
          @click="$emit('close')"
          class="bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isOpen: Boolean,
});
</script>