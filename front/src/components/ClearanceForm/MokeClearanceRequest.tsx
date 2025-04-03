import React, { useState } from "react";
import axiosClient from "../../services/axiosBackend";
import axios from "axios";

const ClearanceRequest: React.FC = () => {
    const [formData, setFormData] = useState({
        year: "",
        semester: "",
        section: "",
        department: "",
        college: "",
        academic_year: "",
        last_day_class_attended: "",
        reason_for_clearance: "",
        cafe_status: "cafe",
        dorm_status: "dorm",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitRequest = async () => {
        setLoading(true);
        setMessage("");

        try {
            const response = await axiosClient.post("/clearance-request", formData);
            setMessage(response.data.message);
            console.log(response);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message || "An error occurred");
            } else {
                setMessage("An error occurred");
            }
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Request Clearance</h2>
            <input name="year" placeholder="Year" onChange={handleChange} className="border p-2 w-full mb-2" />
            <input name="semester" placeholder="Semester" onChange={handleChange} className="border p-2 w-full mb-2" />
            <input name="section" placeholder="Section" onChange={handleChange} className="border p-2 w-full mb-2" />
            <input name="department" placeholder="Department" onChange={handleChange} className="border p-2 w-full mb-2" />
            <input name="college" placeholder="College" onChange={handleChange} className="border p-2 w-full mb-2" />
            <input name="academic_year" placeholder="Academic Year" onChange={handleChange} className="border p-2 w-full mb-2" />
            <input type="date" name="last_day_class_attended" onChange={handleChange} className="border p-2 w-full mb-2" />
            <textarea name="reason_for_clearance" placeholder="Reason" onChange={handleChange} className="border p-2 w-full mb-2"></textarea>
            <select name="cafe_status" onChange={handleChange} className="border p-2 w-full mb-2">
                <option value="cafe">Cafe</option>
                <option value="none-cafe">Non-Cafe</option>
            </select>
            <select name="dorm_status" onChange={handleChange} className="border p-2 w-full mb-2">
                <option value="dorm">Dorm</option>
                <option value="non-dorm">Non-Dorm</option>
            </select>

            <button
                onClick={submitRequest}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                {loading ? "Submitting..." : "Submit Request"}
            </button>
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
};

export default ClearanceRequest;
