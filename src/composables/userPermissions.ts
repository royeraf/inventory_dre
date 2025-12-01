// composables/usePermissions.ts

import { computed } from "vue";
import { useAuthStore } from "../stores/auth";

// Definición de roles
export const UserRole = {
  ADMIN: 1,
  INVENTARIADOR: 2,
  CONSULTA: 3,
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Definición de permisos por módulo
export const permissions = {
  inventario: {
    view: [UserRole.ADMIN, UserRole.INVENTARIADOR, UserRole.CONSULTA],
    create: [UserRole.ADMIN, UserRole.INVENTARIADOR],
    edit: [UserRole.ADMIN, UserRole.INVENTARIADOR],
    delete: [UserRole.ADMIN],
    export: [UserRole.ADMIN, UserRole.INVENTARIADOR],
  },
  reportes: {
    view: [UserRole.ADMIN, UserRole.INVENTARIADOR, UserRole.CONSULTA],
    export: [UserRole.ADMIN, UserRole.INVENTARIADOR],
  },
  usuarios: {
    view: [UserRole.ADMIN],
    create: [UserRole.ADMIN],
    edit: [UserRole.ADMIN],
    delete: [UserRole.ADMIN],
  },
  ajustes: {
    view: [UserRole.ADMIN],
    edit: [UserRole.ADMIN],
  },
};

export function usePermissions() {
  const auth = useAuthStore();

  // Computed properties para roles
  const isAdmin = computed(() => auth.user?.rol_id === UserRole.ADMIN);
  const isInventariador = computed(
    () => auth.user?.rol_id === UserRole.INVENTARIADOR
  );
  const isConsulta = computed(() => auth.user?.rol_id === UserRole.CONSULTA);

  // Función para verificar si el usuario tiene un permiso específico
  const hasPermission = (
    module: keyof typeof permissions,
    action: string
  ): boolean => {
    if (!auth.user) return false;

    const modulePermissions = permissions[module];
    if (!modulePermissions) return false;

    const actionPermissions =
      modulePermissions[action as keyof typeof modulePermissions];
    if (!actionPermissions) return false;

    return (actionPermissions as number[]).includes(auth.user.rol_id);
  };

  // Permisos específicos para cada módulo
  const can = {
    // Inventario
    viewInventario: computed(() => hasPermission("inventario", "view")),
    createBien: computed(() => hasPermission("inventario", "create")),
    editBien: computed(() => hasPermission("inventario", "edit")),
    deleteBien: computed(() => hasPermission("inventario", "delete")),
    exportInventario: computed(() => hasPermission("inventario", "export")),

    // Reportes
    viewReportes: computed(() => hasPermission("reportes", "view")),
    exportReportes: computed(() => hasPermission("reportes", "export")),

    // Usuarios
    viewUsuarios: computed(() => hasPermission("usuarios", "view")),
    createUsuario: computed(() => hasPermission("usuarios", "create")),
    editUsuario: computed(() => hasPermission("usuarios", "edit")),
    deleteUsuario: computed(() => hasPermission("usuarios", "delete")),

    // Ajustes
    viewAjustes: computed(() => hasPermission("ajustes", "view")),
    editAjustes: computed(() => hasPermission("ajustes", "edit")),
  };

  // Nombres de roles
  const getRoleName = (roleId?: number): string => {
    switch (roleId) {
      case UserRole.ADMIN:
        return "Administrador";
      case UserRole.INVENTARIADOR:
        return "Inventariador";
      case UserRole.CONSULTA:
        return "Consulta";
      default:
        return "Sin rol";
    }
  };

  return {
    // Roles
    isAdmin,
    isInventariador,
    isConsulta,

    // Permisos
    can,
    hasPermission,

    // Utilidades
    getRoleName,
  };
}
