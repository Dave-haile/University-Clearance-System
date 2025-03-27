import { useState } from "react";
import useFetchClearanceRequests from "../components/ApproveClearance";
import axiosClient from "../../../services/axiosBackend";

const LibraryApproval = () => {
    const { requests, loading, error, fetchClearanceRequests } = useFetchClearanceRequests("department_head");
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

    return (
        <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Library Clearance Requests</h2>

            {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
                <ul className="space-y-2">
                    {requests.map((req) => (
                        <li key={req.id} className="p-4 bg-white shadow rounded">
                            <p>Student ID: {req.student_id}</p>
                            <p>Status: {req.status}</p>
                            <button onClick={() => setSelectedRequest(req.id)} className="bg-blue-500 text-white px-3 py-1 rounded">
                                Review
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {selectedRequest && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <h3 className="text-lg font-semibold">Review Request</h3>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-2 p-2 border">
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                    </select>
                    <textarea
                        placeholder="Enter remarks (optional)"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full mt-2 p-2 border"
                    />
                    <button onClick={() => handleApproval(selectedRequest)} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default LibraryApproval;
