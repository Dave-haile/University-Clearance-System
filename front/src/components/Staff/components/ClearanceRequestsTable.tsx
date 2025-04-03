import { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useFetchClearanceRequests from "../components/ApproveClearance";
import axiosClient from "../../../services/axiosBackend";
import { Button, Select, MenuItem, TextField, Box } from "@mui/material";

const ClearanceRequestsTable = () => {
    const { requests, loading, error, fetchClearanceRequests } = useFetchClearanceRequests("library");
    const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
    const [status, setStatus] = useState("approved");
    const [remarks, setRemarks] = useState("");

    const handleApproval = async (id: number) => {
        try {
            await axiosClient.post(`/approve-clearance/${id}`, {
                staff_role: "library",
                status,
                remarks,
            });

            fetchClearanceRequests(); 
        } catch (error) {
            console.error("Error updating clearance", error);
        }
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "student_id", headerName: "Student ID", width: 150 },
        { field: "status", headerName: "Status", width: 120 },
        { field: "current_step", headerName: "Current Step", width: 180 },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: (params) => (
                <Button variant="contained" color="primary" onClick={() => setSelectedRequest(params.row.id)}>
                    Review
                </Button>
            ),
        },
    ];

    return (
        <Box p={3}>
            <h2 className="text-lg font-semibold mb-4">Library Clearance Requests</h2>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={requests}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    pagination
                />
            </div>

            {selectedRequest && (
                <Box mt={4} p={2} bgcolor="grey.100" borderRadius={2}>
                    <h3 className="text-lg font-semibold">Review Request</h3>
                    <Select value={status} onChange={(e) => setStatus(e.target.value)} fullWidth>
                        <MenuItem value="approved">Approve</MenuItem>
                        <MenuItem value="rejected">Reject</MenuItem>
                    </Select>
                    <TextField
                        label="Remarks (Optional)"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        fullWidth
                        multiline
                        margin="normal"
                    />
                    <Button
                        onClick={() => handleApproval(selectedRequest)}
                        variant="contained"
                        color="success"
                        fullWidth
                    >
                        Submit
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default ClearanceRequestsTable;
