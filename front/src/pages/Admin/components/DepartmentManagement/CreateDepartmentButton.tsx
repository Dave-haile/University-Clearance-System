import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { PlusIcon, UserRoundIcon } from "lucide-react";
import { toast } from "sonner";

export interface SendtoDepartmentCreationProps {
    department: string,
    college: string
    name: string
    email: string
    password: string
}
interface CreateDepartmentButtonProps {
  collegeOptions: string[];
  onDepartmentCreated: (department: SendtoDepartmentCreationProps) => void;
  Open: boolean;
}

export const CreateDepartmentButton: React.FC<CreateDepartmentButtonProps> = ({
  collegeOptions,
  onDepartmentCreated,
  Open
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingNewCollege, setIsCreatingNewCollege] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    department: "",
    college: "",
    departmentHeadId: "",
    newUserName: "",
    newUserEmail: "",
    newUserPassword: "",
  });

  // Mock users for department head selection
  // In a real app, this would come from an API
  //   const departmentHead: User[] = [
  //     { id: 1, name: "Dr. Jane Smith", username: "jsmith", email: "jsmith@university.edu", email_verified_at: "2023-01-05T10:00:00.000Z", role: "Faculty", profile_image: null, created_at: "2023-01-05T10:00:00.000Z", updated_at: "2023-01-05T10:00:00.000Z", staff: null, student: null, },
  //     { id: 2, name: "Dr. Robert Johnson", username: "rjohnson", email: "rjohnson@university.edu", email_verified_at: "2023-02-05T11:00:00.000Z", role: "Faculty", profile_image: null, created_at: "2023-02-05T11:00:00.000Z", updated_at: "2023-02-05T11:00:00.000Z" },
  //     { id: 3, name: "Dr. Lisa Chen", username: "lchen", email: "lchen@university.edu", email_verified_at: "2023-03-01T10:00:00.000Z", role: "Faculty", profile_image: null, created_at: "2023-03-01T10:00:00.000Z", updated_at: "2023-03-01T10:00:00.000Z" },
  //     { id: 4, name: "Dr. Michael Brown", username: "mbrown", email: "mbrown@university.edu", email_verified_at: "2023-05-05T11:00:00.000Z", role: "Faculty", profile_image: null, created_at: "2023-05-05T11:00:00.000Z", updated_at: "2023-05-05T11:00:00.000Z" },
  //     { id: 5, name: "Dr. Sarah Williams", username: "swilliams", email: "swilliams@university.edu", email_verified_at: "2023-04-15T09:30:00.000Z", role: "Faculty", profile_image: null, created_at: "2023-04-15T09:30:00.000Z", updated_at: "2023-04-15T09:30:00.000Z" },
  //   ];

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when dialog closes
      setFormData({
        department: "",
        college: "",
        departmentHeadId: "",
        newUserName: "",
        newUserEmail: "",
        newUserPassword: "",
      });
      setIsCreatingNewCollege(false);
    }
    setIsOpen(open);
  };

  const handleCreateDepartment = async () => {
    if (!formData.department || !formData.college) {
      toast.error("Department name and college are required");
      return;
    }
    if(formData.departmentHeadId === "newUser"){
        if(!formData.newUserName){
            toast.error("Full Name is required")
            return
        }
        if(!formData.newUserEmail){
            toast.error("Email is required")
            return
        }
        if(!formData.newUserPassword){
            toast.error("Password is required")
            return
        }    
    }

    setIsSaving(true);
    try {

        const newDepartment = {
            department: formData.department,
            college: formData.college,
            name: formData.newUserName,
            email: formData.newUserEmail,
            password: formData.newUserPassword
        }
      console.log(newDepartment);

      onDepartmentCreated(newDepartment);
      setIsOpen(Open);
    } catch (error) {
      console.error("Error creating department:", error);
      toast.error("Failed to create department");
    } finally {
      setIsSaving(Open);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-1">
        <PlusIcon className="h-4 w-4" />
        New Department
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border-0 shadow-lg rounded-xl">
          <DialogHeader className="border-b pb-4 mb-2">
            <DialogTitle className="text-xl font-semibold text-center">
              Create New Department
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500 dark:text-gray-400">
              Add a new department and assign a department head
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-3">
              <Label htmlFor="college" className="text-sm font-medium">
                College
              </Label>
              {isCreatingNewCollege ? (
                <div className="flex gap-2">
                  <Input
                    id="college"
                    value={formData.college}
                    onChange={(e) =>
                      setFormData({ ...formData, college: e.target.value })
                    }
                    placeholder="Enter new college name"
                    className="flex-1 transition-all border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-900"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setIsCreatingNewCollege(false)}
                    type="button"
                    className="transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Select Existing
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Select
                    value={formData.college}
                    onValueChange={(value) =>
                      setFormData({ ...formData, college: value })
                    }
                  >
                    <SelectTrigger className="flex-1 transition-all border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-900">
                      <SelectValue placeholder="Select a college" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md">
                      {collegeOptions.map((college) => (
                        <SelectItem
                          key={college}
                          value={college}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          {college}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreatingNewCollege(true)}
                    type="button"
                    className="transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    New College
                  </Button>
                </div>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="department" className="text-sm font-medium">
                Department Name
              </Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                placeholder="Enter department name"
                className="transition-all border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-900"
              />
            </div>
            <div className="grid gap-3">
              <Label
                htmlFor="departmentHead"
                className="text-sm font-medium flex items-center gap-1"
              >
                <UserRoundIcon className="h-4 w-4" />
                Department Head
              </Label>
              <Select
                value={formData.departmentHeadId}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    departmentHeadId: value,
                  });
                }}
              >
                <SelectTrigger className="flex-1 transition-all border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-900">
                  <SelectValue placeholder="Select a department head (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md max-h-[200px] overflow-y-auto">
                  <SelectItem
                    value="none"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    No department head
                  </SelectItem>
                  <SelectItem
                    value="newUser"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    New Department Head
                  </SelectItem>
                  {/* {departmentHeadsUsers?.map((user) => (
                    <SelectItem
                      key={user.id}
                      value={user.id.toString()}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      {user.name} - {user.email}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
              {formData.departmentHeadId === "newUser" && (
                <>
                  <div className="grid gap-3 mt-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.newUserName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newUserName: e.target.value,
                        })
                      }
                      placeholder="Enter Full Name"
                      className="transition-all border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-900"
                    />
                  </div>
                  <div className="grid gap-3 mt-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.newUserEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newUserEmail: e.target.value,
                        })
                      }
                      placeholder="Enter Email"
                      className="transition-all border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-900"
                    />
                  </div>
                  <div className="grid gap-3 mt-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.newUserPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newUserPassword: e.target.value,
                        })
                      }
                      placeholder="Enter Password"
                      className="transition-all border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-900"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
              className="transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateDepartment}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 transition-colors text-white"
            >
              {isSaving ? "Creating..." : "Create Department"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
