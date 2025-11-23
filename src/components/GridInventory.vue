<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Inventario de Bienes
        </h1>
        <p class="text-gray-600">
          DRE Huánuco - Sistema de Gestión Patrimonial
        </p>
      </div>

      <!-- Tarjeta de estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <p class="text-sm text-gray-600 mb-1">Total de Bienes</p>
          <p class="text-2xl font-bold text-gray-900">{{ bienes.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <p class="text-sm text-gray-600 mb-1">Estado Bueno</p>
          <p class="text-2xl font-bold text-green-600">
            {{ estadisticas.buenos }}
          </p>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
          <p class="text-sm text-gray-600 mb-1">Estado Regular</p>
          <p class="text-2xl font-bold text-yellow-600">
            {{ estadisticas.regulares }}
          </p>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
          <p class="text-sm text-gray-600 mb-1">Estado Malo</p>
          <p class="text-2xl font-bold text-red-600">
            {{ estadisticas.malos }}
          </p>
        </div>
      </div>

      <!-- Acciones principales -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-col sm:flex-row gap-3">
          <button @click="openModalBien = true"
            class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 font-medium shadow-sm">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Bien
          </button>
          <button @click="openModalBarCode = true"
            class="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 font-medium shadow-sm">
            <i class="pi pi-barcode"></i>
            Escanear Código
          </button>
          <button @click="exportarDatos"
            class="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 font-medium shadow-sm ml-auto">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar
          </button>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Buscador -->
          <div class="flex-1">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input v-model="searchQuery" type="text" placeholder="Buscar por descripción, marca, modelo o código..."
                class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <button v-if="searchQuery" @click="searchQuery = ''"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Filtros -->
          <div class="flex flex-col sm:flex-row gap-3">
            <select v-model="selectedCategoria"
              class="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">📦 Todas las categorías</option>
              <option v-for="cat in categorias" :key="cat.id" :value="cat.nombre">
                {{ cat.nombre }}
              </option>
            </select>

            <select v-model="selectedEstado"
              class="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">🔧 Todos los estados</option>
              <option v-for="estado in estados" :key="estado.id" :value="estado.nombre">
                {{ estado.nombre }}
              </option>
            </select>

            <select v-model="selectedUbicacion"
              class="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">📍 Todas las ubicaciones</option>
              <option v-for="ubic in ubicaciones" :key="ubic.id" :value="ubic.nombre">
                {{ ubic.nombre }}
              </option>
            </select>

            <button v-if="hasFiltrosActivos" @click="limpiarFiltros"
              class="px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 font-medium">
              Limpiar filtros
            </button>
          </div>
        </div>

        <!-- Resumen de filtros -->
        <div v-if="pagination.total > 0" class="mt-3 text-sm text-gray-600">
          Mostrando {{ bienes.length }} de {{ pagination.total }} bienes
        </div>
      </div>

      <!-- Tabla de bienes -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Código Patrimonial
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Código Interno
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Categoría
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Denominación
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Marca
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Modelo
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tipo
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Color
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Serie / Dimensiones
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Responsable
                </th>

                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="!cargando" v-for="bien in paginatedData" :key="bien.id"
                class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="font-mono text-sm font-semibold text-gray-900">
                    {{ bien.codigo_patrimonio }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="text-sm text-gray-900">
                    {{ bien.codigo_interno }}
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ bien.categoria_nombre }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <!--<div class="text-sm text-gray-900">{{ bien.marca }}</div>
                  <div class="text-xs text-gray-500">{{ bien.modelo }}</div>-->
                  <div class="text-sm text-gray-900">
                    {{ bien.detalle_bien }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ bien.descripcion }}
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <!--{{
                    bien.ubicacion_id === 1
                      ? "Oficina Principal"
                      : bien.ubicacion_id === 2
                      ? "Contabilidad"
                      : bien.ubicacion_id === 3
                      ? "Administración"
                      : bien.ubicacion_id === 4
                      ? "Sala de reuniones"
                      : "Otra ubicación"
                }}-->
                  {{ bien.marca }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <!--<span
                    :class="{
                      'bg-green-100 text-green-800': bien.estado_id === 1,
                      'bg-yellow-100 text-yellow-800': bien.estado_id === 2,
                      'bg-red-100 text-red-800': bien.estado_id === 3,
                    }"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    <span
                      :class="{
                        'bg-green-500': bien.estado_id === 1,
                        'bg-yellow-500': bien.estado_id === 2,
                        'bg-red-500': bien.estado_id === 3,
                      }"
                      class="w-2 h-2 rounded-full mr-1.5"
                    ></span>
                    {{
                      bien.estado_id === 1
                        ? "Bueno"
                        : bien.estado_id === 2
                        ? "Regular"
                        : "Malo"
                    }}
                  </span>-->
                  {{ bien.modelo }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <!--{{
                    bien.responsable_id === 1
                      ? "Juan Pérez"
                      : bien.responsable_id === 2
                      ? "María Gómez"
                      : bien.responsable_id === 3
                      ? "Carlos Ruiz"
                      : "Sin asignar"
                  }}-->
                  {{ bien.tipo_origen }}
                </td>

                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {{ bien.color }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {{ bien.dimension || bien.numero_serie }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <span :class="obtenerEstilosEstado(bien.estado_id).contenedor"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    <span :class="obtenerEstilosEstado(bien.estado_id).punto"
                      class="w-2 h-2 rounded-full mr-1.5"></span>

                    {{ bien.estado_nombre }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {{ bien.responsable_nombre }}
                </td>

                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <div class="flex gap-2">
                    <button @click="verDetalles(bien)"
                      class="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors duration-200"
                      title="Ver detalles">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button @click="editarBien(bien)"
                      class="inline-flex items-center px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded transition-colors duration-200"
                      title="Editar">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="verMovimientos(bien)"
                      class="inline-flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded transition-colors duration-200"
                      title="Ver movimientos">
                      <i class="pi pi-truck"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="cargando">
                <td colspan="8" class="px-4 py-3">
                  <div class="animate-pulse space-y-3">
                    <div v-for="i in 3" :key="i" class="flex items-center gap-4">
                      <div class="h-10 bg-gray-200 rounded flex-1"></div>
                      <div class="h-10 bg-gray-200 rounded flex-1"></div>
                      <div class="h-10 bg-gray-200 rounded flex-1"></div>
                      <div class="h-10 bg-gray-200 rounded flex-1"></div>
                      <div class="h-10 bg-gray-200 rounded flex-1"></div>
                      <div class="h-10 bg-gray-200 rounded flex-1"></div>
                      <div class="h-10 bg-gray-200 rounded flex-1"></div>
                      <div class="h-10 bg-gray-200 rounded flex-1"></div>
                      <div class="h-10 bg-gray-200 rounded flex-1"></div>
                      <div class="h-10 bg-gray-200 rounded flex-1"></div>
                      <div class="h-10 bg-gray-200 rounded flex-1"></div>
                      <div class="h-10 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr v-if="paginatedData.length === 0 && !cargando">
                <td colspan="8" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center justify-center text-gray-500">
                    <svg class="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p class="text-lg font-medium mb-1">
                      No se encontraron bienes
                    </p>
                    <p class="text-sm">
                      Intenta ajustar los filtros de búsqueda
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div v-if="paginatedData.length > 0" class="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="text-sm text-gray-700">
              Mostrando
              <span class="font-medium">{{
                (pagination.page - 1) * pagination.per_page + 1
                }}</span>
              a
              <span class="font-medium">{{
                Math.min(pagination.page * pagination.per_page, pagination.total)
                }}</span>
              de
              <span class="font-medium">{{ pagination.total }}</span>
              resultados
            </div>

            <div class="flex items-center gap-2">
              <button @click="currentPage = 1" :disabled="currentPage === 1"
                class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                Primera
              </button>
              <button @click="prevPage" :disabled="currentPage === 1"
                class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                Anterior
              </button>

              <div class="flex gap-1">
                <button v-for="page in visiblePages" :key="page" @click="fetchBienes(page)" :class="{
                  'bg-blue-600 text-white': page === currentPage,
                  'bg-white text-gray-700 hover:bg-gray-50':
                    page !== currentPage,
                }"
                  class="px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg transition-colors duration-200">
                  {{ page }}
                </button>
              </div>

              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                Siguiente
              </button>
              <button @click="currentPage = totalPages" :disabled="currentPage === totalPages"
                class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                Última
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <modal-bien :isOpen="openModalBien" @close="openModalBien = false" @save="addBien" />
    <modal-detalle-bien v-if="bienSeleccionado" :isOpen="openModalDetalle" :bien="bienSeleccionado"
      @close="openModalDetalle = false" />
    <bar-code-modal :isOpen="openModalBarCode" @close="openModalBarCode = false" @search="handleSearch" />

    <!-- Add this with your other modals -->
    <modal-movimientos :isOpen="openModalMovimientos" :bien="bienParaMovimientos" @close="openModalMovimientos = false"
      @save-movimiento="handleSaveMovimiento" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import ModalBien from "./ModalBien.vue";
import ModalDetalleBien from "./ModalDetalleBien.vue";
import BarCodeModal from "./BarCodeModal.vue";
import { bienService } from "../services/bienService"; // ✅ Importar correctamente
import ModalMovimientos from "./ModalMovimientos.vue";

// ❌ ELIMINAR: import { open } from "fs"; // No funciona en el navegador

interface Bien {
  id: number;
  codigo_patrimonio: string;
  codigo_interno: string;
  categoria_nombre: string;
  detalle_bien: string;
  descripcion: string;
  marca: string;
  modelo: string;
  tipo_origen?: string;
  color?: string;
  dimension?: string;
  numero_serie?: string;
  estado_id: number;
  estado_nombre: string;
  responsable_nombre: string;
  responsable_id: number;
  estado?: string; // For statistics
  ubicacion: string;
  ubicacion_id: number;
  ubicacion_nombre: string;
  serie?: string; // For export
  categoria?: string; // For export
}

const estadoEstilos = {
  1: {
    contenedor: "bg-green-100 text-green-800",
    punto: "bg-green-500",
  },
  2: {
    contenedor: "bg-yellow-100 text-yellow-800",
    punto: "bg-yellow-500",
  },
  3: {
    contenedor: "bg-red-100 text-red-800",
    punto: "bg-red-500",
  },
};

// Función para obtener el estilo de forma segura (con un fallback por defecto)
const obtenerEstilosEstado = (id: number) => {
  return (
    (estadoEstilos as any)[id] || {
      contenedor: "bg-gray-100 text-gray-800", // Estilo por defecto si el ID no existe
      punto: "bg-gray-500",
    }
  );
};

const openModalMovimientos = ref(false);
const bienParaMovimientos = ref<Bien | null>(null);

const verMovimientos = (bien: Bien) => {
  bienParaMovimientos.value = bien;
  openModalMovimientos.value = true;
};

const handleSaveMovimiento = () => {
  console.log("Guardando movimiento para el bien:", bienParaMovimientos.value);
};

const addBien = () => {
  recargarBienes();
};

const openModalDetalle = ref(false);
const bienSeleccionado = ref<Bien | null>(null);

const handleSearch = ({
  barcode,
  searchType,
}: {
  barcode: string;
  searchType: string;
}) => {
  console.log("🔍 Buscando con:", barcode, "por tipo:", searchType);
  // Aquí puedes implementar la búsqueda por código de barras
  const bienEncontrado = bienes.value.find((b) => b.codigo_patrimonio === barcode);
  if (bienEncontrado) {
    verDetalles(bienEncontrado);
  } else {
    alert("Bien no encontrado");
  }
};

const verDetalles = (bien: Bien) => {
  bienSeleccionado.value = bien;
  openModalDetalle.value = true;
};

const openModalBien = ref(false);
const openModalBarCode = ref(false);

// Datos
const bienes = ref<Bien[]>([]);
const pagination = ref({
  page: 1,
  per_page: 10,
  total: 0,
  total_pages: 0
});
const cargando = ref(true);
const error = ref<string | null>(null);

// Filtros - Datos estáticos por ahora (puedes cargarlos desde el backend después)
const categorias = ref([
  { id: 1, nombre: "Monitores" },
  { id: 2, nombre: "Computadoras" },
  { id: 3, nombre: "Impresoras" },
  { id: 4, nombre: "Proyectores" },
]);

const estados = ref([
  { id: 1, nombre: "Bueno" },
  { id: 2, nombre: "Regular" },
  { id: 3, nombre: "Malo" },
]);

const ubicaciones = ref([
  { id: 1, nombre: "Oficina Principal" },
  { id: 2, nombre: "Contabilidad" },
  { id: 3, nombre: "Administración" },
  { id: 4, nombre: "Sala de reuniones" },
]);

// Variables reactivas
const searchQuery = ref("");
const selectedCategoria = ref("");
const selectedEstado = ref("");
const selectedUbicacion = ref("");

// Paginación
const currentPage = ref(1);

const fetchBienes = async (page = 1) => {
  try {
    cargando.value = true;
    error.value = null;

    const params = {
      page: page,
      per_page: pagination.value.per_page,
      search: searchQuery.value,
      categoria: selectedCategoria.value,
      estado: selectedEstado.value,
      ubicacion: selectedUbicacion.value
    };

    const response = await bienService.getAll(params);
    const res = response as any;

    if (res.success) {
      const data = res.data;
      bienes.value = data.data || [];
      pagination.value = data.pagination;
      currentPage.value = pagination.value.page;
    } else {
      error.value = res.message || "Error al cargar los datos.";
    }
  } catch (e: any) {
    console.error("Error cargando bienes:", e);
    error.value = "Error al cargar los datos";
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  fetchBienes(1);
});

// Watch filters to reset pagination
watch([searchQuery, selectedCategoria, selectedEstado, selectedUbicacion], () => {
  fetchBienes(1);
});



// Computed
const estadisticas = computed(() => {
  return {
    buenos: bienes.value.filter((b) => b.estado === "Bueno").length,
    regulares: bienes.value.filter((b) => b.estado === "Regular").length,
    malos: bienes.value.filter((b) => b.estado === "Malo").length,
    total: bienes.value.length,
  };
});



const totalPages = computed(() => pagination.value.total_pages);

const paginatedData = computed(() => bienes.value);

const hasFiltrosActivos = computed(() => {
  return (
    searchQuery.value !== "" ||
    selectedCategoria.value !== "" ||
    selectedEstado.value !== "" ||
    selectedUbicacion.value !== ""
  );
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    fetchBienes(currentPage.value + 1);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    fetchBienes(currentPage.value - 1);
  }
};

const limpiarFiltros = () => {
  searchQuery.value = "";
  selectedCategoria.value = "";
  selectedEstado.value = "";
  selectedUbicacion.value = "";
  currentPage.value = 1;
};

const editarBien = (bien: Bien) => {
  // Implementar lógica de edición
  alert(`Editar bien ${bien.codigo_patrimonio}`);
  // Podrías abrir un modal con los datos del bien para editar
};



const exportarDatos = () => {
  // Implementar exportación a Excel/CSV
  const csv = [
    [
      "Código",
      "Descripción",
      "Marca",
      "Modelo",
      "Serie",
      "Estado",
      "Ubicación",
    ],
    ...bienes.value.map((b) => [
      b.codigo_patrimonio,
      b.descripcion,
      b.marca || "",
      b.modelo || "",
      b.serie || "",
      b.estado || "",
      b.ubicacion || "",
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `inventario_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// Recargar datos después de agregar/editar
// Recargar datos después de agregar/editar
const recargarBienes = async () => {
  fetchBienes(currentPage.value);
};
</script>
