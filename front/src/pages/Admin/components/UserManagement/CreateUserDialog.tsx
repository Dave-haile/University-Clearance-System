import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../../components/ui/dialog";

import { useToast } from "../../hooks/use-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import CreateStaff from "./CreateAccount";
import StudentRegistration from "../../../../components/Staff/components/StudentAccountCreation";

type UserType = "student" | "staff";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
}

// Form schema for staff
const staffSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.string({
    required_error: "Please select a staff role",
  }),
});

// Form schema for students
const studentSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  studentId: z.string().min(3, { message: "Student ID is required" }),
  department: z.string().min(2, { message: "Department is required" }),
  year: z.string({
    required_error: "Please select a year",
  }),
});

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  open,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [userType, setUserType] = useState<UserType | null>(null);
  const { toast } = useToast();

  const staffForm = useForm<z.infer<typeof staffSchema>>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
    },
  });

  const studentForm = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      studentId: "",
      department: "",
      year: "",
    },
  });

  const handleUserTypeSelection = (type: UserType) => {
    setUserType(type);
    setStep(2);
  };

  const handleStaffSubmit = (values: z.infer<typeof staffSchema>) => {
    toast({
      title: "Staff Account Created",
      description: `Created ${values.name} as ${values.role} staff member`,
    });
    resetAndClose();
  };

  const handleStudentSubmit = (values: z.infer<typeof studentSchema>) => {
    toast({
      title: "Student Account Created",
      description: `Created ${values.name} as a ${values.year} student`,
    });
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep(1);
    setUserType(null);
    staffForm.reset();
    studentForm.reset();
    onClose();
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {step === 1 ? (
          ""
        ) : (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
          </button>
        )}
        <DialogHeader className="space-y-3">
          <DialogTitle>
            {step === 1
              ? "Select User Type"
              : userType === "staff"
              ? "Create Staff Account"
              : "Create Student Account"}
          </DialogTitle>
          {step === 2 && (
            <DialogDescription>
              Fill in the details for the new {userType} account
            </DialogDescription>
          )}
        </DialogHeader>

        {step === 1 ? (
          <div className="py-4">
            <div className="flex flex-col gap-4">
              <button
                value={"student"}
                id="student"
                onClick={() => handleUserTypeSelection("staff")}
                className="w-full rounded-lg border-2 border-blue-500 bg-white px-4 py-3 text-blue-600 hover:bg-blue-50"
              >
                Staff
              </button>

              <button
                onClick={() => handleUserTypeSelection("student")}
                className="w-full rounded-lg border-2 border-blue-500 bg-white px-4 py-3 text-blue-600 hover:bg-blue-50 "
              >
                Student
              </button>
            </div>
          </div>
        ) : userType === "staff" ? (
          <>
            <CreateStaff onSubmitSuccess={handleStaffSubmit} onClose={resetAndClose} />
          </>
        ) : (
          <>
            <StudentRegistration />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
