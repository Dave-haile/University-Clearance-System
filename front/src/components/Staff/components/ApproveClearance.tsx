// import { useEffect, useState } from "react";
// import axiosClient from "../../../services/axiosBackend";

// interface ClearanceRequest {
//   student: Student;
//   id: number;
//   student_id: string;
//   approvals: { [key: string]: { status: string; remarks?: string } };
//   status: "pending" | "approved" | "rejected";
//   current_step: "department_head" | "library" | "cafeteria" | "proctor" | "registrar";
//   department: string;
//   sex: string;
//   year: string;
// }
// interface User {
//   id: number;
//   name: string;
// }

// interface Student {
//   id: number;
//   user_id: number;
//   user: User;
// }

// const ClearanceApproval = () => {
//   const [requests, setRequests] = useState<ClearanceRequest[]>([]);
//   const [selectedRequest, setSelectedRequest] =
//     useState<ClearanceRequest | null>(null);
//   const [status, setStatus] = useState("approved");
//   const [remarks, setRemarks] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetchClearanceRequests();
//   }, []);

//   const fetchClearanceRequests = async () => {
//     try {
//       const response = await axiosClient.get("/clearance-requests");
//       setRequests(response.data);
//       console.log(response.data);
//     } catch (error) {
//       console.error("Error fetching clearance requests", error);
//     }
//   };

//   const handleApproval = async (id: number) => {
//     try {
//       const response = await axiosClient.post(`/approve-clearance/${id}`, {
//         staff_role: 'library',
//         status,
//         remarks,
//       });
//       fetchClearanceRequests();
//       setMessage(response.data.message);
//     } catch (error) {
//       console.error("Error updating clearance", error);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-lg font-semibold mb-4">Clearance Requests</h2>
//       <ul className="space-y-2">
//         {requests.map((req) => (
//           <li key={req.id} className="p-4 bg-white shadow rounded">
//             <p>Name: {req.student.user.name}</p>
//             <p>Student ID: {req.student_id}</p>
//             <p>Department: {req.department}</p>
//             <p>Status: {req.status}</p>
//             <button
//               onClick={() => setSelectedRequest(req)}
//               className="bg-blue-500 text-white px-3 py-1 rounded"
//             >
//               Review
//             </button>
//           </li>
//         ))}
//       </ul>

//       {requests && (
//         <>
//           <div className="bg-[#e5e5e5] border-l-4 border-[#14213d] text-[#05445e] p-4 mt-4">
//             <div className="relative overflow-x-auto">
//               <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//                 <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//                   <tr className="bg-gray-200">
//                     <th scope="col" className="px-6 py-3">
//                       Name
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Student Id
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Department
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Status
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Department
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Year
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Approve
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {requests.map((req, index) => (
//                     <tr
//                       key={index}
//                       className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
//                     >
//                       <th
//                         scope="row"
//                         className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
//                       >
//                         {req.student.user.name}
//                       </th>
//                       <td className="px-6 py-4">{req.student_id}</td>
//                       <td className="px-6 py-4">{req.department}</td>
//                       <td className="px-6 py-4">{req.status}</td>
//                       <td className="px-6 py-4">{req.sex}</td>
//                       <td className="px-6 py-4">{req.year}</td>
//                       <td className=" bg-blue-500 text-white px-3 py-1 rounded">Approve</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       )}

//       {selectedRequest && (
//         <div className="mt-4 p-4 bg-gray-100 rounded">
//           <h3 className="text-lg font-semibold">
//             Review Request for {selectedRequest.student_id}
//           </h3>
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="mt-2 p-2 border"
//           >
//             <option value="approved">Approve</option>
//             <option value="rejected">Reject</option>
//           </select>
//           <textarea
//             placeholder="Enter remarks (optional)"
//             value={remarks}
//             onChange={(e) => setRemarks(e.target.value)}
//             className="w-full mt-2 p-2 border"
//           />
//           <button
//             onClick={() => handleApproval(selectedRequest.id)}
//             className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
//           >
//             Submit
//           </button>
//         </div>
//       )}
//       {message && (
//         <div className="p-4 bg-green-50 text-green-700 rounded-md">
//           {message}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClearanceApproval;

import { useEffect, useState } from "react";
import axiosClient from "../../../services/axiosBackend";
import axios from "axios";

interface ClearanceRequest {
  id: number;
  student_id: string;
  approvals: { [key: string]: { status: string; remarks?: string } };
  status: "pending" | "approved" | "rejected";
  current_step:
    | "department_head"
    | "library"
    | "cafeteria"
    | "proctor"
    | "registrar";
}

const useFetchClearanceRequests = (staffRole: string) => {
  const [requests, setRequests] = useState<ClearanceRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClearanceRequests();
  }, []);

  const fetchClearanceRequests = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/clearance-requests`, {
        params: { staff_role: staffRole }, // Send staff role as a query param
      });
      setRequests(response.data.data);
      console.log(response.data.message);
      console.log(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
        console.error("Error fetching clearance requests", error);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { requests, loading, error, fetchClearanceRequests };
};

export default useFetchClearanceRequests;
