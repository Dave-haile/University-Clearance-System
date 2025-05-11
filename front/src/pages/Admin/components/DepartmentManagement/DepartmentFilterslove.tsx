import React from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { DepartmentFilter } from "../../../../types/department";

interface DepartmentFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: DepartmentFilter;
  onFilterChange: (
    filterType: keyof DepartmentFilter,
    value: string | null
  ) => void;
  onClearFilters: () => void;
  departmentOptions: string[];
  collegeOptions: string[];
  hasFilters: boolean;
}

export const DepartmentFilters: React.FC<DepartmentFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
  departmentOptions,
  collegeOptions,
  hasFilters,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <Input
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        <Select
          value={filters.department || ""}
          onValueChange={(value) => onFilterChange("department", value || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {departmentOptions.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={filters.college || ""}
          onValueChange={(value) => onFilterChange("college", value || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by College" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {collegeOptions.map((college) => (
                <SelectItem key={college} value={college}>
                  {college}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-xs py-4"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </>
  );
};
