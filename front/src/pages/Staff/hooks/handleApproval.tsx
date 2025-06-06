import axiosClient from "@/services/axiosBackend";
import { toast } from "sonner";

export const HandleApproval = async (
  id: number,
  role: string,
  status: string,
  remarks?: string
) => {
  try {
    const response = await axiosClient.post(`/approve-clearance/${id}`, {
      staff_role: role,
      status,
      remarks,
    });
    console.log(response);
    console.log(`Request ${id} updated successfully by ${role}`);
    toast.success(`Request updated successfully by ${role.replace("_", " ")}`);
  } catch (error) {
    console.error("Error updating clearance", error);
  }
};
