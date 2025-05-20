
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { formatDate } from "../../utils/formatDate";
import { ShieldCheck, ShieldX, Shield } from "lucide-react";
import { ClearanceRequest } from "../../../../types/index";

interface ClearanceRequestsListProps {
  clearanceRequest: ClearanceRequest;
}

const ClearanceRequestsList: React.FC<ClearanceRequestsListProps> = ({ clearanceRequest }) => {
  // Parse the approvals JSON string if it's a string
  let approvals: Record<string, boolean | null> = {};
  try {
    if (typeof clearanceRequest.approvals === "string") {
      approvals = JSON.parse(clearanceRequest.approvals);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      approvals = clearanceRequest.approvals as unknown as Record<string, boolean | null>;
    }
  } catch (error) {
    console.error("Error parsing approvals:", error);
  }

  console.log(clearanceRequest);

  // Helper function to render approval status icon
  const renderApprovalStatus = (status: boolean | null) => {
    if (status === true) {
      return <ShieldCheck className="text-green-500" size={18} />;
    } else if (status === false) {
      return <ShieldX className="text-red-500" size={18} />;
    } else {
      return <Shield className="text-gray-400" size={18} />;
    }
  };

  // Helper function for status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Clearance Request</CardTitle>
        <CardDescription>
          Submitted {clearanceRequest.created_at ? formatDate(clearanceRequest.created_at) : 'N/A'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Academic Details</h3>
            <dl className="space-y-1">
              <div className="grid grid-cols-2">
                <dt className="font-medium">Status:</dt>
                <dd>{getStatusBadge(clearanceRequest.status)}</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Academic Year:</dt>
                <dd>{clearanceRequest.academic_year}</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Year:</dt>
                <dd>{clearanceRequest.year}</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Semester:</dt>
                <dd>{clearanceRequest.semester}</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Section:</dt>
                <dd>{clearanceRequest.section}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Department Info</h3>
            <dl className="space-y-1">
              <div className="grid grid-cols-2">
                <dt className="font-medium">Department:</dt>
                <dd>{clearanceRequest.department.department}</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">College:</dt>
                <dd>{clearanceRequest.department.college}</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Current Step:</dt>
                <dd className="capitalize">{clearanceRequest.current_step}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Student Status</h3>
            <dl className="space-y-1">
              <div className="grid grid-cols-2">
                <dt className="font-medium">Cafe Status:</dt>
                <dd>{clearanceRequest.cafe_status}</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Dorm Status:</dt>
                <dd>{clearanceRequest.dorm_status}</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Last Day Attended:</dt>
                <dd>{formatDate(clearanceRequest.last_day_class_attended)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Reason for Clearance</h3>
          <p className="bg-gray-50 p-3 rounded-md">{clearanceRequest.reason_for_clearance}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Approval Status</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Department Head</TableCell>
                <TableCell className="flex items-center gap-2">
                  {renderApprovalStatus(clearanceRequest.department_head_approved)}
                  {clearanceRequest.department_head_approved === true ? 'Approved' : 
                   clearanceRequest.department_head_approved === false ? 'Rejected' : 'Pending'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Library</TableCell>
                <TableCell className="flex items-center gap-2">
                  {renderApprovalStatus(clearanceRequest.library_approved)}
                  {clearanceRequest.library_approved === true ? 'Approved' : 
                   clearanceRequest.library_approved === false ? 'Rejected' : 'Pending'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Cafeteria</TableCell>
                <TableCell className="flex items-center gap-2">
                  {renderApprovalStatus(clearanceRequest.cafeteria_approved)}
                  {clearanceRequest.cafeteria_approved === true ? 'Approved' : 
                   clearanceRequest.cafeteria_approved === false ? 'Rejected' : 'Pending'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Proctor</TableCell>
                <TableCell className="flex items-center gap-2">
                  {renderApprovalStatus(clearanceRequest.proctor_approved)}
                  {clearanceRequest.proctor_approved === true ? 'Approved' : 
                   clearanceRequest.proctor_approved === false ? 'Rejected' : 'Pending'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Registrar</TableCell>
                <TableCell className="flex items-center gap-2">
                  {renderApprovalStatus(clearanceRequest.registrar_approved)}
                  {clearanceRequest.registrar_approved === true ? 'Approved' : 
                   clearanceRequest.registrar_approved === false ? 'Rejected' : 'Pending'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
    <br /><br /><br />
    </>
  );
};

export default ClearanceRequestsList;