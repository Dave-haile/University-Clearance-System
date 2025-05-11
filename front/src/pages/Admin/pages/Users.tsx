import React, { useEffect, useState } from "react";
import axiosClient from "../../../services/axiosBackend";
import UserTable from "../components/UserManagement/UserTable";
import Pagination from "../components/UserManagement/Pagination";
import MainLayout from "../components/layout/MainLayout";
import {
  User as Users,
  UserRole,
  SortField,
  SortDirection,
  roles,
} from "../../../types/user";
import { UserPlus } from "lucide-react";
import CreateUserDialog from "../components/UserManagement/CreateUserDialog";
import EditUserDialog from "../components/UserManagement/EditUserDialog";
import DeleteUserDialog from "../components/UserManagement/DeleteUserDialog";
import { notifySuccess, showError } from "../../../hooks/toast";

const ITEMS_PER_PAGE = 15;

const User: React.FC = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<UserRole>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);

  const handleEditUser = (user: Users) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: Users) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await axiosClient.get("/admin/users");
      setUsers(data.data);
      setError(null);
      notifySuccess("User's are Fetched Successfully");
    } catch (err) {
      setError("Failed to load users. Please try again later.");
      console.log("Error fetching users:", err);
      showError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let result = [...users];
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTermLower) ||
          (user.username &&
            user.username.toLowerCase().includes(searchTermLower)) ||
          (user.email && user.email.toLowerCase().includes(searchTermLower))
      );
    }

    result.sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "created_at") {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [users, roleFilter, searchTerm, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRefresh = () => {
    try {
      loadUsers();
    } catch (error) {
      showError(`Refresh Unsuccessful ${error}`);
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-1 py-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800">
              User Management
              {!loading && (
                <span className="text-gray-600 text-xl font-normal ml-2">
                  ({filteredUsers.length} Users)
                </span>
              )}
            </h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => handleOpenCreateDialog()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <UserPlus size={18} className="mr-2" />
              Create New User
            </button>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`mr-2 ${loading ? "animate-spin" : ""}`}
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.38-5.5M22 12.5a10 10 0 0 1-18.38 5.5"></path>
              </svg>
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 mb-6">
          <div className="w-full md:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="all">All Users</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role
                    .replace("_", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, email or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-gray-100 rounded-md p-8 text-center">
            <p className="text-lg text-gray-600">
              No users found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <UserTable
                users={currentUsers}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
              />
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}

            <EditUserDialog
              open={isEditDialogOpen}
              user={selectedUser}
              onClose={handleCloseEditDialog}
            />

            <DeleteUserDialog
              open={isDeleteDialogOpen}
              user={selectedUser}
              onClose={handleCloseDeleteDialog}
            />
            {/* <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <UserTable
                users={currentUsers}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onEditUser={() => {}}
                onDeleteUser={() => {}}
              />
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )} */}
          </>
        )}
      </div>
      <CreateUserDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
      />
    </MainLayout>
  );
};

export default User;
