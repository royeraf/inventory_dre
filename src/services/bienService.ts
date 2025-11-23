import http from "./http";

export const bienService = {
  // OBTENER TODOS LOS BIENES
  getAll(params: any = {}) {
    return http.get("/bienes/", { params })
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message }));
  },

  // OBTENER UNO POR ID
  getById(id: number) {
    return http.get(`/bienes/${id}`)
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message }));
  },

  // CREAR
  create(data: any) {
    return http.post("/bienes/", data)
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message }));
  },

  // ACTUALIZAR
  update(id: number, data: any) {
    return http.put(`/bienes/${id}`, data)
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message }));
  },

  // ELIMINAR
  delete(id: number) {
    return http.delete(`/bienes/${id}`)
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message }));
  },
};
