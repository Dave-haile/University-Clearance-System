import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  ChevronDown,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClearanceRequest } from "@/types/dashboard";

interface ClearanceRequestsTableProps {
  requests?: ClearanceRequest[];
  onApprove: (request: ClearanceRequest) => void;
  onReject: (request: ClearanceRequest) => void;
}

export const ClearanceRequestsTable = ({
  requests,
  onApprove,
  onReject,
}: ClearanceRequestsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const filteredRequests = requests?.filter((request) => {
    const matchesSearch =
      request.student.user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    const matchesYear =
      yearFilter === "all" || request.year.includes(yearFilter);

    return matchesSearch && matchesStatus && matchesYear;
  });

  const toggleRowExpansion = (requestId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(requestId)) {
      newExpanded.delete(requestId);
    } else {
      newExpanded.add(requestId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl font-semibold text-slate-900">
            Clearance Requests
          </CardTitle>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <ExternalLink className="w-4 h-4 mr-2" />
            View All Requests
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="1st">1st Year</SelectItem>
                <SelectItem value="2nd">2nd Year</SelectItem>
                <SelectItem value="3rd">3rd Year</SelectItem>
                <SelectItem value="4th">4th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="pl-20">Actions</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests?.map((request) => (
                <>
                  <TableRow
                    key={request.id}
                    className="cursor-pointer hover:bg-slate-50 border-b border-slate-200"
                    onClick={() => toggleRowExpansion(request.id)}
                  >
                    <TableCell className="font-medium text-slate-900">
                      {request.student.user.name}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {request.student_id}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {request.year}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-slate-600">
                      {formatDate(request.created_at)}
                    </TableCell>
                    <TableCell>
                      {request.status === "pending" &&
                        request.current_step === "department_head" && (
                          <div
                            className="flex gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              className="h-9 rounded-md px-1 bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => onApprove(request)}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-9 rounded-md px-1 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => onReject(request)}
                            >
                              <X className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                    </TableCell>
                    <TableCell>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          expandedRows.has(request.id) ? "rotate-180" : ""
                        }`}
                      />
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(request.id) && (
                    <TableRow>
                      <TableCell colSpan={7} className="px-4 pb-4">
                        <div className="bg-slate-50 rounded-lg p-4 mt-2">
                          <h4 className="font-medium text-slate-900 mb-3">
                            Student Information
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-600">Email:</span>
                              <span className="ml-2 text-slate-900">
                                {request.student.user.email}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600">Sex:</span>
                              <span className="ml-2 text-slate-900">
                                {request.sex}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600">Section:</span>
                              <span className="ml-2 text-slate-900">
                                {request.section}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600">Semester:</span>
                              <span className="ml-2 text-slate-900">
                                {request.semester}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600">
                                Academic Year:
                              </span>
                              <span className="ml-2 text-slate-900">
                                {request.academic_year}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600">
                                Current Step:
                              </span>
                              <span className="ml-2 text-slate-900 capitalize">
                                {request.current_step.replace("_", " ")}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-slate-600">Reason:</span>
                              <span className="ml-2 text-slate-900 capitalize">
                                {request.reason_for_clearance.replace("_", " ")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {filteredRequests?.map((request) => (
            <Card key={request.id} className="border-slate-200">
              <CardContent
                className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => toggleRowExpansion(request.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">
                      {request.student.user.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {request.student_id}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(request.status)}
                      <span className="text-sm text-slate-600">
                        {request.year}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      expandedRows.has(request.id) ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </CardContent>

              {expandedRows.has(request.id) && (
                <div className="px-4 pb-4">
                  <div className="bg-slate-50 rounded-lg p-3 mb-3">
                    <h4 className="font-medium text-slate-900 mb-2 text-sm">
                      Student Information
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Email:</span>
                        <span className="text-slate-900">
                          {request.student.user.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Section:</span>
                        <span className="text-slate-900">
                          {request.section}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Submitted:</span>
                        <span className="text-slate-900">
                          {formatDate(request.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {request.status === "pending" &&
                    request.current_step === "department_head" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white flex-1"
                          onClick={() => onApprove(request)}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 flex-1"
                          onClick={() => onReject(request)}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                </div>
              )}
            </Card>
          ))}
        </div>

        {filteredRequests?.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No clearance requests found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
