import React, { useState } from "react";
import {
  X,
  Plus,
  Edit2,
  Building2,
  UserPlus,
  ShieldCheck,
  Mail,
  Lock,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Department } from "@/types/department";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateDepartmentModal: React.FC<
  ModalProps & { collegeOptions: string[] }
> = ({ isOpen, onClose, onSuccess, collegeOptions }) => {
  const [loading, setLoading] = useState(false);
  const [isNewCollege, setIsNewCollege] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    headName: "",
    headEmail: "",
    headPassword: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl relative z-10 overflow-hidden animate-slide-up transition-all max-h-[90vh] flex flex-col">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                Register Unit
              </h3>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">
                Academic Provisioning Workflow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-10 overflow-y-auto scrollbar-hide space-y-8"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Department Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
                  placeholder="e.g., Software Engineering"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  Parent College
                </label>
                <button
                  type="button"
                  onClick={() => setIsNewCollege(!isNewCollege)}
                  className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest"
                >
                  {isNewCollege ? "Select Existing" : "+ Register New"}
                </button>
              </div>
              {isNewCollege ? (
                <input
                  required
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
                  placeholder="Enter new college name..."
                  value={formData.college}
                  onChange={(e) =>
                    setFormData({ ...formData, college: e.target.value })
                  }
                />
              ) : (
                <select
                  required
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 appearance-none cursor-pointer"
                  value={formData.college}
                  onChange={(e) =>
                    setFormData({ ...formData, college: e.target.value })
                  }
                >
                  <option value="">Choose College...</option>
                  {collegeOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-50 dark:bg-violet-950/40 text-violet-600 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                Leadership Assignment
              </h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserPlus className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-slate-900 dark:text-slate-100"
                    placeholder="Dr. John Doe"
                    value={formData.headName}
                    onChange={(e) =>
                      setFormData({ ...formData, headName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-slate-900 dark:text-slate-100"
                      placeholder="head@uni.edu"
                      value={formData.headEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, headEmail: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Temporary Secret
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-slate-900 dark:text-slate-100"
                      placeholder="••••••••"
                      value={formData.headPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          headPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all"
          >
            Abort
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] px-8 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Finalize Registration"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const EditDepartmentModal: React.FC<
  ModalProps & { department: Department }
> = ({ isOpen, onClose, onSuccess, department }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: department.department,
    college: department.college,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg relative z-10 animate-slide-up transition-all overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white">
              <Edit2 className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              Modify Registry
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Department Label
            </label>
            <input
              required
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Affiliated College
            </label>
            <input
              required
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
              value={formData.college}
              onChange={(e) =>
                setFormData({ ...formData, college: e.target.value })
              }
            />
          </div>
        </form>

        <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-8 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-sm font-black text-slate-600 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] px-8 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Commit Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const DeleteDepartmentDialog: React.FC<
  ModalProps & { department: Department }
> = ({ isOpen, onClose, onSuccess, department }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl p-10 max-w-md w-full relative z-10 animate-fade-in text-center">
        <div className="w-24 h-24 rounded-[32px] bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center mb-8 mx-auto border border-rose-100 dark:border-rose-900/30">
          <AlertTriangle className="w-12 h-12 text-rose-500" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
          Purge Unit Registry?
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10 font-medium">
          Confirming will permanently excise the{" "}
          <span className="text-slate-900 dark:text-slate-100 font-bold">
            {department.department}
          </span>{" "}
          unit and its history from the institutional matrix.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="px-6 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-sm font-black text-slate-600"
          >
            Abort
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-4 bg-rose-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-rose-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Confirm Purge"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
