import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Search,
  Filter,
  RefreshCcw,
  Mail,
  User as UserIcon,
  ExternalLink,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { User } from "@/types";
import CreateUserDialog from "../components/UserManagement/CreateUserDialog";
import axiosClient from "@/services/axiosBackend";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

type SortField = "name" | "email" | "created_at";
type SortDirection = "asc" | "desc";

const Users: React.FC = () => {
  const [loadingToastShown, setLoadingToastShown] = useState(false);
  const [error] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const navigate = useNavigate();

  const fetchUsers = async (): Promise<User[]> => {
    try {
      const data = await axiosClient.get("/admin/users");
      console.log(data.data);
      return data.data;
    } catch (err) {
      console.log("Error fetching users:", err);
      throw err;
    }
  };

  const {
    data: users = [],
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.usersBase,
    queryFn: fetchUsers,
  });

  const loading = isLoading || isFetching;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedUsers = useMemo(
    () =>
      users
        .filter((user) => {
          const searchStr = searchTerm.toLowerCase();
          const matchesSearch =
            user.name.toLowerCase().includes(searchStr) ||
            (user.email && user.email.toLowerCase().includes(searchStr)) ||
            (user.username &&
              user.username.toLowerCase().includes(searchStr)) ||
            (user.student?.student_id &&
              user.student.student_id.toLowerCase().includes(searchStr));
          const matchesRole = roleFilter === "all" || user.role === roleFilter;
          return matchesSearch && matchesRole;
        })
        .sort((a, b) => {
          let comparison = 0;
          if (sortField === "name") {
            comparison = a.name.localeCompare(b.name);
          } else if (sortField === "email") {
            const emailA = a.email || a.username || "";
            const emailB = b.email || b.username || "";
            comparison = emailA.localeCompare(emailB);
          } else if (sortField === "created_at") {
            comparison =
              new Date(a.created_at as string).getTime() -
              new Date(b.created_at as string).getTime();
          }
          return sortDirection === "asc" ? comparison : -comparison;
        }),
    [users, searchTerm, roleFilter, sortField, sortDirection],
  );

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const currentUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return (
        <ArrowUpDown className="w-3.5 h-3.5 ml-1.5 text-slate-400 opacity-50" />
      );
    return sortDirection === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5 ml-1.5 text-indigo-500" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 ml-1.5 text-indigo-500" />
    );
  };

  useEffect(() => {
    if (queryError && !loadingToastShown) {
      toast.error("Failed to load users. Please try again later.");
      setLoadingToastShown(true);
    }

    if (!queryError && loadingToastShown) {
      setLoadingToastShown(false);
    }
  }, [queryError, loadingToastShown]);

  if (error !== null) {
    toast.error(error);
  }
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            User Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage system access for students, staff, and administrators.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetch()}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RefreshCcw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add New User
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email or ID..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-100"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <select
              className="pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none text-slate-900 dark:text-slate-100 min-w-[148px]"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="department_head">Dept. Heads</option>
              <option value="library">Librarians</option>
              <option value="registrar">Registrars</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <th
                  className="px-5 py-3.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.18em] cursor-pointer group/th"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    User Profile
                    <SortIcon field="name" />
                  </div>
                </th>
                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.18em]">
                  Role & Affiliation
                </th>
                <th
                  className="px-5 py-3.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.18em] cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    Credentials
                    <SortIcon field="email" />
                  </div>
                </th>
                <th
                  className="px-5 py-3.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.18em] cursor-pointer text-right"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center justify-end">
                    Registration
                    <SortIcon field="created_at" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-3.5" colSpan={4}>
                      <div className="h-9 bg-slate-100 dark:bg-slate-800 rounded-lg w-full"></div>
                    </td>
                  </tr>
                ))
                : currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-[11px] shadow-sm overflow-hidden">
                          {user.profile_image ? (
                            <img
                              src={user.profile_image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          )}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-none">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                            #{user.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.14em] ${user.role === "student"
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                              : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                              }`}
                          >
                            {user.role.replace("_", " ")}
                          </span>
                          {user.student && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.14em] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              {user.student.year}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate max-w-[180px]">
                          {user.student?.department?.department ||
                            user.staff?.department?.department ||
                            "System Admin"}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          {user.email ? (
                            <>
                              <Mail className="w-3 h-3" />
                              <span className="text-[11px] font-mono">
                                {user.email}
                              </span>
                            </>
                          ) : (
                            <>
                              <UserIcon className="w-3 h-3" />
                              <span className="text-[11px] font-mono">
                                {user.username}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                          ID: {user.student?.student_id || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <button className="p-1 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-md opacity-0 group-hover:opacity-100 transition-all">
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!loading && filteredAndSortedUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-10 h-10 text-slate-200 dark:text-slate-800" />
                      <p className="text-slate-500 dark:text-slate-400 font-medium">
                        No results for "{searchTerm}"
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-900 dark:text-slate-100">{currentPage}</span> out of <span className="text-slate-900 dark:text-slate-100">{totalPages}</span>
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              {[20, 100, 500].map(size => (
                <button
                  key={size}
                  onClick={() => {
                    setItemsPerPage(size);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${itemsPerPage === size ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      <CreateUserDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          fetchUsers();
        }}
      />
    </div>
  );
};

export default Users;
