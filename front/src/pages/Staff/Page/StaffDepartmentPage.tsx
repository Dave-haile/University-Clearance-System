import React, { useMemo, useState } from "react";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Building2,
  GraduationCap,
  ArrowUpRight,
  Clock,
  UserPlus,
  Pencil,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/authContext";
import { useToast } from "@/components/ui/use-toast";
import axiosClient from "@/services/axiosBackend";
import { queryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { User } from "@/types/user";
import { deleteUser } from "@/pages/Admin/services/userDetailService";

type StudentFormState = {
  name: string;
  student_id: string;
  year: string;
};

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

const fetchDepartmentStudents = async (): Promise<User[]> => {
  const response = await axiosClient.get("/staff/students");
  return response.data;
};

type StaffProfile = {
  id: number;
  user_id: number;
  position: string;
  phone_number: string | null;
  department_id: number | null;
  role: string;
  created_at: string | null;
  updated_at: string | null;
  department?: {
    id: number;
    department: string;
    college: string;
    created_at: string | null;
    updated_at: string | null;
  } | null;
};

const fetchStaffProfile = async (): Promise<StaffProfile> => {
  try {
    const response = await axiosClient.get("/staff/me");
    return response.data;
  } catch {
    const response = await axiosClient.get("/staff/profile/show");
    return response.data?.staff ?? response.data;
  }
};

const getLatestClearance = (student: User) => {
  const requests = student.student?.clearance_requests;
  if (!Array.isArray(requests) || requests.length === 0) {
    return null;
  }
  return requests[0];
};

const getProgress = (student: User) => {
  const latest = getLatestClearance(student);
  if (!latest) return 0;

  const steps = [
    latest.department_head_approved,
    latest.library_approved,
    latest.cafeteria_approved,
    latest.proctor_approved,
    latest.registrar_approved,
  ];
  const applicableSteps =
    latest.cafe_status === "cafe"
      ? steps
      : steps.filter((_, index) => index !== 2);
  const completed = applicableSteps.filter((step) => step === true).length;
  return Math.round((completed / applicableSteps.length) * 100);
};

const getStatus = (student: User) => {
  return getLatestClearance(student)?.status ?? "pending";
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    approved:
      "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
    pending:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    rejected:
      "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm ${styles[status as keyof typeof styles] ?? styles.pending}`}
    >
      {status}
    </span>
  );
};

const StaffDepartmentPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<User | null>(null);
  const [formState, setFormState] = useState<StudentFormState>({
    name: "",
    student_id: "",
    year: "1st Year",
  });
  const itemsPerPage = 8;

  const { data: staffProfile } = useQuery({
    queryKey: queryKeys.staff.profile,
    queryFn: fetchStaffProfile,
    enabled: !!user,
  });

  const departmentId =
    staffProfile?.department_id ?? user?.staff?.department_id ?? null;
  const departmentName =
    staffProfile?.department?.department ??
    user?.staff?.department?.department ??
    user?.student?.department?.department ??
    "Department";
  const collegeName =
    staffProfile?.department?.college ??
    user?.staff?.department?.college ??
    "Assigned College";

  const {
    data: students = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.staff.students,
    queryFn: fetchDepartmentStudents,
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: StudentFormState) => {
      const response = await axiosClient.post("/create-student", {
        ...payload,
        department: departmentName,
      });
      return response.data as {
        message: string;
        username: string;
        password: string;
      };
    },
    onSuccess: (response) => {
      addToast({
        type: "success",
        title: "Student Created",
        message: `${response.message} Username: ${response.username} Password: ${response.password}`,
        duration: 8000,
      });
      setIsCreateOpen(false);
      setFormState({ name: "", student_id: "", year: "1st Year" });
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.staff.students }),
        queryClient.invalidateQueries({ queryKey: queryKeys.staff.dashboard }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.usersBase }),
      ]);
      refetch();
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Create Failed",
        message:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to create student.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      userId: number;
      values: StudentFormState;
    }) => {
      const response = await axiosClient.post(
        `/admin/users/${payload.userId}/update`,
        {
          name: payload.values.name,
          student: {
            student_id: payload.values.student_id,
            year: payload.values.year,
            department_id: departmentId,
          },
        },
      );
      return response.data as { message: string };
    },
    onSuccess: (response) => {
      addToast({
        type: "success",
        title: "Student Updated",
        message: response.message || "Student record updated successfully.",
      });
      setEditingStudent(null);
      setFormState({ name: "", student_id: "", year: "1st Year" });
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.staff.students }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.usersBase }),
      ]);
      refetch();
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Update Failed",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update student.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: number) => deleteUser(String(userId)),
    onSuccess: () => {
      addToast({
        type: "success",
        title: "Student Deleted",
        message: "The student account was deleted successfully.",
      });
      setDeletingStudent(null);
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.staff.students }),
        queryClient.invalidateQueries({ queryKey: queryKeys.staff.dashboard }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.usersBase }),
      ]);
      refetch();
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Delete Failed",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to delete student.",
      });
    },
  });

  const departmentStudents = useMemo(() => {
    if (!departmentId) return students;
    return students.filter(
      (student) => student.student?.department_id === departmentId,
    );
  }, [students, departmentId]);

  const filteredStudents = useMemo(() => {
    return departmentStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.student?.student_id ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [departmentStudents, searchTerm]);

  const totalPending = useMemo(() => {
    return departmentStudents.filter(
      (student) => getStatus(student) === "pending",
    ).length;
  }, [departmentStudents]);

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const openCreateModal = () => {
    setFormState({ name: "", student_id: "", year: "1st Year" });
    setIsCreateOpen(true);
  };

  const openEditModal = (student: User) => {
    setEditingStudent(student);
    setFormState({
      name: student.name,
      student_id: student.student?.student_id ?? "",
      year: student.student?.year ?? "1st Year",
    });
  };

  const closeModalState = () => {
    setIsCreateOpen(false);
    setEditingStudent(null);
    setDeletingStudent(null);
    setFormState({ name: "", student_id: "", year: "1st Year" });
  };

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100 dark:shadow-none">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">
              Department Management
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm ml-1">
            Managing student accounts for{" "}
            <span className="text-indigo-600 font-black">{departmentName}</span>{" "}
            in <span className="font-black">{collegeName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Clock className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100 dark:shadow-none"
          >
            <UserPlus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <div className="px-4 py-2 text-center border-r border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Total Students
          </p>
          <p className="text-xl font-black text-slate-900 dark:text-slate-50">
            {departmentStudents.length}
          </p>
        </div>
        <div className="px-4 py-2 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Pending Clearance
          </p>
          <p className="text-xl font-black text-indigo-600">{totalPending}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Query student records..."
            className="w-full pl-12 pr-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] animate-pulse"
              />
            ))
          : paginatedStudents.map((student) => {
              const progress = getProgress(student);
              const latest = getLatestClearance(student);
              return (
                <div
                  key={student.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 space-y-6 hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-none transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <GraduationCap className="w-24 h-24" />
                  </div>

                  <div className="flex items-start justify-between relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 p-0.5">
                      <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600 font-black text-lg">
                        {student.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                    </div>
                    <StatusBadge status={getStatus(student)} />
                  </div>

                  <div className="space-y-1 relative z-10">
                    <h3 className="text-lg font-black text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
                      {student.name}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {student.student?.student_id}
                    </p>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {student.student?.year ?? "N/A"}
                    </p>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Clearance Progress</span>
                      <span className="text-indigo-600">{progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">
                        {latest
                          ? new Date(latest.updated_at).toLocaleDateString()
                          : "No request yet"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(student)}
                        className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-xl hover:bg-amber-100 transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingStudent(student)}
                        className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-xl hover:bg-rose-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          latest &&
                          window.location.assign(`/staff/requests/${latest.id}`)
                        }
                        disabled={!latest}
                        className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {!isLoading && filteredStudents.length === 0 && (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tighter mb-2">
            No Students Found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Try refining your search parameters or add a new student to this
            department.
          </p>
        </div>
      )}

      {filteredStudents.length > itemsPerPage && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-2xl text-xs font-black transition-all ${currentPage === i + 1 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none" : "bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-600 border border-slate-200 dark:border-slate-800"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {(isCreateOpen || editingStudent) && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={closeModalState}
          />
          <div className="relative z-10 w-full max-w-xl rounded-[40px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50">
                  {editingStudent ? "Edit Student" : "Add Student"}
                </h3>
                <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {editingStudent
                    ? `Update the student record for ${editingStudent.name}.`
                    : `Create a new student in ${departmentName}.`}
                </p>
              </div>
              <button
                onClick={closeModalState}
                className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Full Name
                </label>
                <input
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-5 py-3.5 text-sm font-bold outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Student ID
                </label>
                <input
                  value={formState.student_id}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      student_id: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-5 py-3.5 text-sm font-bold outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Year
                </label>
                <select
                  value={formState.year}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, year: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-5 py-3.5 text-sm font-bold outline-none focus:border-indigo-500"
                >
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Assigned Department
                </p>
                <p className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                  {departmentName}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  onClick={closeModalState}
                  className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-6 py-3.5 text-sm font-black text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    editingStudent
                      ? updateMutation.mutate({
                          userId: editingStudent.id,
                          values: formState,
                        })
                      : createMutation.mutate(formState)
                  }
                  disabled={
                    isSaving ||
                    !formState.name.trim() ||
                    !formState.student_id.trim()
                  }
                  className="rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-black text-white disabled:opacity-50"
                >
                  {isSaving
                    ? "Saving..."
                    : editingStudent
                      ? "Save Changes"
                      : "Create Student"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deletingStudent && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={closeModalState}
          />
          <div className="relative z-10 w-full max-w-md rounded-[36px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl text-center">
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50">
              Delete Student
            </h3>
            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              This will permanently delete{" "}
              <span className="font-black">{deletingStudent.name}</span> and
              remove the account from this department.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                onClick={closeModalState}
                className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-6 py-3.5 text-sm font-black text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deletingStudent.id)}
                disabled={deleteMutation.isPending}
                className="rounded-2xl bg-rose-600 px-6 py-3.5 text-sm font-black text-white disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDepartmentPage;
