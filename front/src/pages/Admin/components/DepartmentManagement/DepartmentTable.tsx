import React from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Department, SortConfig } from '../../../../types/user';

interface DepartmentTableProps {
  departments: Department[];
  sortConfig: SortConfig;
  onSort: (key: keyof Department) => void;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const DepartmentTable: React.FC<DepartmentTableProps> = ({
  departments,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getSortIcon = (key: keyof Department) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const renderSortableHeader = (
    label: string,
    key: keyof Department,
    className: string = ''
  ) => (
    <th
      className={`px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer transition-colors hover:bg-gray-50 ${className}`}
      onClick={() => onSort(key)}
    >
      <div className="flex items-center gap-1">
        {label}
        <span className="text-gray-500 ml-1">{getSortIcon(key)}</span>
      </div>
    </th>
  );

  const renderPageButtons = () => {
    const pageButtons = [];
    const maxVisiblePages = 3;
    
    // First page
    pageButtons.push(
      <button
        key="first"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronsLeft size={18} />
      </button>
    );
    
    // Previous page
    pageButtons.push(
      <button
        key="prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={18} />
      </button>
    );
    
    // Calculate visible page range
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded ${
            i === currentPage
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Next page
    pageButtons.push(
      <button
        key="next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={18} />
      </button>
    );
    
    // Last page
    pageButtons.push(
      <button
        key="last"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronsRight size={18} />
      </button>
    );
    
    return pageButtons;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        {/* <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-12"></th>
              {renderSortableHeader('Department Name', 'name')}
              {renderSortableHeader('Head of Department', 'head')}
              {renderSortableHeader('Total Staff', 'total_staff')}
              {renderSortableHeader('Total Students', 'total_students')}
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map((department) => (
              <tr key={department.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://i.pravatar.cc/40?u=${department.id}`} 
                      alt="Department Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{department.department}</div>
                  <div className="text-sm text-gray-500">{department.college}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {department.head}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {department.total_staff}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {department.total_students}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(department)}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      aria-label={`Edit ${department.name}`}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(department)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      aria-label={`Delete ${department.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
      </div>
      
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{departments.length}</span> of{' '}
              <span className="font-medium">{totalPages * 10}</span> departments
            </p>
          </div>
          <div className="flex gap-2">
            {renderPageButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentTable;