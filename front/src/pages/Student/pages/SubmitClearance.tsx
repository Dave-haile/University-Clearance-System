import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MainLayout } from "../components/layout/MainLayout";
import { toast } from "sonner";
import { ClearanceRequestForm } from "../components/ClearanceManagment/ClearanceRequestForm";
import axiosClient from "@/services/axiosBackend";
import { User } from "@/types";

export default function SubmitClearance() {
  const [studentData, setStudentData] = useState<User | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const studentDataFetch = async () => {
    try {
      const response = await axiosClient.get("/student/data");
      setStudentData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to load student data. Please refresh the page.");
      setLoading(false);
      toast.error("Failed to load student data. Please refresh the page.");
    }
  };
  useEffect(() => {
    studentDataFetch();
  }, []);
  return (
    <MainLayout>
      <div className="w-full max-w-8xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Submit Clearance Request
        </h1>

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : loading ? (
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-8 w-60" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-5 w-full max-w-md" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <ClearanceRequestForm studentData={studentData!} />
        )}
      </div>
    </MainLayout>
  );
}
