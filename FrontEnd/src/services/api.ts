import axios from "axios";

const api = axios.create({
  // Em desenvolvimento a API local usa a porta 8080. Em produção,
  // VITE_API_URL apontará para a URL pública do backend no Render.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("taskly_access_token");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default api;
