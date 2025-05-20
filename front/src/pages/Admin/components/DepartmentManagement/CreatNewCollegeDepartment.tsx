import { useEffect, useState } from "react";
import axiosClient from "../../../../services/axiosBackend";

const CreateNewCollegeDepartment = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [colleges, setColleges] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    department: "",
    college: "",
  });

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axiosClient.get("/departmentDisplay");
        const data = response.data;
        const collegeList = [
          ...new Set(data.map((d: { college: string }) => d.college)),
        ] as string[];
        setColleges(collegeList);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };
    fetchColleges();
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const departmentData = {
      department: formData.department,
      college: formData.college,
    };
    console.log(departmentData);

    try {
      const response = await axiosClient.post(
        "/admin/create-department",
        departmentData
      );
      console.log("Department created:", response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={() => setShowLoginForm(!showLoginForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Show Login
      </button>
      {showLoginForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowLoginForm(!showLoginForm)}
          ></div>
          <div className="bg-white p-8 rounded-lg shadow-lg z-50 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="College"
                  className="block text-sm font-medium text-gray-700"
                >
                  College
                </label>
                <div className="flex">
                  {showInput ? (
                    <input
                      required
                      type="College"
                      id="College"
                      onChange={(e) =>
                        setFormData({ ...formData, college: e.target.value })
                      }
                      placeholder="Enter the Name of the new College"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  ) : (
                    <select
                      onChange={(e) => {
                        setFormData({ ...formData, college: e.target.value });
                      }}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select College</option>
                      {colleges.map((college) => (
                        <option key={college} value={college}>
                          {college}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    onClick={() => {
                      setShowInput(!showInput);
                    }}
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold ml-3 py-0 px-4 rounded"
                  >
                    {showInput ? "Existing College" : "New College"}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="Department"
                  className="block text-sm font-medium text-gray-700"
                >
                  Department
                </label>
                <input
                  type="Department"
                  required
                  id="Department"
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  placeholder="Enter the Name of the new Department"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewCollegeDepartment;
