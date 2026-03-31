import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { User } from "@/types/user";
import { ClearanceRequest } from "@/types";
import axiosClient from "@/services/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RefreshCcw,
  History,
  ArrowLeft,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Building2,
  Search,
  Filter,
  ExternalLink,
  BookOpen,
  Coffee,
  ShieldCheck,
  ClipboardList,
  Check,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ClearanceHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const fetchClearanceHistory = async (): Promise<User> => {
    const response = await axiosClient.get("/student/alldata");
    return response.data;
  };

  const {
    data: history,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.student.clearanceHistory,
    queryFn: fetchClearanceHistory,
  });
  if (loading) {
    return (
      <>
        <Card className="bg-slate-950">
          <CardHeader className="bg-slate-950">
            <CardTitle>
              <Skeleton className="h-8 w-60" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-5 w-full max-w-md" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    );
  }
  console.log(history);

  const clearanceRequests: ClearanceRequest[] = Array.isArray(
    history?.student?.clearance_requests,
  )
    ? history?.student?.clearance_requests
    : [];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-800';
      case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:border-rose-800';
      default: return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:border-amber-800';
    }
  };

  const filteredHistory = clearanceRequests.filter(
    (h) =>
      String(h.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(h.academic_year).includes(searchTerm),
  );

  if (clearanceRequests.length === 0) {
    return (
      <>
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-800">
              Clearance History
            </h2>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500">No clearance history found</p>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-6">
          <Link to="/student/dashboard" className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Clearance Archive</h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
              <History className="w-3 h-3 text-indigo-500" /> Historical Vetting Ledger
            </p>
          </div>
        </div>
        <button onClick={() => refetch()} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Query archive by Reference or Academic Year..."
            className="w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-3 focus:ring-indigo-500/10 transition-all text-slate-900 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative group">
            <Filter className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select className="pl-10 pr-6 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 appearance-none cursor-pointer">
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Grid */}
      <div className="space-y-6">
        {filteredHistory.length > 0 ? filteredHistory.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group hover:border-indigo-500/30 transition-all">
            <div className="p-6 md:p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
              {/* Meta Information */}
              <div className="flex items-center gap-5 min-w-[280px]">
                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border shadow-sm ${item.status === 'approved' ? 'bg-emerald-50 text-emerald-500 border-emerald-100 dark:bg-emerald-900/20' : 'bg-amber-50 text-amber-500 border-amber-100 dark:bg-amber-900/20'}`}>
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">REQ-{item.id}</p>
                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-tight">
                    <span>{item.academic_year} Cycle</span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span>{item.semester}</span>
                  </div>
                </div>
              </div>

              {/* Status Matrix with Timestamps */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  {
                    icon: Building2,
                    label: 'Dept',
                    field: 'department_head_approved' as const,
                  },
                  { icon: BookOpen, label: 'Lib', field: 'library_approved' as const },
                  {
                    icon: Coffee,
                    label: 'Cafe',
                    field: 'cafeteria_approved' as const,
                  },
                  { icon: ShieldCheck, label: 'Proc', field: 'proctor_approved' as const },
                  {
                    icon: ClipboardList,
                    label: 'Reg',
                    field: 'registrar_approved' as const,
                  },
                ].map((step, i) => {
                  const approvedValue = item[step.field];
                  const isApproved = approvedValue === true;
                  return (
                    <div
                      key={i}
                      className={`relative h-[80px] p-3 rounded-[24px] border transition-all flex flex-col items-center justify-center text-center ${isApproved ? 'bg-emerald-50/20 border-emerald-100/50 dark:bg-emerald-950/10 dark:border-emerald-800/40' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}
                    >
                      <div className={`p-2 rounded-xl mb-1.5 ${isApproved ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-none' : 'bg-white dark:bg-slate-900 text-slate-300 border border-slate-100 dark:border-slate-800'}`}>
                        <step.icon className="w-3 h-3" />
                      </div>

                      <span className={`text-[9px] font-black uppercase tracking-widest leading-none ${isApproved ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {step.label}
                      </span>

                      <p className={`mt-0.5 text-[8px] font-bold leading-none ${isApproved ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {isApproved ? 'Approved' : 'Pending'}
                      </p>
                      {isApproved && (
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                            <Check className="w-2 h-2" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 self-end xl:self-center">
                <div className="text-right hidden sm:block">
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Dossier Finalized</p>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => navigate(`/student/clearance/${item.id}`)}
                  className="p-4 bg-indigo-600 text-white rounded-[20px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none active:scale-95 group/btn"
                >
                  <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Sub-Card: Reason & Audit Artifacts */}
            <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                  <Calendar className="w-3 h-3 text-slate-300" />
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Primary Justification: <span className="text-slate-600 dark:text-slate-200 ml-2">{item.reason_for_clearance}</span>
                </p>
              </div>
              <div className="flex items-center gap-6">
                <button className="text-[8px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1 transition-all">
                  <ClipboardList className="w-2.5 h-2.5" /> Audit Artifact
                </button>
                <button className="text-[8px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest flex items-center gap-1 transition-all">
                  <ExternalLink className="w-2.5 h-2.5" /> External Registry Link
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-24 text-center space-y-3">
            <div className="w-20 h-20 rounded-[32px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mx-auto opacity-40">
              <History className="w-10 h-10 text-slate-300" />
            </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">No historical records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClearanceHistory;
