<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">Ajustes de Cuenta</h1>
    <div class="bg-white p-6 rounded-lg shadow">
      <button
        @click="openModalInvetoriador = true"
        class="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 font-medium shadow-sm"
      >
        <i class="pi pi-user-plus"></i>
        Agregar Usuario
      </button>
    </div>
    <modal-inventariador
      :isOpen="openModalInvetoriador"
      @close="openModalInvetoriador = false"
      @save="addInventariador"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ModalInventariador from "../components/ModalInventariador.vue";

const openModalInvetoriador = ref(false);

const addInventariador = (nuevoInventariador: any) => {
  console.log("Nuevo inventariador:", nuevoInventariador);
};
// Lógica específica de la vista de ajustes
</script>