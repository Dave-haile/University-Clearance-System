import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Check,
  User,
  Fingerprint,
  Calendar,
  Copy,
  CheckCircle,
} from "lucide-react";
import axiosClient from "@/services/axiosBackend";
import { toastForAdmin } from "@/hooks/toast";
import CollegeDepartmentSelect from "../DepartmentManagement/DepartmentCollegeFetch";

const schema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  student_id: z.string().min(5, "Valid Student ID is required"),
  department: z.string().min(1, "Please select a department"),
  college: z.string().min(1, "Please select a college"),
  year: z.string().min(1, "Year of study is required"),
});

type FormFields = z.infer<typeof schema>;
type StudentCreateResponse = {
  message: string;
  username: string;
  password: string;
};

interface StudentRegistrationFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({
  onCancel,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [returnData, setReturnData] = useState<{
    message: string;
    username: string;
    password: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      year: "1st Year",
    },
  });

  const onSubmit = async (data: FormFields) => {
    setLoading(true);
    clearErrors("root");

    try {
      const response = await axiosClient.post<StudentCreateResponse>(
        "/create-student",
        {
          name: data.name,
          student_id: data.student_id,
          department: data.department,
          year: data.year,
        },
      );

      setReturnData({
        message: response.data.message,
        username: response.data.username,
        password: response.data.password,
      });
      toastForAdmin.success(
        response.data.message || "Student account created successfully",
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create student account";
      setError("root", { type: "server", message });
      toastForAdmin.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (returnData) {
      navigator.clipboard.writeText(
        `Academic Account\nUsername: ${returnData.username}\nPassword: ${returnData.password}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (returnData) {
    return (
      <div className="py-6 flex flex-col items-center text-center gap-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border-4 border-emerald-50 dark:border-emerald-950/20">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Student Profile Created
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[300px] mx-auto">
            The registration process is complete. Securely relay these
            credentials to the user.
          </p>
        </div>

        <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 relative overflow-hidden group">
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          <div className="flex flex-col gap-5 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                Access ID
              </span>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">
                {returnData.username}
              </p>
            </div>
            <div className="h-px bg-slate-200 dark:bg-slate-700 w-full" />
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                Generated Secret
              </span>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">
                {returnData.password}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onSuccess}
          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-xl shadow-slate-200 dark:shadow-none hover:opacity-90 transition-all active:scale-95"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-5">
        {errors.root && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
            {errors.root.message}
          </div>
        )}

        {/* Identity Header */}
        <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
              New Academic User
            </p>
            <p className="text-[10px] text-indigo-500 font-medium">
              Provisioning student clearing privileges
            </p>
          </div>
        </div>

        {/* Basic Fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
              Student Full Name
            </label>
            <div className="relative">
              <input
                {...register("name")}
                placeholder="First Last..."
                className={`w-full px-5 py-3.5 bg-white dark:bg-slate-800/50 border ${errors.name ? "border-rose-500 ring-4 ring-rose-50 dark:ring-rose-900/10" : "border-slate-200 dark:border-slate-700"} rounded-2xl text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm`}
              />
            </div>
            {errors.name && (
              <p className="text-[10px] font-bold text-rose-500 ml-2 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                Registration ID
              </label>
              <div className="relative">
                <Fingerprint className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register("student_id")}
                  placeholder="ID/0000/00"
                  className={`w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800/50 border ${errors.student_id ? "border-rose-500" : "border-slate-200 dark:border-slate-700"} rounded-2xl text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-900 dark:text-slate-100 shadow-sm`}
                />
              </div>
              {errors.student_id && (
                <p className="text-[10px] font-bold text-rose-500 ml-2 mt-1">
                  {errors.student_id.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                Level of Study
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  {...register("year")}
                  className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-900 dark:text-slate-100 appearance-none shadow-sm"
                >
                  {[
                    "1st Year",
                    "2nd Year",
                    "3rd Year",
                    "4th Year",
                    "5th Year",
                    "6th Year",
                  ].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Org Selection */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
            <CollegeDepartmentSelect
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          </div>
        </div>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all order-2 sm:order-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] px-6 py-3.5 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Registry...</span>
            </>
          ) : (
            "Complete Registration"
          )}
        </button>
      </div>
    </form>
  );
};

export default StudentRegistrationForm;
