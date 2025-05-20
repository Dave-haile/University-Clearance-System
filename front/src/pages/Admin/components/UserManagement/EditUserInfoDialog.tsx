import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import { updateUser } from "../../services/userDetailService";
import { useMutation, } from "@tanstack/react-query";
import { User } from "../../../../types/index";
import CollegeDepartmentSelect from "../DepartmentManagement/DepartmentCollegeFetch";

interface EditUserInfoDialogProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onSuccess: () => void;
}

const roles = [
  { value: "student", label: "Student" },
  { value: "admin", label: "Admin" },
  { value: "department_head", label: "Department Head" },
  { value: "library", label: "Library Staff" },
  { value: "cafeteria", label: "Cafeteria Staff" },
  { value: "proctor", label: "Proctor" },
  { value: "registrar", label: "Registrar" },
];

// Mock departments for demonstration
const departments = [
  { id: 1, name: "Agricultural Economics" },
  { id: 6, name: "Forestry and Climate Science" },
  { id: 12, name: "Computer Science" },
  { id: 23, name: "Electrical Engineering" },
  { id: 34, name: "Mathematics" },
  { id: 41, name: "Geography and Environmental Studies" },
  { id: 44, name: "Law" },
];

const EditUserInfoDialog: React.FC<EditUserInfoDialogProps> = ({
  open,
  onClose,
  user,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("");
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [showDepartmentField, setShowDepartmentField] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    position?: string;
    role?: string;
    departmentId?: string;
  }>({});

  // Update form values when user changes
  useEffect(() => {
    if (user) {
      setRole(user.role);
      if (user.staff) {
        setPosition(user.staff.position);
        setDepartmentId(user.staff.department_id);
      }
      setShowDepartmentField(user.role === "department_head");
    }
  }, [user]);

  // Effect to update department field visibility when role changes
  useEffect(() => {
    setShowDepartmentField(role === "department_head");
  }, [role]);

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<User>) => updateUser(user.id.toString(), data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User information updated successfully",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user information. Please try again.",
      });
    },
  });

  // Form validation
  const validateForm = () => {
    const errors: {
      position?: string;
      role?: string;
      departmentId?: string;
    } = {};

    if (!position.trim()) {
      errors.position = "Position is required";
    }

    if (!role) {
      errors.role = "Role is required";
    }

    if (role === "department_head" && !departmentId) {
      errors.departmentId = "Department is required for Department Head";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    const userData: Partial<User> = {
      role,
      staff: user.staff
        ? {
            ...user.staff,
            position,
            department_id: showDepartmentField ? departmentId : null,
            role: role,
          }
        : undefined,
    };

    updateMutation.mutate(userData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User Information</DialogTitle>
          <DialogDescription>
            Update user details for {user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={setRole}
              disabled={updateMutation.isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((roleOption) => (
                  <SelectItem key={roleOption.value} value={roleOption.value}>
                    {roleOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.role && (
              <p className="text-sm text-red-500">{formErrors.role}</p>
            )}
            <CollegeDepartmentSelect
              onDepartmentChange={(department) => {
                // setValue("department", department);
                console.log(department);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={updateMutation.isPending}
            />
            {formErrors.position && (
              <p className="text-sm text-red-500">{formErrors.position}</p>
            )}
          </div>

          {showDepartmentField && (
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={departmentId?.toString() || ""}
                onValueChange={(value) => setDepartmentId(Number(value))}
                disabled={updateMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.departmentId && (
                <p className="text-sm text-red-500">
                  {formErrors.departmentId}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserInfoDialog;
