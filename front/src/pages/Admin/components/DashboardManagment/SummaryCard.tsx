// import React from "react";
// import {
//   Users,
//   GraduationCap,
//   Building2,
//   BookOpen,
//   School,
//   Send,
//   CheckCheckIcon,
//   Clock,
//   Ban,
// } from "lucide-react";
// import { GoogleLoader } from "../../../../components/ui/GoogleLoder";

// interface SummaryCardProps {
//   title: string;
//   value: string | number | React.ReactNode | null;
//   type:
//     | "users"
//     | "students"
//     | "staff"
//     | "departments"
//     | "colleges"
//     | "approved"
//     | "pending"
//     | "rejected"
//     | "total";
//   isloading: boolean;
// }

// const SummaryCard: React.FC<SummaryCardProps> = ({
//   title,
//   value,
//   type,
//   isloading,
// }) => {
//   const getIcon = () => {
//     switch (type) {
//       case "users":
//         return <Users className="h-8 w-8 text-blue-500" />;
//       case "students":
//         return <GraduationCap className="h-8 w-8 text-indigo-500" />;
//       case "staff":
//         return <Users className="h-8 w-8 text-[#6b6a69]" />;
//       case "departments":
//         return <Building2 className="h-8 w-8 text-orange-500" />;
//       case "colleges":
//         return <School className="h-8 w-8 text-purple-500" />;
//       case "total":
//         return <Send className="h-8 w-8 text-yellow-500 " />;
//       case "approved":
//         return <CheckCheckIcon className="h-8 w-8 text-green-500" />;
//       case "pending":
//         return <Clock className="h-8 w-8 text-[#a7ced1] "/>;
//       case "rejected":
//         return <Ban className="h-8 w-8 text-red-400" />;
//       default:
//         return <BookOpen className="h-8 w-8 text-gray-500" />;
//     }
//   };

//   const getCardStyle = () => {
//     switch (type) {
//       case "users":
//         return "bg-blue-50 border-blue-200";
//       case "students":
//         return "bg-indigo-50 border-indigo-200";
//       case "staff":
//         return "bg-[#F1EFEC] border-[#bebdbb]";
//       case "departments":
//         return "bg-orange-50 border-orange-200";
//       case "colleges":
//         return "bg-purple-50 border-purple-200";
//       case "total":
//         return "bg-yellow-50 border-yellow-200";
//       case "approved":
//         return "bg-green-50 border-green-200";
//       case "pending":
//         return "bg-[#beebf0] border-[#a7ced1]";
//       case "rejected":
//         return "bg-red-50 border-red-200";
//       default:
//         return "bg-gray-50 border-gray-200";
//     }
//   };

//   return (
//     <div
//       className={`p-6 rounded-2xl border ${getCardStyle()} transition-all duration-300 hover:shadow-md`}
//     >
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
//           <div className="text-3xl font-bold text-gray-800">
//             {isloading ? <GoogleLoader /> : value?.toLocaleString()}
//           </div>
//         </div>
//         <div className="p-3 rounded-full bg-white shadow-sm">{getIcon()}</div>
//       </div>
//     </div>
//   );
// };

// export default SummaryCard;

import React from 'react';
import { 
  Users, GraduationCap, Building2, Send, CheckCircle2, 
  Clock, AlertCircle, ArrowUpRight, ArrowDownRight, School
} from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number | undefined;
  trend?: string;
  positive?: boolean;
  type: 'users' | 'students' | 'staff' | 'departments' | 'colleges' | 'approved' | 'pending' | 'rejected' | 'total';
  loading: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, trend, positive, type, loading }) => {
  const getIcon = () => {
    switch (type) {
      case 'students': return <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'staff': return <Users className="w-6 h-6 text-violet-600 dark:text-violet-400" />;
      case 'colleges': return <School className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      case 'departments': return <Building2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />;
      case 'approved': return <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'pending': return <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'rejected': return <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      case 'total': return <Send className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
      default: return <Users className="w-6 h-6 text-slate-600 dark:text-slate-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'students': return 'bg-indigo-50/50 dark:bg-indigo-950/20';
      case 'staff': return 'bg-violet-50/50 dark:bg-violet-950/20';
      case 'colleges': return 'bg-purple-50/50 dark:bg-purple-950/20';
      case 'departments': return 'bg-orange-50/50 dark:bg-orange-950/20';
      case 'approved': return 'bg-emerald-50/50 dark:bg-emerald-950/20';
      case 'pending': return 'bg-amber-50/50 dark:bg-amber-950/20';
      case 'rejected': return 'bg-rose-50/50 dark:bg-rose-950/20';
      case 'total': return 'bg-sky-50/50 dark:bg-sky-950/20';
      default: return 'bg-slate-50/50 dark:bg-slate-800/50';
    }
  };

  return (
    <div className={`group p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-indigo-950/20 hover:-translate-y-1 relative overflow-hidden`}>
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded"></div>
          ) : (
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
              {value?.toLocaleString() || '0'}
            </h3>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${getBgColor()} transition-colors group-hover:bg-white dark:group-hover:bg-slate-800 border border-transparent group-hover:border-slate-100 dark:group-hover:border-slate-700 shadow-sm`}>
          {getIcon()}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-1.5">
          <span className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${positive ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40' : 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40'}`}>
            {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.split(' ')[0]}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {trend.split(' ').slice(1).join(' ')}
          </span>
        </div>
      )}

      {/* Decorative circle */}
      <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-[0.03] dark:opacity-[0.01] group-hover:opacity-[0.08] dark:group-hover:opacity-[0.05] transition-opacity ${getBgColor().replace('/50', '')}`}></div>
    </div>
  );
};

export default SummaryCard;
