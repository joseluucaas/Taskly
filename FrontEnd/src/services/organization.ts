import api, { type ApiResponse } from "./api";
import type { Category, Tag } from "./task";

type OrganizationItem = Category | Tag;
type ItemInput = { name: string; color?: string };

async function list<T extends OrganizationItem>(resource: "categories" | "tags") {
  const response = await api.get<ApiResponse<T[]>>(`/${resource}`);
  return response.data.data;
}

async function create<T extends OrganizationItem>(resource: "categories" | "tags", data: ItemInput) {
  const response = await api.post<ApiResponse<T>>(`/${resource}`, data);
  return response.data.data;
}

async function remove(resource: "categories" | "tags", id: string) {
  await api.delete(`/${resource}/${id}`);
}

async function update<T extends OrganizationItem>(
  resource: "categories" | "tags",
  id: string,
  data: ItemInput,
) {
  const response = await api.put<ApiResponse<T>>(`/${resource}/${id}`, data);
  return response.data.data;
}

export const categories = {
  list: () => list<Category>("categories"),
  create: (data: ItemInput) => create<Category>("categories", data),
  update: (id: string, data: ItemInput) => update<Category>("categories", id, data),
  remove: (id: string) => remove("categories", id),
};

export const tags = {
  list: () => list<Tag>("tags"),
  create: (data: ItemInput) => create<Tag>("tags", data),
  update: (id: string, data: ItemInput) => update<Tag>("tags", id, data),
  remove: (id: string) => remove("tags", id),
};
