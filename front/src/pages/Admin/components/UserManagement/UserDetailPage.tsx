import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchUserDetail, deleteUser } from "../../services/userDetailService";
import { ArrowLeft, Shield, UserMinus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatDate } from "../../utils/formatDate";
import ClearanceRequestsList from "./ClearanceRequestsList";
// import EditUserInfoDialog from "./EditUserInfoDialog";
import ResetPasswordDialog from "./ResetPasswordDialog";
import DeleteUserConfirmDialog from "./DeleteUserConfirmDialog";
import { notifySuccess, showError } from "../../../../hooks/toast";
import { generateAvatar } from "../../utils/avatarGenerator";

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigator = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["userDetail", id],
    queryFn: () => fetchUserDetail(id as string),
    enabled: !!id,
  });

  const { user, clearances } = data || {};

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(id as string),
    onSuccess: () => {
      notifySuccess("User has been deleted successfully");
      setIsDeleteDialogOpen(false);
      navigator("/admin/users");
    },
    onError: () => {
      showError("Failed to delete user. Please try again later.");
    },
  });

  const handleDeleteUser = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p className="font-bold">Error</p>
          <p>Failed to load user details. Please try again later.</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/admin/users" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Users List
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" asChild>
          <Link to="/admin/users" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Users List
          </Link>
        </Button>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center"
            disabled={isLoading}
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
              className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.38-5.5M22 12.5a10 10 0 0 1-18.38 5.5"></path>
            </svg>
            {isLoading ? "Loading..." : "Refresh"}
          </button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <UserMinus size={16} />
            Delete User
          </Button>
        </div>
      </div>

      {/* User Info Card */}
      <Card className="mb-8 border-t-4 border-t-blue-500">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <div className="flex items-center gap-2">
              <img
                src={
                  user.profile_image ||
                  generateAvatar(user.name) ||
                  user.name.charAt(0)
                }
                alt={`${user.name.charAt(0)}`}
                className="w-32 h-32 rounded-full mr-3"
              />
              <CardTitle className="text-3xl">{user.name}</CardTitle>
            </div>
            <CardDescription>
              <span className="flex items-center gap-2 text-base">
                <Shield size={16} />
                {user.role
                  .replace(/\b\w/g, (c) => c.toUpperCase())
                  .replace("_", " ")}
                {user.username && ` • ${user.username}`}
                {user.email && ` • ${user.email}`}
              </span>
            </CardDescription>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsResetPasswordDialogOpen(true)}
            >
              Reset Password
            </Button>
            {/* {user.role === 'student' && (
              <Button onClick={() => setIsEditDialogOpen(true)}>
              Edit User Info
            </Button>
            )} */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic User Info */}
            <div>
              <h3 className="font-medium text-lg mb-4">Basic Information</h3>
              <dl className="space-y-2">
                <div className="grid grid-cols-3 gap-4">
                  <dt className="font-semibold text-gray-500">ID:</dt>
                  <dd className="col-span-2">{user.id}</dd>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <dt className="font-semibold text-gray-500">Role:</dt>
                  <dd className="col-span-2 capitalize">
                    {user.role
                      .replace(/\b\w/g, (c) => c.toUpperCase())
                      .replace("_", " ")}
                  </dd>
                </div>
                {user.username && (
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="font-semibold text-gray-500">Username:</dt>
                    <dd className="col-span-2">{user.username}</dd>
                  </div>
                )}
                {user.email && (
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="font-semibold text-gray-500">Email:</dt>
                    <dd className="col-span-2">{user.email}</dd>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <dt className="font-semibold text-gray-500">Created:</dt>
                  <dd className="col-span-2">
                    {user.created_at ? formatDate(user.created_at) : "N/A"}
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <dt className="font-semibold text-gray-500">Updated:</dt>
                  <dd className="col-span-2">
                    {user.updated_at ? formatDate(user.updated_at) : "N/A"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Staff or Student Specific Info */}
            <div>
              {user.staff && (
                <>
                  <h3 className="font-medium text-lg mb-4">
                    Staff Information
                  </h3>
                  <dl className="space-y-2">
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="font-semibold text-gray-500">Position:</dt>
                      <dd className="col-span-2">{user.staff.position}</dd>
                    </div>
                    {user.staff.department && (
                      <>
                        <div className="grid grid-cols-3 gap-4">
                          <dt className="font-semibold text-gray-500">
                            Department:
                          </dt>
                          <dd className="col-span-2">
                            {user.staff.department.department}
                          </dd>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <dt className="font-semibold text-gray-500">
                            College:
                          </dt>
                          <dd className="col-span-2">
                            {user.staff.department.college}
                          </dd>
                        </div>
                      </>
                    )}
                  </dl>
                </>
              )}

              {user.student && (
                <>
                  <h3 className="font-medium text-lg mb-4">
                    Student Information
                  </h3>
                  <dl className="space-y-2">
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="font-semibold text-gray-500">
                        Student ID:
                      </dt>
                      <dd className="col-span-2">{user.student.student_id}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="font-semibold text-gray-500">Year:</dt>
                      <dd className="col-span-2">{user.student.year}</dd>
                    </div>
                    {user.student.department && (
                      <>
                        <div className="grid grid-cols-3 gap-4">
                          <dt className="font-semibold text-gray-500">
                            Department:
                          </dt>
                          <dd className="col-span-2">
                            {user.student.department.department}
                          </dd>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <dt className="font-semibold text-gray-500">
                            College:
                          </dt>
                          <dd className="col-span-2">
                            {user.student.department.college}
                          </dd>
                        </div>
                      </>
                    )}
                  </dl>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {clearances &&
        clearances.map((clearance) => (
          <ClearanceRequestsList clearanceRequest={clearance} />
        ))}

      {/* {user.role === "student" && (
        <EditUserInfoDialog
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          user={user}
          onSuccess={() => {
            refetch();
            setIsEditDialogOpen(false);
          }}
        />
      )} */}
      <ResetPasswordDialog
        open={isResetPasswordDialogOpen}
        onClose={() => setIsResetPasswordDialogOpen(false)}
        user={user}
        onSuccess={() => {
          setIsResetPasswordDialogOpen(false);
          notifySuccess("User password has been reset successfully");
        }}
      />

      <DeleteUserConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        user={user}
        clearances={clearances}
        onConfirm={handleDeleteUser}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default UserDetailPage;
