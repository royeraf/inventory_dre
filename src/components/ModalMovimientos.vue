<template>
  <Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
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
              <div v-if="movimientos.length === 0" class="text-center py-12">
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
                          <p class="text-sm text-gray-500">{{ mov.fecha }}</p>
                        </div>
                        <span class="px-2.5 py-1 rounded-full text-xs font-medium" :class="getStatusClass(mov.estado)">
                          {{ mov.estado }}
                        </span>
                      </div>
                      <div class="space-y-2 text-sm mt-3 pt-3 border-t">
                        <p>
                          <span class="text-gray-600">De:</span>
                          <span class="font-medium text-gray-800 ml-2">{{
                            mov.desde
                            }}</span>
                        </p>
                        <p>
                          <span class="text-gray-600">Hacia:</span>
                          <span class="font-medium text-gray-800 ml-2">{{
                            mov.hacia
                            }}</span>
                        </p>
                        <p>
                          <span class="text-gray-600">Responsable:</span>
                          <span class="font-medium text-gray-800 ml-2">{{
                            mov.responsable
                            }}</span>
                        </p>
                        <p v-if="mov.observacion" class="pt-2 text-gray-600">
                          <i class="pi pi-info-circle mr-1"></i>
                          <span class="italic">{{ mov.observacion }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Registrar Tab -->
            <div v-if="activeTab === 'registrar'">
              <form @submit.prevent="submitMovimiento" class="space-y-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Tipo de Movimiento -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo de Movimiento</label>
                    <select v-model="form.tipo"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                      required>
                      <option disabled value="">Seleccione un tipo...</option>
                      <option>Asignación</option>
                      <option>Traslado</option>
                      <option>Devolución</option>
                      <option>Baja</option>
                    </select>
                  </div>

                  <!-- Fecha del Movimiento -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Fecha del Movimiento</label>
                    <input v-model="form.fecha" type="date"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Nueva Ubicación -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Nueva Ubicación</label>
                    <select v-model="form.ubicacion_id"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                      required>
                      <option disabled value="">Seleccione ubicación...</option>
                      <option v-for="ubic in ubicaciones" :key="ubic.id" :value="ubic.id">
                        {{ ubic.nombre }}
                      </option>
                    </select>
                    <input v-model="form.ubicacion_id" type="text"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required />
                  </div>

                  <!-- Nuevo Responsable -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Nuevo Responsable</label>
                    <select v-model="form.responsable_id"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                      required>
                      <option disabled value="">
                        Seleccione responsable...
                      </option>
                      <option v-for="resp in responsables" :key="resp.id" :value="resp.id">
                        {{ resp.nombre }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Observaciones -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Observaciones</label>
                  <textarea v-model="form.observacion" rows="4"
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
            <button v-if="activeTab === 'registrar'" @click="submitMovimiento" type="button"
              class="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium shadow-sm">
              <i class="pi pi-save"></i>
              Guardar Movimiento
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import { movimientoService } from '../services/movimientoService.ts'
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();


interface Bien {
  id: number;
  codigo_patrimonio: string;
  descripcion: string;
  ubicacion_id: number;
  responsable_id: number;
  estado?: string;
}

interface Movimiento {
  tipo: "Asignación" | "Traslado" | "Devolución" | "Baja";
  fecha: string;
  desde: string;
  hacia: string;
  responsable: string;
  estado: string;
  observacion?: string;
}

const props = defineProps<{
  isOpen: boolean;
  bien: Bien | null;
}>();

const emit = defineEmits(["close", "save-movimiento"]);

const activeTab = ref<"historial" | "registrar">("historial");

// --- Mock Data (reemplazar con llamadas a API) ---
const movimientos = ref<Movimiento[]>([]);
const ubicaciones = ref([
  { id: 1, nombre: "Oficina Principal - Huánuco" },
  { id: 2, nombre: "Almacén Central" },
  { id: 3, nombre: "Sala de Reuniones" },
  { id: 4, nombre: "Contabilidad" },
]);
const responsables = ref([
  { id: 1, nombre: "Juan Pérez García" },
  { id: 2, nombre: "María López Silva" },
  { id: 3, nombre: "Carlos Torres Ramírez" },
]);

// Formulario para nuevo movimiento
const form = reactive({
  bien_id: props.bien?.id,
  tipo: "",
  fecha: new Date().toISOString().substr(0, 10),
  ubicacion_id: "",
  responsable_id: "",
  observacion: "",
});

const resetForm = () => {
  form.tipo = "";
  form.fecha = new Date().toISOString().substr(0, 10);
  form.ubicacion_id = "";
  form.responsable_id = "";
  form.observacion = "";
};

const fetchMovimientos = async (bienId: number) => {
  console.log(`Fetching movimientos for bien ID: ${bienId}`);
  // Llamar a getById
  movimientoService.getById(bienId).then((response) => {
    const res = response as any;
    movimientos.value = res.data;
  });

};

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal && props.bien) {
      form.bien_id = props.bien.id;
      fetchMovimientos(props.bien.id);
      activeTab.value = "historial"; // Reset to history tab on open
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
};

const submitMovimiento = () => {
  if (!props.bien) {
    console.error("No bien selected");
    return;
  }

  const movimientoData = {
    bien_id: props.bien.id,
    tipo: form.tipo,
    fecha: form.fecha,
    ubicacion_origen: props.bien.ubicacion_id,
    ubicacion_destino: form.ubicacion_id,
    responsable_anterior: props.bien.responsable_id,
    responsable_nuevo: form.responsable_id,
    inventariador_id: auth.user?.id,
    observaciones: form.observacion,
  };

  movimientoService.create(movimientoData).then((response) => {
    console.log(movimientoData)
    console.log("Movimiento guardado exitosamente:", response);
    emit("save-movimiento", response);
    resetForm();
    activeTab.value = "historial";
    if (props.bien) fetchMovimientos(props.bien.id);
  });
};

// --- Helpers para UI ---
const getIconForMovement = (tipo: string) => {
  switch (tipo.toLowerCase()) {
    case "asignación":
      return "pi pi-user-plus text-blue-500";
    case "traslado":
      return "pi pi-arrow-right-arrow-left text-yellow-500";
    case "devolución":
      return "pi pi-undo text-green-500";
    case "baja":
      return "pi pi-trash text-red-500";
    default:
      return "pi pi-info-circle text-gray-500";
  }
};

const getStatusClass = (estado: string) => {
  switch (estado.toLowerCase()) {
    case "completado":
      return "bg-green-100 text-green-800";
    case "en proceso":
      return "bg-yellow-100 text-yellow-800";
    case "cancelado":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
</script>