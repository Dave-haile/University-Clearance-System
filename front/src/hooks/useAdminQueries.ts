import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/services/axiosBackend";
import { queryKeys } from "@/lib/queryKeys";
import type { User } from "@/types";
import type { ClearanceRequests } from "@/types/clerance";
import type { Department } from "@/types/department";

export const ADMIN_FETCH_LIMIT_OPTIONS = [20, 100, 500] as const;
export type AdminFetchLimit = (typeof ADMIN_FETCH_LIMIT_OPTIONS)[number];

type DepartmentResponse = {
  departments: Department[];
  department_head: unknown[];
  stats: {
    total_departments: number;
    unique_colleges: number;
  };
};

type DepartmentView = Department & {
  student_count: number;
};

const normalizeLimit = (limit?: number): AdminFetchLimit => {
  if (limit === 100 || limit === 500) return limit;
  return 20;
};

const adminQueryKeys = {
  users: (limit: AdminFetchLimit) => queryKeys.admin.users(limit),
  requests: (limit: AdminFetchLimit) => queryKeys.admin.requests(limit),
  departments: (limit: AdminFetchLimit) => queryKeys.admin.departments(limit),
};

export const fetchAdminUsers = async (limit: number = 20): Promise<User[]> => {
  const normalizedLimit = normalizeLimit(limit);
  const response = await axiosClient.get("/admin/users", {
    params: { limit: normalizedLimit },
  });

  return Array.isArray(response.data) ? response.data : [];
};

export const fetchAdminRequests = async (
  limit: number = 20,
): Promise<ClearanceRequests[]> => {
  const normalizedLimit = normalizeLimit(limit);
  const response = await axiosClient.get("/admin/clearanceRequests", {
    params: { limit: normalizedLimit },
  });

  return Array.isArray(response.data) ? response.data : [];
};

export const fetchAdminDepartments = async (
  limit: number = 20,
): Promise<{
  departments: DepartmentView[];
  stats: DepartmentResponse["stats"];
}> => {
  const normalizedLimit = normalizeLimit(limit);
  const response = await axiosClient.get<DepartmentResponse>(
    "/admin/departmentDisplay",
    {
      params: { limit: normalizedLimit },
    },
  );

  const departments = Array.isArray(response.data?.departments)
    ? response.data.departments
    : [];

  return {
    departments: departments.map((department) => ({
      ...department,
      student_count: Array.isArray(department.students)
        ? department.students.length
        : 0,
    })),
    stats: response.data?.stats ?? {
      total_departments: 0,
      unique_colleges: 0,
    },
  };
};

export const useAdminUsersQuery = (limit: number = 20) => {
  const normalizedLimit = normalizeLimit(limit);

  return useQuery({
    queryKey: adminQueryKeys.users(normalizedLimit),
    queryFn: () => fetchAdminUsers(normalizedLimit),
  });
};

export const useAdminRequestsQuery = (limit: number = 20) => {
  const normalizedLimit = normalizeLimit(limit);

  return useQuery({
    queryKey: adminQueryKeys.requests(normalizedLimit),
    queryFn: () => fetchAdminRequests(normalizedLimit),
  });
};

export const useAdminDepartmentsQuery = (limit: number = 20) => {
  const normalizedLimit = normalizeLimit(limit);

  return useQuery({
    queryKey: adminQueryKeys.departments(normalizedLimit),
    queryFn: () => fetchAdminDepartments(normalizedLimit),
  });
};

export const getAdminLimitedQueryKeys = (limit: number = 20) => {
  const normalizedLimit = normalizeLimit(limit);

  return {
    users: adminQueryKeys.users(normalizedLimit),
    requests: adminQueryKeys.requests(normalizedLimit),
    departments: adminQueryKeys.departments(normalizedLimit),
  };
};
