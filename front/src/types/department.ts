import { Student, User } from "./user";

export interface DepartmentHead {
    id: number;
    user_id: number;
    position: string;
    department_id: number;
    role: string;
    created_at: string;
    updated_at: string;
    user: User;
}

export interface Department {
    id: number;
    department: string;
    college: string;
    created_at: string | null;
    updated_at: string | null;
    students: Student[];
    department_head: DepartmentHead | null;
}

export interface DepartmentFilter {
    department: string | null;
    college: string | null;
}

export interface DepartmentStat {
    total_departments: number;
    unique_colleges: number;
}