import http from "./http";

export const userService = {
  getAll() {
    return http.get("/usuarios");
  },

  getById(id: number) {
    return http.get(`/usuarios/${id}`);
  },

  create(data: any) {
    return http.post("/usuarios", data);
  },

  update(id: number, data: any) {
    return http.put(`/usuarios/${id}`, data);
  },

  delete(id: number) {
    return http.delete(`/usuarios/${id}`);
  },

  getRoles() {
    return http.get("/usuarios/roles");
  },
};
