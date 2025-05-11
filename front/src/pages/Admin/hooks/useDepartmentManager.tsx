import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Department,
  DepartmentFilter,
  DepartmentStat,
} from "../../../types/department";
import axiosClient from "../../../services/axiosBackend";
import { User } from "@/types/user";
import { SendtoDepartmentCreationProps } from "../components/DepartmentManagement/CreateDepartmentButton";
// import {
//   getDepartments,
//   updateDepartment,
//   deleteDepartment,
//   createDepartment,
// } from "@/services/departmentService";

export const useDepartmentManager = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentStat, setDepartmentStat] = useState<DepartmentStat>();
  const [departmentHeads, setDepartmentHeads] = useState<User[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<DepartmentFilter>({
    department: null,
    college: null,
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Department | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] =
    useState<Department | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchDepartmentsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get("/admin/departmentDisplay");
      const departments = response.data.departments || response.data;
      const departmentStats = response.data.stats || response.data;
      const department_heads = response.data.department_head || response.data;
      console.log(department_heads);
      if (Array.isArray(departments)) {
        setDepartments(departments);
      } else {
        setDepartments([]);
        console.error(
          "Received non-array data from getDepartments:",
          response.data
        );
        setError("Received invalid data format from the server.");
      }
      setDepartmentStat(departmentStats);
      setDepartmentHeads(department_heads);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError("Failed to load departments. Please try again later.");
      toast.error("Failed to load departments");
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentsData();
  }, []);

  const handleRefresh = () => {
    fetchDepartmentsData();
    toast.success("Departments refreshed");
  };

  const handleSort = (key: keyof Department) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        if (prevConfig.direction === "asc") {
          return { key, direction: "desc" };
        } else if (prevConfig.direction === "desc") {
          return { key: null, direction: null };
        }
      }
      return { key, direction: "asc" };
    });
  };

  const handleCreateDepartment = async (departmentData: SendtoDepartmentCreationProps) => {
    console.log(departmentData);
    try {
      const response = await axiosClient.post(
        "/admin/create-department",
        departmentData
      );
      console.log("Department created:", response.data.message);
      setIsOpen(true)
    } catch (error) {
      console.log(error);
      toast.error(`${error.response.data.message}`);
      setIsOpen(false)
    }
  };

  const handleFilterChange = (
    filterType: keyof DepartmentFilter,
    value: string | null
  ) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search change
  };

  const handleClearFilters = () => {
    setFilters({ department: null, college: null });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setEditModalOpen(true);
  };

  const handleSaveDepartment = async (departmentData: Partial<Department>) => {
    if (!selectedDepartment) return;

    setIsSaving(true);
    try {
      const updatedDepartment = await updateDepartment(
        selectedDepartment.id,
        departmentData
      );

      setDepartments((prevDepartments) =>
        prevDepartments.map((dept) =>
          dept.id === updatedDepartment.id ? updatedDepartment : dept
        )
      );

      setEditModalOpen(false);
      setSelectedDepartment(null);
      toast.success("Department updated successfully");
    } catch (error) {
      toast.error(`Failed to update department ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDepartment = (department: Department) => {
    setDepartmentToDelete(department);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteDepartment = async () => {
    if (!departmentToDelete) return;

    setIsDeleting(true);
    try {
      await deleteDepartment(departmentToDelete.id);

      setDepartments((prevDepartments) =>
        prevDepartments.filter((dept) => dept.id !== departmentToDelete.id)
      );
      
      setDeleteDialogOpen(false);
      setDepartmentToDelete(null);
      toast.success("Department deleted successfully");
    } catch (error) {
      toast.error("Failed to delete department");
    } finally {
      setIsDeleting(false);
    }
  };

  // Get unique department and college options for filters
  const departmentOptions = useMemo(() => {
    return Array.isArray(departments)
      ? Array.from(new Set(departments.map((dept) => dept.department)))
      : [];
  }, [departments]);

  const collegeOptions = useMemo(() => {
    return Array.isArray(departments)
      ? Array.from(new Set(departments.map((dept) => dept.college)))
      : [];
  }, [departments]);

  // Filter and sort departments
  const filteredAndSortedDepartments = useMemo(() => {
    if (!Array.isArray(departments)) {
      console.warn(
        "departments is not an array in filteredAndSortedDepartments useMemo"
      );
      return [];
    }

    let result = [...departments];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((dept) =>
        dept.department.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.department) {
      result = result.filter((dept) => dept.department === filters.department);
    }
    if (filters.college) {
      result = result.filter((dept) => dept.college === filters.college);
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Department];
        const bValue = b[sortConfig.key as keyof Department];

        if (aValue === null) return sortConfig.direction === "asc" ? -1 : 1;
        if (bValue === null) return sortConfig.direction === "asc" ? 1 : -1;

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }

    return result;
  }, [departments, filters, sortConfig, searchQuery]);

  const ITEMS_PER_PAGE = 15;
  const totalPages = Math.ceil(
    filteredAndSortedDepartments.length / ITEMS_PER_PAGE
  );

  const handleOpenCreateDialog = async () => {};

  return {
    departments,
    departmentStat,
    departmentHeads,
    filteredAndSortedDepartments,
    isLoading,
    error,
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
    handleOpenCreateDialog,
    handleCreateDepartment,
  };
};
