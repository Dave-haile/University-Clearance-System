import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  RefreshCcw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShieldCheck,
  Loader2,
  Flag,
  Calendar,
  Clock,
  Check,
  X,
  MessageSquare,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ClearanceRequest } from "../../../types";
import { useAuth } from "@/context/authContext";
import { useToast } from "@/components/ui/use-toast";
import axiosClient from "@/services/axiosBackend";
import { isAxiosError } from "axios";
import { queryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

const fetchStaffRequests = async (
  role: string,
): Promise<ClearanceRequest[]> => {
  const response = await axiosClient.get("/clearance-requests", {
    params: { staff_role: role },
  });

  return response.data?.data ?? [];
};

const updateRequestStatus = async ({
  id,
  staffRole,
  status,
  comment,
}: {
  id: number;
  staffRole: string;
  status: "approved" | "rejected";
  comment: string;
}) => {
  const response = await axiosClient.post(`/approve-clearance/${id}`, {
    staff_role: staffRole,
    status,
    remarks: comment,
  });

  return response.data;
};

type RequestPriority = "high" | "medium" | "low";

const normalizeStaffRole = (role: string | undefined) =>
  role === "library_staff" ? "library" : role || "";

const getRequestPriority = (req: ClearanceRequest): RequestPriority => {
  const dueDate = new Date(req.created_at);
  const ageInHours = (Date.now() - dueDate.getTime()) / (1000 * 60 * 60);

  if (ageInHours >= 48) return "high";
  if (ageInHours >= 24) return "medium";
  return "low";
};

const getDueDate = (req: ClearanceRequest) => {
  const dueDate = new Date(req.created_at);
  dueDate.setDate(dueDate.getDate() + 3);
  return dueDate.toISOString();
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    approved:
      "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
    pending:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    rejected:
      "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm ${styles[status as keyof typeof styles]}`}
    >
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: RequestPriority }) => {
  const styles = {
    high: "text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800",
    medium:
      "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    low: "text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800",
  };

  return (
    <div
      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${styles[priority]}`}
    >
      <Flag
        className={`w-2.5 h-2.5 ${priority === "high" ? "animate-pulse" : ""}`}
      />
      {priority}
    </div>
  );
};

const StaffRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const normalizedRole = normalizeStaffRole(user?.role);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"my_turn" | "all">("my_turn");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"created_at" | "due_date">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionModal, setShowActionModal] = useState<{
    id: number;
    name: string;
    type: "approve" | "reject";
  } | null>(null);
  const [comment, setComment] = useState("");
  const itemsPerPage = 10;

  const {
    data: requests,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [...queryKeys.staff.clearanceRequests, normalizedRole],
    queryFn: () => fetchStaffRequests(normalizedRole),
    enabled: !!normalizedRole,
  });

  const actionMutation = useMutation({
    mutationFn: ({
      id,
      status,
      comment,
    }: {
      id: number;
      status: "approved" | "rejected";
      comment: string;
    }) =>
      updateRequestStatus({
        id,
        staffRole: normalizedRole,
        status,
        comment,
      }),
    onSuccess: (response, variables) => {
      addToast({
        type: variables.status === "approved" ? "success" : "error",
        title:
          variables.status === "approved"
            ? "Request Approved"
            : "Request Rejected",
        message:
          response?.message ||
          `Request ${variables.status === "approved" ? "approved" : "rejected"} successfully.`,
      });
      setShowActionModal(null);
      setComment("");
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.staff.clearanceRequests,
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.staff.dashboard }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.student.dashboard,
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.student.allData }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.requestsBase,
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
      refetch();
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message ||
          error.message
        : error instanceof Error
          ? error.message
          : "Failed to update clearance request.";

      addToast({
        type: "error",
        title: "Update Failed",
        message,
      });
    },
  });

  const filteredRequests = useMemo(() => {
    if (!requests) return [];
    let filtered = requests.filter((req) => {
      const matchSearch =
        req.student.user.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        req.student_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTurn =
        filterType === "all" || req.current_step === normalizedRole;
      const matchStatus = statusFilter === "all" || req.status === statusFilter;
      const priority = getRequestPriority(req);
      const matchPriority =
        priorityFilter === "all" || priority === priorityFilter;
      const matchDept =
        deptFilter === "all" || req.department.department === deptFilter;

      return (
        matchSearch && matchTurn && matchStatus && matchPriority && matchDept
      );
    });

    // Sorting
    filtered.sort((a, b) => {
      const valA = new Date(
        sortBy === "due_date" ? getDueDate(a) : a.created_at,
      ).getTime();
      const valB = new Date(
        sortBy === "due_date" ? getDueDate(b) : b.created_at,
      ).getTime();
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });

    return filtered;
  }, [
    requests,
    searchTerm,
    filterType,
    statusFilter,
    priorityFilter,
    deptFilter,
    sortBy,
    sortOrder,
    normalizedRole,
  ]);

  const departments = useMemo(() => {
    if (!requests) return [];
    return Array.from(new Set(requests.map((r) => r.department.department)));
  }, [requests]);

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const getRoleLabel = (role: string | undefined) => {
    if (!role) return "Staff";
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const toggleSort = (field: "created_at" | "due_date") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              Vetting Queue
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs ml-1">
            Manage and process student clearance requests for the{" "}
            <span className="text-indigo-600 font-black">
              {getRoleLabel(normalizedRole)}
            </span>{" "}
            office.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCcw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh Queue
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by student name or ID..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 w-full lg:w-auto">
            <button
              onClick={() => setFilterType("my_turn")}
              className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === "my_turn" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" : "text-slate-400 hover:text-slate-600"}`}
            >
              My Review Turn
            </button>
            <button
              onClick={() => setFilterType("all")}
              className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === "all" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" : "text-slate-400 hover:text-slate-600"}`}
            >
              All Requests
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Department
            </label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Sort By
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => toggleSort("created_at")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${sortBy === "created_at" ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-800" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"}`}
              >
                Submission{" "}
                {sortBy === "created_at" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
              <button
                onClick={() => toggleSort("due_date")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${sortBy === "due_date" ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-800" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"}`}
              >
                Deadline{" "}
                {sortBy === "due_date" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
                  Student Details
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
                  Priority & Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
                  Current Phase
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
                  Dates
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-full"></div>
                      </td>
                    </tr>
                  ))
                : paginatedRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group"
                    >
                      <td
                        className="px-6 py-4"
                        onClick={() => navigate(`/staff/requests/${req.id}`)}
                      >
                        <div className="flex items-center gap-3 cursor-pointer">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-black text-xs shadow-md">
                            {req.student.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-slate-100 leading-none">
                              {req.student.user.name}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-tighter">
                              {req.student_id} • {req.department.department}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <PriorityBadge priority={getRequestPriority(req)} />
                          <StatusBadge status={req.status} />
                        </div>
                      </td>
                      <td
                        className="px-6 py-4"
                        onClick={() => navigate(`/staff/requests/${req.id}`)}
                      >
                        <div className="flex flex-col gap-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${req.current_step === normalizedRole ? "bg-amber-500 animate-pulse" : "bg-slate-300"}`}
                            />
                            <span
                              className={`text-[10px] font-black uppercase tracking-widest ${req.current_step === normalizedRole ? "text-amber-600 dark:text-amber-400" : "text-slate-500"}`}
                            >
                              {req.current_step === normalizedRole
                                ? "Awaiting Your Review"
                                : req.current_step.replace("_", " ")}
                            </span>
                          </div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase ml-3.5">
                            Phase{" "}
                            {[
                              "department_head",
                              "library",
                              "cafeteria",
                              "proctor",
                              "registrar",
                            ].indexOf(req.current_step) + 1}{" "}
                            of 5
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">
                              Sub:{" "}
                              {new Date(req.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-rose-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">
                              Due:{" "}
                              {new Date(getDueDate(req)).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {req.current_step === normalizedRole &&
                            req.status === "pending" && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowActionModal({
                                      id: req.id,
                                      name: req.student.user.name,
                                      type: "approve",
                                    });
                                  }}
                                  className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 transition-all"
                                  title="Quick Approve"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowActionModal({
                                      id: req.id,
                                      name: req.student.user.name,
                                      type: "reject",
                                    });
                                  }}
                                  className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 transition-all"
                                  title="Quick Reject"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          <button
                            onClick={() =>
                              navigate(`/staff/requests/${req.id}`)
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              {!isLoading && paginatedRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Filter className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-900 dark:text-slate-50 uppercase tracking-widest">
                          Queue Empty
                        </p>
                        <p className="text-xs font-medium">
                          No pending requests found matching your criteria.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredRequests.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Page{" "}
              <span className="text-slate-900 dark:text-slate-100">
                {currentPage}
              </span>{" "}
              of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-lg"
            onClick={() => setShowActionModal(null)}
          />
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-2xl p-10 relative z-10 animate-slide-up">
            <div
              className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 mx-auto border ${
                showActionModal.type === "approve"
                  ? "bg-emerald-50 border-emerald-100 text-emerald-500 dark:bg-emerald-950/40 dark:border-emerald-900/30"
                  : "bg-rose-50 border-rose-100 text-rose-500 dark:bg-rose-950/40 dark:border-rose-900/30"
              }`}
            >
              {showActionModal.type === "approve" ? (
                <Check className="w-10 h-10" />
              ) : (
                <X className="w-10 h-10" />
              )}
            </div>

            <div className="text-center space-y-3 mb-10">
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">
                {showActionModal.type === "approve"
                  ? "Confirm Approval"
                  : "Confirm Rejection"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium px-6">
                {showActionModal.type === "approve"
                  ? `You are about to validate ${showActionModal.name}'s clearance for your office.`
                  : `Please provide a reason for rejecting ${showActionModal.name}'s clearance request.`}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" /> Internal Remarks
                  (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter any relevant notes or feedback..."
                  className="w-full h-32 p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[32px] text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowActionModal(null)}
                  className="px-8 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    actionMutation.mutate({
                      id: showActionModal.id,
                      status: showActionModal.type as "approved" | "rejected",
                      comment,
                    })
                  }
                  disabled={actionMutation.isPending}
                  className={`px-8 py-4 text-white rounded-2xl text-xs font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    showActionModal.type === "approve"
                      ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 dark:shadow-none"
                      : "bg-rose-600 hover:bg-rose-700 shadow-rose-100 dark:shadow-none"
                  }`}
                >
                  {actionMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Confirm Action"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffRequestsPage;
