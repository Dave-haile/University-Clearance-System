import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import { Key, Eye } from "lucide-react";
import { User } from "../../../../types/index";
import { resetUserPassword } from "../../services/userDetailService";
import { notifyError, notifySuccess } from "../../../../hooks/toast";

interface ResetPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onSuccess: () => void;
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  open,
  onClose,
  user,
  onSuccess,
}) => {
  const [loginIdentifier, setLoginIdentifier] = useState(
    user.username || user.email || ""
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{
    loginIdentifier?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Reset password mutation
  const resetMutation = useMutation({
    mutationFn: () => {
      const credentials =
        user.role === "student"
          ? { username: loginIdentifier, password }
          : { email: loginIdentifier, password };

      return resetUserPassword(user.id.toString(), credentials);
    },
    onSuccess: () => {
      notifySuccess("User deleted successfully!");
      onSuccess()
    },
    onError: () => {
      notifyError("Failed to delete user.");
    },
  });

  // Form validation
  const validateForm = () => {
    const errors: {
      loginIdentifier?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!loginIdentifier.trim()) {
      errors.loginIdentifier =
        user.role === "student" ? "Username is required" : "Email is required";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;
    resetMutation.mutate();
  };

  // Clear form on dialog close
  const handleDialogClose = () => {
    setPassword("");
    setConfirmPassword("");
    setFormErrors({});
    onClose();
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key size={18} />
            Reset Password for {user.name}
          </DialogTitle>
          <DialogDescription>
            Enter new account credentials for this user. The user will need to
            use these credentials to log in.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="loginIdentifier">
              {user.role === "student" ? "Username" : "Email"}
            </Label>
            <Input
              id="loginIdentifier"
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              disabled={resetMutation.isPending}
              autoComplete="off"
            />
            {formErrors.loginIdentifier && (
              <p className="text-sm text-red-500">
                {formErrors.loginIdentifier}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={resetMutation.isPending}
                autoComplete="new-password"
              />
              <Eye
                onClick={() => {
                  setShowPassword((prev) => !prev);
                }}
                className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 hover:cursor-pointer"
              />
            </div>
            {formErrors.password && (
              <p className="text-sm text-red-500">{formErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={resetMutation.isPending}
                autoComplete="new-password"
              />
              <Eye
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 hover:cursor-pointer"
              />
            </div>
            {formErrors.confirmPassword && (
              <p className="text-sm text-red-500">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <p className="text-xs text-gray-500">
            Password should be at least 6 characters
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleDialogClose}
              disabled={resetMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={resetMutation.isPending}>
              {resetMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
