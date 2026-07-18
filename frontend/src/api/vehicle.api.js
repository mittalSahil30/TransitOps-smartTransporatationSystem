import { apiCall, http } from "./axios";

export const vehicleApi = {
  list: (query = {}) => apiCall(http.get("/vehicles", { params: query })),
  available: () => apiCall(http.get("/vehicles/available")),
  get: (id) => apiCall(http.get(`/vehicles/${id}`)),
  create: (body) => apiCall(http.post("/vehicles", body)),
  update: (id, body) => apiCall(http.put(`/vehicles/${id}`, body)),
  remove: (id) => apiCall(http.delete(`/vehicles/${id}`)),
};
