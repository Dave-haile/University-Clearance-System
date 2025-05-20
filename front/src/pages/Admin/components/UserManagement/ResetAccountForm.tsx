
import React from "react";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { User } from "../../../../types/user";

interface ResetAccountFormProps {
  user: User;
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

const ResetAccountForm: React.FC<ResetAccountFormProps> = ({
  user,
  username,
  password,
  onUsernameChange,
  onPasswordChange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-username" className="text-right">
          {user.role === "student" ? "Username" : "Email"}
        </Label>
        <div className="col-span-3">
          <Input 
            id="new-username" 
            value={username} 
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder={user.role === "student" ? "New username" : "New email"}
          />
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-password" className="text-right">Password</Label>
        <div className="col-span-3">
          <Input 
            id="new-password" 
            type="password" 
            value={password} 
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="New password"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetAccountForm;