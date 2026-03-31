import axiosClient from "@/services/axiosBackend";
import { queryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";

export const HandleApproval = async (
  id: number,
  role: string,
  status: string,
  remarks?: string,
) => {
  try {
    const response = await axiosClient.post(`/approve-clearance/${id}`, {
      staff_role: role,
      status,
      remarks,
    });

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.dashboard }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.staff.clearanceRequests,
      }),
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.students }),
      queryClient.invalidateQueries({ queryKey: queryKeys.student.dashboard }),
      queryClient.invalidateQueries({ queryKey: queryKeys.student.allData }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.student.clearanceHistory,
      }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.requestsBase }),
    ]);

    console.log(response);
    console.log(`Request ${id} updated successfully by ${role}`);
    toast.success(`Request updated successfully by ${role.replace("_", " ")}`);
  } catch (error) {
    console.error("Error updating clearance", error);
  }
};
