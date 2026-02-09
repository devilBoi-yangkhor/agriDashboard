import api from "@/lib/axios";

// Enhanced User type with roles information
export interface User {
  id?: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  roles?: Role[]; // Explicitly include roles
  [key: string]: any; // Allow for additional properties
}

// Role type definition
export interface Role {
  id: number;
  name: string;
  permissions?: string[]; // Optional permissions if needed
}

// Generic API response interface
interface ApiResponse<T> {
  data: ResultsWrapper<T>;
  message: string;
  status: string;
  statusCode: number;
  timestamp: number;
}

// Wrapper for results with pagination support
interface ResultsWrapper<T> {
  results: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
  [x: string]: any; // Additional response properties
}

// Get all users with their roles
export const getUsers = async (
  params?: Record<string, any>,
): Promise<ApiResponse<User[]>> => {
  const response = await api.get("user-management/users/", { params });
  return response.data;
};

// Get users filtered by specific role
export const getUsersByRole = async (
  roleId: number,
): Promise<ApiResponse<User[]>> => {
  const response = await api.get("user-management/users/", {
    params: { role_id: roleId },
  });
  return response.data;
};

// Create user with role support
export const createUser = async (data: User): Promise<ApiResponse<User>> => {
  return api.post("user-management/users/", data);
};

// Get single user with full role details
export const getUser = async (id: number): Promise<ApiResponse<User>> => {
  return api.get(`/user-management/users/${id}`);
};

// Update user including role modifications
export const updateUser = async (
  id: number,
  data: Partial<User>,
): Promise<ApiResponse<User>> => {
  const modifiedPayload = {
    ...data,
    // Ensure roles are properly formatted if being updated
    roles: data.roles
      ? data.roles.map((role) =>
          typeof role === "number" ? { id: role } : role,
        )
      : undefined,
  };
  return api.patch(`/user-management/users/${id}/`, modifiedPayload);
};

// Delete user
export const deleteUser = async (id: number): Promise<ApiResponse<void>> => {
  return api.delete(`user-management/users/${id}/`);
};

// Optional: Get all available roles
export const getRoles = async (): Promise<ApiResponse<Role[]>> => {
  const response = await api.get("user-management/roles/");
  return response.data;
};
