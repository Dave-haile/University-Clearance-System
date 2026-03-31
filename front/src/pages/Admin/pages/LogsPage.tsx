import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  RefreshCcw,
  Clock,
  Terminal,
  Info,
  AlertTriangle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  X,
} from "lucide-react";
import { SystemLog, LogLevel, LogCategory } from "../../../types";

const mockLogs: SystemLog[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `LOG-${1000 + i}`,
  timestamp: new Date(Date.now() - i * 900000).toISOString(),
  level: ["info", "warning", "error", "critical"][i % 4] as LogLevel,
  category: ["audit", "security", "system"][i % 3] as LogCategory,
  action: [
    "User Profile Updated",
    "Clearance Approved",
    "Failed Login Attempt",
    "Database Sync Complete",
    "Registry Policy Modified",
    "Emergency System Restart",
  ][i % 6],
  user:
    i % 5 === 0
      ? null
      : {
          id: 100 + i,
          name: i % 2 === 0 ? "Abel Tsegaye" : "Dr. Sarah Admin",
          role: i % 2 === 0 ? "student" : "admin",
        },
  resource: i % 3 === 0 ? "/api/v1/clearance" : "/admin/settings/security",
  ip_address: `192.168.1.${10 + i}`,
  metadata: { browser: "Chrome/120.0", session_id: `SES_${i * 452}` },
}));

const LevelBadge = ({ level }: { level: LogLevel }) => {
  const styles = {
    info: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800",
    warning:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    error:
      "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800",
    critical:
      "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900",
  };

  const icons = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    critical: ShieldAlert,
  };

  const Icon = icons[level];

  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.18em] border shadow-sm flex items-center gap-1 ${styles[level]}`}
    >
      <Icon className="w-2.5 h-2.5" />
      {level}
    </span>
  );
};

const LogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const itemsPerPage = 12;

  const filteredLogs = useMemo(() => {
    return mockLogs.filter((log) => {
      const matchSearch =
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLevel = levelFilter === "all" || log.level === levelFilter;
      const matchCategory =
        categoryFilter === "all" || log.category === categoryFilter;
      return matchSearch && matchLevel && matchCategory;
    });
  }, [searchTerm, levelFilter, categoryFilter]);

  const stats = useMemo(
    () => ({
      total: mockLogs.length,
      critical: mockLogs.filter((l) => l.level === "critical").length,
      security: mockLogs.filter((l) => l.category === "security").length,
      lastHour: mockLogs.filter(
        (l) => new Date(l.timestamp) > new Date(Date.now() - 3600000),
      ).length,
    }),
    [],
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="max-w-[1360px] mx-auto space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 bg-slate-900 dark:bg-white rounded-xl text-white dark:text-slate-900 shadow-xl shadow-slate-200 dark:shadow-none">
              <Terminal className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              Audit Terminal
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium ml-1">
            Comprehensive forensic ledger of institutional system interactions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Event Volume",
            value: stats.total,
            icon: Terminal,
            color: "text-indigo-600",
            bg: "bg-indigo-50/50",
          },
          {
            label: "Security Alerts",
            value: stats.security,
            icon: ShieldAlert,
            color: "text-orange-600",
            bg: "bg-orange-50/50",
          },
          {
            label: "Critical Errors",
            value: stats.critical,
            icon: AlertCircle,
            color: "text-rose-600",
            bg: "bg-rose-50/50",
          },
          {
            label: "Real-time (1h)",
            value: stats.lastHour,
            icon: Clock,
            color: "text-emerald-600",
            bg: "bg-emerald-50/50",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-all"
          >
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em]">
                {s.label}
              </p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">
                {s.value}
              </h4>
            </div>
            <div
              className={`p-3 rounded-xl ${s.bg} dark:bg-slate-800/50 ${s.color} group-hover:scale-105 transition-transform`}
            >
              <s.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Filter Matrix */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Query action, user, or event ID..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full lg:w-auto">
          <div className="relative min-w-[150px]">
            <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              className="w-full pl-9 pr-8 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200 outline-none appearance-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="all">Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="relative min-w-[150px]">
            <Terminal className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              className="w-full pl-9 pr-8 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200 outline-none appearance-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Categories</option>
              <option value="audit">Audit</option>
              <option value="security">Security</option>
              <option value="system">System</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setLevelFilter("all");
              setCategoryFilter("all");
            }}
            className="px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-[0.18em] hover:bg-slate-200 transition-all"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-sm overflow-hidden flex flex-col transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <th className="px-5 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em]">
                  Timestamp
                </th>
                <th className="px-5 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em]">
                  Principal Actor
                </th>
                <th className="px-5 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em]">
                  Action Artifact
                </th>
                <th className="px-5 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em]">
                  Classification
                </th>
                <th className="px-5 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em] text-right">
                  Telemetry
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {paginatedLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <div>
                        <p className="text-[11px] font-black text-slate-900 dark:text-slate-100">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 mt-0.5">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {log.user ? (
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-[9px] font-black text-indigo-600">
                          {log.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100">
                            {log.user.name}
                          </p>
                          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                            {log.user.role}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 opacity-50">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[9px] font-black text-slate-400">
                          <Terminal className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                          System Daemon
                        </p>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-black text-slate-900 dark:text-slate-100">
                        {log.action}
                      </p>
                      <p className="text-[9px] font-mono text-indigo-500/70 truncate max-w-[180px]">
                        {log.resource}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          log.category === "security"
                            ? "bg-orange-500"
                            : log.category === "audit"
                              ? "bg-indigo-500"
                              : "bg-slate-400"
                        }`}
                      />
                      <LevelBadge level={log.level} />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <div className="text-right">
                        <p className="text-[9px] font-mono font-bold text-slate-500">
                          {log.ip_address}
                        </p>
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-tight">
                          {log.id}
                        </p>
                      </div>
                      <button className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 group-hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Segment */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em]">
            Segment{" "}
            <span className="text-slate-900 dark:text-slate-100">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="text-slate-900 dark:text-slate-100">
              {totalPages}
            </span>
          </p>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setSelectedLog(null)}
          />
          <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl relative z-10 overflow-hidden animate-slide-up transition-all">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-50 tracking-tight">
                    Event Dossier
                  </h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em]">
                    {selectedLog.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em]">
                    Action Taken
                  </p>
                  <p className="text-base font-black text-slate-800 dark:text-slate-100">
                    {selectedLog.action}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em]">
                    Classification
                  </p>
                  <div className="flex items-center gap-2">
                    <LevelBadge level={selectedLog.level} />
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">
                      {selectedLog.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em]">
                    Timestamp
                  </p>
                  <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em]">
                    Network Source
                  </p>
                  <p className="text-[13px] font-mono font-bold text-slate-700 dark:text-slate-300">
                    {selectedLog.ip_address}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em]">
                  Structural Metadata
                </h4>
                <div className="bg-slate-900 rounded-2xl p-6 shadow-inner overflow-x-auto">
                  <pre className="text-[11px] text-indigo-400 font-mono leading-relaxed">
                    {JSON.stringify(
                      {
                        resource: selectedLog.resource,
                        metadata: selectedLog.metadata,
                        principal: selectedLog.user || "SYSTEM_AUTH",
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-[0.18em] hover:opacity-90 transition-all active:scale-95"
              >
                Dismiss Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogsPage;
