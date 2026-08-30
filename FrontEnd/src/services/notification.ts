import api, { type ApiResponse } from "./api";

export type Notification = {
  id: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
};

export async function listNotifications() {
  const response = await api.get<ApiResponse<Notification[]>>("/notifications");
  return response.data.data;
}

export async function markNotificationAsRead(id: string) {
  await api.patch(`/notifications/${id}/read`);
}

export async function deleteNotification(id: string) {
  await api.delete(`/notifications/${id}`);
}
