import { z } from 'zod';

export const clearanceFormSchema = z.object({
  first_name: z.string().min(1, 'Full name is required'),
  sex: z.enum(['Male', 'Female'], {
    required_error: 'Please select your sex',
  }),
  id_number: z.string().min(1, 'ID number is required'),
  college: z.string().min(1, 'College is required'),
  department: z.string().min(1, 'Department is required'),
  last_day_class_attended: z.string().min(1, 'Last day attended is required'),
  academic_year: z.string().min(1, 'Academic year is required'),
  year: z.string().min(1, 'Year of study is required'),
  semester: z.string().min(1, 'Semester is required'),
  section: z.string(),
  reason_for_clearance: z.string().min(1, 'Reason for clearing is required'),
  other_reason: z.string().optional(),
  cafe_status: z.string().min(1, 'Your Cafe Status is required'),
  dorm_status: z.string().min(1, 'Your Dorm status is required')
});

export type ClearanceFormData = z.infer<typeof clearanceFormSchema>;
