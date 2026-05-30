import axios from "axios";
import { clearSavedSession, isTokenExpired, SESSION_EXPIRED_EVENT, TOKEN_STORAGE_KEY } from "../shared/authToken";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function notifySessionExpired() {
  clearSavedSession();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
  if (token) {
    if (isTokenExpired(token)) {
      notifySessionExpired();
      delete config.headers.Authorization;
      return config;
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      notifySessionExpired();
    }
    return Promise.reject(error);
  }
);

export async function apiRequest(path, options = {}) {
  try {
    const response = await api.request({
      url: path,
      method: options.method || "GET",
      data: options.body ? JSON.parse(options.body) : options.data,
      headers: options.headers
    });
    return response.data;
  } catch (error) {
    const data = error.response?.data;
    const message = typeof data === "string" ? data : data?.message || data?.error || error.message || "Request failed";
    throw new Error(message);
  }
}
