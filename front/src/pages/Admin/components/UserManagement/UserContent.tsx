
import React, { useState } from "react";
import { User, SortField, SortDirection } from "../../../../types/user";
import UserTable from "./UserTable";
import Pagination from "./Pagination";
import EditUserDialog from "./EditUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";

interface UserContentProps {
  loading: boolean;
  error: string | null;
  filteredUsers: User[];
  currentUsers: User[];
  sortField: SortField;
  sortDirection: SortDirection;
  currentPage: number;
  totalPages: number;
  onSort: (field: SortField) => void;
  onPageChange: (page: number) => void;
}

const UserContent: React.FC<UserContentProps> = ({
  loading,
  error,
  filteredUsers,
  currentUsers,
  sortField,
  sortDirection,
  currentPage,
  totalPages,
  onSort,
  onPageChange,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="bg-gray-100 rounded-md p-8 text-center">
        <p className="text-lg text-gray-600">No users found matching your criteria.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <UserTable 
          users={currentUsers} 
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
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
    </>
  );
};

export default UserContent;