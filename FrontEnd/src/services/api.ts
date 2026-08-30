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

// Quando o access token expira, a primeira chamada protegida renova a sessão
// uma única vez e repete a requisição original sem interromper a experiência.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config as typeof error.config & { _retry?: boolean };
    const isAuthRequest = request?.url?.startsWith("/auth/");

    if (error.response?.status !== 401 || request?._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("taskly_refresh_token");
    if (!refreshToken) return Promise.reject(error);

    try {
      request._retry = true;
      const response = await api.post<ApiResponse<{ accessToken: string }>>(
        "/auth/refresh",
        { refreshToken },
      );
      const accessToken = response.data.data.accessToken;
      localStorage.setItem("taskly_access_token", accessToken);
      request.headers.Authorization = `Bearer ${accessToken}`;
      return api(request);
    } catch {
      localStorage.removeItem("taskly_access_token");
      localStorage.removeItem("taskly_refresh_token");
      localStorage.removeItem("taskly_user");
      return Promise.reject(error);
    }
  },
);

export type ApiResponse<T> = { success: true; data: T; meta?: unknown };

export default api;
