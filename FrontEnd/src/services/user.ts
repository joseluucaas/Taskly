import api, { type ApiResponse } from "./api";
import type { User } from "./auth";

export type Preferences = {
  language: "pt" | "en";
  theme: "light" | "dark" | "system";
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  dueDateReminders: boolean;
};

export type Profile = User & {
  createdAt: string;
  preferences: Preferences;
};

export async function getProfile() {
  const response = await api.get<ApiResponse<Profile>>("/users/me");
  return response.data.data;
}

export async function updateProfile(data: Pick<User, "name" | "email">) {
  const response = await api.patch<ApiResponse<Profile>>("/users/me", data);
  return response.data.data;
}

export async function updatePreferences(data: Preferences) {
  const response = await api.patch<ApiResponse<Preferences>>(
    "/users/me/preferences",
    data,
  );
  return response.data.data;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  await api.patch("/users/me/password", { currentPassword, newPassword });
}

export async function logoutAllSessions() {
  await api.post("/users/me/logout-all");
}
