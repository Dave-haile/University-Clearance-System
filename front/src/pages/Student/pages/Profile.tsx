import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User as UserIcon, 
  Shield,
  Key,
  Mail,
  Camera,
  ArrowLeft,
  Save,
  Smartphone,
  CheckCircle2,
  Loader2,
  Building2,
  GraduationCap,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/services/axiosBackend";
import { User } from "@/types/user";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { queryClient } from "@/lib/queryClient";

interface StudentProfileProps {
  userData?: User | null;
  onRefresh: () => Promise<void>;
}

export default function Profile() {
  const profileFetch = async (): Promise<User> => {
    const response = await axiosClient.get("/student/profile/show");
    return response.data;
  };

  const {
    data,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.student.profile,
    queryFn: profileFetch,
  });

  const handleRefresh = async () => {
    await refetch();
  };

  if (loading && !data) {
    return (
      // <MainLayout>
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Loading your profile data</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
          <div className="animate-pulse bg-slate-900 h-24 w-24 rounded-full" />
          </CardContent>
        </Card>
      // </MainLayout>
    );
  }
  return (
    // <MainLayout>
    <StudentProfile userData={data} onRefresh={handleRefresh} />
    // </MainLayout>
  );
}

function StudentProfile({ userData, onRefresh }: StudentProfileProps) {
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    username: userData?.username || "",
    email: userData?.email || "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    oldPassword: "",
    new_password: "",
    new_password_confirmation: "",
    profileImage: null as File | null,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: userData?.name || "",
      username: userData?.username || "",
      email: userData?.email || "",
    }));
  }, [userData]);

  const updateProfileMutation = useMutation({
    mutationFn: async (form: FormData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/student/profile/update`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.student.profile }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.student.dashboard,
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.student.allData }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.student.clearanceHistory,
        }),
      ]);
      toast.success("Your profile information has been updated successfully.");
      await onRefresh();
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast.error("There was a problem updating your profile.");
    },
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword || formData.currentPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        toast.error("Please enter your current password");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New password and confirmation must match.");
        return;
      }

      if (formData.newPassword && formData.newPassword.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
      }
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("oldPassword", formData.currentPassword);
    form.append("newPassword", formData.newPassword);
    form.append("confirmPassword", formData.confirmPassword);

    if (formData.profileImage) {
      form.append("profileImage", formData.profileImage);
    }

    updateProfileMutation.mutate(form);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center gap-6">
        <Link to="/student/dashboard" className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-none">Identity Hub</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Professional Profile & Security</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative group">
        <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-600" />
        <div className="px-10 pb-10 flex flex-col md:flex-row items-end gap-8 -mt-12 relative z-10">
          <div className="relative group/avatar">
            <div className="w-32 h-32 rounded-[32px] bg-white dark:bg-slate-800 p-2 shadow-2xl ring-4 ring-white dark:ring-slate-900">
              <div className="w-full h-full rounded-[24px] bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-300 font-black text-3xl overflow-hidden shadow-inner">
                {userData?.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <button className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all active:scale-90 border-4 border-white dark:border-slate-900">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 space-y-2 mb-4">
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">{userData?.name}</h2>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" /> {userData?.student?.department?.department}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-500" /> Level: {userData?.student?.year}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-800">Account Verified</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Personal Data */}
        <div className="lg:col-span-7">
          <form onSubmit={handleUpdate} className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-sm p-10 lg:p-14 space-y-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-xl">
                <UserIcon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Personal Identification</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                <input
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work/Institutional Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      disabled
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-400 opacity-70"
                      value={formData.email}
                    />
                  </div>
                </div>
                    <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                    </div>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-50 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-xl">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Security Credentials</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Active Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-rose-500/10 transition-all"
                    placeholder="••••••••"
                    value={formData.currentPassword}
                    onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                  />
                    </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Policy Password</label>
                  <input
                    type="password"
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                  />
                </div>
                    <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Policy</label>
                  <input
                    type="password"
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                    </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="w-full py-5 bg-indigo-600 text-white rounded-[24px] text-base font-black shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Commit to Institutional Vault</>}
            </button>
          </form>
        </div>

        {/* Right Column: Metadata & Activity */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> System Telemetry
            </h3>

            <div className="space-y-6">
              {[
                { label: 'Portal Username', value: userData?.username, icon: UserIcon },
                { label: 'Institutional ID', value: userData?.student?.student_id, icon: GraduationCap },
                { label: 'Account Created', value: new Date(userData?.created_at || '').toLocaleDateString(), icon: Calendar },
                { label: 'Last Registry Sync', value: 'Today, 10:45 AM', icon: Smartphone },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-700">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">{item.label}</div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-100">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-10 bg-slate-900 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 transition-transform duration-700 group-hover:rotate-0">
              <Shield className="w-32 h-32" />
            </div>
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <h4 className="text-xl font-black tracking-tight leading-none">Security Protocol</h4>
                <p className="text-xs text-white/40 font-medium leading-relaxed">
                  Your account is currently protected by 256-bit institutional encryption. Password rotation is recommended every 90 days to maintain clearance eligibility.
                </p>
              </div>
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 transition-all">
                Audit Login History
              </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
