import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { colleges } from "./data/collage";
import { clearanceFormSchema, type ClearanceFormData } from "./data/schema";
import {
  yearOptions,
  clearingReasons,
  semesterOptions,
  cafeStatus,
  dormStatus,
} from "./data/options";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { RadioGroup } from "./ui/RadioGroup";
import { TextArea } from "./ui/TextArea";
import axiosClient from "../../services/axiosBackend";
import axios from "axios";
import { useStateContext } from "../../context/context";

function ClearanceForm2() {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isLoading },
    setValue,
  } = useForm<ClearanceFormData>({
    resolver: zodResolver(clearanceFormSchema),
  });

  const [message, setMessage] = useState("");
  const selectedCollege = watch("college");
  const selectedReason = watch("reason_for_clearance");
  const departments =
    colleges.find((c) => c.name === selectedCollege)?.departments || [];
  const { users } = useStateContext();
  const date = new Date().getFullYear();

  const onSubmit = async (formData: ClearanceFormData) => {
    console.log(formData);
    try {
      const response = await axiosClient.post("/clearance-request", formData);
      setMessage(response.data.message);
      console.log(response);
      console.log(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "An error occurred");
        setError("root", {
          message: error.response?.data?.message || "An error occurred",
        });
      } else {
        setMessage("An error occurred");
        setError("root", { message: "An error occurred" });
      }
      console.log(error);
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
          disabled={true}
          value={users?.name}
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
          value={users?.student?.student_id}
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
          {...register("last_day_class_attended")}
          error={errors.last_day_class_attended?.message}
        />

        <Input
          label="Academic Year"
          required
          placeholder="e.g., 2023/2024"
          {...register("academic_year")}
          error={errors.academic_year?.message}
          value={date - 8}
        />

        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          <Select
            label="Year of Study"
            required
            options={yearOptions}
            {...register("year")}
            error={errors.year?.message}
          />

          <Select
            label="Semester"
            required
            options={semesterOptions}
            {...register("semester")}
            error={errors.semester?.message}
          />

          <Input
            label="Section"
            required
            {...register("section")}
            error={errors.section?.message}
          />
        </div>

        <div className="md:col-span-2">
          <RadioGroup
            label="Reason for Clearing"
            name="reason_for_clearance"
            options={clearingReasons}
            value={selectedReason}
            onChange={(e) => setValue("reason_for_clearance", e.target.value)}
            error={errors.reason_for_clearance?.message}
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
      </div>
      <div className="grid grid-cols-2 gap-4 md:col-span-2">
        <Select
          label="Cafe Status"
          options={cafeStatus}
          {...register("cafe_status")}
          error={errors.cafe_status?.message}
        />
        <Select
          label="Dorm Status"
          options={dormStatus}
          {...register("dorm_status")}
          error={errors.dorm_status?.message}
        />
      </div>
      {message && (
        <div className="p-4 bg-green-50 text-green-700 rounded-md">
          {message}
        </div>
      )}

      {errors.root && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error submitting form</p>
            <p className="mt-1 text-sm">{errors.root?.message}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
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
