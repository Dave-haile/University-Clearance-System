
import React from "react";
import { User } from "../../../../types/user";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { formatDate } from "../../utils/formatDate";

interface UserDetailsDisplayProps {
  user: User;
}

const UserDetailsDisplay: React.FC<UserDetailsDisplayProps> = ({ user }) => {
  const renderStaffDetails = () => {
    if (!user.staff) return null;
    
    return (
      <>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="position" className="text-right">Position</Label>
          <div className="col-span-3">
            <Input id="position" defaultValue={user.staff.position} readOnly />
          </div>
        </div>
        {user.staff.department && (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">Department</Label>
              <div className="col-span-3">
                <Input id="department" defaultValue={user.staff.department.department} readOnly />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="college" className="text-right">College</Label>
              <div className="col-span-3">
                <Input id="college" defaultValue={user.staff.department.college} readOnly />
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  const renderStudentDetails = () => {
    if (!user.student) return null;
    
    return (
      <>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="student-id" className="text-right">Student ID</Label>
          <div className="col-span-3">
            <Input id="student-id" defaultValue={user.student.student_id} readOnly />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="year" className="text-right">Year</Label>
          <div className="col-span-3">
            <Input id="year" defaultValue={user.student.year} readOnly />
          </div>
        </div>
        {user.student.department && (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">Department</Label>
              <div className="col-span-3">
                <Input id="department" defaultValue={user.student.department.department} readOnly />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="college" className="text-right">College</Label>
              <div className="col-span-3">
                <Input id="college" defaultValue={user.student.department.college} readOnly />
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <div className="col-span-3">
          <Input id="name" defaultValue={user.name} readOnly />
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role" className="text-right">Role</Label>
        <div className="col-span-3">
          <Input id="role" defaultValue={user.role} readOnly />
        </div>
      </div>
      {user.email && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">Email</Label>
          <div className="col-span-3">
            <Input id="email" defaultValue={user.email} readOnly />
          </div>
        </div>
      )}
      {user.username && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">Username</Label>
          <div className="col-span-3">
            <Input id="username" defaultValue={user.username} readOnly />
          </div>
        </div>
      )}
      {user.created_at && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="created-at" className="text-right">Created</Label>
          <div className="col-span-3">
            <Input id="created-at" defaultValue={formatDate(user.created_at)} readOnly />
          </div>
        </div>
      )}

      {/* Render staff or student specific details */}
      {renderStaffDetails()}
      {renderStudentDetails()}
    </div>
  );
};

export default UserDetailsDisplay;