import { apiCall, http } from "./axios";

export const dashboardApi = {
  overview: () => apiCall(http.get("/dashboard/overview")),
  analytics: () => apiCall(http.get("/dashboard/analytics")),
  recent: () => apiCall(http.get("/dashboard/recent")),
};
