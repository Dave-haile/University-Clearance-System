// src/pages/CreateStaff.tsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../services/axiosBackend";
import CollegeDepartmentSelect from "./components/DepartmentManagement/DepartmentCollegeFetch";
import { toastForAdmin } from "../../hooks/toast";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
  college?: string;
  department?: string;
}
interface CreateStaffProps {
  onSubmitSuccess?: (values: { name: string; role: string }) => void;
  onClose?: () => void;
}

const CreateStaff: React.FC<CreateStaffProps> = ({
  onSubmitSuccess,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await axiosClient
        .post("/staffAccountCreation", data)
        .then(({ data }) => {
          setMessage(data.message);
          if (onSubmitSuccess) {
            onSubmitSuccess({
              name: data.name,
              role: data.role,
            });
          }
          if (onClose) {
            onClose();
          }
          toastForAdmin.success(data.message)
        })
        .catch((error) => {
          toastForAdmin.error(error.response?.data?.message || "Failed to create user ❌")
          console.log(error);
          setError(error.response?.data?.message || "An error occurred");
        });
    } catch (error) {
      console.log("Error creating staff", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-1 rounded-lg w-full max-w-md space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter Full Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Choose Role
          </label>
          <select
            {...register("role", { required: "Role is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select Role</option>
            <option value="library">Library Staff</option>
            <option value="cafeteria">Cafeteria Staff</option>
            <option value="proctor">Proctor</option>
            <option value="registrar">Registrar Officer</option>
            <option value="department_head">Department Head</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm">{errors.role.message}</p>
          )}
        </div>

        {/* Show College and Department Select if role is department head */}
        {watch("role") === "department_head" && (
          <CollegeDepartmentSelect
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter Password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? "Creating..." : "Create Staff"}
        </button>

        {message && (
          <div className="p-4 bg-green-50 text-green-700 rounded-md mt-4 w-full max-w-md mx-auto">
            {message}
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md mt-4 w-full max-w-md mx-auto">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateStaff;
