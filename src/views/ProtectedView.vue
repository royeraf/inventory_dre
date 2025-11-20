<template>
  <!-- Loading solo cuando no está inicializado -->
  <div
    v-if="!auth.isInitialized || !auth.user"
    class="flex items-center justify-center min-h-screen bg-slate-100 text-slate-600"
  >
    <div class="text-center animate-pulse">
      <svg
        class="w-10 h-10 mx-auto mb-3 text-blue-600 animate-spin"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <p class="font-medium">Cargando sesión...</p>
    </div>
  </div>

  <div
    v-else
    class="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"
  >
    <!-- Sidebar -->
    <aside
      class="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col shadow-2xl relative overflow-hidden"
    >
      <!-- Decoración de fondo -->
      <div class="absolute inset-0 opacity-10">
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500 rounded-full filter blur-3xl transform -translate-x-1/2 translate-y-1/2"
        ></div>
      </div>

      <!-- Logo y Header -->
      <div class="relative z-10 p-6 border-b border-slate-700">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <svg
              class="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold leading-tight">DRE Huánuco</h1>
            <p class="text-xs text-slate-400">Sistema de Inventario</p>
          </div>
        </div>
      </div>

      <!-- User Info -->
      <div class="relative z-10 p-6 border-b border-slate-700">
        <div class="flex items-center gap-3 mb-3">
          <!-- Avatar con iniciales -->
          <div
            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-lg shadow-lg"
          >
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-sm truncate">
              {{ auth.user.nombre }}
            </h3>
            <div class="flex items-center gap-1.5 mt-1">
              <span
                :class="roleBadgeClass"
                class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                {{ roleLabel }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="relative z-10 flex-1 p-4 space-y-1 overflow-y-auto">
        <!-- Inventario - Todos los roles -->
        <router-link
          to="/protected"
          exact
          class="group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="
            isInventarioActive
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30'
              : 'hover:bg-slate-700/50'
          "
        >
          <svg
            class="w-5 h-5 transition-colors"
            :class="
              isInventarioActive
                ? 'text-white'
                : 'text-slate-400 group-hover:text-white'
            "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <span class="font-medium">Inventario</span>
        </router-link>

        <!-- Reportes - Todos los roles -->
        <router-link
          to="/protected/reportes"
          class="group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="
            isReportesActive
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30'
              : 'hover:bg-slate-700/50'
          "
        >
          <svg
            class="w-5 h-5 transition-colors"
            :class="
              isReportesActive
                ? 'text-white'
                : 'text-slate-400 group-hover:text-white'
            "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span class="font-medium">Reportes</span>
        </router-link>

        <!-- Usuarios - Solo Administrador -->
        <router-link
          v-if="isAdmin"
          to="/protected/usuarios"
          class="group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="
            isUsuariosActive
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30'
              : 'hover:bg-slate-700/50'
          "
        >
          <svg
            class="w-5 h-5 transition-colors"
            :class="
              isUsuariosActive
                ? 'text-white'
                : 'text-slate-400 group-hover:text-white'
            "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span class="font-medium">Usuarios</span>
        </router-link>

        <!-- Ajustes - Solo Administrador -->
        <router-link
          v-if="isAdmin"
          to="/protected/ajustes"
          class="group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="
            isAjustesActive
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30'
              : 'hover:bg-slate-700/50'
          "
        >
          <svg
            class="w-5 h-5 transition-colors"
            :class="
              isAjustesActive
                ? 'text-white'
                : 'text-slate-400 group-hover:text-white'
            "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span class="font-medium">Ajustes</span>
        </router-link>

        <!-- Divider -->
        <div class="pt-4 pb-2">
          <div class="h-px bg-slate-700"></div>
        </div>

        <!-- Stats o Info adicional -->
        <div
          class="px-4 py-3 bg-slate-800/50 rounded-lg border border-slate-700"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-slate-400">Bienes registrados</span>
            <span class="text-sm font-bold text-white">1,234</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-1.5">
            <div
              class="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full"
              style="width: 75%"
            ></div>
          </div>
        </div>
      </nav>

      <!-- Footer con botón de logout -->
      <div class="relative z-10 p-4 border-t border-slate-700">
        <button
          @click="logout"
          class="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <header
        class="bg-white border-b border-slate-200 px-6 py-4 shadow-sm flex items-center justify-between"
      >
        <div>
          <h2 class="text-2xl font-bold text-slate-800">
            {{ currentPageTitle }}
          </h2>
          <p class="text-sm text-slate-500 mt-0.5">
            {{ currentPageSubtitle }}
          </p>
        </div>

        <div class="flex items-center gap-4">
          <!-- Search bar -->
          <div class="relative hidden md:block">
            <input
              type="text"
              placeholder="Buscar..."
              class="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
            <svg
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <!-- Notifications -->
          <button
            class="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span
              class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"
            ></span>
          </button>

          <!-- User menu button -->
          <button
            class="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-sm text-white"
            >
              {{ userInitials }}
            </div>
          </button>
        </div>
      </header>

      <!-- Content Area with scroll -->
      <div class="flex-1 overflow-auto p-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <div :key="route.fullPath">
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

// Cerrar sesión
const logout = () => {
  if (confirm("¿Está seguro que desea cerrar sesión?")) {
    auth.logout();
    router.push("/login");
  }
};

// Iniciales del usuario
const userInitials = computed(() => {
  if (!auth.user?.nombre) return "U";
  const names = auth.user.nombre.split(" ");
  return names
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
});

// Rol del usuario
const roleLabel = computed(() => {
  const role = auth.user?.rol_id;

  if (!role) return "Sin rol";

  return (
    {
      1: "Administrador",
      2: "Inventariador",
      3: "Consulta",
    }[role] || "Sin rol"
  );
});

// Badge del rol
const roleBadgeClass = computed(() => {
  const role = auth.user?.rol_id;

  return (
    {
      1: "bg-purple-500/20 text-purple-300",
      2: "bg-blue-500/20 text-blue-300",
      3: "bg-green-500/20 text-green-300",
    }[role] || "bg-gray-500/20 text-gray-300"
  );
});

// Roles
const isAdmin = computed(() => auth.user?.rol_id === 1);

// Rutas activas
const isInventarioActive = computed(() => route.path === "/protected");
const isReportesActive = computed(() =>
  route.path.startsWith("/protected/reportes")
);
const isUsuariosActive = computed(() =>
  route.path.startsWith("/protected/usuarios")
);
const isAjustesActive = computed(() =>
  route.path.startsWith("/protected/ajustes")
);

// Título dinámico
const currentPageTitle = computed(() => {
  const path = route.path;
  if (path === "/protected") return "Inventario de Bienes";
  if (path.includes("/reportes")) return "Reportes";
  if (path.includes("/usuarios")) return "Gestión de Usuarios";
  if (path.includes("/ajustes")) return "Configuración";
  return "Panel de Control";
});

// Subtítulo
const currentPageSubtitle = computed(() => {
  const path = route.path;
  if (path === "/protected") return "Gestión y control de bienes patrimoniales";
  if (path.includes("/reportes")) return "Reportes y estadísticas del sistema";
  if (path.includes("/usuarios"))
    return "Administración de usuarios del sistema";
  if (path.includes("/ajustes")) return "Configuración general del sistema";
  return "DRE Huánuco";
});
</script>

<style scoped>
/* Animación de transición mejorada */
.fade-enter-active {
  transition: all 0.3s ease-out;
}

.fade-leave-active {
  transition: all 0.2s ease-in;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Scrollbar personalizado */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

aside::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>