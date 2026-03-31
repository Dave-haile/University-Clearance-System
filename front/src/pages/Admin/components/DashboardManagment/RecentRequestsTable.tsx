import React from 'react';
import { RecentRequest } from '../../../../types/dashboard';
import { Link } from 'react-router-dom';

const StatusBadge: React.FC<{ status: RecentRequest['status'] }> = ({ status }) => {
  const styles = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50',
    pending: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50',
    rejected: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50',
  };

  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
};

const RecentRequestsTable: React.FC<{ requests?: RecentRequest[] }> = ({ requests }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Clearance Submissions</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tracking live student clearance progressions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/clearance-requests">
            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl transition-colors">
              View All
            </button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Student</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Academic Year</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Step</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {requests?.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs uppercase transition-colors">
                      {req.student.user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">{req.student.user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-mono">{req.student_id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{req.year}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-tight">AY: {req.academic_year}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wide">
                    {req.current_step.replace('_', ' ')}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={req.status} />
                </td>
                {/* <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentRequestsTable;
