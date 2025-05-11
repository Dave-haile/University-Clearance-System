import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { UserX} from "lucide-react";
import { User, ClearanceRequest } from "../../../../types/index";

interface DeleteUserConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  user: User;
  clearances: ClearanceRequest[] | undefined;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteUserConfirmDialog: React.FC<DeleteUserConfirmDialogProps> = ({
  open,
  onClose,
  user,
  // clearances,
  onConfirm,
  isDeleting,
}) => {
  const getUserDescription = () => {
    if (user.student) {
      return `Student (${user.student.student_id})`;
    } else if (user.staff) {
      return `${user.staff.position}`;
    }
    return user.role;
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserX size={18} className="text-red-500" />
              Delete User Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="bold text-lg text-black whitespace-nowrap">{user.name}'s </span>
              account ({getUserDescription()}) and remove their data from the
              system.
              {user.student?.clearance_requests && (
                <span className="block mt-2 text-red-500 font-medium">
                  Warning: This user has clearance requests that will also be
                  deleted.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                onConfirm();
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteUserConfirmDialog;
