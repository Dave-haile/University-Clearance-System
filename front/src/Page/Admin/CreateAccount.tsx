import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../services/axiosBackend";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
  college?: string;
  department?: string;
}

const CreateStaff: React.FC = () => {
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
  const [colleges, setColleges] = useState<string[]>([]);
  const [departments, setDepartments] = useState<
    { college: string; department: string }[]
  >([]);
  const selectedCollege = watch("college");

  // Fetch Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get("/departmentDisplay");
        const data = response.data;
        const collegeList = [
          ...new Set(data.map((d: { college: string }) => d.college)),
        ] as string[];
        setColleges(collegeList);
        setDepartments(data);
      } catch (error) {
        console.log("Error fetching departments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const filteredDepartments = departments.filter(
    (dept) => dept.college === selectedCollege
  );

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // console.log("Submitted Data:", data);
      await axiosClient.post("/staffAccountCreation", data).then(({ data }) => {
        setMessage(data.message);
      }).catch((error) => {
        console.log(error);
        setError(error.response?.data?.message || "An error occurred");
      })
    } catch (error) {
      console.log("Error creating staff", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Staff Account Creation Form
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your name"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your email"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

        {watch("role") === "department_head" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select College
              </label>
              <select
                {...register("college", { required: "College is required" })}
                onChange={(e) => setValue("college", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select College</option>
                {colleges.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
              {errors.college && (
                <p className="text-red-500 text-sm">{errors.college.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Department
              </label>
              <select
                {...register("department", {
                  required: "Department is required",
                })}
                disabled={!selectedCollege}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Department</option>
                {filteredDepartments.map((dept) => (
                  <option key={dept.department} value={dept.department}>
                    {dept.department}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-red-500 text-sm">
                  {errors.department.message}
                </p>
              )}
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
