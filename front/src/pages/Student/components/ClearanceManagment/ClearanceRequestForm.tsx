import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/pages/Admin/lib/utils";
import axiosClient from "@/services/axiosBackend";
import axios from "axios";
import { User } from "@/types";

interface ClearanceRequestFormProps {
  studentData: User;
}

const formSchema = z
  .object({
    year: z.string().min(1, "Year is required"),
    semester: z.string().min(1, "Semester is required"),
    section: z.string(),
    academic_year: z.string().min(1, "Academic year is required"),
    last_day_class_attended: z.date({
      required_error: "Last day of class attended is required",
    }),
    reason_for_clearance: z.string().min(1, "Reason for clearance is required"),
    other_reason: z.string().optional(),
    cafe_status: z.enum(["cafe", "non-cafe"], {
      required_error: "Cafe status is required",
    }),
    dorm_status: z.enum(["dorm", "non-dorm"], {
      required_error: "Dorm status is required",
    }),
    sex: z.enum(["Male", "Female"], {
      required_error: "Sex is required",
    }),
  })
  .refine(
    (data) => {
      // If reason for clearance is "Other", other_reason must be provided
      return (
        data.reason_for_clearance !== "Other" ||
        (data.reason_for_clearance === "Other" &&
          data.other_reason &&
          data.other_reason.trim().length > 0)
      );
    },
    {
      message: "Please provide details for other reason",
      path: ["other_reason"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

export function ClearanceRequestForm({
  studentData,
}: ClearanceRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: "",
      semester: "",
      section: "",
      academic_year: "",
      reason_for_clearance: "end_of_academic_year",
      cafe_status: "cafe",
      dorm_status: "dorm",
      sex: "Male",
    },
  });

  const watchReasonForClearance = form.watch("reason_for_clearance");

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    console.log(data);
    try {
      const formattedDate = format(data.last_day_class_attended, "yyyy-MM-dd");
      const formData = {
        ...data,
        last_day_class_attended: formattedDate,
        ...(data.reason_for_clearance !== "Other" && {
          other_reason: undefined,
        }),
      };
      const response = await axiosClient.post("/clearance-request", formData);
      console.log(response.data);
      toast.success("Your clearance request has been submitted successfully.");
      form.reset();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error submitting form:", error.response?.data?.message);
        if (error.status === 400) {
          toast.error(
            error.response?.data?.message ||
              "Failed to submit clearance request. Please try again."
          );
        } else {
          toast.error("Failed to submit clearance request. Please try again.");
        }
      } else {
        console.log(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-secondary/20">
        <CardTitle>Clearance Request Form</CardTitle>
        <CardDescription>
          Fill out this form to request a university clearance
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Student Info Section (Read-only) */}
        <div className="bg-muted/30 rounded-md p-4 mb-6">
          <h3 className="text-lg font-medium mb-3">Student Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="student_id">Student ID</Label>
              <Input
                id="student_id"
                value={studentData?.student?.student_id || "N/A"}
                disabled
                className="bg-background/50 disabled:cursor-default"
              />
            </div>
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={studentData?.name || "N/A"}
                disabled
                className="bg-background/50 disabled:cursor-default"
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={studentData?.student?.department?.department || "N/A"}
                disabled
                className="bg-background/50 disabled:cursor-default"
              />
            </div>
            <div>
              <Label htmlFor="college">College</Label>
              <Input
                id="college"
                value={studentData?.student?.department?.college || "N/A"}
                disabled
                className="bg-background/50 disabled:cursor-default"
              />
            </div>
          </div>
        </div>

        {/* Clearance Request Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st Year">1st Year</SelectItem>
                          <SelectItem value="2nd Year">2nd Year</SelectItem>
                          <SelectItem value="3rd Year">3rd Year</SelectItem>
                          <SelectItem value="4th Year">4th Year</SelectItem>
                          <SelectItem value="5th Year">5th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="First">1st Semester</SelectItem>
                          <SelectItem value="Second">2nd Semester</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section (if any)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter section" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academic_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. 2016/2017" {...field} />
                    </FormControl>
                    <FormDescription>Format: YYYY/YYYY</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_day_class_attended"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Last Day of Class Attended</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cafe_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cafe Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cafe status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cafe">Cafe</SelectItem>
                          <SelectItem value="non-cafe">Non-Cafe</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dorm_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dorm Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select dorm status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dorm">Dorm</SelectItem>
                          <SelectItem value="non-dorm">Non-Dorm</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="reason_for_clearance"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Reason for Clearance</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col gap-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="end_of_academic_year" />
                          </FormControl>
                          <FormLabel className="cursor-pointer font-normal">
                            End of Academic Year
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="graduation" />
                          </FormControl>
                          <FormLabel className="cursor-pointer font-normal">
                            Graduation
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="health_family_issues" />
                          </FormControl>
                          <FormLabel className="cursor-pointer font-normal">
                            Health/Family Issues
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="disciplinary_case" />
                          </FormControl>
                          <FormLabel className="cursor-pointer font-normal">
                            Disciplinary Case
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Other" />
                          </FormControl>
                          <FormLabel className="cursor-pointer font-normal">
                            Other
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchReasonForClearance === "Other" && (
                <FormField
                  control={form.control}
                  name="other_reason"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Please specify other reason</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide details about your reason for clearance"
                          {...field}
                          className="min-h-24"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={isSubmitting || !form.formState.isValid}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
