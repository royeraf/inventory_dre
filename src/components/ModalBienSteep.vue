<template>
  <!-- Backdrop con animación -->
  <Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4"
      @click.self="cerrarModal">
      <!-- Modal con animación -->
      <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="isOpen"
          class="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <!-- Header con gradiente -->
          <div
            class="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-white bg-opacity-20 p-2 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">
                  Registrar Nuevo Bien
                </h3>
                <p class="text-blue-100 text-sm">
                  Complete la información del bien patrimonial
                </p>
              </div>
            </div>
            <button @click="cerrarModal" type="button"
              class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Stepper de progreso -->
          <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <button v-for="(step, index) in steps" :key="index" @click="goToStep(index)"
                class="flex-1 flex items-center gap-2 group cursor-pointer"
                :class="{ 'pointer-events-none': index > maxStepReached }">
                <div
                  class="flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-all duration-200"
                  :class="{
                    'bg-blue-600 text-white': currentStep === index,
                    'bg-green-500 text-white': index < currentStep,
                    'bg-gray-200 text-gray-500': index > currentStep,
                  }">
                  <svg v-if="index < currentStep" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <span class="text-sm font-medium hidden sm:block" :class="{
                  'text-blue-600': currentStep === index,
                  'text-green-600': index < currentStep,
                  'text-gray-500': index > currentStep,
                }">
                  {{ step }}
                </span>
                <div v-if="index < steps.length - 1" class="flex-1 h-0.5 ml-2" :class="{
                  'bg-green-500': index < currentStep,
                  'bg-gray-200': index >= currentStep,
                }"></div>
              </button>
            </div>
          </div>

          <!-- Body con scroll -->
          <div class="overflow-y-auto max-h-[calc(90vh-220px)] p-6">
            <form @submit.prevent="submitForm">
              <!-- Paso 1: Información Básica -->
              <div v-show="currentStep === 0" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Código Patrimonio -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Código Patrimonio
                      <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input v-model="form.codigo_patrimonio" type="text" placeholder="Ej: CP-001"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        :class="{ 'border-red-500': errors.codigo_patrimonio }" required />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                      </div>
                    </div>
                    <p v-if="errors.codigo_patrimonio" class="text-red-500 text-xs mt-1">
                      {{ errors.codigo_patrimonio }}
                    </p>
                  </div>

                  <!-- Código Interno -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Código Interno
                      <span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.codigo_interno" type="text" placeholder="Ej: INT-123"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required />
                  </div>

                  <!-- Código Completo (Auto-generado) -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Código Completo
                      <span class="text-blue-600 text-xs">(Auto-generado)</span>
                    </label>
                    <div class="relative">
                      <input :value="codigoCompleto" type="text" readonly
                        class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg cursor-not-allowed"
                        placeholder="Se generará automáticamente" />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg v-if="codigoCompleto" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                      Formato: {{ codigoCompleto || 'CP-XXX-INT-XXX' }}
                    </p>
                  </div>

                  <!-- Código de Barras (Auto-generado) -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Código de Barras
                      <span class="text-blue-600 text-xs">(Auto-generado)</span>
                    </label>
                    <div class="relative">
                      <input :value="codigoBarras" type="text" readonly
                        class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg cursor-not-allowed"
                        placeholder="Se generará automáticamente" />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg v-if="codigoBarras" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                      Igual al código completo
                    </p>
                  </div>

                  <!-- Descripción -->
                  <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Descripción del Bien
                      <span class="text-red-500">*</span>
                    </label>
                    <textarea v-model="form.descripcion" rows="3"
                      placeholder="Describa detalladamente el bien patrimonial..."
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      required></textarea>
                    <div class="flex justify-between mt-1">
                      <p class="text-xs text-gray-500">
                        Incluya características relevantes del bien
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ form.descripcion.length }} caracteres
                      </p>
                    </div>
                  </div>

                  <!-- Categoría -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Categoría
                      <span class="text-red-500">*</span>
                    </label>
                    <select v-model="form.categoria_id"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                      required>
                      <option value="">Seleccione una categoría</option>
                      <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                        {{ cat.nombre }}
                      </option>
                    </select>
                  </div>

                  <!-- Estado -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Estado del Bien
                      <span class="text-red-500">*</span>
                    </label>
                    <select v-model="form.estado_id"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                      required>
                      <option value="">Seleccione el estado</option>
                      <option v-for="estado in estados" :key="estado.id" :value="estado.id">
                        {{ estado.nombre }}
                      </option>
                    </select>
                  </div>

                  <!-- Tipo de Origen -->
                  <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Origen
                      <span class="text-red-500">*</span>
                    </label>
                    <select v-model="form.tipo_origen"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                      required>
                      <option value="">Seleccione el tipo de origen</option>
                      <option value="SIGA">SIGA</option>
                      <option value="DONACION">Donación</option>
                      <option value="COMPRA">Compra</option>
                      <option value="TRANSFERENCIA">Transferencia</option>
                      <option value="OTROS">Otros</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Paso 2: Características -->
              <div v-show="currentStep === 1" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Marca -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Marca
                    </label>
                    <input v-model="form.marca" type="text" placeholder="Ej: Samsung, HP, Lenovo"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                  </div>

                  <!-- Modelo -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Modelo
                    </label>
                    <input v-model="form.modelo" type="text" placeholder="Ej: S27R350, M404dn"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                  </div>

                  <!-- Número de Serie -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Número de Serie
                    </label>
                    <input v-model="form.numero_serie" type="text" placeholder="Ej: SN123456"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                  </div>

                  <!-- Color -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Color
                    </label>
                    <div class="flex gap-2">
                      <input v-model="form.color" type="text" placeholder="Ej: Negro, Gris"
                        class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                      <input v-model="form.color" type="color"
                        class="w-14 h-11 border border-gray-300 rounded-lg cursor-pointer" />
                    </div>
                  </div>

                  <!-- Fecha de Adquisición -->
                  <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha de Adquisición
                    </label>
                    <input v-model="form.fecha_adquisicion" type="date"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                  </div>
                </div>
              </div>

              <!-- Paso 3: Ubicación y Responsabilidad -->
              <div v-show="currentStep === 2" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Ubicación -->
                  <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Ubicación
                      <span class="text-red-500">*</span>
                    </label>
                    <select v-model="form.ubicacion_id"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                      required>
                      <option value="">Seleccione la ubicación</option>
                      <option v-for="ubic in ubicaciones" :key="ubic.id" :value="ubic.id">
                        {{ ubic.nombre }}
                      </option>
                    </select>
                  </div>

                  <!-- Responsable -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Responsable
                      <span class="text-red-500">*</span>
                    </label>
                    <select v-model="form.responsable_id"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                      required>
                      <option value="">Seleccione responsable</option>
                      <option v-for="resp in responsables" :key="resp.id" :value="resp.id">
                        {{ resp.nombre }}
                      </option>
                    </select>
                  </div>



                  <!-- Observación -->
                  <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Observaciones
                    </label>
                    <textarea v-model="form.observacion" rows="4"
                      placeholder="Ingrese observaciones adicionales o notas relevantes..."
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"></textarea>
                  </div>
                </div>

                <!-- Resumen de datos antes de guardar -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 class="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Resumen de Registro
                  </h4>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div class="text-gray-600">Código Completo:</div>
                    <div class="font-medium text-gray-900">{{ codigoCompleto || 'N/A' }}</div>
                    <div class="text-gray-600">Código de Barras:</div>
                    <div class="font-medium text-gray-900">{{ codigoBarras || 'N/A' }}</div>
                    <div class="text-gray-600">Descripción:</div>
                    <div class="font-medium text-gray-900">{{ form.descripcion || 'N/A' }}</div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Footer con botones -->
          <div class="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <button v-if="currentStep > 0" @click="previousStep" type="button"
              class="flex items-center gap-2 px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>
            <div v-else></div>

            <div class="flex gap-3">
              <button @click="cerrarModal" type="button"
                class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
                Cancelar
              </button>

              <button v-if="currentStep < steps.length - 1" @click="nextStep" type="button"
                class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm">
                Siguiente
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button v-else @click="submitForm" type="button"
                class="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Guardar Bien
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { bienService } from "../services/bienService";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["close", "save"]);

// Stepper
const steps = [
  "Información Básica",
  "Características",
  "Ubicación y Responsables",
];
const currentStep = ref(0);
const maxStepReached = ref(0);

// Datos de ejemplo para select
const categorias = [
  { id: 1, nombre: "Monitores" },
  { id: 2, nombre: "Computadoras" },
  { id: 3, nombre: "Impresoras" },
  { id: 4, nombre: "Proyectores" },
  { id: 5, nombre: "Mobiliario" },
  { id: 6, nombre: "Equipos de Red" },
];

const ubicaciones = [
  { id: 1, nombre: "Oficina Principal - Huánuco" },
  { id: 2, nombre: "Almacén Central" },
  { id: 3, nombre: "Sala de Reuniones" },
  { id: 4, nombre: "Contabilidad" },
  { id: 5, nombre: "Administración" },
];

const estados = [
  { id: 1, nombre: "Bueno" },
  { id: 2, nombre: "Regular" },
  { id: 3, nombre: "Malo" },
  { id: 4, nombre: "Operativo" },
  { id: 5, nombre: "Sobrante" },
  { id: 6, nombre: "En Reparación" },
];

const responsables = [
  { id: 1, nombre: "Juan Pérez García" },
  { id: 2, nombre: "María López Silva" },
  { id: 3, nombre: "Carlos Torres Ramírez" },
  { id: 4, nombre: "Ana Gómez Vega" },
];

// Formulario reactivo
// Formulario reactivo
const form = reactive({
  codigo_patrimonio: "",
  codigo_interno: "",
  descripcion: "",
  categoria_id: "",
  marca: "",
  modelo: "",
  numero_serie: "",
  color: "",
  fecha_adquisicion: "",
  tipo_origen: "",
  ubicacion_id: "",
  estado_id: "",
  responsable_id: "",
  inventariador_id: auth.user?.id,
  observacion: "",
});

const codigoCompleto = computed(() => {
  if (form.codigo_patrimonio && form.codigo_interno) {
    return `${form.codigo_patrimonio}-${form.codigo_interno}`;
  }
  return "";
});

const codigoBarras = computed(() => {
  // El código de barras es igual al código completo
  return codigoCompleto.value;
});

// Errores
const errors = reactive({
  codigo_patrimonio: "",
});

// Funciones de navegación
const goToStep = (index: number) => {
  if (index <= maxStepReached.value) {
    currentStep.value = index;
  }
};

const nextStep = () => {
  if (validateCurrentStep()) {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++;
      if (currentStep.value > maxStepReached.value) {
        maxStepReached.value = currentStep.value;
      }
    }
  }
};

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const validateCurrentStep = (): boolean => {
  errors.codigo_patrimonio = "";

  if (currentStep.value === 0) {
    if (!form.codigo_patrimonio) {
      errors.codigo_patrimonio = "El código patrimonio es requerido";
      return false;
    }
    if (!form.codigo_interno || !form.descripcion || !form.categoria_id || !form.estado_id || !form.tipo_origen) {
      alert("Por favor complete todos los campos obligatorios");
      return false;
    }
  }

  if (currentStep.value === 2) {
    if (!form.ubicacion_id || !form.responsable_id) {
      // || !form.inventariador_id
      alert("Por favor complete la ubicación, el responsable y el inventariador");
      return false;
    }
  }

  return true;
};

// Función de envío
const submitForm = () => {
  if (!validateCurrentStep()) {
    return;
  }

  // Crear el objeto JSON según el formato especificado
  const bienData = {
    codigo_patrimonio: form.codigo_patrimonio,
    codigo_interno: form.codigo_interno,
    codigo_completo: codigoCompleto.value,
    descripcion: form.descripcion,
    categoria_id: parseInt(form.categoria_id),
    marca: form.marca || null,
    modelo: form.modelo || null,
    numero_serie: form.numero_serie || null,
    color: form.color || null,
    fecha_adquisicion: form.fecha_adquisicion || null,
    tipo_origen: form.tipo_origen,
    ubicacion_id: parseInt(form.ubicacion_id),
    estado_id: parseInt(form.estado_id),
    responsable_id: parseInt(form.responsable_id),
    inventariador_id: form.inventariador_id,
    observacion: form.observacion || null,
    codigo_barras: codigoBarras.value,
  };

  bienService
    .create(bienData)
    .then((response) => {
      const res = response as any;
      if (res.success) {
        alert("Bien registrado exitosamente");
        emit("save", { bienData: res.data });
        resetForm();
        emit("close");
      } else {
        alert("Error: " + res.message);
      }
    })
    .catch((error) => {
      console.error("Error al registrar el bien:", error);
      alert("Ocurrió un error al registrar el bien. Por favor, intente nuevamente.");
    });
};

const cerrarModal = () => {
  if (
    confirm("¿Está seguro que desea cerrar? Se perderán los datos ingresados.")
  ) {
    resetForm();
    emit("close");
  }
};

const resetForm = () => {
  Object.keys(form).forEach((key) => {
    form[key as keyof typeof form] =
      typeof form[key as keyof typeof form] === "number" ? null : "";
  });
  currentStep.value = 0;
  maxStepReached.value = 0;
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });
};
</script>