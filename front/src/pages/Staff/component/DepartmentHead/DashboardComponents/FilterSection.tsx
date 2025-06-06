import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Department } from "@/types";

interface FilterSectionProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (department: string) => void;
  departments: Department[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClearFilters: () => void;
}

const FilterSection = ({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  onClearFilters,
}: FilterSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Search by Student Name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Year</SelectItem>
                <SelectItem value="1st Year">1st Year</SelectItem>
                <SelectItem value="2nd Year">2nd Year</SelectItem>
                <SelectItem value="3rd Year">3rd Year</SelectItem>
                <SelectItem value="4th Year">4th Year</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* <div className="space-y-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((department, index) => (
                  <SelectItem key={index} value={department.department}>
                    {department.department}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div> */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="text-sm"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
