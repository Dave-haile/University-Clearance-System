import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  RefreshCcw,
  Archive,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  Building2,
  MoreVertical,
  Loader2,
  FileBarChart,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClearanceRequests } from "@/types/clerance";
import axiosClient from "@/services/axiosBackend";
import { queryKeys } from "@/lib/queryKeys";

const archiveAllRequests = async () => {
  // end point /admin/archive-clearance-requests
  await axiosClient.post("/admin/archive-clearance-requests");
};

// --- COMPONENTS ---

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
      className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.16em] border shadow-sm ${styles[status as keyof typeof styles]}`}
    >
      {status}
    </span>
  );
};

const ClearanceProgressDots = ({ request }: { request: ClearanceRequests }) => {
  const steps = [
    { key: "department_head_approved", label: "Dept Head" },
    { key: "library_approved", label: "Library" },
    { key: "cafeteria_approved", label: "Cafeteria" },
    { key: "proctor_approved", label: "Proctor" },
    { key: "registrar_approved", label: "Registrar" },
  ];

  return (
    <div className="flex items-center gap-1">
      {steps.map((step) => {
        const val = request[step.key as keyof ClearanceRequests];
        let color = "bg-slate-200 dark:bg-slate-700"; // Pending/Null
        if (val === true)
          color = "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.3)]";
        if (val === false)
          color = "bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.3)]";

        return (
          <div
            key={step.key}
            className={`w-1 h-1 rounded-full ${color} transition-all duration-300`}
            title={`${step.label}: ${val === true ? "Approved" : val === false ? "Rejected" : "Pending"}`}
          />
        );
      })}
    </div>
  );
};

const fetchClearanceRequests = async (): Promise<ClearanceRequests[]> => {
  try {
    const data = await axiosClient.get("/admin/clearanceRequests");
    return data.data;
  } catch (err) {
    console.error("Error fetching clearance requests:", err);
    return [];
  }
};

const RequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showArchiveAlert, setShowArchiveAlert] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  // const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  // const [searchQuery, setSearchQuery] = useState<string>("");


  const queryClient = useQueryClient();

  const {
    data: requests,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.requestsBase,
    queryFn: fetchClearanceRequests,
  });

  const archiveMutation = useMutation({
    mutationFn: archiveAllRequests,
    onSuccess: async () => {
      setShowArchiveAlert(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.requestsBase,
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });

  const filteredRequests = useMemo(() => {
    if (!requests) return [];
    return requests.filter((req) => {
      const matchSearch =
        req.student.user.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        req.student_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "all" || req.status === statusFilter;
      const matchDept =
        deptFilter === "all" || req.department.department === deptFilter;
      return matchSearch && matchStatus && matchDept;
    });
  }, [requests, searchTerm, statusFilter, deptFilter]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const departments = useMemo(() => {
    if (!requests) return [];
    return Array.from(new Set(requests.map((r) => r.department.department)));
  }, [requests]);

  return (
    <div className="space-y-5 max-w-[1320px] mx-auto animate-fade-in pb-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              Task Command Center
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-[13px] ml-1">
            Real-time vetting workflow and institutional request management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/admin/reports/requests")}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all shadow-sm"
          >
            <FileBarChart className="w-3 h-3" />
            View Reports
          </button>
          <button
            onClick={() => setShowArchiveAlert(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 rounded-lg text-[11px] font-bold hover:bg-rose-100 transition-all shadow-sm group"
          >
            <Archive className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
            Archive Cycle
          </button>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-[11px] font-bold shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all"
          >
            <RefreshCcw
              className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`}
            />
            Sync Cluster
          </button>
        </div>
      </div>

      {/* Analytics Mini-Grid - MOVED TO REPORTS PAGE */}

      {/* Advanced Filtering Matrix */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Query by name or institutional identifier..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            {["all", "pending", "approved", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-md text-[8px] font-black uppercase tracking-[0.16em] transition-all ${statusFilter === s ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative group">
            <Building2 className="w-3 h-3 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500" />
            <select
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[8px] font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200 outline-none appearance-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setDeptFilter("all");
            }}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[8px] font-black uppercase tracking-[0.16em] hover:bg-slate-200 transition-all"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Task List Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <th className="px-5 py-3.5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em]">
                  ID
                </th>
                <th className="px-5 py-3.5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em]">
                  Student Artifact
                </th>
                <th className="px-5 py-3.5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em]">
                  Status
                </th>
                <th className="px-5 py-3.5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em]">
                  Clearance Progress
                </th>
                <th className="px-5 py-3.5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em]">
                  Phase
                </th>
                <th className="px-5 py-3.5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-5 py-3.5">
                      <div className="h-7 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-full"></div>
                    </td>
                  </tr>
                ))
                : paginatedRequests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => navigate(`/admin/requests/${req.id}`)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 font-black">
                        #{req.id}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center font-black text-[9px] border border-indigo-100 dark:border-indigo-800/40">
                          {req.student.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-slate-900 dark:text-slate-100 leading-none">
                            {req.student.user.name}
                          </p>
                          <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                            {req.student_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <ClearanceProgressDots request={req} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
                          {req.current_step.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          className="p-1.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 transition-all shadow-sm"
                          title="Full Dossier"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!isLoading && paginatedRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-2.5 opacity-40">
                      <Filter className="w-10 h-10" />
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-slate-50 uppercase tracking-widest">
                          No Matching Tasks
                        </p>
                        <p className="text-[11px] font-medium">
                          Try adjusting your institutional filters.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-900 dark:text-slate-100">{currentPage}</span> out of <span className="text-slate-900 dark:text-slate-100">{totalPages}</span>
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              {[20, 100, 500].map(size => (
                <button
                  key={size}
                  onClick={() => {
                    setItemsPerPage(size);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${itemsPerPage === size ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Archive Modal */}
      {showArchiveAlert && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-lg"
            onClick={() => setShowArchiveAlert(false)}
          />
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative z-10 animate-slide-up text-center">
            <div className="w-14 h-14 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center mb-5 mx-auto border border-rose-100 dark:border-rose-900/30">
              <Archive className="w-7 h-7 text-rose-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-50 mb-2 tracking-tighter">
              Cycle Archive
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed mb-6 font-medium px-2">
              You are about to transition all active vetting processes to{" "}
              <span className="font-black text-slate-900 dark:text-white">
                Historical Memory
              </span>
              . This action is critical and irreversible.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setShowArchiveAlert(false)}
                className="px-5 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-[9px] font-black text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={() => archiveMutation.mutate()}
                disabled={archiveMutation.isPending}
                className="px-5 py-3 bg-rose-600 text-white rounded-xl text-[9px] font-black shadow-xl shadow-rose-200 dark:shadow-none hover:bg-rose-700 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                {archiveMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
