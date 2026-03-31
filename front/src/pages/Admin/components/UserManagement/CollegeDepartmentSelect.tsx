
import React, { useEffect, useState } from 'react';
import { Building2, MapPin, ChevronDown } from 'lucide-react';

interface Department {
  college: string;
  department: string;
}

interface Props {
  register: any;
  errors: any;
  watch: any;
  setValue: any;
}

const CollegeDepartmentSelect: React.FC<Props> = ({
  register,
  errors,
  watch,
  setValue,
}) => {
  const [colleges, setColleges] = useState<string[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    // Simulated data for demo purposes
    const mockData: Department[] = [
      { college: "College of Engineering & Technology", department: "Computer Science" },
      { college: "College of Engineering & Technology", department: "Electrical Engineering" },
      { college: "College of Business & Economics", department: "Accounting" },
      { college: "College of Business & Economics", department: "Marketing Management" },
      { college: "College of Natural Sciences", department: "Statistics" },
      { college: "College of Natural Sciences", department: "Biology" },
      { college: "College of Humanities", department: "Psychology" },
      { college: "College of Agriculture", department: "Plant Science" },
    ];
    
    setColleges(Array.from(new Set(mockData.map(d => d.college))));
    setDepartments(mockData);
  }, []);

  const selectedCollege = watch("college");
  const filteredDepartments = departments.filter(dept => dept.college === selectedCollege);

  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setValue("college", value);
    setValue("department", ""); 
  };

  return (
    <>
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Affiliated College</label>
        <div className="relative">
          <Building2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            {...register("college")}
            onChange={handleCollegeChange}
            className={`w-full pl-11 pr-10 py-3.5 bg-white dark:bg-slate-800/50 border ${errors.college ? 'border-rose-500 ring-4 ring-rose-50 dark:ring-rose-900/10' : 'border-slate-200 dark:border-slate-700'} rounded-2xl text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-900 dark:text-slate-100 appearance-none shadow-sm`}
          >
            <option value="">Choose College...</option>
            {colleges.map((college) => (
              <option key={college} value={college}>{college}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        {errors.college && <p className="text-[10px] font-bold text-rose-500 ml-2 mt-1">{errors.college.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Assigned Department</label>
        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            {...register("department")}
            disabled={!selectedCollege}
            className={`w-full pl-11 pr-10 py-3.5 bg-white dark:bg-slate-800/50 border ${errors.department ? 'border-rose-500 ring-4 ring-rose-50 dark:ring-rose-900/10' : 'border-slate-200 dark:border-slate-700'} rounded-2xl text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-900 dark:text-slate-100 appearance-none disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-400 disabled:cursor-not-allowed shadow-sm`}
          >
            <option value="">{selectedCollege ? 'Select Specialization...' : 'Select College Above'}</option>
            {filteredDepartments.map((dept) => (
              <option key={dept.department} value={dept.department}>{dept.department}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        {errors.department && <p className="text-[10px] font-bold text-rose-500 ml-2 mt-1">{errors.department.message}</p>}
      </div>
    </>
  );
};

export default CollegeDepartmentSelect;
