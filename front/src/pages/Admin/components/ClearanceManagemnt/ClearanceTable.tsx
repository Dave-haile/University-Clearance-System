import { Check } from "lucide-react";
import ApprovalDots from "./ApprovalDots";
import StatusBadge from "./StatusBadge";
import { Button } from "../../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import Pagination from "./Pagination";
import { useState } from "react";
import RequestDetailsModal from "./RequestDetailsModal";
import { ClearanceRequests } from "../../../../types/clerance";

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
  setCurrentPage 
}: ClearanceTableProps) => {
  const [selectedRequest, setSelectedRequest] = useState<ClearanceRequests | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (request: ClearanceRequests) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  // const formatDate = (dateString: string) => {
  //   try {
  //     const date = new Date(dateString);
  //     return format(date, "MMM dd, yyyy");
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   } catch (error) {
  //     return "Invalid Date";
  //   }
  // };

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

  const formatCurrentStep = (step: string) => {
    return step.charAt(0).toUpperCase() + step.slice(1).replace('_', ' ');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">No</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Year/Sem</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current Step</TableHead>
              <TableHead>Approvals</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clearanceRequests.map((request) => (
              <TableRow onClick={() => handleViewDetails(request)} className="hover:cursor-pointer" key={request.id}>
                <TableCell className="font-medium text-center">{request.id}</TableCell>
                <TableCell className="font-medium">{request.student.user.name}</TableCell>
                <TableCell className="font-medium">{request.student_id}</TableCell>
                <TableCell>{request.year}/{request.semester}</TableCell>
                <TableCell>{request.department.department}</TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell>
                  {formatCurrentStep(request.current_step)}
                </TableCell>
                <TableCell>
                <ApprovalDots approvals={request.approvals} />
                </TableCell>
                <TableCell>{formatDate(request.created_at)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(request)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
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
    </div>
  );
};

export default ClearanceTable;
