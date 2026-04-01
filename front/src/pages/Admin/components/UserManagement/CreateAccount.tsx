// // src/pages/CreateStaff.tsx

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import axiosClient from "../../../../services/axiosBackend";
// import CollegeDepartmentSelect from "../DepartmentManagement/DepartmentCollegeFetch";
// import { toastForAdmin } from "../../../../hooks/toast";

// interface FormData {
//   name: string;
//   email: string;
//   password: string;
//   role: string;
//   college?: string;
//   department?: string;
// }
// interface CreateStaffProps {
//   onSubmitSuccess?: (values: { name: string; role: string }) => void;
//   onClose?: () => void;
// }

// const CreateStaff: React.FC<CreateStaffProps> = ({
//   onSubmitSuccess,
//   onClose,
// }) => {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<FormData>();
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (data: FormData) => {
//     setLoading(true);
//     try {
//       await axiosClient
//         .post("/staffAccountCreation", data)
//         .then(({ data }) => {
//           setMessage(data.message);
//           if (onSubmitSuccess) {
//             onSubmitSuccess({
//               name: data.name,
//               role: data.role,
//             });
//           }
//           if (onClose) {
//             onClose();
//           }
//           toastForAdmin.success(data.message)
//         })
//         .catch((error) => {
//           toastForAdmin.error(error.response?.data?.message || "Failed to create user ❌")
//           console.log(error);
//           setError(error.response?.data?.message || "An error occurred");
//         });
//     } catch (error) {
//       console.log("Error creating staff", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="p-1 rounded-lg w-full max-w-md space-y-6"
//       >
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Name
//           </label>
//           <input
//             type="text"
//             {...register("name", { required: "Name is required" })}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             placeholder="Enter Full Name"
//           />
//           {errors.name && (
//             <p className="text-red-500 text-sm">{errors.name.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Email
//           </label>
//           <input
//             type="email"
//             {...register("email", { required: "Email is required" })}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             placeholder="Enter Email"
//           />
//           {errors.email && (
//             <p className="text-red-500 text-sm">{errors.email.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Choose Role
//           </label>
//           <select
//             {...register("role", { required: "Role is required" })}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           >
//             <option value="">Select Role</option>
//             <option value="library">Library Staff</option>
//             <option value="cafeteria">Cafeteria Staff</option>
//             <option value="proctor">Proctor</option>
//             <option value="registrar">Registrar Officer</option>
//             <option value="department_head">Department Head</option>
//           </select>
//           {errors.role && (
//             <p className="text-red-500 text-sm">{errors.role.message}</p>
//           )}
//         </div>

//         {/* Show College and Department Select if role is department head */}
//         {watch("role") === "department_head" && (
//           <CollegeDepartmentSelect
//             register={register}
//             errors={errors}
//             watch={watch}
//             setValue={setValue}
//           />
//         )}

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Password
//           </label>
//           <input
//             type="password"
//             {...register("password", { required: "Password is required" })}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             placeholder="Enter Password"
//           />
//           {errors.password && (
//             <p className="text-red-500 text-sm">{errors.password.message}</p>
//           )}
//         </div>

//         <button
//           disabled={loading}
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//         >
//           {loading ? "Creating..." : "Create Staff"}
//         </button>

//         {message && (
//           <div className="p-4 bg-green-50 text-green-700 rounded-md mt-4 w-full max-w-md mx-auto">
//             {message}
//           </div>
//         )}
//         {error && (
//           <div className="p-4 bg-red-50 text-red-700 rounded-md mt-4 w-full max-w-md mx-auto">
//             {error}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default CreateStaff;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Check,
  User,
  Mail,
  Lock,
  ShieldCheck,
  CheckCircle,
  Copy,
  Shield,
} from "lucide-react";
import axiosClient from "@/services/axiosBackend";
import { toastForAdmin } from "@/hooks/toast";
import CollegeDepartmentSelect from "../DepartmentManagement/DepartmentCollegeFetch";

const schema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid work email"),
    role: z.string().min(1, "Please select an operational role"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    // Conditional fields handled via refine or optionality
    college: z.string().optional(),
    department: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "department_head") {
        return !!data.college && !!data.department;
      }
      return true;
    },
    {
      message: "College and Department are required for Department Heads",
      path: ["department"], // Assigning error to department for display
    },
  );

type FormFields = z.infer<typeof schema>;
type StaffCreateResponse = {
  message: string;
  email?: string;
  password?: string;
};

interface StaffRegistrationFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const StaffRegistrationForm: React.FC<StaffRegistrationFormProps> = ({
  onCancel,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [returnData, setReturnData] = useState<{
    message: string;
    email: string;
    password: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: FormFields) => {
    setLoading(true);
    clearErrors("root");

    try {
      const response = await axiosClient.post<StaffCreateResponse>(
        "/staffAccountCreation",
        data,
      );

      setReturnData({
        message: response.data.message,
        email: response.data.email || data.email,
        password: response.data.password || data.password,
      });
      toastForAdmin.success(
        response.data.message || "Staff account created successfully",
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create staff account";
      setError("root", { type: "server", message });
      toastForAdmin.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (returnData) {
      navigator.clipboard.writeText(
        `Staff Account\nEmail: ${returnData.email}\nPassword: ${returnData.password}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (returnData) {
    return (
      <div className="py-6 flex flex-col items-center text-center gap-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 border-4 border-violet-50 dark:border-violet-950/20">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Staff Account Created
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[300px] mx-auto">
            Access has been granted. Share these credentials with the staff
            member.
          </p>
        </div>

        <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 relative overflow-hidden group">
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-violet-600 transition-all shadow-sm active:scale-95"
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
                Work Email
              </span>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">
                {returnData.email}
              </p>
            </div>
            <div className="h-px bg-slate-200 dark:bg-slate-700 w-full" />
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                Access Password
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

        {/* Header Branding */}
        <div className="bg-violet-50/50 dark:bg-violet-950/20 p-4 rounded-2xl border border-violet-100/50 dark:border-violet-900/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 dark:shadow-none">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-violet-900 dark:text-violet-300">
              Staff Access Provisioning
            </p>
            <p className="text-[10px] text-violet-500 font-medium">
              Configuring operational permissions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
              Full Professional Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                {...register("name")}
                placeholder="Dr. Jane Doe..."
                className={`w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800/50 border ${errors.name ? "border-rose-500 ring-4 ring-rose-50 dark:ring-rose-900/10" : "border-slate-200 dark:border-slate-700"} rounded-2xl text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-slate-900 dark:text-slate-100 shadow-sm`}
              />
            </div>
            {errors.name && (
              <p className="text-[10px] font-bold text-rose-500 ml-2 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
              Institutional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                {...register("email")}
                type="email"
                placeholder="staff@university.edu"
                className={`w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800/50 border ${errors.email ? "border-rose-500 ring-4 ring-rose-50 dark:ring-rose-900/10" : "border-slate-200 dark:border-slate-700"} rounded-2xl text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-slate-900 dark:text-slate-100 shadow-sm`}
              />
            </div>
            {errors.email && (
              <p className="text-[10px] font-bold text-rose-500 ml-2 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
              Assigned Operational Role
            </label>
            <div className="relative">
              <Shield className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                {...register("role")}
                className={`w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800/50 border ${errors.role ? "border-rose-500" : "border-slate-200 dark:border-slate-700"} rounded-2xl text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-slate-900 dark:text-slate-100 appearance-none shadow-sm`}
              >
                <option value="">Select a Role...</option>
                <option value="department_head">Department Head</option>
                <option value="library">Library Staff</option>
                <option value="cafeteria">Cafeteria Staff</option>
                <option value="proctor">Proctor</option>
                <option value="registrar">Registrar Officer</option>
              </select>
            </div>
            {errors.role && (
              <p className="text-[10px] font-bold text-rose-500 ml-2 mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Conditional Org Selection */}
          {selectedRole === "department_head" && (
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
              <CollegeDepartmentSelect
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            </div>
          )}

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
              Access Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className={`w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800/50 border ${errors.password ? "border-rose-500 ring-4 ring-rose-50 dark:ring-rose-900/10" : "border-slate-200 dark:border-slate-700"} rounded-2xl text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-slate-900 dark:text-slate-100 shadow-sm`}
              />
            </div>
            {errors.password && (
              <p className="text-[10px] font-bold text-rose-500 ml-2 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all order-2 sm:order-1"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] px-6 py-3.5 bg-violet-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-violet-100 dark:shadow-none hover:bg-violet-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            "Generate Access"
          )}
        </button>
      </div>
    </form>
  );
};

export default StaffRegistrationForm;
