import api from "./api";

type ApiResponse<T> = { success: true; data: T };

export type User = { id: string; name: string; email: string };
export type LoginResult = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

// Centraliza as chamadas de autenticação para que os componentes de tela
// não precisem conhecer detalhes de endpoints ou do formato da resposta.
export async function login(email: string, password: string) {
  const response = await api.post<ApiResponse<LoginResult>>("/auth/login", {
    email,
    password,
  });
  return response.data.data;
}

export async function register(name: string, email: string, password: string) {
  await api.post("/auth/register", { name, email, password });
  return login(email, password);
}

// Apenas dados necessários para manter a sessão no navegador são persistidos.
// Nenhuma senha é armazenada no cliente.
export function saveSession(session: LoginResult) {
  localStorage.setItem("taskly_access_token", session.accessToken);
  localStorage.setItem("taskly_refresh_token", session.refreshToken);
  // O perfil público permite reconstruir a interface após atualizar a página.
  // Tokens e senha nunca são exibidos nem enviados a outro serviço.
  localStorage.setItem("taskly_user", JSON.stringify(session.user));
}

export function getStoredSession(): LoginResult | null {
  const accessToken = localStorage.getItem("taskly_access_token");
  const refreshToken = localStorage.getItem("taskly_refresh_token");
  const rawUser = localStorage.getItem("taskly_user");

  if (!accessToken || !refreshToken || !rawUser) return null;

  try {
    const user = JSON.parse(rawUser) as User;
    if (!user.id || !user.name || !user.email) return null;
    return { accessToken, refreshToken, user };
  } catch {
    return null;
  }
}

// O logout local sempre é executado, mesmo se a API estiver indisponível.
export async function logout() {
  const refreshToken = localStorage.getItem("taskly_refresh_token");

  try {
    if (refreshToken) await api.post("/auth/logout", { refreshToken });
  } finally {
    localStorage.removeItem("taskly_access_token");
    localStorage.removeItem("taskly_refresh_token");
    localStorage.removeItem("taskly_user");
  }
}
