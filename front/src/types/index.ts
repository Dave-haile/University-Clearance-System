
// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   department?: string;
//   avatar?: string;
//   isActive: boolean;
// }
// export interface Student {
//   id: number;
//   user_id: number;
//   student_id: string;
//   department: string;
//   year: string;
//   created_at: string;
//   updated_at: string;
//   user: User2;
// }

// export interface ClearanceRequest {
//   id: string;
//   title: string;
//   description: string;
//   department: string;
//   status: "pending" | "approved" | "rejected";
//   userId: string;
//   userName: string;
//   createdAt: string;
//   updatedAt: string;
// }
// export interface ClearanceRequest2{
//   id: string;
//   department: string;
//   username: string;
//   sex: string;
//   academic_year: string;
//   year: string;
//   semester: string;
//   status: string;
//   section: string;
//   reason_for_clearance: string;
//   current_step: string;
//   created_at: string;
//   last_day_class_attended: string;
//   Student: Student;
// }

// export interface Department {
//   id: string;
//   name: string;
//   description: string;
//   headId?: string;
//   headName?: string;
//   memberCount: number;
// }

// export interface Metric {
//   title: string;
//   value: number | string;
//   description: string;
//   trend?: "up" | "down" | "neutral";
//   trendValue?: string;
//   icon?: string;
// }

// export interface ChartData {
//   labels: string[];
//   datasets: {
//     label: string;
//     data: number[];
//     backgroundColor?: string | string[];
//     borderColor?: string | string[];
//     borderWidth?: number;
//   }[];
// }

// export interface ActivityItem {
//   id: string;
//   user: string;
//   action: string;
//   target: string;
//   timestamp: string;
// }

// export interface AuthState {
//   isAuthenticated: boolean;
//   user: User | null;
//   token: string | null;
//   loading: boolean;
//   error: string | null;
// }


export interface Department {
    id: number;
    department: string;
    college: string;
    created_at: string | null;
    updated_at: string | null;
  }
  
  export interface ClearanceRequest {
    id: number;
    student_id: string;
    sex: string;
    status: "pending" | "approved" | "rejected";
    approvals: string;
    year: string;
    semester: string;
    section: string;
    department: string;
    college: string;
    academic_year: string;
    last_day_class_attended: string;
    reason_for_clearance: string;
    cafe_status: string;
    dorm_status: string;
    current_step: string;
    department_head_approved: boolean | null;
    library_approved: boolean | null;
    cafeteria_approved: boolean | null;
    proctor_approved: boolean | null;
    registrar_approved: boolean | null;
    archived: boolean;
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
    department: Department | null;
    clearance_requests: ClearanceRequest | null;
  }
  
  export interface Staff {
    id: number;
    user_id: number;
    position: string;
    department_id: number | null;
    role: string;
    created_at: string | null;
    updated_at: string | null;
    department: Department | null;
  }
  
  export interface User {
    id: number;
    name: string;
    username: string | null;
    email: string | null;
    email_verified_at: string | null;
    role: string;
    created_at: string | null;
    updated_at: string | null;
    profile_image: string | null;
    staff: Staff | null;
    student: Student | null;
  }
  
  export type SortField = "name" | "created_at";
  export type SortDirection = "asc" | "desc";
  export type UserRole = "all" | "student" | "staff" | "admin" | "department_head" | "library" | "cafeteria" | "proctor" | "registrar";
