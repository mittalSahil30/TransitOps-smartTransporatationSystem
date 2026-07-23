import { apiCall, http } from "./axios";

export const fuelApi = {
  list: (query = {}) => apiCall(http.get("/fuel", { params: query })),
  get: (id) => apiCall(http.get(`/fuel/${id}`)),
  create: (body) => apiCall(http.post("/fuel", body)),
  remove: (id) => apiCall(http.delete(`/fuel/${id}`)),
};
