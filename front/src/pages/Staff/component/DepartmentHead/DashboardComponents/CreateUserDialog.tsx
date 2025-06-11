import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import StudentRegistration from "@/components/Staff/components/StudentAccountCreation";

type UserType = "student" | "staff";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
}

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>Create Student Account</DialogTitle>
      </DialogHeader>
      <DialogContent className="sm:max-w-md">
        <div className="py-4">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleUserTypeSelection("student")}
              className="w-full rounded-lg border-2 border-blue-500 bg-white px-4 py-3 text-blue-600 hover:bg-blue-50 "
            >
              Student
            </button>
          </div>
        </div>
        <StudentRegistration />
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
