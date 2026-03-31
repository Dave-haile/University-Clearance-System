
import { z } from 'zod';

export type UserRole = 
  | 'student' 
  | 'department_head' 
  | 'library_staff' 
  | 'registrar' 
  | 'proctor' 
  | 'cafeteria'
  | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  username: string;
}

export interface UserState {
  isAuthenticated: boolean;
  role: UserRole | null;
  user?: User | null;
  token?: string | null;
}

export interface NavLink {
  name: string;
  href: string;
}

export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
}

export const loginSchema = z.object({
  login: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;
