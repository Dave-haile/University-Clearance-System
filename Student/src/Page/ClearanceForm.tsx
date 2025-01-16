import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { colleges } from "../components/ClearanceForm/data/collage";
import { clearanceFormSchema, type ClearanceFormData } from "../components/ClearanceForm/data/schema";
import { supabase } from "../supabaseClient";
import { Input } from "../components/ClearanceForm/ui/Input";
import { Select } from "../components/ClearanceForm/ui/Select";
import { RadioGroup } from "../components/ClearanceForm/ui/RadioGroup";
import { TextArea } from "../components/ClearanceForm/ui/TextArea";

const yearOptions = [
  { value: "1", label: "First Year" },
  { value: "2", label: "Second Year" },
  { value: "3", label: "Third Year" },
  { value: "4", label: "Fourth Year" },
  { value: "5", label: "Fifth Year" },
];

const semesterOptions = [
  { value: "1", label: "First Semester" },
  { value: "2", label: "Second Semester" },
  { value: "summer", label: "Summer" },
];

const clearingReasons = [
  { value: "end_of_academic_year", label: "End of Academic Year" },
  { value: "graduation", label: "Graduation" },
  { value: "health_family", label: "Health/Family Issues" },
  { value: "disciplinary", label: "Disciplinary Case" },
  { value: "other", label: "Other" },
];

function ClearanceForm2() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };

    fetchUser();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
    setValue,
  } = useForm<ClearanceFormData>({
    resolver: zodResolver(clearanceFormSchema),
  });

  const selectedCollege = watch("college");
  const selectedReason = watch("reason_for_clearing");
  const departments =
    colleges.find((c) => c.name === selectedCollege)?.departments || [];

  const onSubmit = async (data: ClearanceFormData) => {
    if (!supabase) return;
    if (!userId) {
      alert("Your are not logged in");
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage(null);

    try {
      const { data: existingRecord, error: checkError } = await supabase
        .from("student-data")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingRecord) {
        const { error } = await supabase
        .from("student-data")
        .update({
          academic_year: data.academic_year,
          year_of_study: data.year_of_study,
          department: data.department,
          full_name: data.first_name,
          id_number: data.id_number,
          last_day_attended: data.last_day_attended,
          reason_for_clearing: data.reason_for_clearing,
          section: data.section,
          semester: data.semester,
        })
        .eq("user_id", userId);
        console.log(error)
      }

      const { error } = await supabase
      .from("student-data")
      .insert({
        user_id: userId,
        academic_year: data.academic_year,
        year_of_study: data.year_of_study,
        department: data.department,
        first_name: data.first_name,
        id_number: data.id_number,
        last_day_attended: data.last_day_attended,
        reason_for_clearing: data.reason_for_clearing,
        section: data.section,
        semester: data.semester,
      });

      if (error) throw error;

      setSubmitStatus("success");
      console.log(submitStatus)
    } catch (error) {
      console.error("Supabase error:", error);
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setError("root", {
        message: (error as Error).message,
      });
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An error occurred while submitting the form"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          University Clearance Form
        </h1>
        <p className="text-gray-600 mt-2">
          Please fill out all required fields marked with an asterisk (*)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          required
          {...register("first_name")}
          error={errors.first_name?.message}
        />

        <Select
          label="Sex"
          required
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
          ]}
          {...register("sex")}
          error={errors.sex?.message}
        />

        <Input
          label="ID Number"
          required
          {...register("id_number")}
          error={errors.id_number?.message}
        />

        <Select
          label="College"
          required
          options={colleges.map((college) => ({
            value: college.name,
            label: college.name,
          }))}
          {...register("college")}
          error={errors.college?.message}
          onChange={(e) => {
            setValue("college", e.target.value);
            setValue("department", "");
          }}
        />

        <Select
          label="Department"
          required
          options={departments.map((dept) => ({
            value: dept,
            label: dept,
          }))}
          {...register("department")}
          error={errors.department?.message}
          disabled={!selectedCollege}
        />

        <Input
          label="Last Day Attended"
          type="date"
          required
          {...register("last_day_attended")}
          error={errors.last_day_attended?.message}
        />

        <Input
          label="Academic Year"
          required
          placeholder="e.g., 2023/2024"
          {...register("academic_year")}
          error={errors.academic_year?.message}
        />

        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          <Select
            label="Year of Study"
            required
            options={yearOptions}
            {...register("year_of_study")}
            error={errors.year_of_study?.message}
          />

          <Select
            label="Semester"
            required
            options={semesterOptions}
            {...register("semester")}
            error={errors.semester?.message}
          />

          <Input
            label="Section (if any)"
            {...register("section")}
            error={errors.section?.message}
          />
        </div>

        <div className="md:col-span-2">
          <RadioGroup
            label="Reason for Clearing"
            name="reason_for_clearing"
            options={clearingReasons}
            value={selectedReason}
            onChange={(e) => setValue("reason_for_clearing", e.target.value)}
            error={errors.reason_for_clearing?.message}
          />
        </div>

        {selectedReason === "other" && (
          <div className="md:col-span-2">
            <TextArea
              label="Please specify other reason"
              required
              rows={3}
              {...register("other_reason")}
              error={errors.other_reason?.message}
            />
          </div>
        )}

        {/* <div className="md:col-span-2">
          <TextArea
            label="Reason to Approve"
            rows={4}
            {...register("reason_to_approve")}
            error={errors.reason_to_approve?.message}
          />
        </div> */}
      </div>

      {submitStatus === "success" && (
        <div className="p-4 bg-green-50 text-green-700 rounded-md">
          Form submitted successfully!
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error submitting form</p>
            {errorMessage && <p className="mt-1 text-sm">{errorMessage}</p>}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            Submitting...
          </>
        ) : (
          "Submit Clearance Form"
        )}
      </button>
    </form>
  );
}

export default ClearanceForm2;
