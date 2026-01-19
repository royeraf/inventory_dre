import http from "./http";

export interface Responsable {
  id: number;
  nombre: string;
  nombre_original?: string;
  area?: string;
  tipo_contrato?: string;
  activo?: boolean;
}

export const responsableService = {
  // OBTENER TODOS LOS RESPONSABLES ACTIVOS
  getAll() {
    return http.get<Responsable[]>("/api/responsables")
      .then((r) => ({ success: true, data: r.data, message: null as string | null }))
      .catch((e) => ({ success: false, message: e.response?.data?.message as string | null, data: [] as Responsable[] }));
  },

  // OBTENER TODOS INCLUYENDO INACTIVOS
  getAllWithInactive() {
    return http.get<Responsable[]>("/api/responsables?include_inactive=true")
      .then((r) => ({ success: true, data: r.data, message: null as string | null }))
      .catch((e) => ({ success: false, message: e.response?.data?.message as string | null, data: [] as Responsable[] }));
  },

  // OBTENER UN RESPONSABLE POR ID
  getById(id: number) {
    return http.get<Responsable>(`/api/responsables/${id}`)
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message }));
  },

  // BUSCAR RESPONSABLES
  search(query: string) {
    return http.get<Responsable[]>(`/api/responsables/search?q=${encodeURIComponent(query)}`)
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message, data: [] as Responsable[] }));
  },

  // CREAR UN NUEVO RESPONSABLE
  create(data: Partial<Responsable>) {
    return http.post<{ success: boolean; id?: number; message?: string }>("/api/responsables", data)
      .then((r) => r.data)
      .catch((e) => ({ success: false, message: e.response?.data?.error || e.message }));
  },

  // ACTUALIZAR UN RESPONSABLE
  update(id: number, data: Partial<Responsable>) {
    return http.put<{ success: boolean; message?: string }>(`/api/responsables/${id}`, data)
      .then((r) => r.data)
      .catch((e) => ({ success: false, message: e.response?.data?.error || e.message }));
  },

  // ACTIVAR/DESACTIVAR UN RESPONSABLE
  toggleActive(id: number) {
    return http.patch<{ success: boolean; message?: string }>(`/api/responsables/${id}/toggle`)
      .then((r) => r.data)
      .catch((e) => ({ success: false, message: e.response?.data?.error || e.message }));
  },
};
