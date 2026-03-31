import type { User } from "../../../types";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const mockUsers: User[] = [
  {
    id: 1,
    name: "Admin User",
    username: "admin",
    email: "admin@example.com",
    email_verified_at: null,
    role: "admin",
    profile_image: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    staff: null,
    student: null,
  },
  {
    id: 2,
    name: "Library Staff",
    username: "library.staff",
    email: "library@example.com",
    email_verified_at: null,
    role: "library",
    profile_image: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    staff: null,
    student: null,
  },
  {
    id: 3,
    name: "Student User",
    username: "stu1001",
    email: "student@example.com",
    email_verified_at: null,
    role: "student",
    profile_image: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    staff: null,
    student: null,
  },
];

export const api = {
  users: {
    getAll: async (): Promise<User[]> => {
      await delay(250);
      return [...mockUsers];
    },
  },
};

export default api;
