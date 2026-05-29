import axios from "axios";
import { logout } from "../features/auth/authSlice";
import { store } from "../store/store";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getTokenPayload(token) {
  try {
    const payload = token.split(".")[1];
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalizedPayload));
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = getTokenPayload(token);
  return !payload?.exp || payload.exp * 1000 <= Date.now();
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("camping_token");
  if (token) {
    if (isTokenExpired(token)) {
      store.dispatch(logout());
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
      store.dispatch(logout());
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
