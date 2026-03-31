export const queryKeys = {
  admin: {
    dashboard: ["admin", "dashboard"] as const,
    users: (limit: number) => ["admin", "users", "limit", limit] as const,
    usersBase: ["admin", "users"] as const,
    userDetail: (id: string | number) =>
      ["admin", "users", String(id)] as const,
    requests: (limit: number) => ["admin", "requests", "limit", limit] as const,
    requestsBase: ["admin", "requests"] as const,
    requestDetail: (id: string | number) =>
      ["admin", "requests", String(id)] as const,
    departments: (limit: number) =>
      ["admin", "departments", "limit", limit] as const,
    departmentsBase: ["admin", "departments"] as const,
    departmentDetail: (id: string | number) =>
      ["admin", "departments", "detail", String(id)] as const,
  },

  student: {
    dashboard: ["student", "dashboard"] as const,
    allData: ["student", "all-data"] as const,
    profile: ["student", "profile"] as const,
    clearanceHistory: ["student", "clearance-history"] as const,
  },

  staff: {
    dashboard: ["staff", "dashboard"] as const,
    profile: ["staff", "profile"] as const,
    clearanceRequests: ["staff", "clearance-requests"] as const,
    students: ["staff", "students"] as const,
    studentDetail: (id: string | number) =>
      ["staff", "students", String(id)] as const,
  },

  shared: {
    departments: ["shared", "departments"] as const,
    departmentDisplay: ["shared", "department-display"] as const,
    publicClearanceRequests: ["shared", "public-clearance-requests"] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
