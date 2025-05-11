import React from "react";
import { generateAvatar } from "../../utils/avatarGenerator";
import { SortDirection, SortField, User } from "../../../../types/user";
// import { toast as toaster } from "sonner";
// import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";


interface UserTableProps {
  users: User[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}
const UserTable: React.FC<UserTableProps> = ({
  users,
  sortField,
  sortDirection,
  onSort,
  // onEditUser,
  // onDeleteUser,
}) => {
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  // const confirmDelete = () => {
  //   console.log(`Deleting user ${selectedUserId}`);
  //   toaster.success("User deleted successfully");
  //   setIsDeleteDialogOpen(false);
  //   setSelectedUserId(null);
  // };
  const handleRowClick = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;

    return sortDirection === "asc" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ml-2 inline-block"
      >
        <path d="m5 12 7-7 7 7"></path>
        <path d="M12 19V5"></path>
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ml-2 inline-block"
      >
        <path d="M12 5v14"></path>
        <path d="m5 12 7 7 7-7"></path>
      </svg>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              <button
                onClick={() => onSort("name")}
                className="flex items-center font-medium text-gray-600"
              >
                Username / Email
                {renderSortIcon("name")}
              </button>
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Role
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Department
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Year
            </th>
            {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Actions
            </th> */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
            onClick={() => handleRowClick(user.id.toString())}
            key={user.id} className="border-b hover:bg-gray-50 hover:cursor-pointer">
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <img
                    src={
                      user.profile_image ||
                      generateAvatar(user.name) ||
                      user.name.charAt(0)
                    }
                    alt={`${user.name.charAt(0)}`}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="font-medium">{user.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 capitalize ">
                {user.username || user.email || "-"}
              </td>
              <td className="px-4 py-3">
                <span className="capitalize">
                  {user.role
                    .replace(/\b\w/g, (c) => c.toUpperCase())
                    .replace("_", " ")}
                </span>
              </td>
              <td className="px-4 py-3 ">
                {user.student?.department?.department ||
                  user.staff?.position ||
                  "-"}
              </td>
              <td className="px-4 py-3">{user.student?.year || "-"}</td>
              {/* <td className="px-4 py-3">
                <div className="flex items-center justify-center mr-6">
                  <button
                    onClick={() => onEditUser(user)}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label="Edit User"
                  >
                     <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDeleteUser(user)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Delete User"
                  >
                     <Trash2 size={18} />
                  </button>

                </div>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
