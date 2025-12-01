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

  // OBTENER ESTADÍSTICAS
  getStats() {
    return http.get("/bienes/stats")
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message }));
  },

  // ELIMINAR
  delete(id: number) {
    return http.delete(`/bienes/${id}`)
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message }));
  },
  // VERIFICAR CÓDIGO
  verifyCode(codigo: string) {
    return http.get(`/bienes/verify-code?codigo=${codigo}`)
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message }));
  },

  // OBTENER ACTIVIDAD RECIENTE
  getRecentActivity() {
    return http.get('/reportes/recent-activity')
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message }));
  },

  // OBTENER GRÁFICO DE MOVIMIENTOS
  getMovementsChart() {
    return http.get('/reportes/movements-chart')
      .then((r) => ({ success: true, data: r.data }))
      .catch((e) => ({ success: false, message: e.response?.data?.message }));
  },

  // OBTENER OPCIONES DE DETALLES PARA REPORTES
  getDetallesOptions() {
    return http.get('/reportes/detalles-options')
      .then((r) => r.data)
      .catch((e) => {
        console.error("Error fetching detalles options:", e);
        return [];
      });
  },

  // GENERAR REPORTE PDF DE BIENES POR ESTADO
  generatePdfReport(filters: any) {
    return http.post('/reportes/pdf-bienes-estado', filters, {
      responseType: 'blob'
    })
      .then((r) => r.data)
      .catch((e) => {
        console.error("Error generating PDF report:", e);
        throw e;
      });
  }
};
