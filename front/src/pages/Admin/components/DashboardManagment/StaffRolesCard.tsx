import React from "react";
import { Users2, BookOpen, Coffee, Shield, ClipboardList } from "lucide-react";
import { StaffRoles } from "../../../../types/dashboard";
interface StaffRolesCardProps {
  roles?: StaffRoles;
}

interface RoleInfo {
  icon: React.ReactNode;
  label: string;
  color: string;
}

const StaffRolesCard: React.FC<StaffRolesCardProps> = ({ roles }) => {
  const roleInfo: Record<keyof StaffRoles, RoleInfo> = {
    department_head: {
      icon: <Users2 className="h-5 w-5" />,
      label: "Department Heads",
      color: "text-blue-600 bg-blue-100",
    },
    library: {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Library Staff",
      color: "text-purple-600 bg-purple-100",
    },
    cafeteria: {
      icon: <Coffee className="h-5 w-5" />,
      label: "Cafeteria Staff",
      color: "text-amber-600 bg-amber-100",
    },
    proctor: {
      icon: <Shield className="h-5 w-5" />,
      label: "Proctors",
      color: "text-emerald-600 bg-emerald-100",
    },
    registrar: {
      icon: <ClipboardList className="h-5 w-5" />,
      label: "Registrars",
      color: "text-rose-600 bg-rose-100",
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Staff Distribution
      </h2>
      <div className="space-y-4">
        {(Object.entries(roles ?? {}) as [keyof StaffRoles, number][]).map(
          ([role, count]) => (
            <div key={role} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 ">
                <div className={`p-2 rounded-lg ${roleInfo[role].color}`}>
                  {roleInfo[role].icon}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {roleInfo[role].label}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-900">
                  {count}
                </span>
                <span className="ml-1 text-sm text-gray-500">members</span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default StaffRolesCard;
