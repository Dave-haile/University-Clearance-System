export interface ClearanceFormData {
    fullName: string;
    sex: "Male" | "Female";
    idNumber: string;
    college: string;
    department: string;
    lastDayAttended: string;
    academicYear: string;
    yearOfStudy: "I" | "II" | "III" | "IV" | "V";
    semester: "1" | "2";
    section: string;
    reasonForClearing:
      | "End of Academic Year"
      | "Graduation"
      | "Health/Family Issues"
      | "Disciplinary Case"
      | "Other";
    otherReason?: string;
  }