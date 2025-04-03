import { z } from "zod";
export const clearanceSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  sex: z.enum(["Male", "Female"]).refine((val) => val !== undefined, {
    message: "Sex is Required",
  }),
  idNumber: z.string().min(1, "ID Number is required"),
  college: z.string().min(1, "College is required"),
  department: z.string().min(1, "Department is required"),
  lastDayAttended: z.string().min(1, "Last Day Attended is required"),
  academicYear: z.string().min(1, "Academic Year is required"),
  yearOfStudy: z
    .enum(["I", "II", "III", "IV", "V"])
    .refine((val) => val !== undefined, {
      message: "Year of Study is required",
    }),
  semester: z.enum(["1", "2"]).refine((val) => val !== undefined, {
    message: "Semester is required",
  }),
  section: z.string().min(1, "Section is required"),
  reasonForClearing: z
    .enum([
      "End of Academic Year",
      "Graduation",
      "Health/Family Issues",
      "Disciplinary Case",
      "Other",
    ])
    .refine((val) => val !== undefined, {
      message: "Reason for clearing is required",
    }),
  otherReason: z.string().optional(),
});

export type FormField = z.infer<typeof clearanceSchema>