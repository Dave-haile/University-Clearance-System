import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Department, DepartmentStat } from "../../../../types/department";
import { EditIcon, Trash2Icon } from "lucide-react";

interface DepartmentTableProps {
  departments: Department[];
  departmentStat: DepartmentStat | undefined;
  isLoading: boolean;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
  sortConfig: {
    key: keyof Department | null;
    direction: "asc" | "desc" | null;
  };
  onSort: (key: keyof Department) => void;
  currentPage: number;
  itemsPerPage: number;
}

export const DepartmentTable: React.FC<DepartmentTableProps> = ({
  departments,
  isLoading,
  onEdit,
  onDelete,
  sortConfig,
  onSort,
  currentPage,
  itemsPerPage,
}) => {
  const renderSortIcon = (key: keyof Department) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  const handleSort = (key: keyof Department) => {
    onSort(key);
  };

  const getDepartmentHeadName = (department: Department) => {
    return department.department_head?.user?.name || "Not Assigned";
  };
  
  const getStudentCount = (department: Department) => {
    return department.students?.length || 0;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDepartments = departments.slice(startIndex, endIndex);
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("department")}
            >
              Department {renderSortIcon("department")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("college")}
            >
              College {renderSortIcon("college")}
            </TableHead>
            <TableHead>Department Head</TableHead>
            <TableHead>Students</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("created_at")}
            >
              Created At {renderSortIcon("created_at")}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                <div className="flex justify-center items-center space-x-2">
                  <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-primary rounded-full"></div>
                  <span>Loading departments...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : paginatedDepartments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                No departments found
              </TableCell>
            </TableRow>
          ) : (
            paginatedDepartments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">
                  {department.department}
                </TableCell>
                <TableCell>{department.college}</TableCell>
                <TableCell>{getDepartmentHeadName(department)}</TableCell>
                <TableCell>{getStudentCount(department)}</TableCell>
                <TableCell>
                  {department.created_at
                    ? format(new Date(department.created_at), "MMM d, yyyy")
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(department)}
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onDelete(department)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};