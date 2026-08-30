import api, { type ApiResponse } from "./api";

export type Category = { id: string; name: string; color: string | null };
export type Tag = { id: string; name: string; color: string | null };
export type Task = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  completed: boolean;
  category: Category | null;
  tags: Tag[];
};

export type TaskInput = {
  title: string;
  description?: string;
  dueDate?: string;
  categoryId?: string | null;
  tagIds?: string[];
};

export async function listTasks(
  params?: Record<string, string | number | boolean>,
) {
  const response = await api.get<ApiResponse<Task[]>>("/tasks", { params });
  return response.data;
}

export async function createTask(data: TaskInput) {
  const response = await api.post<ApiResponse<Task>>("/tasks", data);
  return response.data.data;
}

export async function updateTask(
  id: string,
  data: Partial<TaskInput> & { completed?: boolean },
) {
  const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
  return response.data.data;
}

export async function deleteTask(id: string) {
  await api.delete(`/tasks/${id}`);
}
