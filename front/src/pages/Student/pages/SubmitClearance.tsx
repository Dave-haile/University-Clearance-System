import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/authContext";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Send,
  Building2,
  GraduationCap,
  ClipboardList,
  Calendar,
  CheckCircle2,
  Loader2,
  Home,
  User as UserIcon,
  ShieldCheck,
  Zap,
  Clock,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/pages/Admin/hooks/Toast";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { User } from "@/types";
import axiosClient from "@/services/axiosBackend";
import { isAxiosError } from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";

const clearanceSchema = z
  .object({
    year: z.string().min(1, "Academic level is required"),
    semester: z.string().min(1, "Semester is required"),
    section: z.string().optional(),
    academic_year: z
      .string()
      .regex(/^(\d{4}|\d{4}\/\d{4})$/, "Format must be YYYY or YYYY/YYYY"),
    last_day_class_attended: z.string().min(1, "Date is required"),
    reason_for_clearance: z.string().min(1, "Reason is required"),
    other_reason: z.string().optional(),
    cafe_status: z.enum(["cafe", "non-cafe"]),
    dorm_status: z.enum(["dorm", "non-dorm"]),
    sex: z.enum(["Male", "Female"]),
  })
  .refine(
    (data) => {
      if (data.reason_for_clearance === "Other") {
        return !!data.other_reason && data.other_reason.length > 5;
      }
      return true;
    },
    {
      message: "Please provide a detailed reason (min 5 chars)",
      path: ["other_reason"],
    },
  );

type FormValues = z.infer<typeof clearanceSchema>;

const StudentClearanceRequest: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(clearanceSchema),
    defaultValues: {
      academic_year: "2024/2025",
      semester: "Second Semester",
      reason_for_clearance: "end_of_academic_year",
      dorm_status: "dorm",
      cafe_status: "cafe",
      year: user?.student?.year || "4th Year",
      sex: "Male",
    },
  });

  const fetchStudentData = async (): Promise<User> => {
    const response = await axiosClient.get("/student/data");
    return response.data;
  };

  const {
    data: studentData,
    isLoading: fetchLoading,
    error,
  } = useQuery<User>({
    queryKey: queryKeys.student.allData,
    queryFn: fetchStudentData,
    enabled: !authLoading,
  });

  useEffect(() => {
    if (!studentData?.student) return;

    setValue("year", studentData.student.year || "4th Year");
  }, [studentData, setValue]);

  if (authLoading || fetchLoading) {
    return (
      <>
        <Card className="bg-slate-950">
          <CardHeader className="bg-slate-950">
            <CardTitle>
              <Skeleton className=" bg-slate-950 h-8 w-60" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-5 w-full max-w-md bg-slate-950" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="bg-slate-950 h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-8xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load student data. Please refresh the page."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Watching form fields to update UI selection states
  const watchReason = watch("reason_for_clearance");
  const watchDorm = watch("dorm_status");
  const watchCafe = watch("cafe_status");
  const watchSex = watch("sex");

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);

      const payload = {
        sex: data.sex,
        year: data.year,
        semester: data.semester,
        section: data.section ?? null,
        academic_year: data.academic_year,
        last_day_class_attended: data.last_day_class_attended,
        reason_for_clearance:
          data.reason_for_clearance === "Other"
            ? (data.other_reason ?? "Other")
            : data.reason_for_clearance,
        cafe_status: data.cafe_status,
        dorm_status: data.dorm_status,
      };

      await axiosClient.post("/clearance-request", payload);

      setIsSuccess(true);
      addToast({
        type: "success",
        title: "Application Vaulted",
        message:
          "Your clearance request has been successfully committed to the institutional queue.",
      });
    } catch (e: unknown) {
      const message = isAxiosError(e)
        ? (e.response?.data as { message?: string } | undefined)?.message ||
          e.message
        : e instanceof Error
          ? e.message
          : "Failed to submit clearance request.";

      addToast({
        type: "error",
        title: "Submission Failed",
        message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!studentData?.student) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-10 pb-20 animate-fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-[56px] border border-slate-200 dark:border-slate-800 shadow-sm p-10">
          <div className="flex items-center gap-3 text-amber-600">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-black uppercase tracking-widest">
              Student record not found
            </p>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
            Refresh the page or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-8 animate-fade-in">
        <div className="relative inline-block">
          <div className="w-28 h-28 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-[40px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200 dark:shadow-none border-6 border-white dark:border-slate-900 relative z-10">
            <CheckCircle2 className="w-14 h-14" />
          </div>
          <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-20 -z-10 animate-pulse" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Submission Finalized
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">
            Your application is now undergoing institutional vetting. Reference:{" "}
            <span className="font-mono font-bold text-indigo-600">
              REQ-{Math.floor(Math.random() * 100000)}
            </span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-5">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="px-8 py-4 bg-indigo-600 text-white rounded-[20px] text-xs font-black shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Dashboard Hub <ChevronRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-[20px] text-xs font-black border border-slate-200 dark:border-slate-700 transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Export as PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 px-2">
        <div className="flex items-center gap-5">
          <Link
            to="/student/dashboard"
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              Exit Vetting Protocol
            </h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
              <Zap className="w-2.5 h-2.5 text-indigo-500" /> Academic Clearance
              Submission Workspace
            </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 px-5 py-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
          <Clock className="w-3 h-3 text-indigo-500" />
          <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">
            Typical Processing: 48-72 Hours
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Main Form Entry */}
        <div className="xl:col-span-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-12 space-y-10"
          >
            {/* Sector 1: Enrollment Matrix */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em]">
                  Temporal Matrix
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Academic Year
                  </label>
                  <input
                    {...register("academic_year")}
                    className={`w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border ${errors.academic_year ? "border-rose-500" : "border-slate-100 dark:border-slate-700"} rounded-xl text-sm font-bold outline-none focus:ring-3 focus:ring-indigo-500/10 transition-all text-slate-900 dark:text-white`}
                    placeholder="e.g. 2024/2025"
                  />
                  {errors.academic_year && (
                    <p className="text-[9px] font-bold text-rose-500 ml-2">
                      {errors.academic_year.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Current Semester
                  </label>
                  <select
                    {...register("semester")}
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-3 focus:ring-indigo-500/10 transition-all text-slate-900 dark:text-white appearance-none cursor-pointer"
                  >
                    <option>First Semester</option>
                    <option>Second Semester</option>
                    <option>Summer Term</option>
                  </select>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Level of Study
                  </label>
                  <select
                    {...register("year")}
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-3 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer text-slate-900 dark:text-white"
                  >
                    {[
                      "1st Year",
                      "2nd Year",
                      "3rd Year",
                      "4th Year",
                      "5th Year",
                    ].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Last Class Evaluation
                  </label>
                  <input
                    {...register("last_day_class_attended")}
                    type="date"
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-3 focus:ring-indigo-500/10 transition-all text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Sector 2: Logistics & Provisions */}
            <div className="space-y-10 pt-4 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-50 dark:bg-violet-950/40 rounded-2xl text-violet-600">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em]">
                  Resource Logistics
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Residential Status
                  </label>
                  <div className="flex p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[20px]">
                    <button
                      type="button"
                      onClick={() => setValue("dorm_status", "dorm")}
                      className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${watchDorm === "dorm" ? "bg-indigo-600 text-white shadow-xl" : "text-slate-400 hover:text-slate-600 dark:text-slate-500"}`}
                    >
                      Dorm
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("dorm_status", "non-dorm")}
                      className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${watchDorm === "non-dorm" ? "bg-indigo-600 text-white shadow-xl" : "text-slate-400 hover:text-slate-600 dark:text-slate-500"}`}
                    >
                      External
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Dining Allocation
                  </label>
                  <div className="flex p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[20px]">
                    <button
                      type="button"
                      onClick={() => setValue("cafe_status", "cafe")}
                      className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${watchCafe === "cafe" ? "bg-indigo-600 text-white shadow-xl" : "text-slate-400 hover:text-slate-600 dark:text-slate-500"}`}
                    >
                      Cafe
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("cafe_status", "non-cafe")}
                      className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${watchCafe === "non-cafe" ? "bg-indigo-600 text-white shadow-xl" : "text-slate-400 hover:text-slate-600 dark:text-slate-500"}`}
                    >
                      Private
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Gender Identification
                  </label>
                  <div className="flex p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[20px]">
                    <button
                      type="button"
                      onClick={() => setValue("sex", "Male")}
                      className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${watchSex === "Male" ? "bg-indigo-600 text-white shadow-xl" : "text-slate-400 hover:text-slate-600 dark:text-slate-500"}`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("sex", "Female")}
                      className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${watchSex === "Female" ? "bg-indigo-600 text-white shadow-xl" : "text-slate-400 hover:text-slate-600 dark:text-slate-500"}`}
                    >
                      Female
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sector 3: Justification Logic */}
            <div className="space-y-10 pt-4 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl text-emerald-600">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em]">
                  Operational Justification
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: "end_of_academic_year", label: "Cycle End" },
                  { id: "graduation", label: "Graduation" },
                  { id: "health_family_issues", label: "Medical/Family" },
                  { id: "disciplinary_case", label: "Disciplinary" },
                  { id: "Other", label: "Other/Specific" },
                ].map((reason) => (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => setValue("reason_for_clearance", reason.id)}
                    className={`p-4 rounded-[24px] border-2 text-left transition-all duration-300 flex items-center justify-between group ${
                      watchReason === reason.id
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30"
                        : "border-slate-100 dark:border-slate-800 hover:border-indigo-200"
                    }`}
                  >
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest ${watchReason === reason.id ? "text-indigo-600" : "text-slate-400 dark:text-slate-500"}`}
                    >
                      {reason.label}
                    </span>
                    <div
                      className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${
                        watchReason === reason.id
                          ? "bg-indigo-600 border-indigo-600"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {watchReason === reason.id && (
                        <div className="w-1 h-1 bg-white rounded-full" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {watchReason === "Other" && (
                <div className="space-y-3 animate-slide-up">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Administrative Remarks
                  </label>
                  <textarea
                    {...register("other_reason")}
                    className={`w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border ${errors.other_reason ? "border-rose-500" : "border-slate-100 dark:border-slate-700"} rounded-[24px] text-sm font-bold outline-none focus:ring-3 focus:ring-indigo-500/10 min-h-[140px] resize-none text-slate-900 dark:text-white`}
                    placeholder="Please provide explicit details regarding your clearance justification..."
                  />
                  {errors.other_reason && (
                    <p className="text-[9px] font-bold text-rose-500 ml-3">
                      {errors.other_reason.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-indigo-600 text-white rounded-[24px] text-base font-black shadow-2xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Committing to
                    Registry...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Finalize Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Context */}
        <div className="xl:col-span-4 space-y-6">
          {/* Identity Review */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> Identity Preview
            </h3>

            <div className="space-y-5">
              {[
                {
                  label: "Principal Identity",
                  value: user?.name,
                  icon: UserIcon,
                },
                {
                  label: "Identifier",
                  value: user?.student?.student_id,
                  icon: GraduationCap,
                },
                {
                  label: "Operational Unit",
                  value: user?.student?.department?.department,
                  icon: Building2,
                },
                {
                  label: "College Hub",
                  value: user?.student?.department?.college,
                  icon: Building2,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-700/50"
                >
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-slate-300 shadow-sm">
                    <item.icon className="w-3 h-3" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                      {item.label}
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-white truncate">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Policy Reminder */}
          <div className="p-8 bg-slate-900 rounded-[40px] text-white space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 transition-transform group-hover:rotate-0">
              <ClipboardList className="w-24 h-24" />
            </div>
            <div className="space-y-2 relative z-10">
              <h4 className="text-lg font-black tracking-tight leading-none">
                Institutional Compliance
              </h4>
              <p className="text-xs text-white/50 font-medium leading-relaxed">
                By submitting this request, you attest that all institutional
                physical assets (Library volumes, Laboratory equipment, Sports
                gear) have been returned or logged.
              </p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-3xl relative z-10">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <AlertCircle className="w-3 h-3" />
                <p className="text-[9px] font-black uppercase tracking-widest">
                  Audit Notice
                </p>
              </div>
              <p className="text-[9px] text-white/40 leading-relaxed font-medium">
                Any discrepancies in asset returns will result in immediate
                rejection by the Librarian or Proctorate offices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentClearanceRequest;
