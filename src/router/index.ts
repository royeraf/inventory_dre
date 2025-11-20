import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

// Vistas
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";

import ProtectedView from "../views/ProtectedView.vue";
import AjustesView from "../views/AjustesView.vue";
import InventarioView from "../views/InventarioView.vue";
import UsuariosView from "../views/UsuariosView.vue";
import ReportesView from "../views/ReportesView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { public: true },
    },

    {
      path: "/protected",
      component: ProtectedView,
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "inventario",
          component: InventarioView,
          meta: {
            requiresAuth: true,
            roles: [1, 2],
          },
        },
        {
          path: "reportes",
          name: "reportes",
          component: ReportesView,
          meta: {
            requiresAuth: true,
            roles: [1, 2],
          },
        },
        {
          path: "usuarios",
          name: "usuarios",
          component: UsuariosView,
          meta: {
            requiresAuth: true,
            roles: [1],
          },
        },
        {
          path: "ajustes",
          name: "ajustes",
          component: AjustesView,
          meta: {
            requiresAuth: true,
            roles: [1],
          },
        },
      ],
    },

    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

// ----------------------------------------------------------
// 🛡️ GUARD GLOBAL DE NAVEGACIÓN
// ----------------------------------------------------------

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // Esperar a que el store se inicialice (restaure sesión si existe)
  if (!auth.isInitialized) {
    console.log("⏳ Esperando inicialización del auth store...");
    
    // Esperar máximo 3 segundos
    const timeout = new Promise((resolve) => setTimeout(resolve, 3000));
    const checkInit = new Promise((resolve) => {
      const interval = setInterval(() => {
        if (auth.isInitialized) {
          clearInterval(interval);
          resolve(true);
        }
      }, 50);
    });
    
    await Promise.race([checkInit, timeout]);
  }

  console.log("🔍 Navegando a:", to.path);
  console.log("🔐 Autenticado:", auth.isAuthenticated);
  console.log("👤 Usuario:", auth.user?.nombre || "No cargado");

  // Si la ruta es pública → continuar
  if (to.meta.public) {
    // Si ya está autenticado y va a login, redirigir al inventario
    if (auth.isAuthenticated && to.name === "login") {
      console.log("↪️ Ya autenticado, redirigiendo a inventario");
      return next({ name: "inventario" });
    }
    return next();
  }

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!auth.isAuthenticated) {
      console.log("❌ No autenticado, redirigiendo a login");
      return next({ name: "login" });
    }

    // Validación de roles
    if (to.meta.roles) {
      if (!auth.user || !to.meta.roles.includes(auth.user.rol_id)) {
        console.log("⛔ Sin permisos para esta ruta, redirigiendo");
        return next({ name: "inventario" });
      }
    }
  }

  console.log("✅ Navegación permitida");
  next();
});

export default router;