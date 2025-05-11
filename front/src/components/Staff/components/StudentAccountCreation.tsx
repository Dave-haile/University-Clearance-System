// import { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { z } from "zod";
// import axiosClient from "../../../services/axiosBackend";
// import { Loader2 } from "lucide-react"; // Optional icon (install lucide-react)

// const StudentRegistration = () => {
//   type ReturnData = {
//     message: string;
//     email: string;
//     password: string;
//   };

//   const [returnData, setReturnData] = useState<ReturnData | null>(null);

//   const schema = z.object({
//     name: z.string().min(1, "Name is required"),
//     student_id: z.string().min(1, "Student ID is required"),
//     department: z.string().min(1, "Department is required"),
//     year: z.string().min(1, "Year is required"),
//   });

//   type FormFields = z.infer<typeof schema>;

//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { isSubmitting, errors },
//   } = useForm<FormFields>({ resolver: zodResolver(schema) });

//   const onSubmit: SubmitHandler<FormFields> = async (formData) => {
//     try {
//       const { data } = await axiosClient.post("/create-student", formData);
//       setReturnData({
//         message: data.message,
//         email: data.username,
//         password: data.password,
//       });
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setError("root", { message: err.message });
//         console.error(`Error: ${err.message}`);
//       } else {
//         setError("root", { message: String(err) });
//         console.error(`Error: ${err}`);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 text-center">
//           <h2 className="text-2xl font-semibold">Create Student Account</h2>
//         </div>

//         <div className="px-6 py-6">
//           {returnData && (
//             <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-4">
//               <p className="font-semibold">✅ {returnData.message}</p>
//               <p><span className="font-semibold">Username:</span> {returnData.email}</p>
//               <p><span className="font-semibold">Password:</span> {returnData.password}</p>
//             </div>
//           )}

//           {errors.root && (
//             <p className="text-red-600 text-sm mb-2">{errors.root.message}</p>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//               <input
//                 {...register("name")}
//                 type="text"
//                 placeholder="Full Name"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
//               )}
//             </div>

//             <div>
//               <input
//                 {...register("student_id")}
//                 type="text"
//                 placeholder="Student ID"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               {errors.student_id && (
//                 <p className="text-red-500 text-sm mt-1">{errors.student_id.message}</p>
//               )}
//             </div>

//             <div>
//               <input
//                 {...register("department")}
//                 type="text"
//                 placeholder="Department"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               {errors.department && (
//                 <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
//               )}
//             </div>

//             <div>
//               <select
//                 {...register("year")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//               >
//                 <option value="">Select Year</option>
//                 <option value="1st Year">1st Year</option>
//                 <option value="2nd Year">2nd Year</option>
//                 <option value="3rd Year">3rd Year</option>
//                 <option value="4th Year">4th Year</option>
//               </select>
//               {errors.year && (
//                 <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200"
//             >
//               {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
//               {isSubmitting ? "Creating..." : "Create Student"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentRegistration;

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Check, Loader2 } from "lucide-react";
import { Card, CardContent } from "../../../pages/Admin/components/ui/card";
import { toast } from "sonner";
import axiosClient from "../../../services/axiosBackend";
import { Label } from "../../../pages/Admin/components/ui/label";
import CollegeDepartmentSelect from "../../../pages/Admin/components/DepartmentManagement/DepartmentCollegeFetch";
const StudentRegistration = () => {
  type ReturnData = {
    message: string;
    email: string;
    password: string;
  };

  const [returnData, setReturnData] = useState<ReturnData | null>({
    message: "",
    email: "",
    password: "",
  });
  
  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    student_id: z.string().min(1, "Student ID is required"),
    department: z.string().min(1, "Department is required"),
    year: z.string().min(1, "Year is required"),
  });

  type FormFields = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormFields>({ resolver: zodResolver(schema) });
  // const {toast} = useToast();

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const response = await axiosClient.post("/create-student", formData);
      setReturnData({
        message: response.data.message,
        email: response.data.username,
        password: response.data.password,
      });
      toast.success(response.data.message || "Student Account Created Successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("root", { message: err.message });
        console.log(`Error: ${err}`);
      } else {
        setError("root", { message: String(err) });
        console.log(`Error: ${err}`);
      }
    }
  };

  const handleYearChange = (value: string) => {
    setValue("year", value);
  };

  return (
    // <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
    // <div className="w-full max-w-md">
    <Card className="border-0 animate-fade-in">
      <CardContent className="border-0 p-0">
        {returnData && returnData.message && (
          <div className="rounded-lg bg-green-50 border-l-4 border-green-500 p-4 animate-fade-in">
            <div className="flex items-center space-x-2 text-green-700 font-medium">
              <Check className="h-5 w-5" />
              <span>Success</span>
            </div>
            <p className="mt-2 text-green-700">{returnData.message}</p>
            <div className="mt-2 p-3 bg-white rounded border border-green-200 text-sm">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-600">Username:</span>
                <span className="font-semibold">{returnData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Password:</span>
                <span className="font-semibold">{returnData.password}</span>
              </div>
            </div>
          </div>
        )}

        {errors.root && (
          <div className="rounded-lg bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            <p className="font-medium">Error</p>
            <p>{errors.root?.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              {...register("name")}
              placeholder="Enter Student's Full Name"
              className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name?.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="student_id"
            >
              Student ID
            </label>
            <input
              id="student_id"
              {...register("student_id")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter Student's ID"
            />
            {errors.student_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.student_id?.message}
              </p>
            )}
          </div>
          <CollegeDepartmentSelect
            onDepartmentChange={(department) => {
              setValue("department", department); // Set the selected department in the form
            }}
          />
          {/* <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="department"
            >
              Department
            </label>
            <input
              id="department"
              {...register("department")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter Student's Department"
            /> */}
          {errors.department && (
            <p className="text-red-500 text-xs mt-1">
              {errors.department?.message}
            </p>
          )}
          {/* </div> */}

          <div className="space-y-2">
            <Label htmlFor="year">Year of Study</Label>
            <select
              {...register("year")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="4th Year">5th Year</option>
              <option value="4th Year">6th Year</option>
            </select>
            <input type="hidden" {...register("year")} />
            {errors.year && (
              <p className="text-red-500 text-xs mt-1">
                {errors.year?.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200"
          >
            {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
            {isSubmitting ? "Creating..." : "Create Student"}
          </button>
        </form>
      </CardContent>
    </Card>
    // </div>
    // </div>
  );
};

export default StudentRegistration;
