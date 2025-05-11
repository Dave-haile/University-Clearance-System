import { useEffect, useState } from "react";
import axiosClient from "../../services/axiosBackend";
import { Card, CardContent } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AdminDash from "./AdminDash";

const AdminDashboard = () => {
    // const [stats, setStats] = useState({
    //     totalRequests: 6,
    //     approved: 2,
    //     pending: 1,
    //     rejected: 3,
    // });
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     fetchStats();
    // }, []);

    // const fetchStats = async () => {
    //     try {
    //         const response = await axiosClient.get("/Allclearance-requsets");
    //         setStats(response.data);
    //         console.log(response.data)
    //     } catch (err) {
    //         setError("Failed to fetch stats");
    //         console.log(err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const chartData = [
    //     { name: "Pending", value: stats.pending },
    //     { name: "Approved", value: stats.approved },
    //     { name: "Rejected", value: stats.rejected },
    // ];

    // return (
    //     <div className="p-6">
    //         <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
    //         {loading ? (
    //             <p>Loading...</p>
    //         ) : error ? (
    //             <p className="text-red-500">{error}</p>
    //         ) : (
    //             <div className="grid grid-cols-3 gap-4">
    //                 <Card>
    //                     <CardContent>
    //                         <h3 className="text-lg font-semibold">Total Requests</h3>
    //                         <p className="text-3xl">{stats.totalRequests}</p>
    //                     </CardContent>
    //                 </Card>
    //                 <Card>
    //                     <CardContent>
    //                         <h3 className="text-lg font-semibold">Pending</h3>
    //                         <p className="text-3xl text-yellow-500">{stats.pending}</p>
    //                     </CardContent>
    //                 </Card>
    //                 <Card>
    //                     <CardContent>
    //                         <h3 className="text-lg font-semibold">Approved</h3>
    //                         <p className="text-3xl text-green-500">{stats.approved}</p>
    //                     </CardContent>
    //                 </Card>
    //                 <Card>
    //                     <CardContent>
    //                         <h3 className="text-lg font-semibold">Rejected</h3>
    //                         <p className="text-3xl text-red-500">{stats.rejected}</p>
    //                     </CardContent>
    //                 </Card>
    //             </div>
    //         )}
    //         <div className="mt-6">
    //             <h3 className="text-lg font-semibold mb-2">Clearance Requests Summary</h3>
    //             <ResponsiveContainer width="100%" height={300}>
    //                 <BarChart data={chartData}>
    //                     <XAxis dataKey="name" />
    //                     <YAxis />
    //                     <Tooltip />
    //                     <Bar dataKey="value" fill="#3182CE" />
    //                 </BarChart>
    //             </ResponsiveContainer>
    //         </div>
    //     </div>
    // );
    return <AdminDash />;
};

export default AdminDashboard;

