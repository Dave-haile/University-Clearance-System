import { Department } from ".";

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
  department: Department;
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
  status: "approved" | "pending" | "rejected";
  approvals: {
    department_head: ApprovalClearanceStatusCard;
    library: ApprovalClearanceStatusCard;
    cafeteria: ApprovalClearanceStatusCard;
    proctor: ApprovalClearanceStatusCard;
    registrar: ApprovalClearanceStatusCard;
  };
  year: string;
  semester: string;
  section: string;
  department: Department;
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
  department: Department;
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
export interface ApprovalsProps {
  department_head?: boolean | null;
  library?: boolean | null;
  cafeteria?: boolean | null;
  proctor?: boolean | null;
  registrar?: boolean | null;
}

export interface ApprovalDotsProps {
  approvals: ApprovalsProps | string | null; 
}

export interface ApprovalStatus {
  approved_by: User | null; 
  status: ClearanceStatus;
  name: string;
  reason: string | null;
  timeStamp: string | null
}
export interface ApprovalClearanceStatusCard {
  department_head: ApprovalStatus;
  library: ApprovalStatus;
  cafeteria: ApprovalStatus;
  proctor: ApprovalStatus;
  registrar: ApprovalStatus;
  [key: string]: ApprovalStatus; // Index signature for additional properties
}
export type ClearanceStatus = "approved" | "pending" | "rejected";

export interface ApprovalsForReject {
  approved_by: User | null; 
  status: ClearanceStatus;
  timeStamp: string | null
  remarks: string| null;
}
export interface ApprovalClearanceStatusCard2{
    department_head: ApprovalClearanceStatusCard;
    library: ApprovalClearanceStatusCard;
    cafeteria: ApprovalClearanceStatusCard;
    proctor: ApprovalClearanceStatusCard;
    registrar: ApprovalClearanceStatusCard;
}

export interface ApprovalStep {
  id: string;
  name: string;
  status: ApprovalStatus | null;
}
export interface ApprovalStatus {
  status: ClearanceStatus;
  remarks: string | null;
  timestamp: string;
  approved_by: User | null;
}