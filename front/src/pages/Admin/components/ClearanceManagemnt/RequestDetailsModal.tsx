
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import StatusBadge from "./StatusBadge";
import { ClearanceRequests } from "../../../../types/clerance";

interface RequestDetailsModalProps {
  request: ClearanceRequests;
  isOpen: boolean;
  onClose: () => void;
}

const RequestDetailsModal = ({
  request,
  isOpen,
  onClose,
}: RequestDetailsModalProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatApprovalStatus = (status: boolean | null) => {
    return status ? (
      <span className="text-green-500 font-medium">Approved</span>
    ) : (
      <span className="text-orange-400 font-medium">Pending</span>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Clearance Request Details
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Complete details for student <span className="font-semibold">{request.student_id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <div className="mt-1">
                <StatusBadge status={request.status} />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Student Information</h3>
              <div className="mt-1">
                <p>
                  <span className="font-medium">Name:</span> {request.student.user.name}
                </p>
                <p>
                  <span className="font-medium">ID:</span> {request.student_id}
                </p>
                <p>
                  <span className="font-medium">Year:</span> {request.year}
                </p>
                <p>
                  <span className="font-medium">Semester:</span> {request.semester}
                </p>
                <p>
                  <span className="font-medium">Section:</span> {request.section}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Academic Details</h3>
              <div className="mt-1">
                <p>
                  <span className="font-medium">Department:</span> {request.department}
                </p>
                <p>
                  <span className="font-medium">College:</span> {request.college}
                </p>
                <p>
                  <span className="font-medium">Academic Year:</span> {request.academic_year}
                </p>
                <p>
                  <span className="font-medium">Last Day Attended:</span>{" "}
                  {formatDate(request.last_day_class_attended)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Reason for Clearance</h3>
              <p className="mt-1">{request.reason_for_clearance}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Current Step</h3>
              <p className="mt-1 font-medium capitalize">{(request.current_step.charAt(0).toUpperCase() + request.current_step.slice(1)).replace('_',' ')}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Status Information</h3>
              <div className="mt-1 capitalize">
                <p>
                  <span className="font-medium capitalize">Cafeteria Status:</span>{" "}
                  {(request.cafe_status).replace('_',' ')}
                </p>
                <p>
                  <span className="font-medium capitalize">Dorm Status:</span>{" "}
                  {request.dorm_status.replace('_',' ')}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Approval Status</h3>
              <div className="mt-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Department Head:</span>
                  {formatApprovalStatus(request.department_head_approved)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Library:</span>
                  {formatApprovalStatus(request.library_approved)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Cafeteria:</span>
                  {formatApprovalStatus(request.cafeteria_approved)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Proctor:</span>
                  {formatApprovalStatus(request.proctor_approved)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Registrar:</span>
                  {formatApprovalStatus(request.registrar_approved)}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Created At</h3>
              <p className="mt-1">{formatDate(request.created_at)}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsModal;
