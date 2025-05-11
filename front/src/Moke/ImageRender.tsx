import React, { useEffect, useState } from "react";
import axiosClient from "../services/axiosBackend";

// TypeScript Interface
interface Staff {
  id: number;
  user_id: number;
  position: string;
  department_id: number;
  role: string;
  created_at: string;
  updated_at: string;
}
export interface Student {
    id: number;
    user_id: number;
    student_id: string;
    department: string;
    year: string;
    created_at: string;
    updated_at: string;
  }
interface User {
  id: number;
  name: string;
  username: string | null;
  role: string;
  created_at: string;
  email: string;
  profile_image: string;
  staff: Staff;
  student: Student | null;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get("/admin/users")
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center text-lg">Loading users...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {users.map(user => (
        <div key={user.id} className="bg-white rounded-2xl shadow-md p-4 text-center">
          <img
            src={user.profile_image}
            alt={user.name}
            className="w-24 h-24 rounded-full mx-auto border-4 border-indigo-300 object-cover"
          />
          <h2 className="text-xl font-bold mt-4">{user.name}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-indigo-700 font-medium mt-1 capitalize">{user.staff?.position}</p>
        </div>
      ))}
    </div>
  );
};

export default UserList;
