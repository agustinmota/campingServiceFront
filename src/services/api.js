import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("camping_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    const message = typeof data === "string" ? data : data?.message || data?.error || error.message || "Error en la solicitud";
    throw new Error(message);
  }
}
