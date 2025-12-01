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
          class="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
          <!-- Loader Overlay -->
          <div v-if="isLoading"
            class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm transition-all duration-300">
            <div class="relative">
              <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p class="mt-4 text-lg font-semibold text-gray-700 animate-pulse">Registrando Bien...</p>
            <p class="text-sm text-gray-500">Por favor espere un momento</p>
          </div>
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
                  {{ isEditing ? 'Editar Bien' : 'Registrar Nuevo Bien' }}
                </h3>
                <p class="text-blue-100 text-sm">
                  {{ isEditing ? 'Modifique la información del bien' : 'Complete la información del bien patrimonial' }}
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

          <!-- Body con scroll -->
          <div class="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
            <form @submit.prevent="submitForm">
              <!-- Sección: Códigos -->
              <div class="mb-8">
                <h4
                  class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Códigos de Identificación
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <!-- Tipo de Origen -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Origen
                    </label>
                    <select v-model="tipo_origen" v-bind="tipo_origenProps" :disabled="isEditing"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                      :class="{ 'border-red-500': errors.tipo_origen }">
                      <option value="SIGA">SIGA</option>
                      <option value="Sobrante">Sobrante</option>
                    </select>
                    <p v-if="errors.tipo_origen" class="text-red-500 text-xs mt-1">
                      {{ errors.tipo_origen }}
                    </p>
                  </div>
                  <!-- Código Patrimonio -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Código Patrimonio
                      <span class="text-red-500">*</span>
                    </label>
                    <input v-model="codigo_patrimonio" v-bind="codigo_patrimonioProps" type="text"
                      placeholder="Ej: 123456" maxlength="10" :disabled="isEditing"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                      :class="{ 'border-red-500': errors.codigo_patrimonio }" />
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
                    <input v-model="codigo_interno" v-bind="codigo_internoProps" type="text" placeholder="Ej: INT-001"
                      maxlength="10" :disabled="isEditing"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                      :class="{ 'border-red-500': errors.codigo_interno }" />
                    <p v-if="errors.codigo_interno" class="text-red-500 text-xs mt-1">
                      {{ errors.codigo_interno }}
                    </p>
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
                  </div>
                  <!-- Alerta de Duplicado -->
                  <div v-if="isDuplicate" class="md:col-span-4 bg-red-50 border-l-4 border-red-500 p-4 mt-2">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm text-red-700">
                          <span class="font-bold">¡Código duplicado!</span> Este bien ya se encuentra registrado.
                        </p>
                        <div class="text-sm text-red-600 mt-2 space-y-1" v-if="duplicateInfo">
                          <p><span class="font-semibold">Código Completo:</span> {{ duplicateInfo.codigo_completo }}</p>
                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                            <p><span class="font-semibold">C. Patrimonial:</span> {{ duplicateInfo.codigo_patrimonio }}
                            </p>
                            <p><span class="font-semibold">C. Interno:</span> {{ duplicateInfo.codigo_interno }}</p>
                          </div>
                          <p><span class="font-semibold">Tipo Origen:</span> {{ duplicateInfo.tipo_origen }}</p>
                          <p><span class="font-semibold">Detalle:</span> {{ duplicateInfo.detalle_bien }}</p>
                          <p><span class="font-semibold">Descripción:</span> {{ duplicateInfo.descripcion }}</p>
                          <p><span class="font-semibold">Responsable:</span> {{ duplicateInfo.responsable }}</p>
                          <p><span class="font-semibold">Ubicación:</span> {{ duplicateInfo.ubicacion }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sección: Información Básica -->
              <div class="mb-8">
                <h4
                  class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Información Básica
                </h4>
                <div class="grid grid-cols-1 gap-4">
                  <!-- Detalle del Bien -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Detalle del Bien
                      <span class="text-red-500">*</span>
                    </label>
                    <input v-model="detalle_bien" v-bind="detalle_bienProps" type="text"
                      placeholder="Detalle breve del bien" maxlength="255"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      :class="{ 'border-red-500': errors.detalle_bien }" />
                    <p v-if="errors.detalle_bien" class="text-red-500 text-xs mt-1">
                      {{ errors.detalle_bien }}
                    </p>
                  </div>
                  <!-- Descripción -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Descripción
                      <span class="text-red-500">*</span>
                    </label>
                    <textarea v-model="descripcion" v-bind="descripcionProps" rows="3"
                      placeholder="Describa detalladamente el bien patrimonial..." maxlength="255"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      :class="{ 'border-red-500': errors.descripcion }"></textarea>
                    <div class="flex justify-end mt-1">
                      <p class="text-xs text-gray-500">
                        {{ descripcion.length }}/255 caracteres
                      </p>
                    </div>
                    <p v-if="errors.descripcion" class="text-red-500 text-xs mt-1">
                      {{ errors.descripcion }}
                    </p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Categoría -->
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Categoría
                      </label>
                      <select v-model="categoria_id" v-bind="categoria_idProps"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        :class="{ 'border-red-500': errors.categoria_id }">
                        <option value="">Seleccione...</option>
                        <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                          {{ cat.nombre }}
                        </option>
                      </select>
                      <p v-if="errors.categoria_id" class="text-red-500 text-xs mt-1">
                        {{ errors.categoria_id }}
                      </p>
                    </div>

                    <!-- Estado -->
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Estado
                        <span class="text-red-500">*</span>
                      </label>
                      <select v-model="estado_id" v-bind="estado_idProps"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        :class="{ 'border-red-500': errors.estado_id }">
                        <option value="">Seleccione...</option>
                        <option v-for="estado in estados" :key="estado.id" :value="estado.id">
                          {{ estado.nombre }}
                        </option>
                      </select>
                      <p v-if="errors.estado_id" class="text-red-500 text-xs mt-1">
                        {{ errors.estado_id }}
                      </p>
                    </div>


                  </div>
                </div>
              </div>

              <!-- Sección: Características Técnicas -->
              <div class="mb-8">
                <h4
                  class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  Características Técnicas
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Marca -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Marca
                    </label>
                    <input v-model="marca" v-bind="marcaProps" type="text" placeholder="Ej: Samsung, HP, Lenovo"
                      maxlength="100"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      :class="{ 'border-red-500': errors.marca }" />
                    <p v-if="errors.marca" class="text-red-500 text-xs mt-1">
                      {{ errors.marca }}
                    </p>
                  </div>
                  <!-- Modelo -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Modelo
                    </label>
                    <input v-model="modelo" v-bind="modeloProps" type="text" placeholder="Ej: S27R350, M404dn"
                      maxlength="100"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      :class="{ 'border-red-500': errors.modelo }" />
                    <p v-if="errors.modelo" class="text-red-500 text-xs mt-1">
                      {{ errors.modelo }}
                    </p>
                  </div>

                  <!-- Número de Serie -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Número de Serie
                    </label>
                    <input v-model="numero_serie" v-bind="numero_serieProps" type="text" placeholder="Ej: SN123456789"
                      maxlength="100"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      :class="{ 'border-red-500': errors.numero_serie }" />
                    <p v-if="errors.numero_serie" class="text-red-500 text-xs mt-1">
                      {{ errors.numero_serie }}
                    </p>
                  </div>
                  <!-- Dimensión -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Dimensión
                    </label>
                    <input v-model="dimension" v-bind="dimensionProps" type="text" placeholder="Ej: 10 x 20 x 30 cm"
                      maxlength="100"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      :class="{ 'border-red-500': errors.dimension }" />
                    <p v-if="errors.dimension" class="text-red-500 text-xs mt-1">
                      {{ errors.dimension }}
                    </p>
                  </div>

                  <!-- Color -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Color
                    </label>
                    <div class="flex gap-2">
                      <input v-model="color" v-bind="colorProps" type="text" placeholder="Ej: Negro, Gris"
                        maxlength="50"
                        class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        :class="{ 'border-red-500': errors.color }" />
                      <!--<input
                        v-model="form.color"
                        type="color"
                        class="w-14 h-11 border border-gray-300 rounded-lg cursor-pointer"
                      />-->
                    </div>
                    <p v-if="errors.color" class="text-red-500 text-xs mt-1">
                      {{ errors.color }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Sección: Fechas -->
              <div class="mb-8">
                <h4
                  class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Fechas
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Fecha de Adquisición -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha de Adquisición
                    </label>
                    <input v-model="fecha_adquisicion" v-bind="fecha_adquisicionProps" type="date"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      :class="{ 'border-red-500': errors.fecha_adquisicion }" />
                    <p v-if="errors.fecha_adquisicion" class="text-red-500 text-xs mt-1">
                      {{ errors.fecha_adquisicion }}
                    </p>
                  </div>
                  <!-- Fecha de Asignación -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha de Asignación
                    </label>
                    <input v-model="fecha_asignacion" v-bind="fecha_asignacionProps" type="date"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      :class="{ 'border-red-500': errors.fecha_asignacion }" />
                    <p v-if="errors.fecha_asignacion" class="text-red-500 text-xs mt-1">
                      {{ errors.fecha_asignacion }}
                    </p>
                  </div>

                  <!-- Fecha de Retiro -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha de Retiro
                    </label>
                    <input v-model="fecha_retiro" v-bind="fecha_retiroProps" type="date"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      :class="{ 'border-red-500': errors.fecha_retiro }" />
                    <p v-if="errors.fecha_retiro" class="text-red-500 text-xs mt-1">
                      {{ errors.fecha_retiro }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Sección: Ubicación y Responsabilidad -->
              <div class="mb-8">
                <h4
                  class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ubicación y Responsabilidad
                </h4>
                <div v-if="isEditing" class="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-yellow-700">
                        Para cambiar la ubicación, responsable o modalidad, debe registrar un <strong>Nuevo
                          Movimiento</strong>.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Ubicación -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Ubicación
                      <span class="text-red-500">*</span>
                    </label>
                    <input v-model="ubicacion" v-bind="ubicacionProps" type="text" placeholder="Ingrese la ubicación"
                      :disabled="isEditing"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                      :class="{ 'border-red-500': errors.ubicacion }" />
                    <p v-if="errors.ubicacion" class="text-red-500 text-xs mt-1">
                      {{ errors.ubicacion }}
                    </p>
                  </div>

                  <!-- Responsable -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Responsable
                      <span class="text-red-500">*</span>
                    </label>
                    <input v-model="responsable" v-bind="responsableProps" type="text"
                      placeholder="Ingrese el responsable" :disabled="isEditing"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                      :class="{ 'border-red-500': errors.responsable }" />
                    <p v-if="errors.responsable" class="text-red-500 text-xs mt-1">
                      {{ errors.responsable }}
                    </p>
                  </div>

                  <!-- Modalidad -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Modalidad del funcionario
                      <span class="text-red-500">*</span>
                    </label>
                    <select v-model="modalidad" v-bind="modalidadProps" :disabled="isEditing"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                      :class="{ 'border-red-500': errors.modalidad }">
                      <option value="">Seleccione...</option>
                      <option v-for="moda in modalidades" :key="moda.id" :value="moda.modalidad">
                        {{ moda.modalidad }}
                      </option>
                    </select>
                    <p v-if="errors.modalidad" class="text-red-500 text-xs mt-1">
                      {{ errors.modalidad }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Sección: Observaciones -->
              <div class="mb-6">
                <h4
                  class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Observaciones
                </h4>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Observaciones Adicionales
                  </label>
                  <textarea v-model="observacion" v-bind="observacionProps" rows="4"
                    placeholder="Ingrese observaciones adicionales o notas relevantes..."
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    :class="{ 'border-red-500': errors.observacion }"></textarea>
                  <p v-if="errors.observacion" class="text-red-500 text-xs mt-1">
                    {{ errors.observacion }}
                  </p>
                </div>
              </div>

              <!-- Resumen de datos -->
              <!-- Resumen de datos -->
              <div
                class="bg-gradient-to-br from-gray-50 to-blue-50 border border-blue-100 rounded-xl overflow-hidden shadow-sm">
                <div class="bg-blue-600 px-4 py-2 flex items-center justify-between">
                  <h4 class="text-sm font-bold text-white flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Resumen de Registro
                  </h4>
                  <span class="text-xs text-blue-100 bg-blue-700 px-2 py-0.5 rounded-full">Vista Previa</span>
                </div>

                <div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Código Generado Highlight -->
                  <div
                    class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center md:col-span-2">
                    <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Código Patrimonial
                      Completo</span>
                    <div
                      class="text-2xl font-mono font-bold text-blue-600 tracking-wide bg-blue-50 px-4 py-2 rounded-md border border-blue-100 w-full">
                      {{ codigoCompleto || "---" }}
                    </div>
                  </div>

                  <!-- Detalles -->
                  <div class="space-y-3">
                    <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span class="text-gray-500 text-sm">Código de Barras</span>
                      <span class="font-medium text-gray-800 font-mono text-sm">{{ codigoBarras || "---" }}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span class="text-gray-500 text-sm">Ubicación</span>
                      <span class="font-medium text-gray-800 text-sm text-right truncate ml-4 max-w-[150px]">{{
                        ubicacion || "---" }}</span>
                    </div>
                  </div>

                  <div class="space-y-3">
                    <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span class="text-gray-500 text-sm">Responsable</span>
                      <span class="font-medium text-gray-800 text-sm text-right truncate ml-4 max-w-[150px]">{{
                        responsable || "---" }}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span class="text-gray-500 text-sm">Estado</span>
                      <span class="font-medium text-gray-800 text-sm">
                        <span v-if="estado_id" class="px-2 py-0.5 rounded text-xs" :class="getStateClass(estado_id)">
                          {{ getStateName(estado_id) }}
                        </span>
                        <span v-else>---</span>
                      </span>
                    </div>
                  </div>

                  <div class="md:col-span-2 mt-2">
                    <p class="text-xs text-gray-500 mb-1">Descripción</p>
                    <p class="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200 italic">
                      {{ descripcion || "Sin descripción..." }}
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Footer con botones -->
          <div
            class="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end items-center gap-3">
            <button @click="cerrarModal" type="button"
              class="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
              Cancelar
            </button>
            <button @click="submitForm" type="button"
              class="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-sm">
              <svg v-if="!isEditing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {{ isEditing ? 'Actualizar Bien' : 'Guardar Bien' }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { bienService } from "../services/bienService";
import { useAuthStore } from "../stores/auth";
import { useForm } from "vee-validate";
import * as yup from "yup";
import Swal from 'sweetalert2';

const auth = useAuthStore();
const isLoading = ref(false);

const props = defineProps({
  isOpen: Boolean,
  bienToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(["close", "save"]);

// Datos de ejemplo
const categorias = [
  { id: 1, nombre: "Monitores" },
  { id: 2, nombre: "Computadoras" },
  { id: 3, nombre: "Impresoras" },
  { id: 4, nombre: "Proyectores" },
  { id: 5, nombre: "Mobiliario" },
  { id: 6, nombre: "Equipos de Red" },
];

const estados = [
  { id: 1, nombre: "Bueno" },
  { id: 2, nombre: "Regular" },
  { id: 3, nombre: "Malo" },
];

const modalidades = [
  { id: 1, modalidad: "CAP" },
  { id: 2, modalidad: "CAS" },
  { id: 3, modalidad: "OTROS" },
];

// Esquema de validación
const schema = yup.object({
  codigo_patrimonio: yup.string().required("El código patrimonial es requerido").max(10, "Máximo 10 caracteres"),
  codigo_interno: yup.string().required("El código interno es requerido").max(10, "Máximo 10 caracteres"),
  detalle_bien: yup.string().required("El detalle del bien es requerido").max(255, "Máximo 255 caracteres"),
  descripcion: yup.string().required("La descripción es requerida").max(255, "Máximo 255 caracteres"),
  categoria_id: yup.number().transform((v, o) => o === '' ? null : v).nullable(),
  estado_id: yup.number().required("El estado es requerido").typeError("Seleccione un estado"),
  tipo_origen: yup.string().nullable(),
  marca: yup.string().max(100, "Máximo 100 caracteres").nullable(),
  modelo: yup.string().max(100, "Máximo 100 caracteres").nullable(),
  numero_serie: yup.string().max(100, "Máximo 100 caracteres").nullable(),
  dimension: yup.string().max(100, "Máximo 100 caracteres").nullable(),
  color: yup.string().max(50, "Máximo 50 caracteres").nullable(),
  fecha_adquisicion: yup.string().nullable(),
  fecha_asignacion: yup.string().nullable(),
  fecha_retiro: yup.string().nullable(),
  ubicacion: yup.string().required("La ubicación es requerida"),
  responsable: yup.string().required("El responsable es requerido"),
  modalidad: yup.string().required("La modalidad es requerida"),
  observacion: yup.string().nullable(),
});

// Configuración del formulario
const { handleSubmit, errors, resetForm, defineField, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    tipo_origen: "SIGA",
    codigo_patrimonio: "",
    codigo_interno: "",
    detalle_bien: "",
    descripcion: "",
    categoria_id: "",
    marca: "",
    modelo: "",
    numero_serie: "",
    dimension: "",
    color: "",
    fecha_adquisicion: "",
    fecha_asignacion: "",
    fecha_retiro: "",
    ubicacion: "",
    estado_id: "",
    responsable: "",
    modalidad: "",
    observacion: "",
  }
});

const isEditing = computed(() => !!props.bienToEdit);

watch(() => props.bienToEdit, (newBien) => {
  if (newBien) {
    // Mapear estado nombre a ID
    const estadoObj = estados.find(e => e.nombre.toUpperCase() === newBien.estado?.toUpperCase());
    const estadoId = estadoObj ? estadoObj.id : "";

    setValues({
      tipo_origen: newBien.tipo_origen || "SIGA",
      codigo_patrimonio: newBien.codigo_patrimonio,
      codigo_interno: newBien.codigo_interno,
      detalle_bien: newBien.detalle_bien,
      descripcion: newBien.descripcion,
      categoria_id: newBien.categoria_id,
      marca: newBien.marca,
      modelo: newBien.modelo,
      numero_serie: newBien.numero_serie,
      dimension: newBien.dimension,
      color: newBien.color,
      fecha_adquisicion: newBien.fecha_adquisicion,
      fecha_asignacion: newBien.fecha_asignacion,
      fecha_retiro: newBien.fecha_retiro,
      ubicacion: newBien.ubicacion_nombre || newBien.ubicacion,
      estado_id: String(estadoId), // Convertir a string para evitar error de tipo
      responsable: newBien.responsable_nombre || newBien.responsable,
      modalidad: newBien.tipo_modalidad || "",
      observacion: newBien.observacion,
    });
  } else {
    resetForm();
  }
});

// Definición de campos
const [codigo_patrimonio, codigo_patrimonioProps] = defineField("codigo_patrimonio");
const [codigo_interno, codigo_internoProps] = defineField("codigo_interno");
const [detalle_bien, detalle_bienProps] = defineField("detalle_bien");
const [descripcion, descripcionProps] = defineField("descripcion");
const [categoria_id, categoria_idProps] = defineField("categoria_id");
const [estado_id, estado_idProps] = defineField("estado_id");
const [tipo_origen, tipo_origenProps] = defineField("tipo_origen");
const [marca, marcaProps] = defineField("marca");
const [modelo, modeloProps] = defineField("modelo");
const [numero_serie, numero_serieProps] = defineField("numero_serie");
const [dimension, dimensionProps] = defineField("dimension");
const [color, colorProps] = defineField("color");
const [fecha_adquisicion, fecha_adquisicionProps] = defineField("fecha_adquisicion");
const [fecha_asignacion, fecha_asignacionProps] = defineField("fecha_asignacion");
const [fecha_retiro, fecha_retiroProps] = defineField("fecha_retiro");
const [ubicacion, ubicacionProps] = defineField("ubicacion");
const [responsable, responsableProps] = defineField("responsable");
const [modalidad, modalidadProps] = defineField("modalidad");
const [observacion, observacionProps] = defineField("observacion");

// Computados
const codigoCompleto = computed(() => {
  if (codigo_patrimonio.value && codigo_interno.value) {
    let code = `${codigo_patrimonio.value}${codigo_interno.value}`;
    if (tipo_origen.value === "Sobrante") {
      code += "S";
    }
    return code;
  }
  return "";
});

const codigoBarras = computed(() => codigoCompleto.value);

// Verificación de duplicados
const isDuplicate = ref(false);
const duplicateInfo = ref<any>(null);
let debounceTimer: any = null;



watch(codigoCompleto, (newCode) => {
  if (!newCode || isEditing.value) {
    isDuplicate.value = false;
    duplicateInfo.value = null;
    return;
  }

  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    try {
      const res = await bienService.verifyCode(newCode) as any;
      if (res.success && res.data.exists) {
        isDuplicate.value = true;
        duplicateInfo.value = res.data.bien;
      } else {
        isDuplicate.value = false;
        duplicateInfo.value = null;
      }
    } catch (error) {
      console.error("Error verificando código:", error);
    }
  }, 500); // Debounce de 500ms
});

const getStateName = (id: any) => {
  const estado = estados.find(e => e.id == id);
  return estado ? estado.nombre : '---';
};

const getStateClass = (id: any) => {
  const numId = Number(id);
  if (numId === 1) return 'bg-green-100 text-green-700';
  if (numId === 2) return 'bg-yellow-100 text-yellow-700';
  if (numId === 3) return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
};

// Submit
const submitForm = handleSubmit(async (values) => {
  if (isDuplicate.value) {
    Swal.fire({
      icon: 'error',
      title: 'Código Duplicado',
      text: 'No se puede registrar el bien porque el código ya existe.',
      confirmButtonColor: '#3085d6',
    });
    return;
  }

  isLoading.value = true;
  try {
    // Mapear estado_id a nombre de estado
    const estadoNombre = estados.find(e => e.id === Number(values.estado_id))?.nombre.toUpperCase() || "BUENO";

    const payload = {
      codigo_patrimonio: values.codigo_patrimonio,
      codigo_interno: values.codigo_interno,
      tipo_origen: values.tipo_origen || "SIGA",
      descripcion: values.descripcion,
      detalle_bien: values.detalle_bien,
      marca: values.marca,
      modelo: values.modelo,
      numero_serie: values.numero_serie,
      color: values.color,
      estado: estadoNombre, // Enviar nombre del estado
      ubicacion: values.ubicacion,
      responsable: values.responsable,
      fecha_asignacion: values.fecha_asignacion,
      observacion: values.observacion || "Ninguna",
      inventariador_id: auth.user?.id,
      categoria_id: Number(values.categoria_id) || null,
      tipo_modalidad: values.modalidad, // Renombrar a tipo_modalidad
      dimension: values.dimension,
      fecha_adquisicion: values.fecha_adquisicion,
      fecha_retiro: values.fecha_retiro
    };

    let response;
    if (isEditing.value) {
      // Update
      response = await bienService.update(props.bienToEdit.id, payload);
    } else {
      // Create
      response = await bienService.create(payload);
    }

    const res = response as any;
    if (res.success) {
      await Swal.fire({
        icon: 'success',
        title: isEditing.value ? '¡Actualizado!' : '¡Registrado!',
        text: isEditing.value ? 'Bien actualizado exitosamente' : 'Bien registrado exitosamente',
        timer: 2000,
        showConfirmButton: false
      });
      emit("save", res.data);
      cerrarModal();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar: ' + res.message,
      });
    }
  } catch (error: any) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error Inesperado',
      text: 'Ocurrió un error al guardar el bien',
    });
  } finally {
    isLoading.value = false;
  }
});

const cerrarModal = () => {
  resetForm();
  emit("close");
};
</script>
