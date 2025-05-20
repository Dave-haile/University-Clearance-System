import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { Department } from "../../../../types/department";
import { toast } from "sonner";

interface EditDepartmentModalProps {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (departmentData: Partial<Department>) => Promise<void>;
  isSaving: boolean;
}

export const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({
  department,
  isOpen,
  onClose,
  onSave,
  isSaving,
}) => {
  const [formData, setFormData] = useState<Partial<Department>>({
    department: department?.department || "",
    college: department?.college || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (department) {
      setFormData({
        department: department.department || "",
        college: department.college || "",
      });
      setIsEditing(false);
    }
  }, [department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.department || !formData.college) {
      toast.error("Department name and college are required");
      return;
    }

    try {
      await onSave(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving department:", error);
    }
  };



  const handleCancel = () => {
    if (isEditing) {
      // If in edit mode, reset form data and return to read-only mode
      setFormData({
        department: department?.department || "",
        college: department?.college || "",
      });
      setIsEditing(false);
    } else {
      // If in read-only mode, just close the modal
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white dark:bg-gray-800 border-0 shadow-lg rounded-xl">
        <DialogHeader className="border-b pb-4 mb-2 flex flex-row justify-between items-center">
          <DialogTitle className="text-xl font-semibold">
            Department Details
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="department"
                className="text-right text-sm font-medium"
              >
                Department
              </Label>

              <div className="col-span-3 px-3 py-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700">
                {formData.department}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="college"
                className="text-right text-sm font-medium"
              >
                College
              </Label>
              <div className="col-span-3 px-3 py-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700">
                {formData.college}
              </div>
            </div>
            {department?.department_head && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="head"
                  className="text-right text-sm font-medium"
                >
                  Department Head
                </Label>
                <div className="col-span-3 px-3 py-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700">
                  {department.department_head.user?.name || "Not Assigned"}
                </div>
              </div>
            )}
            {department?.students && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="students"
                  className="text-right text-sm font-medium"
                >
                  Number of Students
                </Label>
                <div className="col-span-3 px-3 py-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700">
                  {department.students.length}
                </div>
              </div>
            )}
            {department?.created_at && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="created"
                  className="text-right text-sm font-medium"
                >
                  Created At
                </Label>
                <div className="col-span-3 px-3 py-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700">
                  {new Date(department.created_at).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex gap-1 items-center transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
              {isEditing ? "Cancel" : "Close"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
