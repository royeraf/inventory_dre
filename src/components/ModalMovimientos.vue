<template>
  <Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4"
      @click.self="closeModal">
      <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="isOpen"
          class="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div
            class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div class="flex items-center gap-3">
              <div class="bg-white bg-opacity-20 p-2 rounded-lg">
                <i class="pi pi-truck text-white text-xl"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">
                  Movimientos del Bien
                </h3>
                <p class="text-indigo-100 text-sm">
                  {{ bien?.codigo_patrimonio }} - {{ bien?.descripcion }}
                </p>
              </div>
            </div>
            <button @click="closeModal" type="button"
              class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors duration-200">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <!-- Información del Bien -->
          <div class="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100 px-6 py-4 flex-shrink-0">
            <div class="flex items-start gap-4">
              <!-- Icono -->
              <div class="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <i class="pi pi-box text-white text-xl"></i>
              </div>

              <!-- Contenido -->
              <div class="min-w-0 flex-1">
                <!-- Denominación -->
                <p class="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Denominación del Bien</p>
                <p class="text-lg font-bold text-gray-900 leading-tight mb-3"
                  :title="bien?.detalle_bien || bien?.descripcion">
                  {{ bien?.detalle_bien || bien?.descripcion || 'Sin denominación' }}
                </p>

                <!-- Códigos y Tipo en una fila -->
                <div class="flex flex-wrap items-center gap-4">
                  <!-- Código Patrimonial -->
                  <div class="flex items-center gap-2">
                    <i class="pi pi-hashtag text-purple-500 text-sm"></i>
                    <span class="text-xs text-gray-500">Cód. Patrimonial:</span>
                    <span class="text-sm font-bold text-gray-900 font-mono">{{ bien?.codigo_patrimonio || 'N/A'
                      }}</span>
                  </div>

                  <!-- Código Interno -->
                  <div class="flex items-center gap-2">
                    <i class="pi pi-tag text-blue-500 text-sm"></i>
                    <span class="text-xs text-gray-500">Cód. Interno:</span>
                    <span class="text-sm font-bold text-gray-900 font-mono">{{ bien?.codigo_interno || 'N/A' }}</span>
                  </div>

                  <!-- Tipo Registro (SIGA/SOBRANTE) -->
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold"
                      :class="bien?.tipo_registro === 'SOBRANTE' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'">
                      {{ bien?.tipo_registro || 'SIGA' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="bg-gray-50 border-b border-gray-200 flex-shrink-0">
            <nav class="flex px-6 -mb-px space-x-6" aria-label="Tabs">
              <button @click="activeTab = 'historial'" :class="[
                activeTab === 'historial'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'group inline-flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              ]">
                <i class="pi pi-history"></i>
                Historial de Movimientos
              </button>
              <button @click="activeTab = 'registrar'" :class="[
                activeTab === 'registrar'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'group inline-flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              ]">
                <i class="pi pi-plus-circle"></i>
                Registrar Nuevo Movimiento
              </button>
            </nav>
          </div>

          <!-- Body -->
          <div class="overflow-y-auto p-6 flex-grow">
            <!-- Historial Tab -->
            <div v-if="activeTab === 'historial'">
              <!-- Loader -->
              <div v-if="isLoading" class="flex flex-col justify-center items-center py-12">
                <i class="pi pi-spin pi-spinner text-4xl text-purple-600 mb-3"></i>
                <span class="text-gray-500 font-medium">Cargando historial...</span>
              </div>

              <!-- Empty State -->
              <div v-else-if="movimientos.length === 0" class="text-center py-12">
                <i class="pi pi-inbox text-5xl text-gray-300 mb-4" style="line-height: 1"></i>
                <p class="text-gray-500 text-lg font-medium mb-2">
                  Sin movimientos registrados
                </p>
                <p class="text-gray-400 text-sm">
                  Este bien aún no tiene un historial de movimientos.
                </p>
              </div>

              <!-- Timeline -->
              <div v-else class="relative">
                <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div v-for="(mov, index) in movimientos" :key="index" class="relative flex gap-4 pb-8">
                  <!-- Icon -->
                  <div
                    class="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-purple-500 shadow-sm flex-shrink-0">
                    <i :class="getIconForMovement(mov.tipo)"></i>
                  </div>
                  <!-- Content -->
                  <div class="flex-1">
                    <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                      <div class="flex items-start justify-between mb-2">
                        <div>
                          <h4 class="font-semibold text-gray-800 capitalize">
                            {{ mov.tipo }}
                          </h4>
                          <p class="text-sm text-gray-500">{{ formatDate(mov.fecha) }}</p>
                        </div>
                      </div>
                      <div class="space-y-2 text-sm mt-3 pt-3 border-t">
                        <p v-if="mov.ubicacion_actual">
                          <span class="text-gray-600">Ubicación:</span>
                          <span class="font-medium text-gray-800 ml-2">{{
                            mov.ubicacion_actual
                            }}</span>
                        </p>
                        <p v-if="mov.responsable">
                          <span class="text-gray-600">Responsable:</span>
                          <span class="font-medium text-gray-800 ml-2">{{
                            mov.responsable
                            }}</span>
                        </p>
                        <p v-if="mov.modalidad_responsable">
                          <span class="text-gray-600">Modalidad:</span>
                          <span class="font-medium text-gray-800 ml-2">{{
                            mov.modalidad_responsable
                          }}</span>
                        </p>
                        <p v-if="mov.estado_movimiento || mov.estado">
                          <span class="text-gray-600">Estado del Bien:</span>
                          <span class="ml-2 px-2 py-0.5 rounded-full text-xs font-medium"
                            :class="getEstadoClass(mov.estado_movimiento || mov.estado)">
                            {{ mov.estado_movimiento || mov.estado }}
                          </span>
                        </p>

                        <p v-if="mov.inventariador_nombre">
                          <span class="text-gray-600">Registrado por:</span>
                          <span class="font-medium text-gray-800 ml-2">{{
                            mov.inventariador_nombre
                            }}</span>
                        </p>
                        <p v-if="mov.observaciones" class="pt-2 text-gray-600">
                          <i class="pi pi-info-circle mr-1"></i>
                          <span class="italic">{{ mov.observaciones }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Registrar Tab -->
            <div v-if="activeTab === 'registrar'">
              <form @submit="submitMovimiento" class="space-y-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Tipo de Movimiento -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo de Movimiento</label>
                    <select v-model="tipo" v-bind="tipoProps"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                      :class="{ 'border-red-500': errors.tipo }">
                      <option disabled value="">Seleccione un tipo...</option>
                      <option>Asignación</option>
                      <option>Traslado</option>
                      <option>Retiro</option>
                      <option>Baja</option>
                      <option>Cambio de Estado</option>
                    </select>
                    <p v-if="errors.tipo" class="mt-1 text-sm text-red-500">{{ errors.tipo }}</p>
                  </div>

                  <!-- Fecha del Movimiento -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Fecha del Movimiento</label>
                    <input v-model="fecha" v-bind="fechaProps" type="date"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      :class="{ 'border-red-500': errors.fecha }" />
                    <p v-if="errors.fecha" class="mt-1 text-sm text-red-500">{{ errors.fecha }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Nueva Ubicación -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Nueva Ubicación</label>
                    <input v-model="ubicacion_destino" v-bind="ubicacion_destinoProps" type="text"
                      placeholder="Ingrese la nueva ubicación"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      :class="{ 'border-red-500': errors.ubicacion_destino }" />
                    <p v-if="errors.ubicacion_destino" class="mt-1 text-sm text-red-500">{{ errors.ubicacion_destino }}
                    </p>
                  </div>

                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Nuevo Responsable -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Nuevo Responsable</label>
                    <input v-model="responsable_nuevo" v-bind="responsable_nuevoProps" type="text"
                      placeholder="Ingrese el nuevo responsable"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      :class="{ 'border-red-500': errors.responsable_nuevo }" />
                    <p v-if="errors.responsable_nuevo" class="mt-1 text-sm text-red-500">{{ errors.responsable_nuevo }}
                    </p>
                  </div>

                  <!-- Modalidad del Nuevo Responsable -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Modalidad del Responsable</label>
                    <select v-model="modalidad_responsable_nuevo" v-bind="modalidad_responsable_nuevoProps"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                      :class="{ 'border-red-500': errors.modalidad_responsable_nuevo }">
                      <option value="">Seleccione...</option>
                      <option v-for="moda in modalidades" :key="moda.id" :value="moda.modalidad">
                        {{ moda.modalidad }}
                      </option>
                    </select>
                    <p v-if="errors.modalidad_responsable_nuevo" class="mt-1 text-sm text-red-500">{{
                      errors.modalidad_responsable_nuevo }}</p>
                  </div>
                </div>

                <!-- Observaciones -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Observaciones</label>
                  <textarea v-model="observaciones" v-bind="observacionesProps" rows="4"
                    placeholder="Motivo del movimiento, estado del bien, etc."
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"></textarea>
                </div>
              </form>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end items-center gap-3 flex-shrink-0">
            <button @click="closeModal" type="button"
              class="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium">
              Cancelar
            </button>
            <button v-if="activeTab === 'registrar'" @click="submitMovimiento" type="button" :disabled="isSubmitting"
              class="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <i v-if="isSubmitting" class="pi pi-spin pi-spinner"></i>
              <i v-else class="pi pi-save"></i>
              {{ isSubmitting ? 'Guardando...' : 'Guardar Movimiento' }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { movimientoService } from '../services/movimientoService.ts'
import { useAuthStore } from "../stores/auth";
import { useForm } from "vee-validate";
import * as yup from "yup";
import Swal from 'sweetalert2';

const auth = useAuthStore();


interface Bien {
  id: number;
  codigo_patrimonio: string;
  codigo_interno?: string;
  codigo_completo?: string;
  descripcion: string;
  detalle_bien?: string;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  serie?: string;
  color?: string;
  dimension?: string;
  tipo_origen?: string;
  tipo_registro?: string;
  ubicacion_id: number | null;
  ubicacion_nombre?: string;
  responsable_id: number | null;
  responsable_nombre?: string;
  tipo_modalidad?: string;
  estado?: string;
  estado_nombre?: string;
  observacion?: string;
}

interface Movimiento {
  id: number;
  bien_id: number;
  tipo: string;
  fecha: string;
  ubicacion_actual?: string | null;
  responsable?: string | null;
  modalidad_responsable?: string | null;
  inventariador_id?: number;
  inventariador_nombre?: string;
  documento_id?: number | null;
  observaciones?: string;
  estado?: string; // Estado del bien en el momento del movimiento
  estado_movimiento?: string; // Alias del estado guardado
}

const props = defineProps<{
  isOpen: boolean;
  bien: Bien | null;
}>();

const emit = defineEmits(["close", "save-movimiento"]);

const activeTab = ref<"historial" | "registrar">("historial");
const isLoading = ref(false);
const movimientos = ref<Movimiento[]>([]);

const modalidades = [
  { id: 1, modalidad: "CAP" },
  { id: 2, modalidad: "CAS" },
  { id: 3, modalidad: "OTROS" },
];

// Esquema de validación
const schema = yup.object({
  tipo: yup.string().required("El tipo de movimiento es requerido").oneOf(['Asignación', 'Traslado', 'Retiro', 'Baja', 'Cambio de Estado'], "Tipo de movimiento inválido"),
  fecha: yup.string().required("La fecha es requerida"),
  ubicacion_destino: yup.string().required("La nueva ubicación es requerida"),
  responsable_nuevo: yup.string().required("El nuevo responsable es requerido"),
  modalidad_responsable_nuevo: yup.string().required("La modalidad es requerida"),
  observaciones: yup.string().nullable(),
});

// Configuración del formulario
const { handleSubmit, resetForm, errors, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    tipo: "",
    fecha: new Date().toISOString().substr(0, 10),
    ubicacion_destino: "",
    responsable_nuevo: "",
    modalidad_responsable_nuevo: "",
    observaciones: "",
  },
});

const [tipo, tipoProps] = defineField("tipo");
const [fecha, fechaProps] = defineField("fecha");
const [ubicacion_destino, ubicacion_destinoProps] = defineField("ubicacion_destino");
const [responsable_nuevo, responsable_nuevoProps] = defineField("responsable_nuevo");
const [modalidad_responsable_nuevo, modalidad_responsable_nuevoProps] = defineField("modalidad_responsable_nuevo");
const [observaciones, observacionesProps] = defineField("observaciones");


const fetchMovimientos = async (bienId: number) => {
  console.log(`Fetching movimientos for bien ID: ${bienId}`);
  isLoading.value = true;
  movimientos.value = []; // Clear previous data

  try {
    const response = await movimientoService.getById(bienId);
    const res = response as any;
    if (res.movimientos) {
      movimientos.value = res.movimientos;
    } else if (Array.isArray(res)) {
      movimientos.value = res;
    } else if (res.data && Array.isArray(res.data)) {
      movimientos.value = res.data;
    } else {
      movimientos.value = [];
    }
  } catch (error) {
    console.error("Error fetching movimientos:", error);
    movimientos.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal && props.bien) {
      fetchMovimientos(props.bien.id);
      activeTab.value = "historial"; // Reset to history tab on open
      resetForm({
        values: {
          tipo: "",
          fecha: new Date().toISOString().substr(0, 10),
          ubicacion_destino: "",
          responsable_nuevo: "",
          modalidad_responsable_nuevo: "",
          observaciones: "",
        }
      });
    } else {
      // Clear data when modal closes
      movimientos.value = [];
    }
  }
);

onMounted(() => {
  if (props.bien) {
    fetchMovimientos(props.bien.id);
  }
});

const closeModal = () => {
  emit("close");
  resetForm();
  movimientos.value = []; // Clear data on close
};

const isSubmitting = ref(false);

const submitMovimiento = handleSubmit(async (values) => {
  if (!props.bien) {
    console.error("No bien selected");
    return;
  }

  isSubmitting.value = true;

  const movimientoData = {
    bien_id: props.bien.id,
    tipo: values.tipo,
    fecha: values.fecha,
    ubicacion_actual: values.ubicacion_destino, // Nueva ubicación
    responsable: values.responsable_nuevo, // Nuevo responsable
    modalidad_responsable: values.modalidad_responsable_nuevo, // Régimen del nuevo responsable
    inventariador_id: auth.user?.id,
    observaciones: values.observaciones,
    estado: props.bien.estado || "BUENO", // Estado actual del bien
  };

  try {
    const response = await movimientoService.create(movimientoData);
    console.log(movimientoData);
    console.log("Movimiento guardado exitosamente:", response);

    await Swal.fire({
      icon: 'success',
      title: '¡Movimiento Registrado!',
      text: 'El movimiento se ha guardado correctamente.',
      timer: 2000,
      showConfirmButton: false
    });

    emit("save-movimiento", response);
    resetForm();
    activeTab.value = "historial";
    if (props.bien) await fetchMovimientos(props.bien.id);
  } catch (error) {
    console.error("Error al guardar movimiento:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo guardar el movimiento. Intente nuevamente.',
    });
  } finally {
    isSubmitting.value = false;
  }
});

// --- Helpers para UI ---
const getIconForMovement = (tipo: string) => {
  switch (tipo.toLowerCase()) {
    case "asignación":
      return "pi pi-user-plus text-blue-500";
    case "traslado":
      return "pi pi-arrow-right-arrow-left text-yellow-500";
    case "devolución":
    case "retiro":
      return "pi pi-undo text-green-500";
    case "baja":
      return "pi pi-trash text-red-500";
    case "cambio de estado":
      return "pi pi-refresh text-orange-500";
    case "editado":
      return "pi pi-pencil text-amber-500";
    default:
      return "pi pi-info-circle text-gray-500";
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

// Función para obtener la clase CSS según el estado del bien
const getEstadoClass = (estado: string | undefined) => {
  if (!estado) return 'bg-gray-100 text-gray-800';

  const estadoUpper = estado.toUpperCase();
  const clases: Record<string, string> = {
    'BUENO': 'bg-green-100 text-green-800',
    'REGULAR': 'bg-yellow-100 text-yellow-800',
    'MALO': 'bg-red-100 text-red-800'
  };
  return clases[estadoUpper] || 'bg-gray-100 text-gray-800';
};
</script>