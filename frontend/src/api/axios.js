import axios from "axios";
import toast from "react-hot-toast";
import { API_URL, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "@/lib/config";

export const http = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = typeof window !== "undefined"
    ? window.localStorage.getItem(TOKEN_STORAGE_KEY)
    : null;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let redirecting = false;

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("Network error. Check your connection.");
      return Promise.reject(error);
    }
    const status = error.response.status;
    const payload = error.response.data;
    const validationMsg =
      Array.isArray(payload?.errors) && payload.errors.length
        ? payload.errors.map((e) => e.msg).join(", ")
        : null;
    const message = validationMsg ?? payload?.message ?? "Request failed";

    if (status === 401) {
      if (typeof window !== "undefined" && !redirecting) {
        redirecting = true;
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        window.localStorage.removeItem(USER_STORAGE_KEY);
        toast.error("Your session expired. Please sign in again.");
        setTimeout(() => {
          redirecting = false;
          if (!window.location.pathname.startsWith("/login")) {
            window.location.href = "/login";
          }
        }, 250);
      }
    } else if (status === 403) {
      toast.error(message || "You don't have permission to do that.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again.");
    } else {
      toast.error(message);
    }
    return Promise.reject(error);
  },
);

export async function apiCall(promise) {
  const res = await promise;
  return res.data.data;
}
