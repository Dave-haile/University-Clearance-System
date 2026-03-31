// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/authContext";
// import axiosClient from "../../services/axiosBackend";
// import { LoginFormInputs, loginSchema } from "../../types/user";
// import { notifyError } from "../../hooks/toast";

// const Login: React.FC = () => {
//   const [darkMode, setDarkMode] = useState(false);
//   const navigator = useNavigate();
//   const [loading, setLoading] = useState(false);
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
//       else if (
//         [
//           "department_head",
//           "library",
//           "cafeteria",
//           "registrar",
//           "proctor",
//         ].includes(user?.role ?? "")
//       )
//         navigator(`/staff/${user?.role}`);
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
//       notifyError("Login failed. Please check your credentials.");
//       console.error("Login error:", error);
//       setError("root", {
//         message: "Login failed. Please check your credentials.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className={`min-h-screen flex items-center justify-center ${
//         darkMode ? "dark bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
//       }`}
//     >
//       <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 shadow-md rounded-md">
//         <button
//           className="absolute top-4 right-4 text-sm text-blue-500"
//           onClick={() => setDarkMode(!darkMode)}
//         >
//           Toggle {darkMode ? "Light" : "Dark"} Mode
//         </button>

//         <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="mb-4">
//             <label
//               htmlFor="Username"
//               className="block text-sm font-medium mb-1"
//             >
//               Username
//             </label>
//             <input
//               id="Username"
//               type="text"
//               className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
//                 errors.login ? "border-red-500" : "border-gray-300"
//               }`}
//               {...register("login")}
//             />
//             {errors.login && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.login.message}
//               </p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium mb-1"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
//                 errors.password ? "border-red-500" : "border-gray-300"
//               }`}
//               {...register("password")}
//             />
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>
//           <button
//             type="submit"
//             className={`w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none  ${
//               loading ? "opacity-50 cursor-not-allowed" : ""
//             } `}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//           {errors.root && (
//             <p className="text-red-500 text-center py-2 text-[1.1rem] mt-1">
//               {errors.root.message}
//             </p>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { LoginFormInputs, loginSchema } from "../../types/user";
import { GraduationCap, ArrowLeft, Lock, User as UserIcon, Loader2, Eye, EyeOff } from "lucide-react";
import axiosClient from "@/services/axiosBackend";

const Login: React.FC = () => {
  const navigator = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, token, user } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (token) {
      if (user?.role === "admin") navigator("/admin");
      else if (user?.role === "student") navigator("/student");
      else if (["department_head", "library_staff", "cafeteria", "registrar", "proctor"].includes(user?.role ?? "")) {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-100/50 dark:bg-indigo-900/10 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigator('/')}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg mb-4">
              <GraduationCap size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white text-center">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 text-center mt-2">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Username</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  placeholder="e.g. jdoe_student"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${errors.login ? "border-red-500" : "border-slate-100 dark:border-slate-700"
                    }`}
                  {...register("login")}
                />
              </div>
              {errors.login && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.login.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${errors.password ? "border-red-500" : "border-slate-100 dark:border-slate-700"
                    }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline">Forgot?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 dark:shadow-blue-900/20 transition-all flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5"
                }`}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
            </button>

            {errors.root && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-3 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-center text-sm font-medium">
                  {errors.root.message}
                </p>
              </div>
            )}
          </form>

          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-8">
            Demo: Use <span className="font-bold text-blue-600">admin</span> for admin role or <span className="font-bold text-blue-600">student</span> for student role.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
