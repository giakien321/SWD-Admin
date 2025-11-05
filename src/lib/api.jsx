import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({ baseURL: BASE });

export default api;

export const apiWithAuth = () => {
  const token = localStorage.getItem("accessToken");
  const instance = axios.create({ baseURL: BASE });
  if (token) instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return instance;
};
