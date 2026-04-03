import { ClearanceRequest } from "./../../../types/index";

import axiosClient from "../../../services/axiosBackend";
import { User } from "../../../types/index";
import { notifyError, notifySuccess } from "../../../hooks/toast";
import { Department } from "../../../types/department";

export const fetchUserDetail = async (
  userId: string,
): Promise<{ user: User; clearances: ClearanceRequest[] }> => {
  try {
    const response = await axiosClient.get(`/admin/users/${userId}`);
    return {
      user: response.data.user,
      clearances: response.data.clearances,
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    notifyError("Failed to fetch user details.");
    throw error;
  }
};

// Update user information
export const updateUser = async (
  userId: string,
  userData: Partial<User>,
): Promise<User> => {
  try {
    const response = await axiosClient.post(
      `/admin/users/${userId}/update`,
      userData,
    );
    return response.data.user as User;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Reset user password
export const resetUserPassword = async (
  userId: string,
  credentials: { username?: string; email?: string; password: string },
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await axiosClient.put(
      `/admin/users/${userId}/reset-password`,
      credentials,
    );
    notifySuccess(response.data.message || "Password reset successfully!");
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("Error resetting password:", error);
    notifyError("Failed to reset password.");
    throw error;
  }
};

// Delete user
export const deleteUser = async (
  userId: string,
): Promise<{ success: boolean }> => {
  try {
    const response = await axiosClient.delete(`/admin/users/${userId}/delete`);
    console.log("Delete user:", response.data);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const fetchDepartment = async (): Promise<{
  department: Department;
}> => {
  try {
    const response = await axiosClient.get("/departmentDisplay");
    console.log(response.data);
    return { department: response.data as Department };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
