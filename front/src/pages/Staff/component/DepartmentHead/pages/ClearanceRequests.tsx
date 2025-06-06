import { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { MainLayout } from "../../layout/MainLayout";
import LoadingSpinner from "@/pages/Admin/components/ClearanceManagemnt/LoadingSpinner";
import ErrorAlert from "@/pages/Admin/components/ClearanceManagemnt/ErrorAlert";
import EmptyState from "@/pages/Admin/components/ClearanceManagemnt/EmptyState";
import FilterSection from "../DashboardComponents/FilterSection";
import axiosClient from "@/services/axiosBackend";
import { Button } from "@/components/ui/button";
import { ClearanceRequests as Clear } from "@/types/clerance";
import ClearanceTable from "../DashboardComponents/ClearanceTable";

const ClearanceRequests = () => {
  const [clearanceRequests, setClearanceRequests] = useState<Clear[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Clear[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  const uniqueDepartments = Array.from(
    new Set(clearanceRequests.map((req) => req.department))
  );

  const loadClearanceRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await axiosClient.get("/staff/displayRequests");
      console.log("Clearance Requests Data:", data.data);
      setClearanceRequests(data.data);
      setTotalPages(Math.ceil(data.data.length / itemsPerPage));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError("Failed to load clearance requests. Please try again.");
      console.error("Error fetching clearance requests:", err);
    }
  };

  useEffect(() => {
    loadClearanceRequests();
  }, []);

  useEffect(() => {
    let filtered = [...clearanceRequests];
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (request) => request.year.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    if (departmentFilter !== "all") {
      filtered = filtered.filter(
        (request) => request.department.department === departmentFilter
      );
    }
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (request) =>
          request.student_id.toLowerCase().includes(query) ||
          (request.student.user.name &&
            request.student.user.name.toLowerCase().includes(query))
      );
    }
    setFilteredRequests(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [clearanceRequests, statusFilter, departmentFilter, searchQuery]);
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRequests.slice(startIndex, endIndex);
  };

  const handleRefresh = () => {
    loadClearanceRequests();
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setDepartmentFilter("all");
    setSearchQuery("");
  };

  return (
    <MainLayout>
      <div className="mx-auto px-1 py-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">
            Clearance Request Monitoring
          </h1>
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
            >
              <RefreshCcw className="h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>

        <FilterSection
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          departments={uniqueDepartments}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onClearFilters={handleClearFilters}
        />

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorAlert message={error} onRetry={handleRefresh} />
        ) : filteredRequests.length === 0 ? (
          <EmptyState onRefresh={handleRefresh} />
        ) : (
          <ClearanceTable
            clearanceRequests={getCurrentPageItems()}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ClearanceRequests;
