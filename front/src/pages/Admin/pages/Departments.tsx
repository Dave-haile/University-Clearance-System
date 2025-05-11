import React from "react";
import { RefreshCwIcon } from "lucide-react";
import { DepartmentTable } from "../components/DepartmentManagement/DepartmentTablelove";
import { useDepartmentManager } from "../hooks/useDepartmentManager";
import { Button } from "../components/ui/button";
import { DepartmentFilters } from "../components/DepartmentManagement/DepartmentFilterslove";
import { DepartmentPagination } from "../components/DepartmentManagement/DepartmentPagination";
import { EditDepartmentModal } from "../components/DepartmentManagement/EditDepartmentModal";
import DeleteConfirmationDialog from "../components/DepartmentManagement/DeleteConfirmationDialog";
import MainLayout from "../components/layout/MainLayout";
import { CreateDepartmentButton } from "../components/DepartmentManagement/CreateDepartmentButton";

const Departments: React.FC = () => {
  const {
    error,
    isLoading,
    filteredAndSortedDepartments,
    searchQuery,
    filters,
    sortConfig,
    currentPage,
    setCurrentPage,
    editModalOpen,
    selectedDepartment,
    isSaving,
    deleteDialogOpen,
    departmentToDelete,
    isDeleting,
    departmentOptions,
    collegeOptions,
    ITEMS_PER_PAGE,
    totalPages,
    departmentStat,
    isOpen,
    handleRefresh,
    handleSort,
    handleFilterChange,
    handleSearchChange,
    handleClearFilters,
    handleEditDepartment,
    handleSaveDepartment,
    handleDeleteDepartment,
    confirmDeleteDepartment,
    setEditModalOpen,
    setDeleteDialogOpen,
    // handleOpenCreateDialog,
    handleCreateDepartment,
  } = useDepartmentManager();

  const hasFilters = !!(filters.department || filters.college || searchQuery);

  return (
    <MainLayout>
      <div className=" mx-auto py-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Department Management</h1>
            <p className="text-gray-500">
              Manage academic departments and their information
            </p>
          </div>

          {/* <div className="flex space-x-4">
            <button
              onClick={() => handleOpenCreateDialog()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus size={18} className="mr-2" />
              Create New Department / College
            </button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center hover:text-white"
              disabled={isLoading}
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              {isLoading ? "Loading..." : "Refresh"}
            </Button>
          </div> */}
          <div className="mt-4 sm:mt-0 flex gap-2">
            <CreateDepartmentButton
              collegeOptions={collegeOptions}
              onDepartmentCreated={handleCreateDepartment}
              Open={isOpen}
            />
            <Button
              onClick={handleRefresh}
              variant="outline"
              className=""
              disabled={isLoading}
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <DepartmentFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          departmentOptions={departmentOptions}
          collegeOptions={collegeOptions}
          hasFilters={hasFilters}
        />

        <DepartmentTable
          departments={filteredAndSortedDepartments}
          departmentStat={departmentStat}
          isLoading={isLoading}
          onEdit={handleEditDepartment}
          onDelete={handleDeleteDepartment}
          sortConfig={sortConfig}
          onSort={handleSort}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
        />

        <DepartmentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <EditDepartmentModal
          department={selectedDepartment}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
          }}
          onSave={handleSaveDepartment}
          isSaving={isSaving}
        />

        {deleteDialogOpen && (
          <DeleteConfirmationDialog
            isOpen={deleteDialogOpen}
            department={departmentToDelete?.department || ""}
            college={departmentToDelete?.college || ""}
            onClose={() => {
              setDeleteDialogOpen(false);
            }}
            onConfirm={confirmDeleteDepartment}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Departments;
