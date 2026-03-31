// import React from "react";
// import { Users2, BookOpen, Coffee, Shield, ClipboardList } from "lucide-react";
// import { StaffRoles } from "../../../../types/dashboard";
// interface StaffRolesCardProps {
//   roles?: StaffRoles;
// }

// interface RoleInfo {
//   icon: React.ReactNode;
//   label: string;
//   color: string;
// }

// const StaffRolesCard: React.FC<StaffRolesCardProps> = ({ roles }) => {
//   const roleInfo: Record<keyof StaffRoles, RoleInfo> = {
//     department_head: {
//       icon: <Users2 className="h-5 w-5" />,
//       label: "Department Heads",
//       color: "text-blue-600 bg-blue-100",
//     },
//     library: {
//       icon: <BookOpen className="h-5 w-5" />,
//       label: "Library Staff",
//       color: "text-purple-600 bg-purple-100",
//     },
//     cafeteria: {
//       icon: <Coffee className="h-5 w-5" />,
//       label: "Cafeteria Staff",
//       color: "text-amber-600 bg-amber-100",
//     },
//     proctor: {
//       icon: <Shield className="h-5 w-5" />,
//       label: "Proctors",
//       color: "text-emerald-600 bg-emerald-100",
//     },
//     registrar: {
//       icon: <ClipboardList className="h-5 w-5" />,
//       label: "Registrars",
//       color: "text-rose-600 bg-rose-100",
//     },
//   };

//   return (
//     <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">
//         Staff Distribution
//       </h2>
//       <div className="space-y-4">
//         {(Object.entries(roles ?? {}) as [keyof StaffRoles, number][]).map(
//           ([role, count]) => (
//             <div key={role} className="flex items-center justify-between">
//               <div className="flex items-center space-x-3 ">
//                 <div className={`p-2 rounded-lg ${roleInfo[role].color}`}>
//                   {roleInfo[role].icon}
//                 </div>
//                 <span className="text-sm font-medium text-gray-700">
//                   {roleInfo[role].label}
//                 </span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-lg font-semibold text-gray-900">
//                   {count}
//                 </span>
//                 <span className="ml-1 text-sm text-gray-500">members</span>
//               </div>
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default StaffRolesCard;

import React from 'react';
import { Users2, BookOpen, Coffee, Shield, ClipboardList } from 'lucide-react';
import { StaffRoles } from '../../../../types/dashboard';

interface StaffDistributionProps {
  roles?: StaffRoles;
}

const StaffDistribution: React.FC<StaffDistributionProps> = ({ roles }) => {
  const roleInfo = [
    { key: 'department_head', icon: Users2, label: 'Dept. Heads', color: 'bg-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400' },
    { key: 'library', icon: BookOpen, label: 'Librarians', color: 'bg-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-600 dark:text-violet-400' },
    { key: 'cafeteria', icon: Coffee, label: 'Food Service', color: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400' },
    { key: 'proctor', icon: Shield, label: 'Proctors', color: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400' },
    { key: 'registrar', icon: ClipboardList, label: 'Registrars', color: 'bg-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-600 dark:text-rose-400' },
  ];

  const total = roles 
    ? (Object.values(roles) as number[]).reduce((acc, curr) => acc + curr, 0) 
    : 0;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-6 uppercase tracking-wider">Operational Staffing</h2>
      <div className="space-y-5">
        {roleInfo.map((role) => {
          const count = roles?.[role.key as keyof StaffRoles] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          
          return (
            <div key={role.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${role.bg}`}>
                    <role.icon className={`w-4 h-4 ${role.text}`} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{role.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-50">{count}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">PAX</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${role.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StaffDistribution;
