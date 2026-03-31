import React, { useMemo, useState } from "react";
import {
  Building2,
  Search,
  Plus,
  RefreshCcw,
  GraduationCap,
  School,
  Eye,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "@/services/axiosBackend";
import { queryKeys } from "@/lib/queryKeys";
import { queryClient } from "@/lib/queryClient";
import { Department } from "@/types/department";
import { toast } from "sonner";

type DepartmentResponse = {
  departments: Department[];
  department_head: unknown[];
  stats: {
    total_departments: number;
    unique_colleges: number;
  };
};

type CreateDepartmentPayload = {
  department: string;
  college: string;
  name?: string;
  email?: string;
  password?: string;
};

type DepartmentView = Department & {
  student_count: number;
};

const fetchDepartments = async (): Promise<DepartmentResponse> => {
  const response = await axiosClient.get("/admin/departmentDisplay");
  const payload = response.data;

  return {
    departments: Array.isArray(payload?.departments) ? payload.departments : [],
    department_head: Array.isArray(payload?.department_head)
      ? payload.department_head
      : [],
    stats: payload?.stats ?? {
      total_departments: 0,
      unique_colleges: 0,
    },
  };
};

const createDepartment = async (payload: CreateDepartmentPayload) => {
  const response = await axiosClient.post("/admin/create-department", payload);
  return response.data;
};

interface CreateDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  collegeOptions: string[];
}

const CreateDepartmentModal: React.FC<CreateDepartmentModalProps> = ({
  isOpen,
  onClose,
  collegeOptions,
}) => {
  const [isNewCollege, setIsNewCollege] = useState(false);
  const [formData, setFormData] = useState<CreateDepartmentPayload>({
    department: "",
    college: "",
    name: "",
    email: "",
    password: "",
  });

  const createMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: async (data) => {
      toast.success(data?.message || "Department created successfully");
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.departmentsBase,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.dashboard,
      });
      setFormData({
        department: "",
        college: "",
        name: "",
        email: "",
        password: "",
      });
      setIsNewCollege(false);
      onClose();
    },
    onError: (error: unknown) => {
      const message =
        typeof error === "object" &&
          error !== null &&
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "data" in error.response &&
          error.response.data &&
          typeof error.response.data === "object" &&
          "message" in error.response.data
          ? String(error.response.data.message)
          : "Failed to create department.";
      toast.error(message);
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateDepartmentPayload = {
      department: formData.department.trim(),
      college: formData.college.trim(),
    };

    if (formData.name?.trim()) payload.name = formData.name.trim();
    if (formData.email?.trim()) payload.email = formData.email.trim();
    if (formData.password?.trim()) payload.password = formData.password.trim();

    createMutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg relative z-10 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                Register Department
              </h3>
              <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">
                Live Academic Provisioning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-7 overflow-y-auto space-y-6 flex-1"
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Department Name
              </label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
                  placeholder="e.g., Software Engineering"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Parent College
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewCollege((prev) => !prev);
                    setFormData((prev) => ({ ...prev, college: "" }));
                  }}
                  className="text-[9px] font-black text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest"
                >
                  {isNewCollege ? "Select Existing" : "+ Register New"}
                </button>
              </div>

              {isNewCollege ? (
                <input
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
                  placeholder="Enter new college name..."
                  value={formData.college}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      college: e.target.value,
                    }))
                  }
                />
              ) : (
                <select
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 appearance-none cursor-pointer"
                  value={formData.college}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      college: e.target.value,
                    }))
                  }
                >
                  <option value="">Choose College...</option>
                  {collegeOptions.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 dark:border-slate-800 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-violet-50 dark:bg-violet-950/40 text-violet-600 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                Optional Department Head
              </h4>
            </div>

            <div className="space-y-3">
              <input
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-slate-900 dark:text-slate-100"
                placeholder="Head full name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-slate-900 dark:text-slate-100"
                  placeholder="head@uni.edu"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-slate-900 dark:text-slate-100"
                  placeholder="Temporary password"
                  value={formData.password || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all"
          >
            Abort
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="flex-[2] px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <RefreshCcw
              className={`w-4 h-4 ${createMutation.isPending ? "animate-spin" : "hidden"}`}
            />
            {createMutation.isPending ? "Creating..." : "Finalize Registration"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Departments: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const {
    data,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.departmentsBase,
    queryFn: fetchDepartments,
  });

  const departments = useMemo<DepartmentView[]>(
    () =>
      (data?.departments || []).map((dept) => ({
        ...dept,
        student_count: Array.isArray(dept.students) ? dept.students.length : 0,
      })),
    [data],
  );

  const filteredDepts = useMemo(() => {
    return departments.filter((dept) => {
      const matchSearch =
        dept.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.college.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCollege =
        collegeFilter === "all" || dept.college === collegeFilter;
      return matchSearch && matchCollege;
    });
  }, [departments, searchTerm, collegeFilter]);

  const colleges = useMemo(
    () => Array.from(new Set(departments.map((d) => d.college))),
    [departments],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDepts.length / itemsPerPage),
  );
  const currentDepts = filteredDepts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const stats = useMemo(
    () => ({
      total: data?.stats?.total_departments ?? departments.length,
      colleges: data?.stats?.unique_colleges ?? colleges.length,
      students: departments.reduce(
        (acc, curr) => acc + (curr.student_count || 0),
        0,
      ),
    }),
    [data, departments, colleges],
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-[1320px] mx-auto pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-xl shadow-indigo-100 dark:shadow-none">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              Departmental Matrix
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium ml-1">
            Live management of academic units and departmental leadership.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => void refetch()}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCcw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Department
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Units",
            value: stats.total,
            icon: Building2,
            color: "text-indigo-600",
            bg: "bg-indigo-50/50 dark:bg-indigo-950/20",
          },
          {
            label: "Academic Colleges",
            value: stats.colleges,
            icon: School,
            color: "text-violet-600",
            bg: "bg-violet-50/50 dark:bg-violet-950/20",
          },
          {
            label: "Enrolled Students",
            value: stats.students,
            icon: GraduationCap,
            color: "text-emerald-600",
            bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-all"
          >
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">
                {stat.value}
              </h4>
            </div>
            <div
              className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-3 items-center transition-colors">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by department name..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
          <div className="relative min-w-[190px]">
            <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              className="w-full pl-9 pr-8 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-black text-slate-700 dark:text-slate-200 outline-none appearance-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
              value={collegeFilter}
              onChange={(e) => {
                setCollegeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Filter by College</option>
              {colleges.map((college) => (
                <option key={college} value={college}>
                  {college}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setCollegeFilter("all");
              setCurrentPage(1);
            }}
            className="px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-sm overflow-hidden flex flex-col transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Unit Identity
                </th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Affiliated College
                </th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Department Head
                </th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Student Volume
                </th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-9 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-full"></div>
                    </td>
                  </tr>
                ))
                : currentDepts.map((dept) => (
                  <tr
                    key={dept.id}
                    onClick={() => navigate(`/admin/departments/${dept.id}`)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50 shadow-sm transition-transform group-hover:scale-105">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[13px] font-black text-slate-900 dark:text-slate-100 leading-none">
                            {dept.department}
                          </p>
                          <p className="text-[9px] font-mono text-slate-400 mt-1.5 tracking-tight">
                            ID: #DEPT-{dept.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-slate-300" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                          {dept.college}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {dept.department_head ? (
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[9px] font-black text-slate-400">
                            {dept.department_head.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100">
                              {dept.department_head.user.name}
                            </p>
                            <p className="text-[8px] text-slate-400 font-medium truncate max-w-[120px]">
                              {dept.department_head.user.email}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[9px] font-black text-rose-500/70 bg-rose-50 dark:bg-rose-950/20 px-2 py-1 rounded-lg uppercase tracking-widest border border-rose-100 dark:border-rose-900/40">
                          Vacant
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-slate-900 dark:text-slate-50">
                          {dept.student_count}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                          PAX
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/departments/${dept.id}`);
                          }}
                          className="p-2 bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!loading && filteredDepts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <School className="w-14 h-14 text-slate-200 dark:text-slate-800" />
                      <div>
                        <p className="text-base font-black text-slate-900 dark:text-slate-50">
                          Empty Registry
                        </p>
                        <p className="text-sm text-slate-500 font-medium">
                          No units found matching "{searchTerm}"
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-900 dark:text-slate-100">{currentPage}</span> out of <span className="text-slate-900 dark:text-slate-100">{totalPages}</span>
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              {[20, 100, 500].map(size => (
                <button
                  key={size}
                  onClick={() => {
                    setItemsPerPage(size);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${itemsPerPage === size ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CreateDepartmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        collegeOptions={colleges}
      />
    </div>
  );
};

export default Departments;
