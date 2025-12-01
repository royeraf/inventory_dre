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

      <!-- Acciones principales -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-col sm:flex-row gap-3">
          <button @click="abrirModalAgregar"
            class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 font-medium shadow-sm">
            <i class="pi pi-plus"></i>
            Agregar Bien
          </button>
          <button @click="openModalBarCode = true"
            class="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 font-medium shadow-sm">
            <i class="pi pi-barcode"></i>
            Escanear Código
          </button>
          <button @click="exportarDatos"
            class="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 font-medium shadow-sm ml-auto">
            <i class="pi pi-download"></i>
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
              <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input v-model="searchQuery" type="text" placeholder="Buscar por descripción, marca, modelo o código..."
                class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <button v-if="searchQuery" @click="searchQuery = ''"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i class="pi pi-times"></i>
              </button>
            </div>
          </div>

          <!-- Filtros -->
          <div class="flex flex-col sm:flex-row gap-3">


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
              <option v-for="ubic in ubicaciones" :key="ubic" :value="ubic">
                {{ ubic }}
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
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/3">
                  Denominación
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tipo
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
                <td class="px-4 py-3">
                  <div class="max-w-xs">
                    <div class="text-sm font-medium text-gray-900 truncate" :title="bien.detalle_bien">
                      {{ bien.detalle_bien }}
                    </div>
                    <div class="text-xs text-gray-500 truncate" :title="bien.descripcion">
                      {{ bien.descripcion }}
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {{ bien.tipo_origen }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <span :class="obtenerEstilosEstado(bien.estado).contenedor"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    <span :class="obtenerEstilosEstado(bien.estado).punto" class="w-2 h-2 rounded-full mr-1.5"></span>
                    {{ bien.estado_nombre }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                      {{ bien.responsable_nombre?.charAt(0) || '?' }}
                    </div>
                    <span class="truncate max-w-[150px]" :title="bien.responsable_nombre">
                      {{ bien.responsable_nombre }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <div class="flex gap-2">
                    <button @click="verDetalles(bien)"
                      class="inline-flex items-center justify-center w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200"
                      title="Ver detalles">
                      <i class="pi pi-eye text-sm"></i>
                    </button>
                    <button @click="editarBien(bien)"
                      class="inline-flex items-center justify-center w-8 h-8 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors duration-200"
                      title="Editar">
                      <i class="pi pi-pencil text-sm"></i>
                    </button>
                    <button @click="verMovimientos(bien)"
                      class="inline-flex items-center justify-center w-8 h-8 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors duration-200"
                      title="Ver movimientos">
                      <i class="pi pi-history text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="cargando">
                <td colspan="8" class="px-4 py-8">
                  <div class="flex flex-col items-center justify-center space-y-4">
                    <div class="relative w-12 h-12">
                      <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
                      <div
                        class="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin">
                      </div>
                    </div>
                    <p class="text-sm text-gray-500 font-medium animate-pulse">Cargando inventario...</p>
                  </div>
                </td>
              </tr>

              <tr v-if="paginatedData.length === 0 && !cargando">
                <td colspan="8" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center justify-center text-gray-500">
                    <i class="pi pi-search text-4xl mb-4 text-gray-300"></i>
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
              <button @click="fetchBienes(1)" :disabled="currentPage === 1"
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
              <button @click="fetchBienes(totalPages)" :disabled="currentPage === totalPages"
                class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                Última
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <modal-bien :isOpen="openModalBien" :bienToEdit="bienParaEditar" @close="cerrarModalBien" @save="onBienSaved" />
    <modal-detalle-bien v-if="bienSeleccionado" :isOpen="openModalDetalle" :bien="bienSeleccionado"
      @close="openModalDetalle = false" />
    <bar-code-modal :isOpen="openModalBarCode" @close="openModalBarCode = false" @search="handleSearch"
      @open-movimientos="verMovimientos" />

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
  estado: string;
  estado_nombre: string;
  responsable_nombre: string;
  responsable_id: number | null;
  ubicacion_id: number | null;
  ubicacion_nombre: string;
  serie?: string; // For export
  categoria?: string; // For export
}

const estadoEstilos = {
  "BUENO": {
    contenedor: "bg-green-100 text-green-800",
    punto: "bg-green-500",
  },
  "REGULAR": {
    contenedor: "bg-yellow-100 text-yellow-800",
    punto: "bg-yellow-500",
  },
  "MALO": {
    contenedor: "bg-red-100 text-red-800",
    punto: "bg-red-500",
  },
};

// Función para obtener el estilo de forma segura
const obtenerEstilosEstado = (estado: string) => {
  const estadoUpper = estado?.toUpperCase() || "";
  return (
    (estadoEstilos as any)[estadoUpper] || {
      contenedor: "bg-gray-100 text-gray-800", // Estilo por defecto
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

const onBienSaved = () => {
  recargarBienes();
  //fetchStats();
  cerrarModalBien();
};

const abrirModalAgregar = () => {
  bienParaEditar.value = undefined;
  openModalBien.value = true;
};

const cerrarModalBien = () => {
  openModalBien.value = false;
  bienParaEditar.value = undefined;
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
const bienParaEditar = ref<Bien | undefined>(undefined);
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


const estados = ref([
  { id: 1, nombre: "Bueno" },
  { id: 2, nombre: "Regular" },
  { id: 3, nombre: "Malo" },
]);

const ubicaciones = ref<string[]>([]);

const fetchUbicaciones = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/reportes/options`);
    if (response.ok) {
      const data = await response.json();
      ubicaciones.value = data.areas || [];
    }
  } catch (error) {
    console.error('Error fetching ubicaciones:', error);
  }
};

// Variables reactivas
const searchQuery = ref("");
const selectedEstado = ref("");
const selectedUbicacion = ref("");

// Watch filters to reset pagination
// Watch filters to reset pagination
watch([searchQuery, selectedEstado, selectedUbicacion], () => {
  fetchBienes(1);
});

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
      estado: selectedEstado.value,
      ubicacion: selectedUbicacion.value
    };

    const response = await bienService.getAll(params);
    const res = response as any;

    if (res.success) {
      // La respuesta ahora viene en res.data.data (array) y res.data.pagination (objeto)
      const responseData = res.data;
      bienes.value = responseData.data || [];
      if (responseData.pagination) {
        pagination.value = responseData.pagination;
      }
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

// Estadísticas
/*const estadisticas = ref({
  total: 0,
  buenos: 0,
  regulares: 0,
  malos: 0
});*/

/*const fetchStats = async () => {
  try {
    const res = await bienService.getStats() as any;
    if (res.success) {
      estadisticas.value = res.data;
    }
  } catch (e) {
    console.error("Error cargando estadísticas:", e);
  }
};*/

onMounted(() => {
  fetchBienes(1);
  //fetchStats();
  fetchUbicaciones();
});



const totalPages = computed(() => pagination.value.total_pages);

const paginatedData = computed(() => bienes.value);

const hasFiltrosActivos = computed(() => {
  return (
    searchQuery.value !== "" ||
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
  selectedEstado.value = "";
  selectedUbicacion.value = "";
  currentPage.value = 1;
};

const editarBien = (bien: Bien) => {
  bienParaEditar.value = bien;
  openModalBien.value = true;
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
      b.ubicacion_nombre || "",
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
