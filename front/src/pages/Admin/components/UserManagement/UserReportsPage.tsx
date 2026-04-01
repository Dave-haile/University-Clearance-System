import React, { useEffect, useMemo, useState } from "react";
import {
  Users as UsersIcon,
  GraduationCap,
  Shield,
  Zap,
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { User } from "@/types";
import axiosClient from "@/services/axiosBackend";
import { isAxiosError } from "axios";

const COLORS = ["#6366F1", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

const useIsDarkMode = () => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    setIsDark(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);
  return isDark;
};

type PaginatedResponse<T> = {
  data: T[];
  current_page?: number;
  per_page?: number;
  total?: number;
};

const fetchUsers = async (): Promise<User[]> => {
  const response = await axiosClient.get<PaginatedResponse<User>>("/admin/users", {
    params: { limit: 500, page: 1, role: "all" },
  });
  const payload = response.data as unknown as PaginatedResponse<User> | User[];
  return Array.isArray(payload) ? payload : (payload.data ?? []);
};

const UserReportsPage: React.FC = () => {
  const isDark = useIsDarkMode();
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin", "reports", "users"],
    queryFn: fetchUsers,
  });

  const stats = useMemo(() => {
    const students = users.filter((u) => u.role === "student").length;
    const staff = users.filter((u) => u.role !== "student").length;
    const recentlyJoined = users.filter((u) => {
      const joinDate = new Date(u.created_at);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return joinDate > monthAgo;
    }).length;

    const roleDistribution = [
      { name: "Students", value: students },
      { name: "Staff", value: staff },
      { name: "Admins", value: users.filter((u) => u.role === "admin").length },
    ];

    const deptCounts: Record<string, number> = {};
    users.forEach((u) => {
      const dept =
        u.student?.department?.department ||
        u.staff?.department?.department ||
        "Other";
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });
    const deptDistribution = Object.keys(deptCounts).map((name) => ({
      name,
      value: deptCounts[name],
    }));

    const months: Record<string, number> = {};
    users.forEach((u) => {
      const m = new Date(u.created_at).toLocaleString("default", {
        month: "short",
      });
      months[m] = (months[m] || 0) + 1;
    });
    const growthData = Object.keys(months).map((key) => ({
      name: key,
      count: months[key],
    }));

    return {
      total: users.length,
      students,
      staff,
      recentlyJoined,
      roleDistribution,
      deptDistribution,
      growthData,
    };
  }, [users]);

  const ReportCard = ({
    label,
    value,
    icon: Icon,
    color,
    trend,
  }: {
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    trend?: string;
  }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-all">
      <div className="space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">
            {value.toLocaleString()}
          </h4>
          {trend && (
            <span className="text-[9px] font-black text-emerald-500 tracking-tighter">
              {trend}
            </span>
          )}
        </div>
      </div>
      <div
        className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError) {
    const message = isAxiosError(error)
      ? (error.response?.data as { message?: string } | undefined)?.message ||
        error.message
      : error instanceof Error
        ? error.message
        : "Failed to load user reports.";
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">
          Reports Unavailable
        </h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
          User Intelligence Reports
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Comprehensive analytics and demographic insights of the institutional
          directory.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <ReportCard
          label="Total Directory"
          value={stats.total}
          icon={UsersIcon}
          color="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
          trend="+12%"
        />
        <ReportCard
          label="Academic Enrollees"
          value={stats.students}
          icon={GraduationCap}
          color="bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400"
        />
        <ReportCard
          label="Operational Staff"
          value={stats.staff}
          icon={Shield}
          color="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
        />
        <ReportCard
          label="New Identifiers (30d)"
          value={stats.recentlyJoined}
          icon={Zap}
          color="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Role Allocation */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[40px] shadow-sm flex flex-col hover:border-indigo-500/20 transition-all">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <PieIcon className="w-4 h-4" /> Role Allocation
            </h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.roleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.roleDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0f172a" : "#ffffff",
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Registry Velocity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[40px] shadow-sm flex flex-col hover:border-violet-500/20 transition-all">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Registry Velocity
            </h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.growthData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={isDark ? "#1e293b" : "#f1f5f9"}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fontWeight: 700,
                    fill: isDark ? "#94a3b8" : "#64748b",
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: isDark ? "#94a3b8" : "#64748b" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0f172a" : "#ffffff",
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8B5CF6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Distribution */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[40px] shadow-sm flex flex-col hover:border-emerald-500/20 transition-all">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Departmental Demographics
          </h2>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.deptDistribution}
              layout="vertical"
              margin={{ left: 40, right: 40 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke={isDark ? "#1e293b" : "#f1f5f9"}
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fontWeight: 700,
                  fill: isDark ? "#94a3b8" : "#64748b",
                }}
                width={150}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: isDark ? "#0f172a" : "#ffffff",
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
              <Bar
                dataKey="value"
                fill="#6366F1"
                radius={[0, 10, 10, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserReportsPage;
