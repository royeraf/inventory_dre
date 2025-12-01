<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo y encabezado -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl mb-4 shadow-lg overflow-hidden">
          <img src="@/assets/logo.png" alt="Logo DRE" class="w-full h-full object-contain p-2" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Sistema de Inventario
        </h1>
        <p class="text-gray-600">DRE Huánuco</p>
      </div>

      <!-- Card del formulario -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-1">
            Iniciar sesión
          </h2>
          <p class="text-sm text-gray-500">
            Ingrese sus credenciales para acceder
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Campo usuario -->
          <div>
            <label for="dni" class="block text-sm font-medium text-gray-700 mb-2">
              DNI
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <input id="dni" v-model="dni" type="text" placeholder="Ingrese su DNI" maxlength="8"
                @input="dni = dni?.replace(/\D/g, '')"
                :class="{ 'border-red-500 focus:ring-red-500': dniError, 'border-gray-300 focus:ring-blue-500': !dniError }"
                class="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all outline-none" />
            </div>
            <p v-if="dniError" class="mt-1 text-sm text-red-600">{{ dniError }}</p>
          </div>

          <!-- Campo contraseña -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input id="password" v-model="password" type="password" placeholder="Ingrese su contraseña"
                :class="{ 'border-red-500 focus:ring-red-500': passwordError, 'border-gray-300 focus:ring-blue-500': !passwordError }"
                class="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all outline-none" />
            </div>
            <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
          </div>

          <!-- Mensaje de error -->
          <div v-if="auth.error" class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
            <svg class="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-700">{{ auth.error }}</p>
          </div>

          <!-- Botón de envío -->
          <button type="submit" :disabled="isLoading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span v-if="!isLoading">Iniciar sesión</span>
            <span v-else>Iniciando...</span>
          </button>
        </form>

        <!-- Información adicional -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-xs text-center text-gray-500">
            Solo personal autorizado. Si no tiene acceso, contacte al
            administrador del sistema.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6">
        <p class="text-sm text-gray-500">
          © 2025 DRE Huánuco. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import Swal from 'sweetalert2';

const isLoading = ref(false);
const auth = useAuthStore();
const router = useRouter();

// Esquema de validación
const schema = yup.object({
  dni: yup
    .string()
    .required("El DNI es obligatorio")
    .matches(/^\d{8}$/, "El DNI debe tener 8 dígitos numéricos"),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Configuración del formulario
const { handleSubmit } = useForm({
  validationSchema: schema,
});

// Campos
const { value: dni, errorMessage: dniError } = useField<string>("dni");
const { value: password, errorMessage: passwordError } = useField<string>("password");

const handleLogin = handleSubmit(async (values) => {
  isLoading.value = true;

  try {
    // auth.login lanza error si falla
    await auth.login(values.dni, values.password);

    // Si llega aquí es porque fue exitoso
    router.push("/protected");

  } catch (error: any) {
    console.error("Error al iniciar sesión:", error);

    // Usar el mensaje de error del store o del error capturado
    const errorMessage = auth.error || error.response?.data?.message || 'Ocurrió un error al intentar iniciar sesión';

    Swal.fire({
      icon: 'error',
      title: 'Error de Acceso',
      text: errorMessage,
      confirmButtonColor: '#2563EB',
    });
  } finally {
    isLoading.value = false;
  }
});
</script>
