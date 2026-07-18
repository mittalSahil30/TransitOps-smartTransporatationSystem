import { apiCall, http } from "./axios";

export const tripApi = {
  list: (query = {}) => apiCall(http.get("/trips", { params: query })),
  get: (id) => apiCall(http.get(`/trips/${id}`)),
  create: (body) => apiCall(http.post("/trips", body)),
  dispatch: (id) => apiCall(http.put(`/trips/${id}/dispatch`)),
  complete: (id, body) => apiCall(http.put(`/trips/${id}/complete`, body)),
  cancel: (id, body = {}) => apiCall(http.put(`/trips/${id}/cancel`, body)),
  remove: (id) => apiCall(http.delete(`/trips/${id}`)),
};
