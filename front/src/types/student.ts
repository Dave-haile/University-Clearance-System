import { Department } from ".";
import { ClearanceRequests } from "./clerance";

export interface Student {
    id: number;
    user_id: number;
    student_id: string;
    department_id: number;
    year: string;
    created_at: string;
    updated_at: string;
    clearance_requests: ClearanceRequests;
    department: Department;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: null | string;
    email_verified_at: null | string;
    role: string;
    profile_image: null | string;
    created_at: string;
    updated_at: string;
    student: Student;
}