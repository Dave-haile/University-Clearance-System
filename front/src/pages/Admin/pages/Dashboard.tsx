import React from "react";
import {
  RefreshCcw,
  Calendar,
  Zap,
  Activity,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import RecentRequestsTable from "../components/DashboardManagment/RecentRequestsTable";
import { DashboardData } from "@/types/dashboard";
import SummaryCard from "../components/DashboardManagment/SummaryCard";
import {
  DepartmentPieChart,
  MonthlyTrendsChart,
} from "../components/DashboardManagment/RequestsBarChart";
import StaffDistribution from "../components/DashboardManagment/StaffRolesCard";
import { RequestsBarChart } from "../components/DashboardManagment/RequestsBarChart";
import axiosClient from "@/services/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import LiveActivityFeed from "../components/DashboardManagment/LiveActivityFeed";

const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await axiosClient.get("/admin/dashboard");
  return response.data;
};

const Dashboard: React.FC = () => {
  const {
    data,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: fetchDashboardData,
  });

  return (
    <div className="space-y-6 max-w-[1320px] mx-auto transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-xl shadow-indigo-100 dark:shadow-none">
              <Zap className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              Academic Clearance Dashboard
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-[11px] ml-1">
            Strategic overview and management of all clearance operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
            <Calendar className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
            Last Updated: {new Date().toLocaleTimeString()}
          </div>
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 dark:shadow-none hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCcw
              className={`w-2.5 h-2.5 ${loading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Sync Data</span>
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <SummaryCard
          title="Total Users"
          value={data?.total_users ?? 0}
          type="users"
          loading={loading}
        />
        <SummaryCard
          title="Total Students"
          value={data?.total_students}
          type="students"
          loading={loading}
        />
        <SummaryCard
          title="Total Staff"
          value={data?.total_staff}
          type="staff"
          loading={loading}
        />
        <SummaryCard
          title="Total Departments"
          value={data?.total_departments}
          type="departments"
          loading={loading}
        />
        <SummaryCard
          title="Total Colleges"
          value={data?.total_colleges}
          type="colleges"
          loading={loading}
        />
        <SummaryCard
          title="Total Requests"
          value={data?.totals.all ?? 0}
          type="total"
          loading={loading}
        />
        <SummaryCard
          title="Approved Requests"
          value={data?.totals.approved ?? 0}
          type="approved"
          loading={loading}
        />
        <SummaryCard
          title="Pending Requests"
          value={data?.totals.pending ?? 0}
          type="pending"
          loading={loading}
        />
        <SummaryCard
          title="Rejected Requests"
          value={data?.totals.rejected ?? 0}
          type="rejected"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Main Analytics Block */}
        <div className="xl:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RequestsBarChart data={data?.totals} />
            <DepartmentPieChart data={data?.byDepartment} />
          </div>

          <MonthlyTrendsChart data={data?.byMonth} />

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col md:flex-row items-center justify-between gap-5 group hover:border-indigo-500/30 transition-all">
            <div className="space-y-2.5 max-w-md">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-50 tracking-tight">
                  Institutional Performance
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                The average clearance turnaround is currently{" "}
                <span className="text-indigo-600 font-black">1.8 days</span>,
                which is 14% faster than the previous academic cycle.
              </p>
              <button className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-indigo-600 hover:gap-2 transition-all">
                View Detailed Reports <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="w-full md:w-auto grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center space-y-1 border border-slate-100 dark:border-slate-800 transition-transform group-hover:scale-105">
                <p className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  94%
                </p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  SLA Compliance
                </p>
              </div>
              <div className="p-3 bg-indigo-600 rounded-xl text-center space-y-1 shadow-xl shadow-indigo-100 dark:shadow-none transition-transform group-hover:scale-105 delay-75">
                <p className="text-xl font-black text-white tracking-tight">
                  4.2h
                </p>
                <p className="text-[8px] font-black text-indigo-100 uppercase tracking-widest">
                  Peak Response
                </p>
              </div>
            </div>
          </div>

          <RecentRequestsTable requests={data?.recentRequests} />
        </div>

        {/* Intelligence Sidebar */}
        <div className="xl:col-span-4 space-y-4">
          <StaffDistribution roles={data?.staffRoles} />

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-black text-[9px] text-slate-400 uppercase tracking-[0.2em] flex items-center justify-between">
              Administrative Health
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
            </h3>
            <div className="space-y-5">
              {[
                {
                  name: "Colleges Synchronization",
                  val: data?.total_colleges || 0,
                  max: 10,
                  color: "bg-emerald-500",
                  desc: "Active units in registry",
                },
                {
                  name: "Department Coverage",
                  val: data?.total_departments || 0,
                  max: 50,
                  color: "bg-indigo-500",
                  desc: "Structural management",
                },
                {
                  name: "User Vetting Rate",
                  val: 84,
                  max: 100,
                  color: "bg-violet-500",
                  desc: "Identity verification",
                },
              ].map((c) => (
                <div key={c.name} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100">
                        {c.name}
                      </span>
                      <p className="text-[8px] text-slate-400 font-medium">
                        {c.desc}
                      </p>
                    </div>
                    <span className="text-[9px] font-black text-slate-900 dark:text-slate-100">
                      {c.val}%
                    </span>
                  </div>
                  <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.color} transition-all duration-1000 ease-in-out shadow-sm`}
                      style={{ width: `${(c.val / c.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <LiveActivityFeed />

          <div className="bg-slate-900 dark:bg-slate-800 p-5 rounded-2xl text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-5 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Zap className="w-20 h-20" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="space-y-1">
                <h3 className="font-black text-lg tracking-tight">
                  System Insights
                </h3>
                <p className="text-white/50 text-[9px] font-medium leading-relaxed">
                  You have{" "}
                  <span className="text-indigo-400 font-bold">
                    {data?.totals.pending} student requests
                  </span>{" "}
                  that have surpassed the 48-hour processing window.
                </p>
              </div>
              <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/10 transition-all active:scale-95">
                Optimize Workflow
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
