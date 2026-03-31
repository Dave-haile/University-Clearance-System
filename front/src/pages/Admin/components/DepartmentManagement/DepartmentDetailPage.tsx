import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Users,
  ClipboardList,
  ShieldCheck,
  RefreshCcw,
  Search,
  Mail,
  Clock,
  AlertCircle,
  ExternalLink,
  Calendar,
  Globe,
  Phone,
  PieChartIcon,
  Activity,
  ArrowRight,
  CheckCircle,
  Target,
  BarChart3,
  Zap,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/services/axiosBackend";

import type { Department } from "@/types/department";
import type { User } from "@/types/user";
import type { ClearanceRequests } from "@/types/clerance";
import { toast } from "sonner";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type DepartmentDisplayResponse = {
  departments: Department[];
  department_head: User[];
  stats: {
    total_departments: number;
    unique_colleges: number;
  };
};

type DepartmentDetailData = {
  department: Department;
  students: User[];
  requests: ClearanceRequests[];
};

const fetchDepartmentDetail = async (
  id: string,
): Promise<DepartmentDetailData> => {
  const [departmentsResponse, usersResponse, requestsResponse] =
    await Promise.all([
      axiosClient.get<DepartmentDisplayResponse>("/admin/departmentDisplay"),
      axiosClient.get<User[]>("/admin/users"),
      axiosClient.get<ClearanceRequests[]>("/admin/clearanceRequests"),
    ]);

  const departments = departmentsResponse.data?.departments ?? [];
  const department = departments.find((item) => String(item.id) === id);

  if (!department) {
    throw new Error("Department not found");
  }

  const students = (usersResponse.data ?? []).filter(
    (user) => user.student?.department_id === department.id,
  );

  const requests = (requestsResponse.data ?? []).filter(
    (request) => request.department?.id === department.id,
  );

  return {
    department,
    students,
    requests,
  };
};

const CHART_COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F43F5E", "#F97316"];

const DepartmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "students" | "requests" | "analytics"
  >("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "departments", "detail", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Missing department id");
      }
      return fetchDepartmentDetail(id);
    },
    enabled: !!id,
  });

  const handleRefresh = async () => {
    await refetch();
    toast.success("Dossier Synchronized", {
      description: "Latest unit telemetry has been pulled from the vault.",
    });
  };

  const department = data?.department;
  const students = useMemo(() => data?.students ?? [], [data?.students]);
  const requests = useMemo(() => data?.requests ?? [], [data?.requests]);

  const yearDistribution = useMemo(() => {
    if (!students) return [];
    const counts: Record<string, number> = {};
    students.forEach((s) => {
      const year = s.student?.year || "Unknown";
      counts[year] = (counts[year] || 0) + 1;
    });
    return Object.keys(counts).map((year) => ({
      name: year,
      value: counts[year],
    }));
  }, [students]);

  const filteredStudents = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return students;

    return students.filter((student) => {
      const name = student.name?.toLowerCase() ?? "";
      const studentId = student.student?.student_id?.toLowerCase() ?? "";
      const email = student.email?.toLowerCase() ?? "";
      return (
        name.includes(query) ||
        studentId.includes(query) ||
        email.includes(query)
      );
    });
  }, [students, searchTerm]);

  const filteredRequests = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return requests;

    return requests.filter((request) => {
      const name = request.student?.user?.name?.toLowerCase() ?? "";
      const studentId = request.student_id?.toLowerCase() ?? "";
      const status = request.status?.toLowerCase() ?? "";
      return (
        name.includes(query) ||
        studentId.includes(query) ||
        status.includes(query)
      );
    });
  }, [requests, searchTerm]);

  const totalPages = useMemo(() => {
    const count = activeTab === 'students' ? filteredStudents.length : filteredRequests.length;
    return Math.ceil(count / itemsPerPage);
  }, [activeTab, filteredStudents.length, filteredRequests.length, itemsPerPage]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(start, start + itemsPerPage);
  }, [filteredRequests, currentPage, itemsPerPage]);

  // Reset page on search or tab change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-5">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <div className="text-center space-y-1.5">
          <p className="text-slate-900 dark:text-slate-50 text-base font-black tracking-tight">
            Loading Department
          </p>
          <p className="text-slate-400 text-sm font-medium">
            Fetching live academic and clearance data...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !department) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-5">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-50">
            Department Unavailable
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            We couldn't load this department from the admin registry.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/admin/departments"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 dark:shadow-none transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Departments
          </Link>
          <button
            onClick={() => void refetch()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto space-y-6 animate-fade-in pb-20">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/departments"
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <nav className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.18em] text-slate-400 mb-1">
              <Link to="/admin/dashboard" className="hover:text-indigo-600">
                Admin
              </Link>
              <span>/</span>
              <Link to="/admin/departments" className="hover:text-indigo-600">
                Departments
              </Link>
              <span>/</span>
              <span className="text-indigo-600">Dossier</span>
            </nav>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              Departmental Intelligence
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all">
            <ExternalLink className="w-3.5 h-3.5" />
            Audit Protocol
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: CORE IDENTITY & LEADERSHIP */}
        <div className="xl:col-span-4 space-y-6">
          {/* Identity & Status Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group">
            <div className="p-6 pb-0 flex items-center justify-between">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100 dark:border-emerald-800">
                Operational
              </span>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tighter leading-tight">
                  {department?.department}
                </h2>
                <p className="text-[13px] font-bold text-slate-400">
                  {department?.college}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors group-hover:bg-indigo-50/30 group-hover:border-indigo-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Students
                  </p>
                  <p className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">
                    {department?.student_count}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors group-hover:bg-violet-50/30 group-hover:border-violet-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Vetting Rate
                  </p>
                  <p className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">
                    94%
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-50 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px] font-bold">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  Unit Founded:{" "}
                  {new Date(department?.created_at || "").toLocaleDateString(
                    undefined,
                    { year: "numeric", month: "long" },
                  )}
                </div>
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px] font-bold">
                  <Globe className="w-3.5 h-3.5 text-violet-500" />
                  Registry Access: Global Administrative
                </div>
              </div>
            </div>
          </div>

          {/* Principal Liaison Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <ShieldCheck className="w-24 h-24" />
            </div>
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.26em] flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Stewardship
            </h3>

            {department?.department_head ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-[24px] bg-gradient-to-tr from-indigo-500 to-violet-500 p-1 shadow-xl group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-full rounded-[20px] bg-white dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-slate-200 overflow-hidden">
                      {department.department_head.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      {department.department_head.user.name}
                    </p>
                    <p className="text-[9px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md uppercase tracking-widest inline-block">
                      Unit Head
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent hover:border-indigo-100 transition-all cursor-pointer">
                    <Mail className="w-3.5 h-3.5 text-indigo-500" />
                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 truncate">
                      {department.department_head.user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent hover:border-indigo-100 transition-all cursor-pointer">
                    <Phone className="w-3.5 h-3.5 text-indigo-500" />
                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      +251 911 000 111
                    </p>
                  </div>
                </div>

                <button className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[18px] text-[9px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 dark:shadow-none transition-all active:scale-95 hover:opacity-90">
                  Contact Principal
                </button>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-500 mx-auto">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-slate-600">
                  No Principal Assigned
                </p>
                <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-lg">
                  Assign Now
                </button>
              </div>
            )}
          </div>

          {/* Demographics Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.26em] flex items-center gap-2">
              <PieChartIcon className="w-3.5 h-3.5" /> Academic Mix
            </h3>

            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={yearDistribution}
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {yearDistribution.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "14px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {yearDistribution.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                    }}
                  ></div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tight truncate leading-none mb-1">
                      {item.name}
                    </p>
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                      {item.value} PAX
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: OPERATIONAL WORKSPACE */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[36px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[760px]">
            {/* Workspace Control Bar */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-[18px] border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
                {(
                  [
                    { id: "students", label: "Registry", icon: Users },
                    { id: "requests", label: "Vetting", icon: ClipboardList },
                    { id: "analytics", label: "Analysis", icon: Activity },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-[14px] text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab.id
                        ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-xl shadow-indigo-100 dark:shadow-none"
                        : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72 group">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search artifacts..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[18px] text-[11px] font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* List Engine */}
            <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
              {activeTab === "students" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-fade-in">
                  {paginatedStudents.map(stu => (
                    <div
                      key={stu.id}
                      className="p-5 bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-indigo-500/30 transition-all hover:shadow-2xl hover:shadow-indigo-100/30 dark:hover:shadow-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center text-lg font-black group-hover:scale-110 transition-transform">
                          {stu.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="space-y-1">
                          <p className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                            {stu.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-tight">
                              {stu.student?.student_id}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                            <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">
                              {stu.student?.year}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/admin/users/${stu.id}`)}
                        className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 transition-all group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {paginatedStudents.length === 0 && (
                    <div className="col-span-2 py-24 text-center space-y-4 opacity-30">
                      <Users className="w-14 h-14 mx-auto" />
                      <p className="text-sm font-bold uppercase tracking-widest">
                        No matching registry records.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "requests" && (
                <div className="space-y-3.5 animate-fade-in">
                  {paginatedRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-6 bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-indigo-500/30 transition-all hover:shadow-2xl hover:shadow-indigo-100/20 dark:hover:shadow-none"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-16 h-16 rounded-[22px] flex items-center justify-center border shadow-sm ${req.status === "approved"
                              ? "bg-emerald-50 border-emerald-100 text-emerald-500 dark:bg-emerald-950/30"
                              : "bg-amber-50 border-amber-100 text-amber-500 dark:bg-amber-950/30"
                            }`}
                        >
                          {req.status === "approved" ? (
                            <CheckCircle className="w-8 h-8" />
                          ) : (
                            <Clock className="w-8 h-8" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none">
                            {req.student.user.name}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-mono font-bold text-slate-400">
                              REF: #{req.id}
                            </span>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">
                              {req.current_step.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 self-end md:self-center">
                        <div className="text-right hidden sm:block">
                          <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">
                            Audit Status
                          </p>
                          <span
                            className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${req.status === "approved"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30"
                                : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30"
                              }`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <button
                          onClick={() => navigate(`/admin/requests/${req.id}`)}
                          className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-[18px] hover:bg-indigo-100 transition-all shadow-sm"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredRequests.length === 0 && (
                    <div className="py-24 text-center space-y-4 opacity-30">
                      <ClipboardList className="w-14 h-14 mx-auto" />
                      <p className="text-sm font-bold uppercase tracking-widest">
                        Vetting queue is currently at zero.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-7 bg-indigo-600 rounded-[32px] text-white space-y-6 shadow-xl shadow-indigo-200 dark:shadow-none group overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-7 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                        <BarChart3 className="w-28 h-28" />
                      </div>
                      <div className="space-y-1 relative z-10">
                        <h4 className="text-2xl font-black tracking-tight">
                          Growth Velocity
                        </h4>
                        <p className="text-[11px] text-white/50 font-bold uppercase tracking-widest">
                          Year-on-Year Expansion
                        </p>
                      </div>
                      <div className="relative z-10">
                        <p className="text-4xl font-black tracking-tighter">
                          +12.4%
                        </p>
                        <p className="text-[11px] font-medium text-white/60 leading-relaxed mt-3">
                          Unit expansion rate is tracking 4.2% above the
                          institutional average for the 2024 academic cycle.
                        </p>
                      </div>
                    </div>
                    <div className="p-7 bg-slate-900 rounded-[32px] text-white space-y-6 shadow-2xl group overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-7 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                        <Zap className="w-28 h-28" />
                      </div>
                      <div className="space-y-1 relative z-10">
                        <h4 className="text-2xl font-black tracking-tight">
                          Vetting Speed
                        </h4>
                        <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest">
                          Unit Processing Time
                        </p>
                      </div>
                      <div className="relative z-10">
                        <p className="text-4xl font-black tracking-tighter">
                          1.8{" "}
                          <span className="text-lg text-emerald-400 tracking-tight">
                            DAYS
                          </span>
                        </p>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-5">
                          <div className="h-full bg-emerald-500 rounded-full w-[85%] shadow-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[36px] border border-slate-100 dark:border-slate-800 space-y-7">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-lg font-black text-slate-900 dark:text-slate-50 tracking-tight">
                          Health Metrics
                        </h4>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          Unit Performance Telemetry
                        </p>
                      </div>
                      <Target className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div className="space-y-6">
                      {[
                        {
                          label: "Management Efficiency",
                          value: 89,
                          color: "bg-indigo-500",
                        },
                        {
                          label: "Resource Saturation",
                          value: 72,
                          color: "bg-emerald-500",
                        },
                        {
                          label: "Student Success Ratio",
                          value: 95,
                          color: "bg-violet-500",
                        },
                        {
                          label: "Compliance Score",
                          value: 100,
                          color: "bg-amber-500",
                        },
                      ].map((m, i) => (
                        <div key={i} className="space-y-2.5">
                          <div className="flex justify-between text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                            <span>{m.label}</span>
                            <span className="text-slate-900 dark:text-slate-100 font-black">
                              {m.value}%
                            </span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                            <div
                              className={`h-full ${m.color} rounded-full transition-all duration-1000 shadow-sm`}
                              style={{ width: `${m.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination Segment (Dynamic based on tab) */}
            {activeTab !== 'analytics' && (
              <div className="px-10 py-8 border-t border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-800/10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Displaying Segment <span className="text-slate-900 dark:text-slate-100">{currentPage}</span> of <span className="text-slate-900 dark:text-slate-100">{totalPages || 1}</span>
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

                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() => setCurrentPage(p => p + 1)}
                      className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailPage;
