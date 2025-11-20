import http from "./http";

export const movimientoService = {
  // OBTENER TODOS LOS BIENES
  getAll() {
    return http.get("/movimientos/")
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message }));
  },

  // OBTENER UNO POR ID
  getById(id: number) {
    return http.get(`/movimientos/${id}`)
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message }));
  },

  // CREAR
  create(data: any) {
    return http.post("/movimientos/", data)
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message }));
  },

  // ACTUALIZAR
  update(id: number, data: any) {
    return http.put(`/movimientos/${id}`, data)
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message }));
  },

  // ELIMINAR
  delete(id: number) {
    return http.delete(`/movimientos/${id}`)
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message }));
  },
};
