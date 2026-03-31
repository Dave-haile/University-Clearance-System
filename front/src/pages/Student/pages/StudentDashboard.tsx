
import React from 'react';
import { useAuth } from '@/context/authContext';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  Building2,
  Layers,
  BookOpen,
  Coffee,
  ShieldCheck,
  ClipboardList,
  Calendar,
  FileUp,
  History,
  ExternalLink,
  Zap,
  Loader2,
  Check,
  X,
  User
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/services/axiosBackend';
import { queryKeys } from '@/lib/queryKeys';
import { User as UserType } from '@/types/clerance';

type ApprovalStatus = 'approved' | 'pending' | 'rejected';

type ApprovalDetails = {
  status: ApprovalStatus;
  remarks: string | null;
  timeStamp: string | null;
  approved_by: UserType | null;
};

type ApprovalsMap = Record<string, ApprovalDetails>;

type RecentHistoryItem = {
  id: number;
  year: string;
  semester: string;
  status: string;
  date: string;
};

type DashboardData = {
  status: string;
  approvals: ApprovalsMap;
  progress: number;
  recentHistory: RecentHistoryItem[];
  [key: string]: unknown;
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const approvalSteps = [
    { id: 'dept', name: 'Department Head', icon: Building2, key: 'department_head' },
    { id: 'lib', name: 'University Library', icon: BookOpen, key: 'library' },
    { id: 'cafe', name: 'Cafeteria Services', icon: Coffee, key: 'cafeteria' },
    { id: 'proc', name: 'Proctorate Office', icon: ShieldCheck, key: 'proctor' },
    { id: 'reg', name: 'Office of Registrar', icon: ClipboardList, key: 'registrar' },
  ];

  const computeProgress = (approvals: ApprovalsMap | undefined) => {
    if (!approvals) return 0;
    const items = Object.values(approvals);
    if (items.length === 0) return 0;
    const approved = items.filter((a) => a.status === 'approved').length;
    return Math.round((approved / items.length) * 100);
  };

  const fetchStudentDashboard = async (): Promise<DashboardData> => {
    const response = await axiosClient.get('/student/data');
    const userData: unknown = response.data;

    const userRec = isRecord(userData) ? userData : {};
    const studentRec = isRecord(userRec.student) ? userRec.student : {};
    const requests: unknown = studentRec.clearance_requests;
    const latestRequest: unknown = Array.isArray(requests) ? requests[0] : requests;

    const emptyApprovals: ApprovalsMap = {
      department_head: { status: 'pending', remarks: null, timeStamp: null, approved_by: null },
      library: { status: 'pending', remarks: null, timeStamp: null, approved_by: null },
      cafeteria: { status: 'pending', remarks: null, timeStamp: null, approved_by: null },
      proctor: { status: 'pending', remarks: null, timeStamp: null, approved_by: null },
      registrar: { status: 'pending', remarks: null, timeStamp: null, approved_by: null },
    };
    if (!latestRequest) {
      return {
        status: 'pending',
        approvals: emptyApprovals,
        progress: 0,
        recentHistory: [],
      };
    }

    const latestReqRec = isRecord(latestRequest) ? latestRequest : {};
    const approvals = (isRecord(latestReqRec.approvals)
      ? (latestReqRec.approvals as ApprovalsMap)
      : emptyApprovals) as ApprovalsMap;
    const progress = computeProgress(approvals);

    const recentHistory: RecentHistoryItem[] = Array.isArray(requests)
      ? requests.slice(0, 3).map((r) => {
        const rr = isRecord(r) ? r : {};
        return {
          id: Number(rr.id),
          year: String(rr.year ?? ''),
          semester: String(rr.semester ?? ''),
          status: String(rr.status ?? ''),
          date: rr.created_at ? new Date(String(rr.created_at)).toLocaleDateString('en-US') : '',
        };
      })
      : [];

    return {
      ...(latestReqRec as Record<string, unknown>),
      approvals,
      progress,
      recentHistory,
      status: String(latestReqRec.status ?? 'pending'),
    };
  };

  const {
    data: clearanceData,
    isLoading,
    // refetch,
  } = useQuery<DashboardData>({
    queryKey: queryKeys.student.dashboard,
    queryFn: fetchStudentDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Syncing Records...</p>
      </div>
    );
  }

  if (!clearanceData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No data found</p>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const getOverallStatusColor = () => {
    const statuses = Object.values(clearanceData?.approvals ?? {}).map((a) => a?.status);
    if (statuses.includes('rejected')) return 'bg-rose-500 shadow-rose-200';
    if (clearanceData?.status === 'approved') return 'bg-emerald-500 shadow-emerald-200';
    return 'bg-amber-500 shadow-amber-200';
  };

  const recentHistory = clearanceData?.recentHistory ?? [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 animate-fade-in">
      {/* 1. WELCOME HERO */}
      <div className="bg-indigo-600 rounded-[36px] p-8 md:p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200 dark:shadow-none">
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-125 rotate-12 transition-transform duration-1000 group-hover:rotate-0">
          <Zap className="w-48 h-48" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-3 max-w-lg">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 w-fit">
              <Calendar className="w-3 h-3 text-indigo-200" />
              <span className="text-[9px] font-black uppercase tracking-widest">{today}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">
              Welcome, <span className="text-indigo-200">{user?.name.split(' ')[0]}</span>!
            </h1>
            <p className="text-base text-indigo-100 font-medium leading-relaxed">
              Institutional identity verified. Your clearance workflow is active for the <span className="font-bold border-b-2 border-indigo-400">2024/25 Cycle</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            {[
              { label: 'Unit', val: user?.student?.department?.department },
              { label: 'Identifier', val: user?.student?.student_id },
              { label: 'Academic Level', val: user?.student?.year },
              { label: 'Portal Status', val: 'Operational' },
            ].map((stat) => (
              <div key={stat.label} className="p-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl min-w-[120px]">
                <p className="text-[8px] font-black text-indigo-200 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xs font-bold truncate">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 2. PROGRESS TRACKER */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[36px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col xl:flex-row">

            <div className="p-8 md:p-10 md:border-r border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center bg-slate-50/30 dark:bg-slate-800/20 xl:w-72 shrink-0">
              <div className="relative mb-6">
                <div className={`w-40 h-40 rounded-full border-[10px] border-slate-100 dark:border-slate-800 flex items-center justify-center ${clearanceData?.status === 'pending' && !Object.values(clearanceData?.approvals ?? {}).some((a) => a?.status === 'rejected') ? 'animate-pulse' : ''}`}>
                  <div className={`w-28 h-28 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-700 ${getOverallStatusColor()}`}>
                    <div className="text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Complete</p>
                      <p className="text-3xl font-black tracking-tighter">{clearanceData?.progress}%</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-12 h-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl flex items-center justify-center">
                  {clearanceData?.status === 'approved' ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : Object.values(clearanceData?.approvals ?? {}).some((a) => a?.status === 'rejected') ? <AlertCircle className="w-6 h-6 text-rose-500 animate-bounce" /> : <Clock className="w-6 h-6 text-amber-500" />}
                </div>
              </div>
              <div className="text-center space-y-1.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Workflow Index</p>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 px-3">
                  {Object.values(clearanceData?.approvals ?? {}).some((a) => a?.status === 'rejected')
                    ? 'Intervention required due to rejection.'
                    : clearanceData?.status === 'pending'
                      ? 'Currently under institutional vetting.'
                      : 'Evaluation process finalized.'}
                </p>
              </div>
            </div>

            <div className="p-8 md:p-10 flex-1 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Vetting Roadmap</h3>
                <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-indigo-100 dark:border-indigo-800">Operational Trail</span>
              </div>

              <div className="space-y-10 relative">
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-100 dark:bg-slate-800 rounded-full" />

                {approvalSteps.map((step) => {
                  const details = clearanceData?.approvals?.[step.key];
                  const isApproved = details?.status === 'approved';
                  const isRejected = details?.status === 'rejected';

                  return (
                    <div key={step.id} className="relative flex items-start justify-between pl-14 group">
                      <div className="flex items-start gap-5">
                        {/* Step Icon with Status Overlay */}
                        <div className={`absolute left-0 w-8 h-8 rounded-[12px] flex items-center justify-center border-2 transition-all z-10 ${isApproved ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-100 dark:shadow-none' :
                          isRejected ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-100 animate-pulse' :
                            'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300'
                          }`}>
                          <step.icon className="w-4 h-4" />

                          {/* Status Indicator Badges */}
                          {isApproved && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                              <Check className="w-2 h-2 stroke-[3]" />
                            </div>
                          )}
                          {isRejected && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-100 dark:bg-rose-900 text-rose-600 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                              <X className="w-2 h-2 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-1 pr-3">
                          <p className={`text-xs font-black transition-colors ${isRejected ? 'text-rose-600' : isApproved ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                            {step.name}
                          </p>

                          {details?.timeStamp ? (
                            <div className="flex items-center gap-1.5 py-0.5">
                              <Clock className="w-2.5 h-2.5 text-slate-400" />
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                {new Date(details.timeStamp).toLocaleString('en-US', {
                                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                              </p>
                            </div>
                          ) : (
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tight italic">Waiting for review...</p>
                          )}

                          {details?.remarks && (
                            <div className={`mt-2 p-3 rounded-xl border text-[10px] font-medium leading-relaxed max-w-md relative ${isRejected ? 'bg-rose-50/50 border-rose-100 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400' :
                              'bg-slate-50 border-slate-100 text-slate-500 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-400'
                              }`}>
                              <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-full ${isRejected ? 'bg-rose-400' : 'bg-slate-300'}`} />
                              <span className="pl-2 block">{details.remarks}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={`shrink-0 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all h-fit ${isApproved ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-800' :
                        isRejected ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:border-rose-800' :
                          'bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800 dark:border-slate-700'
                        }`}>
                        {details?.status ?? 'pending'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. QUICK ACTIONS */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white px-2 tracking-tight">Management Suite</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: 'New Request', desc: 'Initialize vetting workflow', icon: FileUp, color: 'bg-indigo-600', link: '/student/clearance', btn: 'Start Now' },
                { title: 'Registry Vault', desc: 'Archive of past approvals', icon: History, color: 'bg-slate-900', link: '/student/clearance-history', btn: 'View History' },
                { title: 'Identity Hub', desc: 'Security & Profile settings', icon: User, color: 'bg-emerald-500', link: '/student/profile', btn: 'Configure' },
              ].map((action) => (
                <div key={action.title} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col justify-between min-h-[200px]">
                  <div className="space-y-5">
                    <div className={`w-12 h-12 rounded-[18px] ${action.color} text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-slate-900 dark:text-slate-50 tracking-tight leading-none">{action.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">{action.desc}</p>
                    </div>
                  </div>
                  <button onClick={() => navigate(action.link)} className="mt-5 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:gap-3 transition-all">
                    {action.btn} <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4. CLEARANCE HISTORY SECTION */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Vetting History Ledger</h3>
              <Link to="/student/clearance-history" className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                Expand Full Registry <ChevronRight className="w-2.5 h-2.5" />
              </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-50 dark:divide-slate-800">
              {recentHistory.map((hist) => (
                <div
                  key={hist.id}
                  onClick={() => navigate(`/student/clearance/${hist.id}`)}
                  className="p-6 flex flex-col md:flex-row items-center justify-between gap-5 group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-700 transition-all group-hover:scale-110 group-hover:text-indigo-500">
                      <History className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-900 dark:text-white leading-none">Cycle: {hist.year} • {hist.semester}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Identifier: REQ-{hist.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Final Status</p>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                        {hist.status}
                      </span>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Completed</p>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400">{hist.date}</p>
                    </div>
                    <button className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. SIDEBAR INTELLIGENCE */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[36px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <ShieldCheck className="w-24 h-24" />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <AlertCircle className="w-3 h-3" /> Protocol Alerts
              </h3>
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
            </div>

            <div className="space-y-5 relative z-10">
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] border border-slate-100 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">Overdue Assets</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">3 books must be returned to the library immediately. Failure will block registrar sign-off.</p>
              </div>

              <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-[24px] border border-emerald-100 dark:border-emerald-800/40 space-y-2">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">Dept. Success</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">Software Engineering department has approved your academic portfolio for graduation.</p>
              </div>
            </div>

            <button className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100 active:scale-95">
              Download Procedure PDF
            </button>
          </div>

          <div className="bg-slate-900 p-8 rounded-[36px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Layers className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-5">
              <div className="space-y-2">
                <h4 className="text-xl font-black tracking-tight leading-none">Audit Support</h4>
                <p className="text-xs text-white/50 font-medium leading-relaxed">
                  Direct encrypted communication with the University Registry for technical dispute resolution.
                </p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-[18px] text-[9px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95">
                Live Session Chat <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
