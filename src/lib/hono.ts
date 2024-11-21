import { hc } from "hono/client";
import type { AppType } from "@/app/api/[[...route]]/route";
import type { User, Role, Permission, RoleUpdateData } from "@/utils/types";
import { UserFormData } from "@/schema/user";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const client = hc<AppType>(`${BASE_URL}`);

export const api = {
  users: {
    getAll: async () => {
      const response = await client.api.user.$get();
      return response.json() as Promise<User[]>;
    },
    create: async (data: UserFormData) => {
      const response = await client.api.user.$post({ json: data });
      return response.json();
    },
    update: async (id: string, data: UserFormData) => {
      const response = await fetch(`${BASE_URL}/api/user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    delete: async (id: string) => {
      const response = await client.api.user[":id"].$delete({ param: { id } });
      return response.json();
    },
  },
  roles: {
    getAll: async () => {
      const response = await client.api.role.$get();
      return response.json() as Promise<Role[]>;
    },
    create: async (data: Partial<Role>) => {
      const response = await client.api.role.$post({ json: data });
      return response.json();
    },
    update: async (id: string, data: RoleUpdateData) => {
      const response = await fetch(`${BASE_URL}/api/role/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update role');
      return response.json();
    },
    delete: async (id: string) => {
      const response = await client.api.role[":id"].$delete({ param: { id } });
      return response.json();
    },
  },
  permissions: {
    getAll: async () => {
      const response = await client.api.permission.$get();
      return response.json() as Promise<Permission[]>;
    },
    create: async (data: Partial<Permission>) => {
      const response = await client.api.permission.$post({ json: data });
      return response.json();
    },
    delete: async (id: string) => {
      const response = await client.api.permission[":id"].$delete({ param: { id } });
      return response.json();
    },
  },
};
