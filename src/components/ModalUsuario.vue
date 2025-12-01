<template>
    <div v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md overflow-y-auto"
        @click.self="closeModal">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 my-6 flex flex-col max-h-[90vh]">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 class="text-xl font-bold text-gray-800">
                    {{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}
                </h3>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <i class="pi pi-times text-xl"></i>
                </button>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto custom-scrollbar">
                <form @submit.prevent="handleSubmit" class="space-y-6">

                    <!-- Grid Layout -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <!-- Nombre -->
                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                            <input v-model="form.nombre" type="text" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ej. Juan Pérez" />
                        </div>

                        <!-- DNI -->
                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                            <input v-model="form.dni" type="text" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ej. 12345678" />
                        </div>

                        <!-- Usuario -->
                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                            <input v-model="form.usuario" type="text" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ej. jperez" />
                        </div>

                        <!-- Correo -->
                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <input v-model="form.correo" type="email" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ej. juan@ejemplo.com" />
                        </div>

                        <!-- Rol -->
                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                            <select v-model="form.rol_id" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white">
                                <option value="" disabled>Seleccione un rol</option>
                                <option v-for="rol in roles" :key="rol.id" :value="rol.id">
                                    {{ rol.nombre }}
                                </option>
                            </select>
                        </div>

                        <!-- Contraseña -->
                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                                <span v-if="isEditing" class="text-xs text-gray-500 font-normal ml-1">(Opcional)</span>
                            </label>
                            <input v-model="form.contrasena" type="password" :required="!isEditing"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••" />
                        </div>

                        <!-- Activo (Solo en edición) -->
                        <div v-if="isEditing" class="col-span-2">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input v-model="form.activo" type="checkbox"
                                    class="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
                                <span class="text-sm font-medium text-gray-700">Usuario Activo</span>
                            </label>
                        </div>

                    </div>

                    <!-- Error Message -->
                    <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
                        <i class="pi pi-exclamation-circle"></i>
                        {{ error }}
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" @click="closeModal"
                            class="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" :disabled="isSubmitting"
                            class="px-5 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                            <i v-if="isSubmitting" class="pi pi-spin pi-spinner"></i>
                            {{ isEditing ? 'Actualizar' : 'Guardar' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { userService } from '../services/userService';

const props = defineProps<{
    isOpen: boolean;
    userToEdit?: any | null;
}>();

const emit = defineEmits(['close', 'save']);

const roles = ref<any[]>([]);
const isSubmitting = ref(false);
const error = ref('');

const form = reactive({
    nombre: '',
    dni: '',
    usuario: '',
    correo: '',
    contrasena: '',
    rol_id: '' as string | number,
    activo: true
});

const isEditing = computed(() => !!props.userToEdit);

// Fetch roles on mount
onMounted(async () => {
    try {
        const response: any = await userService.getRoles();
        roles.value = response.data || response;
    } catch (e) {
        console.error('Error fetching roles:', e);
    }
});

// Reset form when modal opens/closes or userToEdit changes
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        resetForm();
        if (props.userToEdit) {
            Object.assign(form, {
                nombre: props.userToEdit.nombre,
                dni: props.userToEdit.dni,
                usuario: props.userToEdit.usuario,
                correo: props.userToEdit.correo || props.userToEdit.email, // Handle both cases if backend varies
                rol_id: props.userToEdit.rol_id,
                activo: props.userToEdit.activo !== undefined ? !!props.userToEdit.activo : true,
                contrasena: '' // Always empty on edit
            });
        }
    }
});

const resetForm = () => {
    form.nombre = '';
    form.dni = '';
    form.usuario = '';
    form.correo = '';
    form.contrasena = '';
    form.rol_id = '';
    form.activo = true;
    error.value = '';
};

const closeModal = () => {
    emit('close');
    resetForm();
};

const handleSubmit = async () => {
    error.value = '';
    isSubmitting.value = true;

    try {
        const payload: any = {
            nombre: form.nombre,
            dni: form.dni,
            usuario: form.usuario,
            correo: form.correo,
            rol_id: form.rol_id,
        };

        if (form.contrasena) {
            payload.contrasena = form.contrasena;
        }

        if (isEditing.value) {
            payload.activo = form.activo ? 1 : 0;
            await userService.update(props.userToEdit.id, payload);
        } else {
            // For create, password is required (handled by HTML attribute, but good to check)
            if (!payload.contrasena) {
                throw new Error('La contraseña es obligatoria para nuevos usuarios');
            }
            await userService.create(payload);
        }

        emit('save');
        closeModal();
    } catch (e: any) {
        console.error('Error saving user:', e);
        error.value = e.response?.data?.message || e.message || 'Error al guardar el usuario';
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}
</style>
