<template>
  <section
    class="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-6"
  >
    <div class="max-w-2xl">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">
        Bienvenido al Sistema de Gestión de Bienes
      </h1>
      <p class="text-gray-600 text-lg mb-8">
        Este sistema permite registrar, consultar y controlar los bienes
        asignados a cada responsable dentro de la institución. Facilita la
        gestión de inventarios, el seguimiento de activos y la generación de
        reportes de manera eficiente.
      </p>

      <router-link
        to="/login"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
      >
        Iniciar sesión
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>
