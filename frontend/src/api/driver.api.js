import { apiCall, http } from "./axios";

export const driverApi = {
  list: (query = {}) => apiCall(http.get("/drivers", { params: query })),
  available: () => apiCall(http.get("/drivers/available")),
  get: (id) => apiCall(http.get(`/drivers/${id}`)),
  create: (body) => apiCall(http.post("/drivers", body)),
  update: (id, body) => apiCall(http.put(`/drivers/${id}`, body)),
  remove: (id) => apiCall(http.delete(`/drivers/${id}`)),
};
