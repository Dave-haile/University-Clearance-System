export interface User {
  id: number;
  name: string;
  username: string;
  role: string;
  profile_image: string | null;
}

export interface Student {
  id: number;
  user_id: number;
  student_id: string;
  department: string;
  year: string;
  user: User;
}

export interface ClearanceRequest {
  id: number;
  student_id: string;
  sex: string;
  status: string;
  year: string;
  semester: string;
  section: string;
  department: string;
  college: string;
  academic_year: string;
  last_day_class_attended: string;
  reason_for_clearance: string;
  current_step: string;
  created_at: string;
  student: Student;
}
export interface ClearanceRequests {
  id: number;
  student_id: string;
  status: string;
  approvals: {
    department_head: boolean | null;
    library: boolean | null;
    cafeteria: boolean | null;
    proctor: boolean | null;
    registrar: boolean | null;
  };
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
  created_at: string;
  student: Student;
  cafeteria_approved: boolean | null;
  department_head_approved: boolean | null;
  library_approved: boolean | null;
  proctor_approved: boolean | null;
  registrar_approved: boolean | null;


}

export interface ClearanceDisplay {
  id: number;
  student_id: string;
  username: string;
  college: string;
  department: string;
  sex: string;
  academicYear: string;
  year: string;
  semester: string;
  section: string;
  reason: string;
  currentStep: string;
  status: string;
  lastDay: string;
  createdAt: string;
}