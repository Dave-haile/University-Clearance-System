import React, { useEffect, useState } from "react";
import axiosClient from "../../../../services/axiosBackend";

interface Department {
  college: string;
  department: string;
}

interface Props {
  register?: any;
  errors?: any;
  watch?: any;
  setValue?: any;
  onCollegeChange?: (college: string) => void;
  onDepartmentChange?: (department: string) => void;
}

const CollegeDepartmentSelect: React.FC<Props> = ({
  register,
  errors,
  watch,
  setValue,
  onCollegeChange,
  onDepartmentChange,
}) => {
  const [colleges, setColleges] = useState<string[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  useEffect(() => {
    const fetchDepartments = async () => {
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
      }
    };
    fetchDepartments();
  }, []);

  const realSelectedCollege = watch ? watch("college") ?? "" : selectedCollege;
  const realSelectedDepartment = watch
    ? watch("department") ?? ""
    : selectedDepartment;

  const filteredDepartments = departments.filter(
    (dept) => dept.college === realSelectedCollege
  );

  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const college = e.target.value;
    if (setValue) {
      setValue("college", college);
    } else {
      setSelectedCollege(college);
      onCollegeChange?.(college);
    }
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const department = e.target.value;
    if (setValue) {
      setValue("department", department);
    } else {
      setSelectedDepartment(department);
      onDepartmentChange?.(department);
    }
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Select College
        </label>
        <select
          {...(register
            ? register("college", { required: "College is required" })
            : {})}
          onChange={handleCollegeChange}
          value={realSelectedCollege}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select College</option>
          {colleges.map((college) => (
            <option key={college} value={college}>
              {college}
            </option>
          ))}
        </select>
        {errors?.college && (
          <p className="text-red-500 text-sm">{errors.college.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Select Department
        </label>
        <select
          {...(register
            ? register("department", { required: "Department is required" })
            : {})}
          onChange={handleDepartmentChange}
          value={realSelectedDepartment}
          disabled={!realSelectedCollege}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Department</option>
          {filteredDepartments.map((dept) => (
            <option key={dept.department} value={dept.department}>
              {dept.department}
            </option>
          ))}
        </select>
        {errors?.department && (
          <p className="text-red-500 text-sm">{errors.department.message}</p>
        )}
      </div>
    </>
  );
};

export default CollegeDepartmentSelect;
