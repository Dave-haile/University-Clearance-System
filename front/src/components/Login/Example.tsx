// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/authContext";
// import { LoginFormInputs, loginSchema } from "../../types/user";
// import { GraduationCap, ArrowLeft, Lock, User as UserIcon, Loader2, Eye, EyeOff } from "lucide-react";
// import axiosClient from "@/services/axiosBackend";

// const Login: React.FC = () => {
//   const navigator = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const { login, token, user } = useAuth();

//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors },
//   } = useForm<LoginFormInputs>({
//     resolver: zodResolver(loginSchema),
//   });

//   useEffect(() => {
//     if (token) {
//       if (user?.role === "admin") navigator("/admin");
//       else if (user?.role === "student") navigator("/student");
//       else if (["department_head", "library_staff", "cafeteria", "registrar", "proctor"].includes(user?.role ?? "")) {
//         navigator(`/staff/${user?.role}`);
//       }
//     }
//   }, [token, navigator, user]);

//   const onSubmit = async (data: LoginFormInputs) => {
//     setLoading(true);
//     try {
//       const response = await axiosClient.post("/login", data);
//       const user = response.data.user;
//       const token = response.data.token;
//       login(user, token);
//       if (user?.role === "admin") {
//         navigator("/admin/Dashbord", {
//           state: { message: `Welcome back, admin!` },
//         });
//       } else if (user?.role === "student") {
//         navigator("/student", {
//           state: { message: `Welcome back, student!` },
//         });
//       } else if (
//         [
//           "department_head",
//           "library",
//           "cafeteria",
//           "registrar",
//           "proctor",
//         ].includes(user?.role ?? "")
//       ) {
//         navigator(`/staff/${user?.role}`, {
//           state: { message: `Welcome back, member!` },
//         });
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setError("root", {
//         message: "Login failed. Please check your credentials.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300 relative overflow-hidden">
//       {/* Background blobs */}
//       <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50"></div>
//       <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-100/50 dark:bg-indigo-900/10 rounded-full blur-3xl opacity-50"></div>

//       <div className="w-full max-w-md relative z-10">
//         {/* Back Button */}
//         <button
//           onClick={() => navigator('/')}
//           className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium group"
//         >
//           <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
//           Back to Home
//         </button>

//         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800">
//           <div className="flex flex-col items-center mb-10">
//             <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg mb-4">
//               <GraduationCap size={32} />
//             </div>
//             <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white text-center">Welcome Back</h1>
//             <p className="text-slate-500 dark:text-slate-400 text-center mt-2">Enter your credentials to access your dashboard</p>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             <div>
//               <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Username</label>
//               <div className="relative">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                   <UserIcon size={18} />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="e.g. jdoe_student"
//                   className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${errors.login ? "border-red-500" : "border-slate-100 dark:border-slate-700"
//                     }`}
//                   {...register("login")}
//                 />
//               </div>
//               {errors.login && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.login.message}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Password</label>
//               <div className="relative">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                   <Lock size={18} />
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${errors.password ? "border-red-500" : "border-slate-100 dark:border-slate-700"
//                     }`}
//                   {...register("password")}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//               {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
//             </div>

//             <div className="flex items-center justify-between px-1">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
//                 <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
//               </label>
//               <a href="#" className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline">Forgot?</a>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 dark:shadow-blue-900/20 transition-all flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5"
//                 }`}
//             >
//               {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
//             </button>

//             {errors.root && (
//               <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-3 rounded-xl">
//                 <p className="text-red-600 dark:text-red-400 text-center text-sm font-medium">
//                   {errors.root.message}
//                 </p>
//               </div>
//             )}
//           </form>

//           <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-8">
//             Demo: Use <span className="font-bold text-blue-600">admin</span> for admin role or <span className="font-bold text-blue-600">student</span> for student role.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { LoginFormInputs, loginSchema } from "../../types/user";
import {
  GraduationCap,
  ArrowLeft,
  Lock,
  User as UserIcon,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Key,
  X,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/pages/Admin/lib/utils";
import axiosClient from "@/services/axiosBackend";

const demoCredentials = [
  { role: "Admin", email: "admin@university.com", desc: "Full system control" },
  {
    role: "Dept Head",
    email: "head@university.edu",
    desc: "Departmental oversight",
  },
  {
    role: "Registrar",
    email: "registrar@university.edu",
    desc: "Academic records",
  },
  {
    role: "Student",
    email: "student@university.edu",
    desc: "Clearance tracking",
  },
  {
    role: "Library",
    email: "library@university.edu",
    desc: "Resource management",
  },
];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const { login, token, user } = useAuth();
  const navigator = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (token) {
      if (user?.role === "admin") navigator("/admin");
      else if (user?.role === "student") navigator("/student");
      else if (
        [
          "department_head",
          "library_staff",
          "cafeteria",
          "registrar",
          "proctor",
        ].includes(user?.role ?? "")
      ) {
        navigator(`/staff/${user?.role}`);
      }
    }
  }, [token, navigator, user]);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      const response = await axiosClient.post("/login", data);
      const user = response.data.user;
      const token = response.data.token;
      login(user, token);
      if (user?.role === "admin") {
        navigator("/admin/Dashbord", {
          state: { message: `Welcome back, admin!` },
        });
      } else if (user?.role === "student") {
        navigator("/student", {
          state: { message: `Welcome back, student!` },
        });
      } else if (
        [
          "department_head",
          "library",
          "cafeteria",
          "registrar",
          "proctor",
        ].includes(user?.role ?? "")
      ) {
        navigator(`/staff/${user?.role}`, {
          state: { message: `Welcome back, member!` },
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("root", {
        message: "Login failed. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };
  const selectDemo = (email: string) => {
    // Map email to username for the mock login
    const username = email.split("@")[0];
    setValue("login", username);
    setValue("password", "password123");
    setShowDemoModal(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#020617] p-4 transition-colors duration-500 relative overflow-hidden font-sans">
      {/* Immersive Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] animate-pulse"></div>
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="w-full max-w-[420px] relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-4 flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors font-medium group"
        >
          <ArrowLeft size={16} className="transition-transform" />
          <span className="text-xs tracking-tight uppercase font-bold">
            Back to Home
          </span>
        </button>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-white dark:border-slate-800">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-600 p-3 rounded-xl text-white shadow-xl shadow-blue-500/20 mb-4">
              <GraduationCap size={28} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-center mt-1 text-xs font-medium">
              Secure access to your academic portal
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider opacity-70">
                Username
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <UserIcon size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className={cn(
                    "w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium",
                    errors.login
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-slate-100 dark:border-slate-700/50 focus:border-blue-500/50",
                  )}
                  {...register("login")}
                />
              </div>
              {errors.login && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                  {errors.login.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider opacity-70">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn(
                    "w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium",
                    errors.password
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-slate-100 dark:border-slate-700/50 focus:border-blue-500/50",
                  )}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-slate-200 dark:border-slate-700 transition-all checked:border-blue-600 checked:bg-blue-600"
                  />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Forgot?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 relative overflow-hidden",
                loading && "opacity-80 cursor-not-allowed",
              )}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Sign In</span>
                  <ShieldCheck size={18} />
                </>
              )}
            </button>

            {errors.root && (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/50 p-3 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-center text-[11px] font-bold">
                  {errors.root.message}
                </p>
              </div>
            )}
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center">
            <button
              onClick={() => setShowDemoModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-widest hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all border border-indigo-100 dark:border-indigo-800/50"
            >
              <Key size={14} />
              Demo Access
            </button>
          </div>
        </div>
      </div>

      {showDemoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            onClick={() => setShowDemoModal(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative z-10 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl">
                  <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Demo Access
                </h3>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
              {demoCredentials.map((demo) => (
                <button
                  key={demo.role}
                  onClick={() => selectDemo(demo.email)}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 rounded-2xl text-left transition-all group flex items-center justify-between"
                >
                  <div>
                    <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none mb-1">
                      {demo.role}
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {demo.email}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {demo.desc}
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>

            <p className="mt-6 text-[9px] text-center text-slate-400 uppercase tracking-widest font-bold">
              Password for all accounts is{" "}
              <span className="text-indigo-500">password</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
