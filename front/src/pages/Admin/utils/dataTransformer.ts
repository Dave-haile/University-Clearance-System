import { ClearanceDisplay, ClearanceRequest } from "../../../types/clerance";

export const transformClearanceData = (request: ClearanceRequest): ClearanceDisplay => {
  return {
    id: request.id,
    student_id: request.student_id,
    username: request.student?.user?.username ?? 'Unknown',
    department: request.student?.department ?? request.department ?? 'Unknown',
    sex: request.sex,
    academicYear: request.academic_year,
    year: request.year,
    semester: request.semester,
    section: request.section,
    college: request.college,
    reason: request.reason_for_clearance
      ? (request.reason_for_clearance.length > 30
        ? request.reason_for_clearance.slice(0, 30) + '...'
        : request.reason_for_clearance)
      : 'No reason provided',
    currentStep: request.current_step,
    status: request.status,
    lastDay: request.last_day_class_attended,
    createdAt: request.created_at
      ? new Date(request.created_at).toLocaleDateString()
      : 'Unknown date',
  };
};