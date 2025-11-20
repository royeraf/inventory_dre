import { defineStore } from "pinia";
import { loginService, meService } from "../services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("token") || null,

    isInitialized: false, // 🔥 Importante !!!!!
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async initialize() {
      console.log("🔄 Restaurando sesión...");

      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        this.token = storedToken;

        try {
          const res = await meService(); // 🔥 ya no se pasa token
          if (res.user) {
            this.user = res.user;
            localStorage.setItem("user", JSON.stringify(res.user));
          }
        } catch (e) {
          console.warn("⚠ Token inválido, eliminando sesión");
          this.logout();
        }
      }

      this.isInitialized = true;
    },
    async login(dni: string, contrasena: string) {
      const res = await loginService(dni, contrasena);

      if (res.access_token) {
        this.token = res.access_token;
        this.user = res.user;

        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));

        this.isInitialized = true;
      }

      return res;
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      this.isInitialized = true;
    },
  },
});
