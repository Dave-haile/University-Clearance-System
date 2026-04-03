import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCcw,
  Trash2,
  Key,
  Shield,
  Calendar,
  Building2,
  GraduationCap,
  Mail,
  User as UserIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  Smartphone,
  ChevronRight,
  History,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteUser,
  fetchUserDetail,
  resetUserPassword,
} from "../../services/userDetailService";
import { queryKeys } from "@/lib/queryKeys";
import { queryClient } from "@/lib/queryClient";
import { toast } from "@/components/ui/use-toast";

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Using React Query as requested
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.admin.userDetail(id as string),
    queryFn: () => fetchUserDetail(id as string),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(id as string),
    onSuccess: async () => {
      setShowDeleteConfirm(false);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.usersBase,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.dashboard,
      });
      if (id) {
        await queryClient.removeQueries({
          queryKey: queryKeys.admin.userDetail(id),
        });
      }
      navigate("/admin/users");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      if (!id || !user) {
        throw new Error("Missing user context");
      }

      await resetUserPassword(id, {
        username: user.username || undefined,
        email: user.email || undefined,
        password: newPassword.trim(),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.usersBase,
      });
      if (id) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.admin.userDetail(id),
        });
      }
      toast.success("Password updated successfully");
      setShowResetConfirm(false);
      setNewPassword("");
      setShowPassword(false);
    },
  });

  const handleGeneratePassword = () => {
    if (newPassword.trim().length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    resetPasswordMutation.mutate();
  };

  const handleCloseResetModal = () => {
    if (!resetPasswordMutation.isPending) {
      setShowResetConfirm(false);
      setNewPassword("");
      setShowPassword(false);
      resetPasswordMutation.reset();
    }
  };

  const { user, clearances } = data || {};

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70dvh] gap-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="space-y-1 text-center">
          <p className="text-slate-900 dark:text-slate-50 font-bold">
            Synchronizing Records
          </p>
          <p className="text-slate-400 text-xs font-medium">
            Loading professional profile data...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="w-full max-w-2xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/20 rounded-3xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">
            Profile Unreachable
          </h2>
          <p className="text-slate-500 mt-2">
            We couldn't retrieve the requested user details from the registry.
          </p>
        </div>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-2xl font-bold shadow-lg shadow-slate-200 dark:shadow-none transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 px-4 sm:px-6 lg:px-8">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <Link
          to="/admin/users"
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-all group"
        >
          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-indigo-100 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          Return
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md"
            title="Refresh Profile"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <Key className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Reset Credentials</span>
            <span className="sm:hidden">Reset</span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-5 py-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 rounded-2xl text-sm font-bold hover:bg-rose-100 transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Revoke Access</span>
            <span className="sm:hidden">Delete</span>
          </button>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative group">
        <div className="h-40 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>
        <div className="px-10 pb-10 flex flex-col md:flex-row gap-8 items-end -mt-16 relative z-10">
          <div className="w-40 h-40 rounded-[32px] bg-white dark:bg-slate-800 p-2 shadow-2xl ring-4 ring-white dark:ring-slate-900">
            <div className="w-full h-full rounded-[24px] bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-300 font-black text-4xl overflow-hidden shadow-inner">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              )}
            </div>
          </div>
          <div className="flex-1 space-y-3 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                {user.name}
              </h2>
              <div
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm flex items-center gap-2 ${
                  user.role === "student"
                    ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50"
                    : "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50"
                }`}
              >
                {user.role === "student" ? (
                  <GraduationCap className="w-3 h-3" />
                ) : (
                  <ShieldCheck className="w-3 h-3" />
                )}
                {user.role.replace("_", " ")}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                <Mail className="w-4 h-4 text-indigo-500" />{" "}
                {user.email || user.username || "N/A"}
              </div>
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                <Calendar className="w-4 h-4 text-violet-500" /> Registered{" "}
                {new Date(user.created_at as string).toLocaleDateString(
                  undefined,
                  { day: "numeric", month: "long", year: "numeric" },
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Core Identity */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                <UserIcon className="w-4 h-4" />
              </div>
              Account Blueprint
            </h3>

            <div className="space-y-5">
              {[
                {
                  label: "System Identifier",
                  value: `#${user.id}`,
                  mono: true,
                },
                {
                  label: "Primary Username",
                  value: user.username || "None",
                  mono: true,
                },
                { label: "Verified Status", value: "Active", status: true },
                {
                  label: "Institutional ID",
                  value: user.student?.student_id || "STAFF-MEMBER",
                  mono: true,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-1 pb-4 border-b border-slate-50 dark:border-slate-800 last:border-0 last:pb-0"
                >
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-bold text-slate-900 dark:text-slate-100 ${item.mono ? "font-mono tracking-tight" : ""}`}
                    >
                      {item.value}
                    </span>
                    {item.status && (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-200" />{" "}
                        ONLINE
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40">
                {user.role === "student" ? (
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Building2 className="w-4 h-4 text-indigo-600" />
                )}
              </div>
              Organization Info
            </h3>
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                  Principal Department
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {user.student?.department?.department ||
                    user.staff?.department?.department ||
                    "Administration"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-50 uppercase">
                  Parent College
                </p>
                <div className="mt-2 flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                  <Building2 className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                    {user.student?.department?.college ||
                      user.staff?.department?.college ||
                      "Strategic Academic Registry"}
                  </p>
                </div>
              </div>
              {user.staff && (
                <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/40">
                      <Smartphone className="w-4 h-4 text-violet-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {user.staff.phone_number || "No linked phone"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Activity / History */}
        <div className="lg:col-span-8 space-y-8">
          {user.role === "student" ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
                    <History className="w-6 h-6" />
                  </div>
                  Clearance Records
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Historical Volume:
                  </span>
                  <span className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-black text-indigo-600">
                    {clearances?.length || 0} Requests
                  </span>
                </div>
              </div>

              {clearances && clearances.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {clearances.map((req, idx) => (
                    <div
                      key={req.id}
                      className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 relative group"
                    >
                      {idx === 0 && (
                        <div className="absolute top-0 right-0 p-4">
                          <span className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-200 animate-pulse">
                            Most Recent
                          </span>
                        </div>
                      )}

                      <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                          <div
                            className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${
                              req.status === "approved"
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-100"
                                : "bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-100"
                            }`}
                          >
                            {req.status === "approved" ? (
                              <CheckCircle className="w-8 h-8" />
                            ) : (
                              <Clock className="w-8 h-8" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-black text-slate-900 dark:text-slate-100">
                                Ref No. #{req.id}
                              </p>
                              <ChevronRight className="w-4 h-4 text-slate-300" />
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                AY: {req.academic_year} / {req.semester}{" "}
                                Semester
                              </p>
                              <div className="w-1 h-1 rounded-full bg-slate-200" />
                              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                                STEP: {req.current_step.replace("_", " ")}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                              Status
                            </p>
                            <span
                              className={`text-[11px] font-black px-4 py-1.5 rounded-xl uppercase tracking-[0.1em] border shadow-sm ${
                                req.status === "approved"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50"
                                  : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50"
                              }`}
                            >
                              {req.status}
                            </span>
                          </div>
                          <button className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                            <ExternalLink className="w-5 h-5 text-slate-400" />
                          </button>
                        </div>
                      </div>

                      {/* Step Indicator Bar */}
                      <div className="bg-slate-50/50 dark:bg-slate-800/30 px-8 py-8 grid grid-cols-5 gap-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
                        {[
                          {
                            label: "Dept. Head",
                            status: req.department_head_approved,
                          },
                          { label: "Library", status: req.library_approved },
                          {
                            label: "Cafeteria",
                            status: req.cafeteria_approved,
                          },
                          { label: "Proctor", status: req.proctor_approved },
                          {
                            label: "Registrar",
                            status: req.registrar_approved,
                          },
                        ].map((step, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center gap-3 text-center"
                          >
                            <div
                              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                                step.status === true
                                  ? "bg-emerald-500 text-white shadow-emerald-200"
                                  : step.status === false
                                    ? "bg-rose-500 text-white shadow-rose-200"
                                    : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
                              }`}
                            >
                              {step.status === true ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : step.status === false ? (
                                <AlertCircle className="w-5 h-5" />
                              ) : (
                                <Clock className="w-5 h-5" />
                              )}
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                                {step.label}
                              </p>
                              <p className="text-[8px] font-bold text-slate-400 dark:text-slate-600">
                                {step.status === true
                                  ? "APPROVED"
                                  : step.status === false
                                    ? "REJECTED"
                                    : "PENDING"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50/50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] p-20 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center shadow-lg mb-6">
                    <History className="w-10 h-10 text-slate-200 dark:text-slate-700" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                    Empty Registry
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed">
                    This student hasn't initiated any clearance procedures in
                    the system history yet.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 px-2 flex items-center gap-3">
                <div className="p-2 bg-violet-600 rounded-2xl text-white shadow-xl shadow-violet-100">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                Staff Operations Hub
              </h2>

              <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-violet-500/20 blur-[60px] rounded-full"></div>
                  <Shield className="w-24 h-24 text-violet-500 relative z-10" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-black text-slate-900 dark:text-slate-50">
                    Administrative Authority
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
                    This staff member is currently overseeing approval workflows
                    for{" "}
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      Clearance Applications
                    </span>{" "}
                    within the Software Engineering department.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 text-left group hover:bg-white transition-colors">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                      Decisions Finalized
                    </p>
                    <div className="flex items-end gap-2">
                      <p className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                        1.2k
                      </p>
                      <span className="text-[10px] font-bold text-emerald-500 mb-1.5">
                        +12%
                      </span>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 text-left group hover:bg-white transition-colors">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                      Task Latency
                    </p>
                    <div className="flex items-end gap-2">
                      <p className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                        2.4
                      </p>
                      <span className="text-xs font-black text-slate-400 mb-1.5 uppercase tracking-tighter">
                        HRS
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl p-10 max-w-md w-full relative z-10 animate-fade-in text-center">
            <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center mb-8 mx-auto border border-rose-100 dark:border-rose-900/20">
              <Trash2 className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-3 tracking-tight">
              Terminate User Access?
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium">
              You are about to permanently purge{" "}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {user.name}'s
              </span>{" "}
              identity and historical records. This operation cannot be rolled
              back.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-8 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-200 active:scale-95"
              >
                Retain Record
              </button>
              <button
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="flex-1 px-8 py-4 bg-rose-600 hover:bg-rose-700 rounded-2xl text-sm font-bold text-white shadow-xl shadow-rose-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Purge Profile"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={handleCloseResetModal}
          />
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl p-10 max-w-md w-full relative z-10 animate-fade-in text-center">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mb-8 mx-auto border border-amber-100 dark:border-amber-900/20">
              <Key className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-3 tracking-tight">
              Set New Password
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed font-medium">
              Enter the new password you want to assign to{" "}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {user.name}
              </span>
              . This will replace the current password immediately.
            </p>
            <div className="mb-8 text-left">
              <label
                htmlFor="manual-password"
                className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="manual-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={resetPasswordMutation.isPending}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm font-medium text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
                  placeholder="Enter a new password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs font-medium text-slate-400">
                Use at least 8 characters.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCloseResetModal}
                disabled={resetPasswordMutation.isPending}
                className="flex-1 px-8 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-200 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleGeneratePassword}
                disabled={resetPasswordMutation.isPending}
                className="flex-1 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-sm font-bold text-white shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {resetPasswordMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
