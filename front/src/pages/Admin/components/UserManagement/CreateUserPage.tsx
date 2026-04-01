import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserPlus,
  GraduationCap,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import StudentRegistrationForm from "./StudentRegistrationForm";
import StaffRegistrationForm from "./CreateAccount";

const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"student" | "staff">("student");

  const handleBack = () => {
    navigate("/admin/users");
  };

  const handleSuccess = () => {
    navigate("/admin/users");
  };

  //   can you make [@CreateUserPage.tsx](file:///D:/SummerSchool2/Clearance/front/src/pages/Admin/components/UserManagement/CreateUserPage.tsx) work, i want to create users from this page

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              Provision New Identity
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Register a new student or staff member into the institutional
              registry.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
          <UserPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            Identity Provisioning
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-slide-up transition-colors">
        {/* Classification Selector */}
        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="max-w-xs">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              Account Classification
            </label>
            <div className="relative">
              <select
                value={userType}
                onChange={(e) =>
                  setUserType(e.target.value as "student" | "staff")
                }
                className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-slate-100 outline-none appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
              >
                <option value="student">Student Account</option>
                <option value="staff">Staff Account</option>
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {userType === "student" ? (
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-violet-500" />
                )}
              </div>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 sm:p-10">
          <div className="mb-6">
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-50 tracking-tight">
              {userType === "student"
                ? "Student Registration"
                : "Staff Registration"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              {userType === "student"
                ? "Enter academic and personal details for the new student."
                : "Enter professional and departmental details for the new staff member."}
            </p>
          </div>

          <div key={userType} className="animate-fade-in">
            {userType === "student" ? (
              <StudentRegistrationForm
                onCancel={handleBack}
                onSuccess={handleSuccess}
              />
            ) : (
              <StaffRegistrationForm
                onCancel={handleBack}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
