import { apiCall, http } from "./axios";

export const maintenanceApi = {
  list: (query = {}) => apiCall(http.get("/maintenance", { params: query })),
  get: (id) => apiCall(http.get(`/maintenance/${id}`)),
  create: (body) => apiCall(http.post("/maintenance", body)),
  start: (id) => apiCall(http.patch(`/maintenance/${id}/start`, {})),
  complete: (id, body) => apiCall(http.patch(`/maintenance/${id}/complete`, body)),
  cancel: (id, body) => apiCall(http.patch(`/maintenance/${id}/cancel`, body)),
  remove: (id) => apiCall(http.delete(`/maintenance/${id}`)),
};
