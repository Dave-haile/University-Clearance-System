import React from 'react';
import { Search, X } from 'lucide-react';
import { Department, DepartmentFilters as FilterTypes } from '../../../../types/department';

interface DepartmentFiltersProps {
  departments: Department[];
  colleges: string[];
  filters: FilterTypes;
  onFilterChange: (filters: FilterTypes) => void;
  onClearFilters: () => void;
  searchQuery: string;
  onSearch: (query: string) => void;
}

const DepartmentFilters: React.FC<DepartmentFiltersProps> = ({
  departments,
  colleges,
  filters,
  onFilterChange,
  onClearFilters,
  searchQuery,
  onSearch,
}) => {
  // Get unique department names for filter options
  const departmentNames = [...new Set(departments.map(dept => dept.department))].sort();

  const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onFilterChange({
      ...filters,
      departmentName: value === 'all' ? null : value,
    });
  };

  const handleCollegeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onFilterChange({
      ...filters,
      collegeName: value === 'all' ? null : value,
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search departments..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Department
          </label>
          <select
            id="department-filter"
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filters.departmentName || 'all'}
            onChange={handleDepartmentChange}
          >
            <option value="all">All Departments</option>
            {departmentNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="college-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by College
          </label>
          <select
            id="college-filter"
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filters.collegeName || 'all'}
            onChange={handleCollegeChange}
          >
            <option value="all">All Colleges</option>
            {colleges.map((college) => (
              <option key={college} value={college}>
                {college}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className="flex items-center justify-center gap-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <X size={16} />
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentFilters;