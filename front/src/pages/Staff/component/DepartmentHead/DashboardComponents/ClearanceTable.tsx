import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { ClearanceRequests } from "@/types/clerance";
import { Pagination } from "@/components/ui/pagination";
import RequestDetailsModal from "@/pages/Admin/components/ClearanceManagemnt/RequestDetailsModal";
import StatusBadge from "@/pages/Admin/components/ClearanceManagemnt/StatusBadge";
import { HandleApproval } from "@/pages/Staff/hooks/handleApproval";
import { RejectionModal } from "./RejectionModal";
import { ClearanceRequest as ClearanceRequest2 } from "@/types/dashboard";

interface ClearanceTableProps {
  clearanceRequests: ClearanceRequests[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const ClearanceTable = ({
  clearanceRequests,
  currentPage,
  totalPages,
  setCurrentPage,
}: ClearanceTableProps) => {
  const [selectedRequest, setSelectedRequest] =
    useState<ClearanceRequests | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedRequest2, setSelectedRequest2] =
    useState<ClearanceRequest2 | null>(null);

  const handleViewDetails = (request: ClearanceRequests) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleApprove = async (request: ClearanceRequest2, remarks = "") => {
    console.log(request);
    await HandleApproval(request.id, "department_head", "approved", remarks);
  };

  const handleReject = (request: ClearanceRequest2) => {
    setSelectedRequest2(request);
    setShowRejectionModal(true);
  };
  const confirmRejection = async (reason: string) => {
    if (!selectedRequest2) return;
    if (selectedRequest2) {
      console.log(
        `Request ${selectedRequest2.id} rejected with reason: ${reason}`
      );
    }
    await HandleApproval(
      selectedRequest2.id,
      "department_head",
      "rejected",
      reason
    );

    setShowRejectionModal(false);
    setSelectedRequest2(null);
  };
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Year/Sem</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clearanceRequests.map((request) => (
              <TableRow
                onClick={() => handleViewDetails(request)}
                className="hover:cursor-pointer"
                key={request.id}
              >
                <TableCell className="font-medium">
                  {request.student.user.name}
                </TableCell>
                <TableCell className="font-medium">
                  {request.student_id}
                </TableCell>
                <TableCell>
                  {request.year}/{request.semester}
                </TableCell>
                <TableCell>{request.department.department}</TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell>{formatDate(request.created_at)}</TableCell>
                <TableCell className="text-right">
                  {request.status === "pending" &&
                    request.current_step === "department_head" && (
                      <div
                        className="flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          className="h-9 rounded-md px-1 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApprove(request)}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 rounded-md px-1 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleReject(request)}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <RejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onConfirm={confirmRejection}
        studentName={selectedRequest?.student.user.name || ""}
      />
    </div>
  );
};

export default ClearanceTable;
