//src/stores/bien.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import { bienService } from "../services/bienService";

export const useBienesStore = defineStore("bienes", () => {
  const bienes = ref<any[]>([]);
  const loading = ref(false);
  const error = ref("");

  const fetchBienes = async () => {
    loading.value = true;
    error.value = "";
    try {
      const res = await bienService.getAll();
      if (res.success) {
          // @ts-ignore
          // La respuesta ahora tiene { data: [], pagination: {} }
          bienes.value = res.data.data || [];
      } else {
          // @ts-ignore
          error.value = res.message;
      }
    } catch (err: any) {
      error.value = err.message || "Error al obtener bienes";
    } finally {
      loading.value = false;
    }
  };

  const createBien = async (data: any) => {
    try {
      const res = await bienService.create(data);
      if (res.success) {
          // @ts-ignore
          bienes.value.push(res.data);
      }
    } catch (err: any) {
      console.error("Error al crear bien:", err);
    }
  };

  return { bienes, loading, error, fetchBienes, createBien };
});
