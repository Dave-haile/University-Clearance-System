import React from "react";
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  School,
  Send,
  CheckCheckIcon,
  Clock,
  Ban,
} from "lucide-react";
import { GoogleLoader } from "../../../../components/ui/GoogleLoder";

interface SummaryCardProps {
  title: string;
  value: string | number | React.ReactNode | null;
  type:
    | "users"
    | "students"
    | "staff"
    | "departments"
    | "colleges"
    | "approved"
    | "pending"
    | "rejected"
    | "total";
  isloading: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  type,
  isloading,
}) => {
  const getIcon = () => {
    switch (type) {
      case "users":
        return <Users className="h-8 w-8 text-blue-500" />;
      case "students":
        return <GraduationCap className="h-8 w-8 text-indigo-500" />;
      case "staff":
        return <Users className="h-8 w-8 text-[#6b6a69]" />;
      case "departments":
        return <Building2 className="h-8 w-8 text-orange-500" />;
      case "colleges":
        return <School className="h-8 w-8 text-purple-500" />;
      case "total":
        return <Send className="h-8 w-8 text-yellow-500 " />;
      case "approved":
        return <CheckCheckIcon className="h-8 w-8 text-green-500" />;
      case "pending":
        return <Clock className="h-8 w-8 text-[#a7ced1] "/>;
      case "rejected":
        return <Ban className="h-8 w-8 text-red-400" />;
      default:
        return <BookOpen className="h-8 w-8 text-gray-500" />;
    }
  };

  const getCardStyle = () => {
    switch (type) {
      case "users":
        return "bg-blue-50 border-blue-200";
      case "students":
        return "bg-indigo-50 border-indigo-200";
      case "staff":
        return "bg-[#F1EFEC] border-[#bebdbb]";
      case "departments":
        return "bg-orange-50 border-orange-200";
      case "colleges":
        return "bg-purple-50 border-purple-200";
      case "total":
        return "bg-yellow-50 border-yellow-200";
      case "approved":
        return "bg-green-50 border-green-200";
      case "pending":
        return "bg-[#beebf0] border-[#a7ced1]";
      case "rejected":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div
      className={`p-6 rounded-2xl border ${getCardStyle()} transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <div className="text-3xl font-bold text-gray-800">
            {isloading ? <GoogleLoader /> : value?.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-full bg-white shadow-sm">{getIcon()}</div>
      </div>
    </div>
  );
};

export default SummaryCard;
