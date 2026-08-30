import api, { type ApiResponse } from "./api";

export type Comment = { id: string; content: string; createdAt: string; updatedAt: string };

export async function listComments(taskId: string) {
  const response = await api.get<ApiResponse<Comment[]>>(`/tasks/${taskId}/comments`);
  return response.data.data;
}

export async function createComment(taskId: string, content: string) {
  const response = await api.post<ApiResponse<Comment>>(`/tasks/${taskId}/comments`, { content });
  return response.data.data;
}

export async function deleteComment(taskId: string, commentId: string) {
  await api.delete(`/tasks/${taskId}/comments/${commentId}`);
}

export async function updateComment(taskId: string, commentId: string, content: string) {
  const response = await api.put<ApiResponse<Comment>>(
    `/tasks/${taskId}/comments/${commentId}`,
    { content },
  );
  return response.data.data;
}
