import { useState } from "react";
import axios from "axios";

const StudentUpload = () => {
  type StudentData = {
    name: string;
    username: string;
    password: string;
    department: string;
    year: string;
    student_id: string;
  };

  type ReturnData = {
    message: string;
    students: StudentData[];
  };

  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ReturnData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    if (!file) {
      setData({
        message: "Please select a CSV file",
        students: [],
      });
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload-students`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setData({
        message: response.data.message,
        students: response.data.students,
      });
      // console.log(response)
      console.log(response.data);

      setIsLoading(false);
    } catch (error) {
      setData({
        message: `Failed to upload students. ${error}`,
        students: [],
      });
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-3">Upload Students via CSV</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4 p-2 border"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? "Uploading..." : "Upload"}
      </button>

      {data && data.message && (
        <>
          <p className="font-bold text-green-400">Success</p>
          <p className="text-green-400">{data.message}</p>
          <div className="bg-[#e5e5e5] border-l-4 border-[#14213d] text-[#05445e] p-4 mt-4">
            {data.students.length > 0 && (
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="bg-gray-200">
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Student Id
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Username
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Password
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Department
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Year
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.students.map((student, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {student.name}
                        </th>
                        <td className="px-6 py-4">{student.student_id}</td>
                        <td className="px-6 py-4">{student.username}</td>
                        <td className="px-6 py-4">{student.password}</td>
                        <td className="px-6 py-4">{student.department}</td>
                        <td className="px-6 py-4">{student.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentUpload;
