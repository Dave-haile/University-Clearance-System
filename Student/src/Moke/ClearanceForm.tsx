
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// import "tailwindcss/tailwind.css";

// Define schema using Zod
const clearanceSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  sex: z.enum(['Male', 'Female']).refine(val => val !== undefined,{
    message: "Sex is Required"
  }),
  idNumber: z.string().min(1, 'ID Number is required'),
  college: z.string().min(1, 'College is required'),
  department: z.string().min(1, 'Department is required'),
  lastDayAttended: z.string().min(1, 'Last Day Attended is required'),
  academicYear: z.string().min(1, 'Academic Year is required'),
  yearOfStudy: z.enum(['I', 'II', 'III', 'IV', 'V']).refine((val) => val !== undefined, {
    message: 'Year of Study is required',
  }),
  semester: z.enum(['1', '2']).refine((val) => val !== undefined, {
    message: 'Semester is required',
  }),
  section: z.string().min(1, 'Section is required'),
  reasonForClearing: z
    .enum([
      'End of Academic Year',
      'Graduation',
      'Health/Family Issues',
      'Disciplinary Case',
      'Other',
    ])
    .refine((val) => val !== undefined, {
      message: 'Reason for clearing is required',
    }),
  otherReason: z.string().optional(),
});

const ClearanceForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(clearanceSchema),
    defaultValues: {
      fullName: '',
      sex: 'Male' as 'Male' | 'Female',
      idNumber: '',
      college: '',
      department: '',
      lastDayAttended: '',
      academicYear: '',
      yearOfStudy: 'I' as 'I' | 'II' | 'III' | 'IV' | 'V',
      semester: '1' as '1' | '2',
      section: '',
      reasonForClearing: 'End of Academic Year' as 'End of Academic Year' | 'Graduation' | 'Health/Family Issues' | 'Disciplinary Case' | 'Other',
      otherReason: '',
    },
  });

  const colleges = {
    'Engineering and Computational Science': ['Computer Science', 'Software Engineering', 'Electrical Engineering'],
    'Business and Economics': ['Accounting', 'Marketing', 'Finance'],
    'Health Sciences': ['Nursing', 'Pharmacy', 'Public Health'],
  };

  const selectedCollege = watch('college') as keyof typeof colleges;

  interface ClearanceFormData {
    fullName: string;
    sex: 'Male' | 'Female';
    idNumber: string;
    college: string;
    department: string;
    lastDayAttended: string;
    academicYear: string;
    yearOfStudy: 'I' | 'II' | 'III' | 'IV' | 'V';
    semester: '1' | '2';
    section: string;
    reasonForClearing: 'End of Academic Year' | 'Graduation' | 'Health/Family Issues' | 'Disciplinary Case' | 'Other';
    otherReason?: string;
  }

  const onSubmit = async (data: ClearanceFormData): Promise<void> => {
    try {
      const response = await fetch('https://your-supabase-url.supabase.co/rest/v1/clearance_form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'your-supabase-api-key',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to submit the form');

      alert('Form submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('Error submitting the form, please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">University Clearance Form</h1>

      {/* Full Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Full Name *</label>
        <input
          type="text"
          {...register('fullName')}
          className={`mt-1 block w-full rounded-md border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} p-2`}
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
      </div>

      {/* Sex */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Sex *</label>
        <select
          {...register('sex')}
          className={`mt-1 block w-full rounded-md border ${errors.sex ? 'border-red-500' : 'border-gray-300'} p-2`}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {errors.sex && <p className="text-red-500 text-sm">{errors.sex.message}</p>}
      </div>

      {/* ID Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium">ID Number *</label>
        <input
          type="text"
          {...register('idNumber')}
          className={`mt-1 block w-full rounded-md border ${errors.idNumber ? 'border-red-500' : 'border-gray-300'} p-2`}
        />
        {errors.idNumber && <p className="text-red-500 text-sm">{errors.idNumber.message}</p>}
      </div>

      {/* College */}
      <div className="mb-4">
        <label className="block text-sm font-medium">College *</label>
        <select
          {...register('college')}
          className={`mt-1 block w-full rounded-md border ${errors.college ? 'border-red-500' : 'border-gray-300'} p-2`}
        >
          <option value="">Select College</option>
          {Object.keys(colleges).map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
        {errors.college && <p className="text-red-500 text-sm">{errors.college.message}</p>}
      </div>

      {/* Department */}
      {selectedCollege && (
        <div className="mb-4">
          <label className="block text-sm font-medium">Department *</label>
          <select
            {...register('department')}
            className={`mt-1 block w-full rounded-md border ${errors.department ? 'border-red-500' : 'border-gray-300'} p-2`}
          >
            <option value="">Select Department</option>
            {colleges[selectedCollege].map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
        </div>
      )}

      {/* Add other fields following the same pattern */}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default ClearanceForm;
