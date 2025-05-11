import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import axiosClient from "../../services/axiosBackend";
import { LoginFormInputs, loginSchema } from "../../types/user";
import { notifyError } from "../../hooks/toast";

const Login: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigator = useNavigate();
  const [loading, setLoading] = useState(false);
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
      else navigator("/staff");
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
        navigator("/staff", {
          state: { message: `Welcome back, member!` },
        });
      }
    } catch (error) {
      notifyError("Login failed. Please check your credentials.");
      console.error("Login error:", error);
      setError("root", {
        message: "Login failed. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "dark bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 shadow-md rounded-md">
        <button
          className="absolute top-4 right-4 text-sm text-blue-500"
          onClick={() => setDarkMode(!darkMode)}
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="Username"
              className="block text-sm font-medium mb-1"
            >
              Username
            </label>
            <input
              id="Username"
              type="text"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.login ? "border-red-500" : "border-gray-300"
              }`}
              {...register("login")}
            />
            {errors.login && (
              <p className="text-red-500 text-sm mt-1">
                {errors.login.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none  ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            } `}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {errors.root && (
            <p className="text-red-500 text-center py-2 text-[1.1rem] mt-1">
              {errors.root.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
