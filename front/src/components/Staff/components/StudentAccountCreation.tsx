import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import axiosClient from "../../../services/axiosBackend";


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
  type FromFields = z.infer<typeof schema>;

  const {register,handleSubmit,setError,formState: { isSubmitting, errors }} = useForm<FromFields>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<FromFields> = async (formData) => {
    try {
      await axiosClient.post("/create-student", formData).then(({data})=>{
        setReturnData({
          message: data.message,
          email: data.username,
          password: data.password
        })
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('root', { message: err.message });
        console.log(`Error: ${err.message}`);
      } else {
        setError('root', { message: String(err) });
        console.log(`Error: ${err}`);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Student Account</h2>
      {returnData && returnData.message && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p className="font-bold">Success</p>
          <p>{returnData.message}</p>
          <p>Email: {returnData.email}</p>
          <p>Password: {returnData.password}</p>
        </div>
      )}
      {errors.root && <p className="text-red-600">{errors.root?.message}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
        {...register('name')}
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          required
        />
        {errors.name && <p className="text-red-600">{errors.name?.message}</p>}
        <input
        {...register('student_id')}
          type="text"
          placeholder="Student ID"
          className="w-full p-2 border rounded"
          required
        />
        {errors.student_id && <p className="text-red-600">{errors.student_id?.message}</p>}
        <input
        {...register('department')}
          type="text"
          placeholder="Department"
          className="w-full p-2 border rounded"
          required
        />
        {errors.department && <p className="text-red-600">{errors.department?.message}</p>}
        <select
        {...register('year')}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Year</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
        {errors.year && <p className="text-red-600">{errors.year?.message}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Student'}
        </button>
      </form>
    </div>
  );
};

export default StudentRegistration;
