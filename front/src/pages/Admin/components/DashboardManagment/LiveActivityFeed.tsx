
import React from 'react';
import { UserCheck, UserPlus, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

const activities = [
  { id: 1, user: "Abel Tsegaye", action: "initiated clearance", time: "2 mins ago", icon: UserPlus, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/40" },
  { id: 2, user: "Dr. Kebede", action: "approved Software Eng.", time: "12 mins ago", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
  { id: 3, user: "System", action: "archived 2024 Cycle", time: "1 hr ago", icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/40" },
  { id: 4, user: "Marta Bekele", action: "completed registration", time: "2 hrs ago", icon: UserCheck, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/40" },
  { id: 5, user: "Library Dept", action: "flagged 12 items", time: "4 hrs ago", icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40" }
];

const LiveActivityFeed: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col transition-colors">
      <div className="flex items-center justify-between mb-6">
         <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Operational Pulse</h3>
         <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live Stream</span>
         </div>
      </div>

      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item.id} className="flex gap-3 group cursor-pointer">
             <div className={`w-8 h-8 shrink-0 rounded-lg ${item.bg} ${item.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                <item.icon className="w-4 h-4" />
             </div>
             <div className="space-y-0.5 border-b border-slate-50 dark:border-slate-800 pb-3 w-full last:border-0 group-hover:border-indigo-100 transition-colors">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  <span className="text-slate-900 dark:text-white">{item.user}</span> {item.action}
                </p>
                <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">{item.time}</p>
             </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full py-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 shadow-sm">
        View Complete Audit
      </button>
    </div>
  );
};

export default LiveActivityFeed;
