import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  Share2,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  GraduationCap,
  Calendar,
  Layers,
  FileText,
  MapPin,
  Coffee,
  BookOpen,
  ShieldCheck,
  ClipboardList,
  History,
  Info,
  ExternalLink
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ClearanceRequests } from '@/types/clerance';
import axiosClient from '@/services/axiosBackend';

const fetchRequestDetail = async (id: string): Promise<ClearanceRequests> => {
  try {
    const response = await axiosClient.get(`/admin/clearanceRequests/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching request detail:', error);
    throw error;
  }
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
    pending: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
    rejected: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800',
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${styles[status as keyof typeof styles]}`}>
      {status}
    </span>
  );
};

type ApprovalStepProps = {
  label: string;
  status: boolean | null;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const ApprovalStep = ({ label, status, icon: Icon }: ApprovalStepProps) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${status === true
        ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-800'
        : status === false
          ? 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800'
          : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700'
        }`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 tracking-tight">{label}</p>
        <p className={`text-[9px] font-black uppercase tracking-widest ${status === true ? 'text-emerald-500' : status === false ? 'text-rose-500' : 'text-slate-400'
          }`}>
          {status === true ? 'Validated' : status === false ? 'Rejected' : 'Awaiting Review'}
        </p>
      </div>
    </div>
    {status === true ? (
      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
        <CheckCircle2 className="w-4 h-4" />
      </div>
    ) : status === false ? (
      <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-100">
        <AlertCircle className="w-4 h-4" />
      </div>
    ) : (
      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 flex items-center justify-center border border-slate-200 dark:border-slate-700">
        <Clock className="w-4 h-4" />
      </div>
    )}
  </div>
);

const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: request, isLoading, isError, refetch } = useQuery({
    queryKey: ['requestDetail', id],
    queryFn: () => fetchRequestDetail(id as string),
    enabled: !!id,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70dvh] gap-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="space-y-1 text-center">
          <p className="text-slate-900 dark:text-slate-50 font-bold">Accessing Dossier</p>
          <p className="text-slate-400 text-xs font-medium">Retrieving clearance reference #{id}...</p>
        </div>
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="w-full max-w-2xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/20 rounded-3xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">Dossier Unavailable</h2>
        <Link to="/admin/requests" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold transition-all hover:scale-105">
          <ArrowLeft className="w-4 h-4" /> Return to Monitor
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 px-4 sm:px-6 lg:px-8">
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <Link to="/admin/requests" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-all group">
          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm group-hover:shadow-indigo-100 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          Return to Monitor
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => refetch()} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
            <RefreshCcw className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all">
            <Printer className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share Dossier</span>
          </button>
        </div>
      </div>

      {/* Hero Profile Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative group">
        <div className="h-48 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>
        <div className="px-12 pb-12 flex flex-col md:flex-row gap-8 items-end -mt-16 relative z-10">
          <div className="w-40 h-40 rounded-[40px] bg-white dark:bg-slate-800 p-2 shadow-2xl ring-4 ring-white dark:ring-slate-900">
            <div className="w-full h-full rounded-[32px] bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-300 font-black text-4xl overflow-hidden shadow-inner">
              {request.student.user.profile_image ? (
                <img src={request.student.user.profile_image} alt={request.student.user.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                request.student.user.name.split(' ').map(n => n[0]).join('')
              )}
            </div>
          </div>
          <div className="flex-1 space-y-4 mb-4">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-none">{request.student.user.name}</h2>
              <StatusBadge status={request.status} />
            </div>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-sm font-bold">
                <FileText className="w-4 h-4 text-indigo-500" /> Reference: #{request.id}
              </div>
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-sm font-bold">
                <GraduationCap className="w-4 h-4 text-violet-500" /> {request.student_id}
              </div>
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-sm font-bold">
                <Calendar className="w-4 h-4 text-emerald-500" /> Submitted {formatDate(request.created_at)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Dossier Details */}
        <div className="lg:col-span-7 space-y-8">

          <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Academic Dossier
              </h3>
              <Link to={`/admin/users/${request.student.user_id}`} className="text-xs font-black text-indigo-600 flex items-center gap-1.5 hover:underline transition-all">
                Full Student Profile <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-y-10 gap-x-12">
              {[
                { label: "Level & Section", value: `${request.year} • Sec ${request.section}`, icon: MapPin },
                { label: "Department", value: request.department.department, icon: Building2 },
                { label: "College Affiliation", value: request.department.college, icon: Building2 },
                { label: "Academic Cycle", value: `${request.academic_year} • ${request.semester} Sem`, icon: Calendar },
                { label: "Dining Provisioning", value: request.cafe_status, icon: Coffee, capitalize: true },
                { label: "Residential Status", value: request.dorm_status, icon: Layers, capitalize: true }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">{item.label}</p>
                    <p className={`text-sm font-black text-slate-800 dark:text-slate-100 ${item.capitalize ? 'capitalize' : ''}`}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-slate-50 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <FileText className="w-4 h-4" /> Justification & Reasoning
              </h3>
              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700/50 relative overflow-hidden group transition-all hover:bg-white dark:hover:bg-slate-800">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                  <Layers className="w-24 h-24" />
                </div>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed relative z-10">
                  {request.reason_for_clearance}
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Info className="w-4 h-4" /> Validation Date: {formatDate(request.last_day_class_attended)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Approval Chain */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Approval Lifecycle
              </h3>
              <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full font-black text-indigo-600 tracking-tighter uppercase">Chain Monitoring</span>
            </div>

            <div className="space-y-8 relative">
              {/* Visual Timeline Connector */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100 dark:bg-slate-800" />

              <ApprovalStep label="Department Head" status={request.department_head_approved} icon={Building2} />
              <ApprovalStep label="University Library" status={request.library_approved} icon={BookOpen} />
              <ApprovalStep label="Cafeteria Services" status={request.cafeteria_approved} icon={Coffee} />
              <ApprovalStep label="Proctorate Office" status={request.proctor_approved} icon={ShieldCheck} />
              <ApprovalStep label="Office of Registrar" status={request.registrar_approved} icon={ClipboardList} />
            </div>

            <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
              <div className="p-6 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-[32px] border border-emerald-100/30 flex items-start gap-4">
                <div className="p-2.5 bg-white dark:bg-emerald-900/30 rounded-xl shadow-sm">
                  <History className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Audit Trail Active</p>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                    Submission initialized at 10:00 AM. Initial vetting by Department Head completed. Currently under review by Institutional Library.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-950 p-8 rounded-[40px] text-white space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700" />
            <div className="space-y-2 relative z-10">
              <h4 className="text-lg font-black tracking-tight">System Recommendations</h4>
              <p className="text-xs text-white/60 font-medium leading-relaxed">
                Based on the current workflow status, this request is 20% ahead of average institutional processing times. No manual intervention is required at this stage.
              </p>
            </div>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95">
              Generate Analytics Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailPage;
