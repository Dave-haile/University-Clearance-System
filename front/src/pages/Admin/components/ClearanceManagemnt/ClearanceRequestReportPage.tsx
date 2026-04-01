import React, { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { ClearanceRequest } from "@/types";
import axiosClient from "@/services/axiosBackend";
import { isAxiosError } from "axios";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

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

const fetchClearanceRequests = async (): Promise<ClearanceRequest[]> => {
  const response = await axiosClient.get<ClearanceRequest[]>(
    "/admin/clearanceRequests",
    {
      params: { limit: 500 },
    },
  );
  return Array.isArray(response.data) ? response.data : [];
};

type RequestPriority = "high" | "medium" | "low";

const getRequestPriority = (req: ClearanceRequest): RequestPriority => {
  const createdAt = new Date(req.created_at);
  const ageInHours = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
  if (ageInHours >= 48) return "high";
  if (ageInHours >= 24) return "medium";
  return "low";
};

const RequestReportsPage: React.FC = () => {
  const isDark = useIsDarkMode();
  const {
    data: requests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin", "reports", "clearanceRequests"],
    queryFn: fetchClearanceRequests,
  });

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "pending").length;
    const approved = requests.filter((r) => r.status === "approved").length;
    const rejected = requests.filter((r) => r.status === "rejected").length;
    const highPriority = requests.filter(
      (r) => getRequestPriority(r) === "high" && r.status === "pending",
    ).length;

    const statusDistribution = [
      { name: "Pending", value: pending },
      { name: "Approved", value: approved },
      { name: "Rejected", value: rejected },
    ];

    const priorityDistribution = [
      {
        name: "High",
        value: requests.filter((r) => getRequestPriority(r) === "high").length,
      },
      {
        name: "Medium",
        value: requests.filter((r) => getRequestPriority(r) === "medium").length,
      },
      {
        name: "Low",
        value: requests.filter((r) => getRequestPriority(r) === "low").length,
      },
    ];

    const timelineData: Record<string, { count: number; approved: number }> =
      {};
    requests.forEach((r) => {
      const date = new Date(r.created_at).toLocaleDateString("default", {
        month: "short",
        day: "numeric",
      });
      if (!timelineData[date]) timelineData[date] = { count: 0, approved: 0 };
      timelineData[date].count++;
      if (r.status === "approved") timelineData[date].approved++;
    });
    const trendData = Object.keys(timelineData)
      .map((date) => ({
        date,
        requests: timelineData[date].count,
        approved: timelineData[date].approved,
      }))
      .slice(-15);

    return {
      total,
      pending,
      approved,
      rejected,
      highPriority,
      statusDistribution,
      priorityDistribution,
      trendData,
    };
  }, [requests]);

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
        : "Failed to load clearance reports.";
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
          Clearance Analytics
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Deep dive into clearance request workflows, bottlenecks, and
          completion trends.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <ReportCard
          label="Total Requests"
          value={stats.total}
          icon={ShieldCheck}
          color="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
        />
        <ReportCard
          label="Pending Review"
          value={stats.pending}
          icon={Clock}
          color="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
        />
        <ReportCard
          label="Approved Cycle"
          value={stats.approved}
          icon={CheckCircle2}
          color="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
        />
        <ReportCard
          label="Critical Priority"
          value={stats.highPriority}
          icon={AlertCircle}
          color="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[40px] shadow-sm flex flex-col hover:border-indigo-500/20 transition-all">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <PieIcon className="w-4 h-4" /> Status Breakdown
            </h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#F59E0B" /> {/* Pending */}
                  <Cell fill="#10B981" /> {/* Approved */}
                  <Cell fill="#EF4444" /> {/* Rejected */}
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

        {/* Priority Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[40px] shadow-sm flex flex-col hover:border-violet-500/20 transition-all">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Priority Matrix
            </h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.priorityDistribution}>
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
                  radius={[10, 10, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Request Trends */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[40px] shadow-sm flex flex-col hover:border-emerald-500/20 transition-all">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Request Volatility & Completion
          </h2>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.trendData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? "#1e293b" : "#f1f5f9"}
              />
              <XAxis
                dataKey="date"
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
              <Legend />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="approved"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RequestReportsPage;
