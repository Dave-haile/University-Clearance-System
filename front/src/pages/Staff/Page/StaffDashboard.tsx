import React from "react";
import { useAuth } from "@/context/authContext";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Coffee,
  FileCheck,
  GraduationCap,
  LucideIcon,
  School,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import axiosClient from "@/services/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import { Staff } from "@/types/user";
import { queryKeys } from "@/lib/queryKeys";

type StaffRoleKey =
  | "department_head"
  | "library"
  | "cafeteria"
  | "proctor"
  | "registrar"
  | "staff";

type RoleConfig = {
  label: string;
  icon: LucideIcon;
  gradient: string;
  accent: string;
  badge: string;
  title: string;
  description: string;
  focus: string;
  metricLabel: string;
  metricValue: string;
  cards: { label: string; value: string; note: string; icon: LucideIcon }[];
  tasks: { title: string; description: string; to: string }[];
  alerts: string[];
};

const roleConfigs: Record<StaffRoleKey, RoleConfig> = {
  department_head: {
    label: "Department Head",
    icon: Building2,
    gradient: "from-indigo-700 via-indigo-600 to-sky-500",
    accent: "text-indigo-600",
    badge:
      "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-800",
    title: "lead departmental clearance with confidence.",
    description:
      "Track student readiness, sign off departmental obligations, and move qualified students to the next office without losing visibility.",
    focus:
      "Departmental review is the first critical decision point in the clearance workflow.",
    metricLabel: "Awaiting Department Review",
    metricValue: "28",
    cards: [
      {
        label: "Pending Reviews",
        value: "28",
        note: "8 need action today",
        icon: ClipboardCheck,
      },
      {
        label: "Students Cleared",
        value: "64",
        note: "This week",
        icon: GraduationCap,
      },
      {
        label: "Completion Rate",
        value: "91%",
        note: "Across final-year students",
        icon: CheckCircle2,
      },
    ],
    tasks: [
      {
        title: "Review clearance queue",
        description:
          "Approve ready requests and return blocked ones with remarks.",
        to: "/staff/requests",
      },
      {
        title: "Monitor your department",
        description: "See which students are blocked, delayed, or fully ready.",
        to: "/staff/department",
      },
      {
        title: "Open workflow guidance",
        description: "Review staff procedures and exception handling notes.",
        to: "/staff/help",
      },
    ],
    alerts: [
      "Prioritize final-year students with unresolved department obligations.",
      "Always include remarks when returning or rejecting a request.",
    ],
  },
  library: {
    label: "Library Staff",
    icon: BookOpen,
    gradient: "from-emerald-700 via-emerald-600 to-teal-500",
    accent: "text-emerald-600",
    badge:
      "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-800",
    title: "resolve borrowing obligations before final release.",
    description:
      "Verify returns, flag overdue materials, and keep student library clearance accurate and easy to process.",
    focus:
      "Library validation prevents unresolved assets from reaching final approval.",
    metricLabel: "Flagged Borrowing Records",
    metricValue: "17",
    cards: [
      {
        label: "Pending Library Reviews",
        value: "17",
        note: "5 include overdue books",
        icon: ClipboardCheck,
      },
      {
        label: "Returns Confirmed",
        value: "31",
        note: "Today",
        icon: BookOpen,
      },
      {
        label: "Accuracy Rate",
        value: "98%",
        note: "Audit trail consistency",
        icon: CheckCircle2,
      },
    ],
    tasks: [
      {
        title: "Process overdue material cases",
        description:
          "Handle students with unresolved books or borrowed equipment.",
        to: "/staff/requests",
      },
      {
        title: "Clear verified borrowers",
        description:
          "Approve requests where all library obligations are settled.",
        to: "/staff/requests",
      },
      {
        title: "Review library guidance",
        description:
          "Open policy notes for exceptions and manual verification.",
        to: "/staff/help",
      },
    ],
    alerts: [
      "High-priority items often relate to overdue or unverified materials.",
      "Use remarks for partial returns or unresolved borrower registry issues.",
    ],
  },
  cafeteria: {
    label: "Cafeteria Staff",
    icon: Coffee,
    gradient: "from-amber-700 via-amber-600 to-orange-500",
    accent: "text-amber-600",
    badge:
      "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30 dark:border-amber-800",
    title: "keep dining account verification simple and fast.",
    description:
      "Review meal-service obligations, unpaid balances, and verified exemptions so students can continue their clearance flow.",
    focus:
      "Dining balance checks help prevent unresolved service accounts at cycle close.",
    metricLabel: "Accounts Requiring Review",
    metricValue: "14",
    cards: [
      {
        label: "Pending Cafeteria Reviews",
        value: "14",
        note: "4 include open balances",
        icon: ClipboardCheck,
      },
      { label: "Settled Accounts", value: "19", note: "Today", icon: Coffee },
      {
        label: "Resolution Rate",
        value: "92%",
        note: "Improving this week",
        icon: CheckCircle2,
      },
    ],
    tasks: [
      {
        title: "Review unpaid balance cases",
        description: "Handle open cafeteria charges and meal plan conflicts.",
        to: "/staff/requests",
      },
      {
        title: "Approve resolved accounts",
        description: "Clear students whose dining obligations are settled.",
        to: "/staff/requests",
      },
      {
        title: "Check service guidance",
        description:
          "Read workflow notes for exceptions and non-cafe students.",
        to: "/staff/help",
      },
    ],
    alerts: [
      "Open balances should be marked clearly to reduce repeat escalations.",
      "Use remarks for verified non-cafeteria students and waivers.",
    ],
  },
  proctor: {
    label: "Proctor Office",
    icon: ShieldCheck,
    gradient: "from-rose-700 via-rose-600 to-pink-500",
    accent: "text-rose-600",
    badge:
      "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/30 dark:border-rose-800",
    title: "manage residence and conduct clearance in one place.",
    description:
      "Review dorm status, conduct checks, and residence obligations before students move on to final approval.",
    focus:
      "Proctor approval often depends on both residence status and conduct records.",
    metricLabel: "Residence Cases Awaiting Review",
    metricValue: "11",
    cards: [
      {
        label: "Pending Proctor Reviews",
        value: "11",
        note: "3 are residence handovers",
        icon: ClipboardCheck,
      },
      {
        label: "Dorm Handover Confirmed",
        value: "23",
        note: "This week",
        icon: ShieldCheck,
      },
      {
        label: "Conduct Clearance Rate",
        value: "95%",
        note: "Few escalations",
        icon: CheckCircle2,
      },
    ],
    tasks: [
      {
        title: "Review dorm and conduct cases",
        description:
          "Prioritize room checks, conduct flags, and residence issues.",
        to: "/staff/requests",
      },
      {
        title: "Approve clean residence records",
        description: "Move fully cleared students to the registrar step.",
        to: "/staff/requests",
      },
      {
        title: "Read office procedures",
        description: "Open guidance for non-dorm students and manual reviews.",
        to: "/staff/help",
      },
    ],
    alerts: [
      "Dorm-related issues should be resolved before registrar handoff.",
      "Manual confirmation is common for non-dorm students and needs remarks.",
    ],
  },
  registrar: {
    label: "Registrar",
    icon: ClipboardList,
    gradient: "from-violet-700 via-violet-600 to-fuchsia-500",
    accent: "text-violet-600",
    badge:
      "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-950/30 dark:border-violet-800",
    title: "finalize institutional clearance with precision.",
    description:
      "Confirm the last step in the workflow, ensuring all prior approvals are complete before records are released.",
    focus: "Registrar approval closes the full student clearance journey.",
    metricLabel: "Final Reviews Ready",
    metricValue: "22",
    cards: [
      {
        label: "Pending Final Reviews",
        value: "22",
        note: "12 can close now",
        icon: ClipboardCheck,
      },
      {
        label: "Certificates Released",
        value: "48",
        note: "This cycle",
        icon: School,
      },
      {
        label: "Final Approval Accuracy",
        value: "99%",
        note: "Excellent handoff quality",
        icon: CheckCircle2,
      },
    ],
    tasks: [
      {
        title: "Finalize complete files",
        description:
          "Process students whose prior approvals are already complete.",
        to: "/staff/requests",
      },
      {
        title: "Inspect incomplete handoffs",
        description: "Catch requests missing one or more office approvals.",
        to: "/staff/requests",
      },
      {
        title: "Open release guidance",
        description:
          "Read documentation for holds, exceptions, and release control.",
        to: "/staff/help",
      },
    ],
    alerts: [
      "Finalize only after all office checks are complete and consistent.",
      "Escalate any missing approval chain entries before release.",
    ],
  },
  staff: {
    label: "Staff",
    icon: UserRound,
    gradient: "from-slate-800 via-slate-700 to-slate-500",
    accent: "text-slate-700 dark:text-slate-200",
    badge:
      "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:border-slate-800",
    title: "coordinate your workflow from one dashboard.",
    description:
      "Use this workspace to keep student clearance moving with visibility into tasks, requests, and office responsibilities.",
    focus:
      "Every staff office contributes to a smooth institutional clearance cycle.",
    metricLabel: "Operational Tasks",
    metricValue: "12",
    cards: [
      {
        label: "Open Reviews",
        value: "12",
        note: "Current queue items",
        icon: ClipboardCheck,
      },
      {
        label: "Resolved Today",
        value: "18",
        note: "Across staff offices",
        icon: Users,
      },
      {
        label: "Readiness",
        value: "90%",
        note: "Healthy workflow momentum",
        icon: CheckCircle2,
      },
    ],
    tasks: [
      {
        title: "Review active requests",
        description:
          "Open the main queue and process tasks assigned to your office.",
        to: "/staff/requests",
      },
      {
        title: "Check staff procedures",
        description: "Use the help center when you need workflow guidance.",
        to: "/staff/help",
      },
      {
        title: "Monitor workflow health",
        description:
          "Track progress, blockers, and escalations across the cycle.",
        to: "/staff/requests",
      },
    ],
    alerts: [
      "Follow the workflow order so records move cleanly between offices.",
      "Add remarks whenever you reject or defer a request.",
    ],
  },
};

const normalizeRole = (role?: string | null): StaffRoleKey => {
  if (!role) return "staff";
  if (role === "department_head") return "department_head";
  if (role === "library") return "library";
  if (role === "cafeteria") return "cafeteria";
  if (role === "proctor") return "proctor";
  if (role === "registrar") return "registrar";
  return "staff";
};

type StaffDashboardData = {
  totalRequests: number;
  pendingRequests: number;
  apprevedRequests: number;
  rejectedRequests: number;
  totalStudents: number;
  user?: {
    staff?: {
      department?: {
        department: string;
        college: string;
      } | null;
    } | null;
  };
};

const fetchStaffDashboard = async (): Promise<StaffDashboardData> => {
  const response = await axiosClient.get("/staff/dashboard");
  return response.data;
};

const fetchStaffProfile = async (): Promise<Staff | null> => {
  try {
    const response = await axiosClient.get("/staff/me");
    return response.data;
  } catch {
    const response = await axiosClient.get("/staff/profile/show");
    return (
      response.data?.staff ?? response.data?.staff ?? response.data ?? null
    );
  }
};

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const normalizedRole = normalizeRole(user?.role);
  const config = roleConfigs[normalizedRole];
  const firstName = user?.name?.split(" ")[0] || "Staff";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const { data: staff } = useQuery({
    queryKey: queryKeys.staff.profile,
    queryFn: fetchStaffProfile,
    enabled: !!user,
  });

  const { data: dashboard } = useQuery({
    queryKey: queryKeys.staff.dashboard,
    queryFn: fetchStaffDashboard,
    enabled: !!user,
  });

  const heroStats = [
    { label: "Role", value: config.label },
    {
      label: "Office",
      value:
        staff?.department?.department ||
        dashboard?.user?.staff?.department?.department ||
        "Institutional Services",
    },
    {
      label: config.metricLabel,
      value: String(dashboard?.pendingRequests ?? config.metricValue),
    },
    { label: "Portal Status", value: "Operational" },
  ];

  const dynamicCards = [
    {
      ...config.cards[0],
      value: String(dashboard?.pendingRequests ?? config.cards[0].value),
      note:
        normalizedRole === "department_head"
          ? `${dashboard?.rejectedRequests ?? 0} rejected need follow-up`
          : config.cards[0].note,
    },
    {
      ...config.cards[1],
      value: String(dashboard?.apprevedRequests ?? config.cards[1].value),
      note:
        normalizedRole === "department_head"
          ? `${dashboard?.totalStudents ?? 0} students in department`
          : config.cards[1].note,
    },
    {
      ...config.cards[2],
      value:
        normalizedRole === "department_head"
          ? String(dashboard?.totalRequests ?? config.cards[2].value)
          : config.cards[2].value,
      note:
        normalizedRole === "department_head"
          ? "Total requests routed through your department"
          : config.cards[2].note,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 animate-fade-in">
      <section
        className={`relative overflow-hidden rounded-[36px] bg-gradient-to-br ${config.gradient} p-8 text-white shadow-2xl md:p-10`}
      >
        <div className="absolute bottom-0 right-8 opacity-10">
          <config.icon className="h-40 w-40 md:h-52 md:w-52" />
        </div>
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.25em]">
              <Calendar className="h-3.5 w-3.5" />
              {today}
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                {firstName}, {config.title}
              </h1>
              <p className="mt-3 max-w-xl text-sm font-medium leading-7 text-white/80 md:text-base">
                {config.description}
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                Today&apos;s Focus
              </p>
              <p className="mt-2 text-sm font-semibold text-white/90">
                {config.focus}
              </p>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 lg:max-w-sm">
            {heroStats.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/60">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-bold leading-tight text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {dynamicCards.map((card) => (
          <div
            key={card.label}
            className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${config.badge}`}
              >
                <card.icon className={`h-5 w-5 ${config.accent}`} />
              </div>
              <span
                className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.25em] ${config.badge}`}
              >
                {config.label}
              </span>
            </div>
            <p className="mt-6 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              {card.value}
            </p>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
              {card.note}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <section className="rounded-[34px] border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p
                  className={`text-[10px] font-black uppercase tracking-[0.3em] ${config.accent}`}
                >
                  Role-specific tasks
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                  What your office should handle next
                </h2>
              </div>
              <button
                onClick={() => navigate("/staff/requests")}
                className={`inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r px-5 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-white ${config.gradient}`}
              >
                Open workflow
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-8 grid gap-4">
              {config.tasks.map((task) => (
                <button
                  key={task.title}
                  onClick={() => navigate(task.to)}
                  className="flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-slate-50/70 p-5 text-left dark:border-slate-800 dark:bg-slate-800/40 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-slate-50">
                      {task.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                      {task.description}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 self-start rounded-2xl border px-4 py-3 text-[10px] font-black uppercase tracking-[0.25em] ${config.badge}`}
                  >
                    Open
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[34px] border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Queue snapshot
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                  Shared staff actions
                </h2>
              </div>
              <Link
                to="/staff/requests"
                className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] ${config.accent}`}
              >
                View full queue
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  label: "My Queue",
                  value: String(
                    dashboard?.pendingRequests ?? config.metricValue,
                  ),
                  icon: FileCheck,
                },
                {
                  label: "Resolved",
                  value: String(
                    (dashboard?.apprevedRequests ?? dynamicCards[1]?.value) ||
                      "0",
                  ),
                  icon: Sparkles,
                },
                {
                  label: "Needs Attention",
                  value: String(dashboard?.rejectedRequests ?? "0"),
                  icon: AlertCircle,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[28px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <item.icon className={`h-5 w-5 ${config.accent}`} />
                  <p className="mt-4 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <section className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Office checklist
              </p>
              <Users className={`h-5 w-5 ${config.accent}`} />
            </div>
            <div className="mt-6 space-y-4">
              {[
                "Review assigned cases in order",
                "Add remarks for any blocked request",
                "Move verified files forward quickly",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-black ${config.badge}`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            className={`rounded-[34px] border p-6 shadow-sm ${config.badge}`}
          >
            <div className="flex items-center justify-between">
              <p
                className={`text-[10px] font-black uppercase tracking-[0.3em] ${config.accent}`}
              >
                Service pulse
              </p>
              <Sparkles className={`h-5 w-5 ${config.accent}`} />
            </div>
            <p className="mt-4 text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              94%
            </p>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
              Strong office responsiveness across the current clearance cycle.
            </p>
          </section>

          <section className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Alerts and notes
              </p>
              <AlertCircle className="h-4.5 w-4.5 text-amber-500" />
            </div>
            <div className="mt-6 space-y-4">
              {config.alerts.map((alert) => (
                <div
                  key={alert}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <p className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
                    {alert}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
