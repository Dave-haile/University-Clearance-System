import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { User } from "@/types/student";

interface WelcomeCardProps {
  student: User[] | undefined;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ student }) => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);
  return (
    <Card className="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
      {student?.map((stud) => (
        <CardContent key={stud?.id} className="py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {stud?.name.split(" ")[0]}!
              </h1>
              <p className="mt-2 text-blue-100">
                Track and manage your university clearance process from one
                place.
              </p>
            </div>
            <div className="flex items-center text-blue-100 text-sm">
              <Calendar size={16} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-blue-100 text-sm">Department</p>
              <p className="font-medium mt-1">
                {stud?.student?.department?.department}
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-blue-100 text-sm">Student ID</p>
              <p className="font-medium mt-1">{stud?.student?.student_id}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-blue-100 text-sm">Academic Level</p>
              <p className="font-medium mt-1">{stud?.student?.year}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-blue-100 text-sm">Status</p>
              <p className="font-medium mt-1">Active</p>
            </div>
          </div>
        </CardContent>
      ))}
    </Card>
  );
};

export default WelcomeCard;
