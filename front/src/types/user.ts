import { z } from "zod";
import { Department } from "./department";
import { ClearanceRequest } from './index'
export const loginSchema = z.object({
  login: z.string().min(1, "this is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


export const roles = [
  "student",
  "department_head",
  "library",
  "cafeteria",
  "proctor",
  "registrar",
  "admin",
];
export type LoginFormInputs = z.infer<typeof loginSchema>;

export interface Staff {
  id: number;
  user_id: number;
  position: string;
  department_id: number | null;
  role: string;
  created_at: string | null;
  updated_at: string | null;
  department?: Department | null;
  user: User | null;
}

export interface Student {
  id: number;
  user_id: number;
  student_id: string;
  department_id: number | null;
  department: Department | null;
  year: string;
  created_at: string;
  updated_at: string;
  clearance_requests: ClearanceRequest[] | null;
}

export interface User {
  id: number;
  name: string;
  username: string | null;
  email: string | null;
  email_verified_at: string | null;
  profile_image: string | null;
  role: UserRole | string;
  created_at: string | null;
  updated_at: string | null;
  staff: Staff | null;
  student: Student | null;
}
export type SortField = "name" | "created_at";
export type SortDirection = "asc" | "desc";
export interface RoleFilterProps {
  selectedRole: FilterOption;
  onRoleChange: (role: FilterOption) => void;
}
export type UserRole =
  | "all"
  | "student"
  | "department_head"
  | "library"
  | "cafeteria"
  | "registrar"
  | "proctor"
  | "admin";

export type FilterOption = UserRole | "all";

export const ROLE_LABELS: Record<FilterOption, string> = {
  all: "All",
  student: "Student",
  department_head: "Department Head",
  library: "Library",
  cafeteria: "Cafeteria",
  registrar: "Registrar",
  admin: "Admin",
  proctor: "Proctor",
};