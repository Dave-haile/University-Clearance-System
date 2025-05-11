export interface User {
  id: number;
  name: string;
  username: string;
  email: string | null;
  email_verified_at: string | null;
  role: string;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: number;
  user_id: number;
  student_id: string;
  department_id: number;
  year: string;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface RecentRequest {
  id: number;
  student_id: string;
  sex: string;
  status: "pending" | "approved" | "rejected";
  approvals: string | null;
  year: string;
  semester: string;
  section: string;
  department: string;
  college: string;
  academic_year: string;
  last_day_class_attended: string;
  reason_for_clearance: string;
  cafe_status: "cafe" | "non-cafe";
  dorm_status: "dorm" | "non-dorm";
  current_step: string;
  department_head_approved: boolean | null;
  library_approved: boolean | null;
  cafeteria_approved: boolean | null;
  proctor_approved: boolean | null;
  registrar_approved: boolean | null;
  created_at: string;
  updated_at: string;
  archived: boolean;
  student: Student;
}

export interface DepartmentStat {
  department: string;
  total: number;
}

export interface MonthStat {
  month: string;
  total: number;
}

export interface Totals {
  all: number | null;
  approved: number | null;
  pending: number | null;
  rejected: number | null;
}
export interface StaffRoles {
  cafeteria: number | null;
  department_head: number | null;
  library: number | null;
  proctor: number | null;
  registrar: number | null;
}

export interface DashboardData {
  total_users: number;
  total_students: number;
  total_staff: number;
  total_departments: number;
  total_student: number;
  total_colleges: number;
  totals: Totals;
  byDepartment: DepartmentStat[];
  byMonth: MonthStat[];
  recentRequests: RecentRequest[];
  staffRoles: StaffRoles;
}
