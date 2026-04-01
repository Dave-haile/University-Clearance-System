import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  GraduationCap,
  Calendar,
  Layers,
  FileText,
  MapPin,
  Coffee,
  BookOpen,
  ShieldCheck,
  ClipboardList,
  History,
  Info,
  Check,
  X,
  Loader2,
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

const fetchStaffRequestDetail = async (
  id: string,
): Promise<ClearanceRequest> => {
  const response = await axiosClient.get(`/staff/requests/${id}`);
  return response.data;
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

const normalizeStaffRole = (role: string | undefined) =>
  role === "library_staff" ? "library" : role || "";

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
      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${styles[status as keyof typeof styles]}`}
    >
      {status}
    </span>
  );
};

const ApprovalStep = ({
  label,
  status,
  icon: Icon,
}: {
  label: string;
  status: boolean | null;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
          status === true
            ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-800"
            : status === false
              ? "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800"
              : "bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700"
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 tracking-tight">
          {label}
        </p>
        <p
          className={`text-[9px] font-black uppercase tracking-widest ${
            status === true
              ? "text-emerald-500"
              : status === false
                ? "text-rose-500"
                : "text-slate-400"
          }`}
        >
          {status === true
            ? "Validated"
            : status === false
              ? "Rejected"
              : "Awaiting Review"}
        </p>
      </div>
    </div>
    {status === true ? (
      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
        <CheckCircle2 className="w-4 h-4" />
      </div>
    ) : status === false ? (
      <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-100">
        <AlertCircle className="w-4 h-4" />
      </div>
    ) : (
      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 flex items-center justify-center border border-slate-200 dark:border-slate-700">
        <Clock className="w-4 h-4" />
      </div>
    )}
  </div>
);

const StaffRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const normalizedRole = normalizeStaffRole(user?.role);
  const [comment, setComment] = useState("");
  const [showActionModal, setShowActionModal] = useState<
    "approve" | "reject" | null
  >(null);

  const {
    data: request,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["staffRequestDetail", id],
    queryFn: () => fetchStaffRequestDetail(id as string),
    enabled: !!id,
  });

  const actionMutation = useMutation({
    mutationFn: ({
      status,
      comment,
    }: {
      status: "approved" | "rejected";
      comment: string;
    }) =>
      updateRequestStatus({
        id: request?.id || 0,
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
      // Optionally navigate back after a delay
      setTimeout(() => navigate("/staff/requests"), 1500);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const isMyTurn = request?.current_step === normalizedRole;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="space-y-1 text-center">
          <p className="text-slate-900 dark:text-slate-50 font-bold">
            Accessing Dossier
          </p>
          <p className="text-slate-400 text-xs font-medium">
            Retrieving clearance reference #{id}...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/20 rounded-3xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">
          Dossier Unavailable
        </h2>
        <Link
          to="/staff/requests"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Queue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <Link
          to="/staff/requests"
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-all group"
        >
          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm group-hover:shadow-indigo-100 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          Return to Queue
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all">
            <Printer className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* Hero Profile Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative group">
        <div className="h-48 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>
        <div className="px-12 pb-12 flex flex-col md:flex-row gap-8 items-end -mt-16 relative z-10">
          <div className="w-40 h-40 rounded-[40px] bg-white dark:bg-slate-800 p-2 shadow-2xl ring-4 ring-white dark:ring-slate-900">
            <div className="w-full h-full rounded-[32px] bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-300 font-black text-4xl overflow-hidden shadow-inner">
              {request.student.user.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </div>
          </div>
          <div className="flex-1 space-y-4 mb-4">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-none">
                {request.student.user.name}
              </h2>
              <StatusBadge status={request.status} />
            </div>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-sm font-bold">
                <FileText className="w-4 h-4 text-indigo-500" /> Reference: #
                {request.id}
              </div>
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-sm font-bold">
                <GraduationCap className="w-4 h-4 text-violet-500" />{" "}
                {request.student_id}
              </div>
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-sm font-bold">
                <Calendar className="w-4 h-4 text-emerald-500" /> Submitted{" "}
                {formatDate(request.created_at)}
              </div>
            </div>
          </div>

          {/* Action Buttons for Staff */}
          {isMyTurn && (
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setShowActionModal("reject")}
                className="flex items-center gap-2 px-6 py-3.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-all shadow-lg shadow-rose-100 dark:shadow-none active:scale-95"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={() => setShowActionModal("approve")}
                className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 dark:shadow-none active:scale-95"
              >
                <Check className="w-4 h-4" />
                Approve
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Dossier Details */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Academic Dossier
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-y-10 gap-x-12">
              {[
                {
                  label: "Level & Section",
                  value: `${request.year} • Sec ${request.section}`,
                  icon: MapPin,
                },
                {
                  label: "Department",
                  value: request.department.department,
                  icon: Building2,
                },
                {
                  label: "College Affiliation",
                  value: request.department.college,
                  icon: Building2,
                },
                {
                  label: "Academic Cycle",
                  value: `${request.academic_year} • ${request.semester} Sem`,
                  icon: Calendar,
                },
                {
                  label: "Dining Provisioning",
                  value: request.cafe_status,
                  icon: Coffee,
                  capitalize: true,
                },
                {
                  label: "Residential Status",
                  value: request.dorm_status,
                  icon: Layers,
                  capitalize: true,
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">
                      {item.label}
                    </p>
                    <p
                      className={`text-sm font-black text-slate-800 dark:text-slate-100 ${item.capitalize ? "capitalize" : ""}`}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-slate-50 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <FileText className="w-4 h-4" /> Justification & Reasoning
              </h3>
              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700/50 relative overflow-hidden group transition-all hover:bg-white dark:hover:bg-slate-800">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                  <Layers className="w-24 h-24" />
                </div>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed relative z-10">
                  {request.reason_for_clearance}
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Info className="w-4 h-4" /> Validation Date:{" "}
                  {formatDate(request.last_day_class_attended)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Approval Chain */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Approval Lifecycle
              </h3>
            </div>

            <div className="space-y-8 relative">
              {/* Visual Timeline Connector */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100 dark:bg-slate-800" />

              <ApprovalStep
                label="Department Head"
                status={request.department_head_approved}
                icon={Building2}
              />
              <ApprovalStep
                label="University Library"
                status={request.library_approved}
                icon={BookOpen}
              />
              <ApprovalStep
                label="Cafeteria Services"
                status={request.cafeteria_approved}
                icon={Coffee}
              />
              <ApprovalStep
                label="Proctorate Office"
                status={request.proctor_approved}
                icon={ShieldCheck}
              />
              <ApprovalStep
                label="Office of Registrar"
                status={request.registrar_approved}
                icon={ClipboardList}
              />
            </div>

            <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
              <div className="p-6 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-[32px] border border-emerald-100/30 flex items-start gap-4">
                <div className="p-2.5 bg-white dark:bg-emerald-900/30 rounded-xl shadow-sm">
                  <History className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                    Audit Trail Active
                  </p>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                    Submission initialized at 10:00 AM.{" "}
                    {request.department_head_approved
                      ? "Initial vetting by Department Head completed."
                      : "Awaiting Department Head review."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                showActionModal === "approve"
                  ? "bg-emerald-50 border-emerald-100 text-emerald-500 dark:bg-emerald-950/40 dark:border-emerald-900/30"
                  : "bg-rose-50 border-rose-100 text-rose-500 dark:bg-rose-950/40 dark:border-rose-900/30"
              }`}
            >
              {showActionModal === "approve" ? (
                <Check className="w-10 h-10" />
              ) : (
                <X className="w-10 h-10" />
              )}
            </div>

            <div className="text-center space-y-3 mb-10">
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">
                {showActionModal === "approve"
                  ? "Confirm Approval"
                  : "Confirm Rejection"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium px-6">
                {showActionModal === "approve"
                  ? "You are about to validate this student's clearance for your department. This will move the request to the next phase."
                  : "Please provide a reason for rejecting this clearance request. The student will be notified immediately."}
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
                      status:
                        showActionModal === "approve" ? "approved" : "rejected",
                      comment,
                    })
                  }
                  disabled={actionMutation.isPending}
                  className={`px-8 py-4 text-white rounded-2xl text-xs font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    showActionModal === "approve"
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

export default StaffRequestDetailPage;
