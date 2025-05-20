import { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import FilterSection from "../components/ClearanceManagemnt/FilterSection";
import LoadingSpinner from "../components/ClearanceManagemnt/LoadingSpinner";
import ErrorAlert from "../components/ClearanceManagemnt/ErrorAlert";
import EmptyState from "../components/ClearanceManagemnt/EmptyState";
import { Button } from "../../../components/ui/button";
import { ClearanceRequests } from "../../../types/clerance";
import ClearanceTable from "../components/ClearanceManagemnt/ClearanceTable";
import axiosClient from "../../../services/axiosBackend";
import MainLayout from "../components/layout/MainLayout";
import { Archive } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { toast } from "sonner";

const Requests = () => {
  const [clearanceRequests, setClearanceRequests] = useState<
    ClearanceRequests[]
  >([]);
  const [filteredRequests, setFilteredRequests] = useState<ClearanceRequests[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
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
      const data = await axiosClient.get("/admin/clearanceRequests");
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
        (request) => request.status.toLowerCase() === statusFilter.toLowerCase()
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

  const handleArchiveAllRequests = async () => {
    setIsArchiveDialogOpen(false);
    try {
      const res = await axiosClient.post("/admin/archive-clearance-requests");
      toast.success(res.data.message || "All requests archived successfully!");
      handleRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to archive. Try again.");
    }
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
              variant="destructive"
              onClick={() => setIsArchiveDialogOpen(true)}
              className="flex items-center"
            >
              <Archive className="mr-2" size={20} />
              Archive All Clearance Requests
            </Button>
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
        <AlertDialog
          open={isArchiveDialogOpen}
          onOpenChange={setIsArchiveDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center text-red-600">
                <span className="text-xl mr-2">⚠️</span> Archive Clearances
                Confirmation
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-4 pt-2">
                <p className="text-sm">
                  <strong>Note:</strong> This action will mark all existing
                  clearance requests as archived, preserving them for historical
                  reference. After archiving, students will be able to submit
                  new clearance requests for the upcoming semester.
                </p>

                <p className="text-sm flex items-center border-l-4 border-blue-500 pl-3 py-2 bg-blue-50">
                  <span className="mr-2">🔒</span> Archived data cannot be
                  modified by students.
                </p>

                <p className="font-medium text-gray-900">
                  Are you sure you want to proceed with archiving all current
                  clearance requests?
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleArchiveAllRequests}
                className="bg-red-600 hover:bg-red-700"
              >
                Archive All Requests
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default Requests;
