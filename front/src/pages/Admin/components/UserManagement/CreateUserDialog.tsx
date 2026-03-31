// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "../../../../components/ui/dialog";

// import { useToast } from "../../hooks/use-toast";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { ArrowLeft } from "lucide-react";
// import CreateStaff from "./CreateAccount";
// import StudentRegistration from "../../../../components/Staff/components/StudentAccountCreation";

// type UserType = "student" | "staff";

// interface CreateUserDialogProps {
//   open: boolean;
//   onClose: () => void;
// }

// // Form schema for staff
// const staffSchema = z.object({
//   name: z.string().min(2, { message: "Name must be at least 2 characters" }),
//   email: z.string().email({ message: "Please enter a valid email address" }),
//   role: z.string({
//     required_error: "Please select a staff role",
//   }),
// });

// // Form schema for students
// const studentSchema = z.object({
//   name: z.string().min(2, { message: "Name must be at least 2 characters" }),
//   studentId: z.string().min(3, { message: "Student ID is required" }),
//   department: z.string().min(2, { message: "Department is required" }),
//   year: z.string({
//     required_error: "Please select a year",
//   }),
// });

// const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
//   open,
//   onClose,
// }) => {
//   const [step, setStep] = useState<1 | 2>(1);
//   const [userType, setUserType] = useState<UserType | null>(null);
//   const { toast } = useToast();

//   const staffForm = useForm<z.infer<typeof staffSchema>>({
//     resolver: zodResolver(staffSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       role: "",
//     },
//   });

//   const studentForm = useForm<z.infer<typeof studentSchema>>({
//     resolver: zodResolver(studentSchema),
//     defaultValues: {
//       name: "",
//       studentId: "",
//       department: "",
//       year: "",
//     },
//   });

//   const handleUserTypeSelection = (type: UserType) => {
//     setUserType(type);
//     setStep(2);
//   };

//   const handleStaffSubmit = (values: z.infer<typeof staffSchema>) => {
//     toast({
//       title: "Staff Account Created",
//       description: `Created ${values.name} as ${values.role} staff member`,
//     });
//     resetAndClose();
//   };

//   const handleStudentSubmit = (values: z.infer<typeof studentSchema>) => {
//     toast({
//       title: "Student Account Created",
//       description: `Created ${values.name} as a ${values.year} student`,
//     });
//     resetAndClose();
//   };

//   const resetAndClose = () => {
//     setStep(1);
//     setUserType(null);
//     staffForm.reset();
//     studentForm.reset();
//     onClose();
//   };

//   const handleBack = () => {
//     setStep(1);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         {step === 1 ? (
//           ""
//         ) : (
//           <button
//             type="button"
//             onClick={handleBack}
//             className="flex items-center"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//           </button>
//         )}
//         <DialogHeader className="space-y-3">
//           <DialogTitle>
//             {step === 1
//               ? "Select User Type"
//               : userType === "staff"
//               ? "Create Staff Account"
//               : "Create Student Account"}
//           </DialogTitle>
//           {step === 2 && (
//             <DialogDescription>
//               Fill in the details for the new {userType} account
//             </DialogDescription>
//           )}
//         </DialogHeader>

//         {step === 1 ? (
//           <div className="py-4">
//             <div className="flex flex-col gap-4">
//               <button
//                 value={"student"}
//                 id="student"
//                 onClick={() => handleUserTypeSelection("staff")}
//                 className="w-full rounded-lg border-2 border-blue-500 bg-white px-4 py-3 text-blue-600 hover:bg-blue-50"
//               >
//                 Staff
//               </button>

//               <button
//                 onClick={() => handleUserTypeSelection("student")}
//                 className="w-full rounded-lg border-2 border-blue-500 bg-white px-4 py-3 text-blue-600 hover:bg-blue-50 "
//               >
//                 Student
//               </button>
//             </div>
//           </div>
//         ) : userType === "staff" ? (
//           <>
//             <CreateStaff onSubmitSuccess={handleStaffSubmit} onClose={resetAndClose} />
//           </>
//         ) : (
//           <>
//             <StudentRegistration />
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreateUserDialog;

import React, { useState } from 'react';
import { X, ArrowLeft, GraduationCap, ShieldCheck } from 'lucide-react';
import StudentRegistrationForm from './StudentRegistrationForm';
import StaffRegistrationForm from './StudentRegistrationForm';

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [userType, setUserType] = useState<'student' | 'staff' | null>(null);

  if (!isOpen) return null;

  const handleTypeSelect = (type: 'student' | 'staff') => {
    setUserType(type);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setUserType(null);
  };

  const handleClose = () => {
    setStep(1);
    setUserType(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg relative z-10 flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden animate-slide-up sm:animate-fade-in transition-all">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button onClick={handleBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <ArrowLeft className="w-4 h-4 text-slate-500" />
              </button>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                {step === 1 ? 'Select Account Type' : `Create ${userType === 'student' ? 'Student' : 'Staff'} Account`}
              </h3>
              {step === 2 && <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">Step 2 of 2: Registration Details</p>}
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto scrollbar-hide flex-1">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-4">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Who are you creating this account for?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Choose the appropriate role to generate the correct workspace.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleTypeSelect('student')}
                  className="group p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all flex flex-col items-center text-center gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-50">Student</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For academic enrollment & clearance</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleTypeSelect('staff')}
                  className="group p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 transition-all flex flex-col items-center text-center gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-50">Staff</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For administrators & departmental heads</p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              {userType === 'student' ? (
                <StudentRegistrationForm onCancel={handleClose} onSuccess={onSuccess} />
              ) : (
                <StaffRegistrationForm onCancel={handleClose} onSuccess={onSuccess} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateUserDialog;
