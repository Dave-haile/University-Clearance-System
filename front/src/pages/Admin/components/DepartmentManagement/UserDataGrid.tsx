
import React, { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import RoleFilter from "./RoleFilter";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Edit, Trash2, Key, Lock } from "lucide-react";
import { toast } from "sonner";
import { FilterOption, User } from "../../../../types/user";

interface UserDataGridProps {
  users: User[];
}

const UserDataGrid: React.FC<UserDataGridProps> = ({ users }) => {
  const [selectedRole, setSelectedRole] = useState<FilterOption>("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Filter users based on selected role
  const filteredUsers = useMemo(() => {
    if (selectedRole === "all") {
      return users;
    }
    return users.filter(user => user.role === selectedRole);
  }, [users, selectedRole]);

  // Format date in a readable format
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    try {
      return format(parseISO(dateString), "MMMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  // Get row background color based on user role
  const getRowClass = (user: User): string => {
    if (user.role === "department_head") {
      return "bg-purple-50 hover:bg-purple-100";
    }
    if (user.role === "student") {
      return "bg-green-50 hover:bg-green-100";
    }
    return "hover:bg-gray-50";
  };

  // Get department if available
  const getDepartment = (user: User): string => {
    if (user.student?.department) {
      return user.student.department.department;
    }
    if (user.staff?.department?.department) {
      return user.staff.department.department;
    }
    return "N/A";
  };

  // Action handlers
  const handleManage = (userId: number) => {
    console.log(`Managing user ${userId}`);
    toast.info("Opening management page...");
  };

  const handleDelete = (userId: number) => {
    setSelectedUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log(`Deleting user ${selectedUserId}`);
    toast.success("User deleted successfully");
    setIsDeleteDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleResetPassword = (userId: number) => {
    console.log(`Resetting password for user ${userId}`);
    toast.success("Password reset link sent");
  };

  const handleFreezeUser = (userId: number) => {
    console.log(`Freezing user ${userId}`);
    toast.success("User account frozen");
  };

  return (
    <div className="w-full">
      <RoleFilter selectedRole={selectedRole} onRoleChange={setSelectedRole} />
      
      <div className="rounded-lg border shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr className="text-xs uppercase text-gray-600 tracking-wider">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Username</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Year</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No users found matching the selected filter.
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr
                  key={user.id}
                  className={`${getRowClass(user)} transition-colors duration-150`}
                >
                  <td className="px-6 py-4 font-medium">{user.name || "N/A"}</td>
                  <td className="px-6 py-4">{user.username || "N/A"}</td>
                  <td className="px-6 py-4 capitalize">{user.role?.replace("_", " ") || "N/A"}</td>
                  <td className="px-6 py-4">{getDepartment(user)}</td>
                  <td className="px-6 py-4">{user.student?.year || "N/A"}</td>
                  <td className="px-6 py-4">{formatDate(user.created_at)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleManage(user.id)}
                        title="Manage"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleResetPassword(user.id)}
                        title="Reset Password"
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFreezeUser(user.id)}
                        title="Freeze User"
                      >
                        <Lock className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Showing {filteredUsers.length} of {users.length} users
      </p>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDataGrid;
