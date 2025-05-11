
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FilterOption, ROLE_LABELS } from "../../../../types/user";

interface RoleFilterProps {
  selectedRole: FilterOption;
  onRoleChange: (role: FilterOption) => void;
}

const RoleFilter: React.FC<RoleFilterProps> = ({ selectedRole, onRoleChange }) => {
  const handleValueChange = (value: string) => {
    onRoleChange(value as FilterOption);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2">
        <label htmlFor="role-filter" className="text-sm font-medium">
          Filter by Role:
        </label>
        <Select value={selectedRole} onValueChange={handleValueChange}>
          <SelectTrigger id="role-filter" className="w-[180px]">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ROLE_LABELS).map(([role, label]) => (
              <SelectItem key={role} value={role}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RoleFilter;
