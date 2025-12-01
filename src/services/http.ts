import axios from "axios";
import { useAuthStore } from "../stores/auth";

const API_URL = import.meta.env.VITE_API_URL;

// Crear instancia
const http = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ------------------------------------------------------
// 🌟 INTERCEPTOR para agregar token automáticamente
// ------------------------------------------------------
http.interceptors.request.use(
  (config) => {
    const auth = useAuthStore();

    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ------------------------------------------------------
// 🌟 INTERCEPTOR para manejar errores globales
// ------------------------------------------------------
http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Error en API:", error.response || error);

    // Token expirado o inválido
    if (error.response?.status === 401) {
      // Evitar redirección si el error viene del login
      if (!error.config.url?.includes('/auth/login')) {
        const auth = useAuthStore();
        auth.logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default http;
