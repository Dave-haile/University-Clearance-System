import React from "react";
import { FileUp, History, User } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

const QuickActions: React.FC = () => {
  const navigator = useNavigate();
  const actionsData = [
    {
      id: "submit",
      title: "Submit New Request",
      description: "Start a new clearance application",
      icon: <FileUp size={18} />,
      variant: "primary",
      btnOnClick: "/student/submit-clearance",
    },
    {
      id: "history",
      title: "View History",
      description: "Access your past clearance records",
      icon: <History size={18} />,
      variant: "outline" as const,
      btnOnClick: "/student/clearance-history",
    },
    {
      id: "profile",
      title: "Edit Profile",
      description: "Edit Your Name, Password, Profile Image ",
      icon: <User size={18} />,
      variant: "secondary" as const,
      btnOnClick: "/student/profile",
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {actionsData.map((action) => (
            
              <div
                key={action.id}
                className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`
                  p-2 rounded-lg text-white
                  ${
                    action.variant === "primary"
                      ? "bg-blue-800"
                      : action.variant === "secondary"
                      ? "bg-cyan-300"
                      : "bg-gray-100 text-gray-700"
                  }
                `}
                  >
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {action.description}
                    </p>
                    <Button
                      variant={
                        action.variant === "primary" ? "primary" : "outline"
                      }
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => {
                        navigator(action.btnOnClick);
                      }}
                    >
                      {action.variant === "primary" ? "Start Now" : action.variant === "secondary" ? "Edit Now" : "View Now"}
                    </Button>
                  </div>
                </div>
              </div>
            
          ))}
          </div>
        </CardContent>
      </Card>
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
        <div className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors bg-white">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg text-white bg-blue-800`}>
              <FileUp size={18} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">Submit New Request</h3>
              <p className="text-xs text-gray-500 mt-1">
                Start a new clearance application
              </p>
              <Button
                variant={"primary"}
                size="sm"
                className="mt-2 w-full"
                onClick={() => {
                  navigator("/student/submit-clearance");
                }}
              >
                Start Now
              </Button>
            </div>
          </div>
        </div>
        <div className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors bg-white absolute bottom-0 left-1/2">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg text-white bg-blue-800`}>
              <FileUp size={18} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">Submit New Request</h3>
              <p className="text-xs text-gray-500 mt-1">
                Start a new clearance application
              </p>
              <Button
                variant={"primary"}
                size="sm"
                className="mt-2 w-full"
                onClick={() => {
                  navigator("/student/submit-clearance");
                }}
              >
                Start Now
              </Button>
            </div>
          </div>
        </div>
        <div className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors bg-white absolute bottom-0 right-0 h-[14rem]">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg text-white bg-blue-800`}>
              <FileUp size={18} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">Submit New Request</h3>
              <p className="text-xs text-gray-500 mt-1">
                Start a new clearance application
              </p>
              <Button
                variant={"primary"}
                size="sm"
                className="mt-2 w-full"
                onClick={() => {
                  navigator("/student/submit-clearance");
                }}
              >
                Start Now
              </Button>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default QuickActions;
