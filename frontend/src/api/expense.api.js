import { apiCall, http } from "./axios";

export const expenseApi = {
  list: (query = {}) => apiCall(http.get("/expenses", { params: query })),
  get: (id) => apiCall(http.get(`/expenses/${id}`)),
  create: (body) => apiCall(http.post("/expenses", body)),
  update: (id, body) => apiCall(http.put(`/expenses/${id}`, body)),
  remove: (id) => apiCall(http.delete(`/expenses/${id}`)),
};
