import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/context";
import axiosClient from "../../services/axiosBackend";
import axios from "axios";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginExample: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigator = useNavigate();
  const [loading, setLoading] = useState(false);
  const { token, setUsers, setToken } = useStateContext();
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
      navigator("/");
    }
  }, [token, navigator]);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true)
    try {
      const response = await axiosClient.post("/login", data);
      setUsers(response.data.user);
      setToken(response.data.token);
      navigator("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError("root", {
          message: error.response?.data?.message || "An error occurred",
        });
      } else {
        setError("root", { message: "An error occurred" });
      }
      console.log(error);
    } finally{
      setLoading(false)
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
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
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
        </form>
      </div>
    </div>
  );
};

export default LoginExample;
