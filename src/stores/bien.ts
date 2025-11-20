//src/stores/bien.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import { bienService } from "../services/bienService";

export const useBienesStore = defineStore("bienes", () => {
  const bienes = ref([]);
  const loading = ref(false);
  const error = ref("");

  const fetchBienes = async () => {
    loading.value = true;
    error.value = "";
    try {
      const res = await bienService.getAll();
      bienes.value = res.data;
    } catch (err: any) {
      error.value = err.message || "Error al obtener bienes";
    } finally {
      loading.value = false;
    }
  };

  const createBien = async (data: any) => {
    try {
      const res = await bienService.create(data);
      bienes.value.push(res.data);
    } catch (err: any) {
      console.error("Error al crear bien:", err);
    }
  };

  return { bienes, loading, error, fetchBienes, createBien };
});
