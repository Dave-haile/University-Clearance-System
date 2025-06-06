import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../ui/Card";
import Button from "../ui/Button";
import { Loader2 } from "lucide-react";
import { MainLayout } from "../layout/MainLayout";

// Mock user data - Replace with actual API call
const mockUser = {
  id: 46,
  name: "Haile Sebho",
  username: "INUSR022313",
  email: null,
  role: "student",
  profile_image: null,
  student: {
    id: 17,
    student_id: "INUSR/0223/13",
    department: {
      department: "Software Engineering",
      college: "College of Engineering and Technology",
    },
  },
};

const clearanceSchema = z.object({
  year: z.string().min(1, "Year is required"),
  semester: z.string().min(1, "Semester is required"),
  section: z.string(),
  academic_year: z.string().min(1, "Academic year is required"),
  last_day_class_attended: z.string().min(1, "Last day of class is required"),
  reason_for_clearance: z.string().min(1, "Reason is required"),
  other_reason: z.string().optional(),
  cafe_status: z.enum(["cafe", "non-cafe"]),
  dorm_status: z.enum(["dorm", "non-dorm"]),
  sex: z.enum(["Male", "Female"]),
});

type ClearanceFormData = z.infer<typeof clearanceSchema>;

const ClearanceRequest: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ClearanceFormData>({
    resolver: zodResolver(clearanceSchema),
    mode: "onChange",
    defaultValues: {
      cafe_status: "cafe",
      dorm_status: "dorm",
    },
  });

  const reasonForClearance = watch("reason_for_clearance");

  const onSubmit = async (data: ClearanceFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch("/api/clearance-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit clearance request");
      }

      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-800">
              Request Clearance
            </h2>
            <p className="text-gray-600 mt-1">
              Fill out the form below to submit your clearance request
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Student Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={mockUser.student.student_id}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={mockUser.name}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <input
                      type="text"
                      value={mockUser.student.department.department}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      College
                    </label>
                    <input
                      type="text"
                      value={mockUser.student.department.college}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Clearance Details Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800">
                  Clearance Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Year
                    </label>
                    <input
                      type="text"
                      {...register("year")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.year && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.year.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Semester
                    </label>
                    <input
                      type="text"
                      {...register("semester")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.semester && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.semester.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Section
                    </label>
                    <input
                      type="text"
                      {...register("section")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.section && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.section.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      {...register("academic_year")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.academic_year && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.academic_year.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Day of Class Attended
                    </label>
                    <input
                      type="date"
                      {...register("last_day_class_attended")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.last_day_class_attended && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.last_day_class_attended.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sex
                    </label>
                    <select
                      {...register("sex")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.sex && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.sex.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reason for Clearance
                    </label>
                    <select
                      {...register("reason_for_clearance")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select a reason</option>
                      <option value="end_of_academic_year">
                        End of Academic Year
                      </option>
                      <option value="graduation">Graduation</option>
                      <option value="health_family">
                        Health/Family Issues
                      </option>
                      <option value="disciplinary">Disciplinary Case</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.reason_for_clearance && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.reason_for_clearance.message}
                      </p>
                    )}
                  </div>

                  {reasonForClearance === "other" && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Please specify the reason
                      </label>
                      <textarea
                        {...register("other_reason")}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.other_reason && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.other_reason.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cafeteria Status
                    </label>
                    <select
                      {...register("cafe_status")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="cafe">Cafe</option>
                      <option value="non-cafe">Non-Cafe</option>
                    </select>
                    {errors.cafe_status && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.cafe_status.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Dormitory Status
                    </label>
                    <select
                      {...register("dorm_status")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="dorm">Dorm</option>
                      <option value="non-dorm">Non-Dorm</option>
                    </select>
                    {errors.dorm_status && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.dorm_status.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            {submitError && (
              <div className="w-full p-4 bg-red-50 text-red-700 rounded-lg">
                {submitError}
              </div>
            )}

            {submitSuccess && (
              <div className="w-full p-4 bg-green-50 text-green-700 rounded-lg">
                Clearance request submitted successfully!
              </div>
            )}

            <Button
              variant="primary"
              className="w-full"
              disabled={!isValid || isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Clearance Request"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ClearanceRequest;
