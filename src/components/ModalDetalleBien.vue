<template>
  <transition name="fade">
    <div v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
      @click.self="closeModal">
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all">
        <!-- Header con gradiente -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-white bg-opacity-20 p-2 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">
                  {{ bien.codigo_patrimonio + ' - ' + bien.codigo_interno }}
                </h2>
                <p class="text-blue-100 text-sm">
                  {{ bien.descripcion }}
                </p>
              </div>
            </div>
            <button @click="closeModal"
              class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="bg-gray-50 border-b border-gray-200">
          <nav class="flex px-6 -mb-px space-x-8" aria-label="Tabs">
            <button @click="activeTab = 'detalles'" :class="[
              activeTab === 'detalles'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
            ]">
              <svg :class="[
                activeTab === 'detalles'
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500',
                'w-5 h-5',
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Información General
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="overflow-y-auto max-h-[calc(90vh-240px)] p-6">
          <!-- Tab 1: Información General -->
          <div v-show="activeTab === 'detalles'" class="space-y-6">
            <!-- Información Principal -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Información Principal
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">
                    Código Patrimonial
                  </p>
                  <p class="text-base font-semibold text-gray-900 bg-white px-3 py-2 rounded-md">
                    {{ bien.codigo_patrimonio }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">
                    Código Interno
                  </p>
                  <p class="text-base font-semibold text-gray-900 bg-white px-3 py-2 rounded-md">
                    {{ bien.codigo_interno }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">
                    Estado del Bien
                  </p>
                  <div>
                    <span :class="{
                      'bg-green-100 text-green-800 border-green-200':
                        bien.estado_nombre === 'Bueno',
                      'bg-yellow-100 text-yellow-800 border-yellow-200':
                        bien.estado_nombre === 'Regular',
                      'bg-red-100 text-red-800 border-red-200':
                        bien.estado_nombre === 'Malo',
                    }" class="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold border">
                      <span :class="{
                        'bg-green-500': bien.estado_nombre === 'Bueno',
                        'bg-yellow-500': bien.estado_nombre === 'Regular',
                        'bg-red-500': bien.estado_nombre === 'Malo',
                      }" class="w-2 h-2 rounded-full mr-2"></span>
                      {{ bien.estado_nombre }}
                    </span>
                  </div>
                </div>
                <div class="md:col-span-2">
                  <p class="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">
                    Detalle bien
                  </p>
                  <p class="text-base text-gray-900 bg-white px-3 py-2 rounded-md">
                    {{ bien.detalle_bien }}
                  </p>
                </div>
                <div class="md:col-span-2">
                  <p class="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">
                    Descripción
                  </p>
                  <p class="text-base text-gray-900 bg-white px-3 py-2 rounded-md">
                    {{ bien.descripcion }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Características Técnicas -->
            <div class="bg-white rounded-lg border border-gray-200 p-5">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                Características Técnicas
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-gray-50 rounded-lg p-3">
                  <p class="text-xs text-gray-600 font-medium mb-1">
                    Categoría
                  </p>
                  <p class="text-sm font-semibold text-gray-900">
                    {{ bien.categoria_nombre }}
                  </p>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                  <p class="text-xs text-gray-600 font-medium mb-1">Marca</p>
                  <p class="text-sm font-semibold text-gray-900">
                    {{ bien.marca }}
                  </p>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                  <p class="text-xs text-gray-600 font-medium mb-1">Modelo</p>
                  <p class="text-sm font-semibold text-gray-900">
                    {{ bien.modelo }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Responsabilidad y Ubicación -->
            <div class="bg-white rounded-lg border border-gray-200 p-5">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Responsabilidad
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                  <div class="bg-blue-100 p-2 rounded-full">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600 font-medium">Responsable</p>
                    <p class="text-sm font-semibold text-gray-900">
                      {{ bien.responsable_nombre }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                  <div class="bg-green-100 p-2 rounded-full">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600 font-medium">Ubicación</p>
                    <p class="text-sm font-semibold text-gray-900">
                      {{ bien.ubicacion_nombre }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg border border-gray-200 p-5">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Observación
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                  <div class="bg-blue-100 p-2 rounded-full">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600 font-medium">Responsable</p>
                    <p class="text-sm font-semibold text-gray-900">
                      {{ bien.responsable_nombre }}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>



        </div>

        <!-- Footer -->
        <div class="flex justify-between items-center border-t bg-gray-50 px-6 py-4">
          <div class="text-sm text-gray-500">
            <span class="font-medium">Última actualización:</span>
            {{ fechaActualizacion }}
          </div>
          <div class="flex gap-3">
            <button @click="imprimirDetalles"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir
            </button>
            <button @click="closeModal"
              class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Bien {
  id: number;
  codigo_patrimonio: string;
  codigo_interno: string;
  descripcion: string;
  categoria_nombre: string;
  marca: string;
  modelo: string;
  ubicacion: string;
  estado: "Bueno" | "Regular" | "Malo";
  detalle_bien: string;
  estado_nombre: string;
  responsable_nombre: string;
  ubicacion_nombre: string;
}

interface Movimiento {
  tipo: "asignacion" | "traslado" | "devolucion" | "baja";
  fecha: string;
  desde: string;
  hacia: string;
  responsable: string;
  estado: string;
  detalle_bien: string;
  observacion?: string;
}

const props = defineProps<{
  isOpen: boolean;
  bien: Bien;
}>();

const emit = defineEmits(["close"]);

const activeTab = ref<"detalles" | "movimientos" | "ubicacion" | "asignacion">(
  "detalles"
);

// Datos del formulario de asignación
const asignForm = ref({
  nuevoResponsable: "",
  nuevaUbicacion: "",
  observacion: "",
});

// Datos de ejemplo (luego los reemplazas por API)
const responsables = ref([
  "Juan Pérez",
  "María López",
  "Carlos Ramírez",
  "Ana Torres",
]);
const ubicaciones = ref(["Almacén", "Oficina 1", "Oficina 2", "Contabilidad"]);

// Guardar asignación/reasignación
const guardarAsignacion = () => {
  if (!asignForm.value.nuevoResponsable || !asignForm.value.nuevaUbicacion) {
    alert("Completa todos los campos");
    return;
  }

  // Agrega al historial
  movimientos.value.unshift({
    tipo: "asignacion",
    fecha: new Date().toLocaleString("es-PE"),
    desde: props.bien.ubicacion,
    hacia: asignForm.value.nuevaUbicacion,
    responsable: asignForm.value.nuevoResponsable,
    estado: "Completado",
    observacion: asignForm.value.observacion,
  });

  // Actualiza el bien visualmente
  props.bien.responsable = asignForm.value.nuevoResponsable;
  props.bien.ubicacion = asignForm.value.nuevaUbicacion;

  // Resetear formulario
  asignForm.value = {
    nuevoResponsable: "",
    nuevaUbicacion: "",
    observacion: "",
  }; // Datos del formulario de asignación
  const asignForm = ref({
    nuevoResponsable: "",
    nuevaUbicacion: "",
    observacion: "",
  });

  // Datos de ejemplo (luego los reemplazas por API)
  const responsables = ref([
    "Juan Pérez",
    "María López",
    "Carlos Ramírez",
    "Ana Torres",
  ]);
  const ubicaciones = ref([
    "Almacén",
    "Oficina 1",
    "Oficina 2",
    "Contabilidad",
  ]);

  // Guardar asignación/reasignación
  const guardarAsignacion = () => {
    if (!asignForm.value.nuevoResponsable || !asignForm.value.nuevaUbicacion) {
      alert("Completa todos los campos");
      return;
    }

    // Agrega al historial
    movimientos.value.unshift({
      tipo: "asignacion",
      fecha: new Date().toLocaleString("es-PE"),
      desde: props.bien.ubicacion,
      hacia: asignForm.value.nuevaUbicacion,
      responsable: asignForm.value.nuevoResponsable,
      estado: "Completado",
      observacion: asignForm.value.observacion,
    });

    // Actualiza el bien visualmente
    props.bien.responsable = asignForm.value.nuevoResponsable;
    props.bien.ubicacion = asignForm.value.nuevaUbicacion;

    // Resetear formulario
    asignForm.value = {
      nuevoResponsable: "",
      nuevaUbicacion: "",
      observacion: "",
    };

    alert("Asignación guardada correctamente");
    activeTab.value = "movimientos";
  };

  alert("Asignación guardada correctamente");
  activeTab.value = "movimientos";
};

// Datos de ejemplo para movimientos
const movimientos = ref<Movimiento[]>([
  {
    tipo: "asignacion",
    fecha: "15/11/2024 10:30 AM",
    desde: "Almacén Central",
    hacia: "Oficina Principal",
    responsable: "Juan Pérez García",
    estado: "Completado",
    observacion: "Asignación inicial del equipo",
  },
  {
    tipo: "traslado",
    fecha: "20/10/2024 02:15 PM",
    desde: "Oficina Principal",
    hacia: "Contabilidad",
    responsable: "María López Silva",
    estado: "Completado",
    observacion: "Traslado por reorganización de oficinas",
  },
  {
    tipo: "traslado",
    fecha: "05/09/2024 09:00 AM",
    desde: "Contabilidad",
    hacia: "Oficina Principal",
    responsable: "Juan Pérez García",
    estado: "Completado",
  },
]);

// Fecha de última actualización
const fechaActualizacion = computed(() => {
  const fecha = new Date();
  return fecha.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

// Métodos
const closeModal = () => {
  activeTab.value = "detalles"; // Reset al cerrar
  emit("close");
};

const imprimirDetalles = () => {
  window.print();
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos para impresión */
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
