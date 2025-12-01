<template>
    <div class="p-6 space-y-6">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
                <p class="text-gray-500">Administra los usuarios y sus permisos en el sistema</p>
            </div>
            <button @click="openCreateModal"
                class="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 font-medium shadow-sm">
                <i class="pi pi-user-plus"></i>
                Nuevo Usuario
            </button>
        </div>

        <!-- Users Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div v-if="isLoading" class="p-12 text-center">
                <i class="pi pi-spin pi-spinner text-4xl text-purple-600 mb-3"></i>
                <p class="text-gray-500">Cargando usuarios...</p>
            </div>

            <div v-else class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-4">Usuario</th>
                            <th class="px-6 py-4">DNI / Username</th>
                            <th class="px-6 py-4">Rol</th>
                            <th class="px-6 py-4">Estado</th>
                            <th class="px-6 py-4">Fecha Registro</th>
                            <th class="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors group">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
                                        {{ user.nombre ? user.nombre.charAt(0).toUpperCase() : '?' }}
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">{{ user.nombre }}</p>
                                        <p class="text-gray-500 text-xs">{{ user.correo || user.email }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col">
                                    <span class="font-medium text-gray-900">{{ user.usuario }}</span>
                                    <span class="text-xs text-gray-500">DNI: {{ user.dni }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span :class="getRoleBadgeClass(user.rol_id)"
                                    class="px-2.5 py-1 rounded-full text-xs font-medium border">
                                    {{ getRoleName(user.rol_id) }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    :class="user.activo ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'"
                                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border">
                                    <span :class="user.activo ? 'bg-green-500' : 'bg-red-500'"
                                        class="w-1.5 h-1.5 rounded-full"></span>
                                    {{ user.activo ? 'Activo' : 'Inactivo' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-gray-500">
                                {{ formatDate(user.creado_en) }}
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div
                                    class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button @click="openEditModal(user)"
                                        class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar">
                                        <i class="pi pi-pencil"></i>
                                    </button>
                                    <button @click="confirmDelete(user)"
                                        class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar">
                                        <i class="pi pi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination (Mock) -->
            <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <span class="text-sm text-gray-500">Mostrando {{ users.length }} usuarios</span>
                <div class="flex gap-2">
                    <button
                        class="px-3 py-1 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        disabled>
                        <i class="pi pi-chevron-left text-xs"></i>
                    </button>
                    <button
                        class="px-3 py-1 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        disabled>
                        <i class="pi pi-chevron-right text-xs"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <ModalUsuario :isOpen="isModalOpen" :userToEdit="userToEdit" @close="closeModal" @save="handleUserSaved" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userService } from '../services/userService';
import ModalUsuario from '../components/ModalUsuario.vue';

const users = ref<any[]>([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const userToEdit = ref<any | null>(null);
const rolesMap = ref<Record<number, string>>({});

const fetchUsers = async () => {
    isLoading.value = true;
    try {
        const response: any = await userService.getAll();
        // Adaptar según la respuesta real de la API
        if (response.data) {
            users.value = response.data;
        } else if (Array.isArray(response)) {
            users.value = response;
        } else {
            users.value = [];
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        users.value = [];
    } finally {
        isLoading.value = false;
    }
};

const fetchRoles = async () => {
    try {
        const response: any = await userService.getRoles();
        const roles = response.data || response;
        if (Array.isArray(roles)) {
            rolesMap.value = roles.reduce((acc: any, role: any) => {
                acc[role.id] = role.nombre;
                return acc;
            }, {});
        }
    } catch (error) {
        console.error("Error fetching roles:", error);
    }
};

const openCreateModal = () => {
    userToEdit.value = null;
    isModalOpen.value = true;
};

const openEditModal = (user: any) => {
    userToEdit.value = user;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    userToEdit.value = null;
};

const handleUserSaved = () => {
    fetchUsers();
};

const confirmDelete = async (user: any) => {
    if (confirm(`¿Estás seguro de eliminar al usuario ${user.nombre}?`)) {
        try {
            await userService.delete(user.id);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("No se pudo eliminar el usuario");
        }
    }
}

const getRoleName = (rolId: number) => {
    return rolesMap.value[rolId] || 'Desconocido';
};

const getRoleBadgeClass = (rolId: number) => {
    // Simple logic for badge colors based on ID, can be improved
    const classes: Record<number, string> = {
        1: 'bg-purple-100 text-purple-700 border-purple-200', // Admin
        2: 'bg-blue-100 text-blue-700 border-blue-200', // Inventariador
        3: 'bg-gray-100 text-gray-700 border-gray-200' // Consulta
    };
    return classes[rolId] || 'bg-gray-100 text-gray-700';
};

const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

onMounted(() => {
    fetchRoles();
    fetchUsers();
});
</script>