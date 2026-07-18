import { apiCall, http } from "./axios";

export const authApi = {
  login: (body) => apiCall(http.post("/auth/login", body)),
  register: (body) => apiCall(http.post("/auth/register", body)),
  profile: () => apiCall(http.get("/auth/profile")),
};
