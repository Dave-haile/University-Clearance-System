import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  User as UserIcon,
  Upload,
  RefreshCcw,
} from "lucide-react";
import { MainLayout } from "../components/layout/MainLayout";
import { toast } from "sonner";
import axiosClient from "@/services/axiosBackend";
import { User } from "@/types/user";
import { getFullMemberSinceDate } from "@/pages/Admin/utils/formatDate";
import { generateAvatar } from "@/pages/Admin/utils/avatarGenerator";
import axios from "axios";

interface StudentProfileProps {
  userData?: User | null;
  onRefresh: () => Promise<void>;
}

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<User>();

  const prfileFetch = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/student/profile/show");
      setData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    prfileFetch();
  }, []);

  if (loading && !data) {
    return (
      <MainLayout>
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Loading your profile data</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <div className="animate-pulse bg-gray-200 h-24 w-24 rounded-full" />
          </CardContent>
        </Card>
      </MainLayout>
    );
  }
  return (
    <MainLayout>
      <StudentProfile userData={data} onRefresh={prfileFetch} />
    </MainLayout>
  );
}

function StudentProfile({ userData, onRefresh }: StudentProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [formData, setFormData] = useState({
    name: userData?.name || "",
    username: userData?.username || "",
    email: userData?.email || "",
    oldPassword: "",
    new_password: "",
    new_password_confirmation: "",
    profileImage: null as File | null,
  });
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      toast.success("Profile data refreshed successfully");
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        profileImage: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.new_password ||
      formData.oldPassword ||
      formData.new_password_confirmation
    ) {
      if (!formData.oldPassword) {
        toast.error("Please enter your current password");
        return;
      }

      if (formData.new_password !== formData.new_password_confirmation) {
        toast.error("New password and confirmation must match.");
        return;
      }

      if (formData.new_password && formData.new_password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
      }
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("oldPassword", formData.oldPassword);
    form.append("new_password", formData.new_password);
    form.append(
      "new_password_confirmation",
      formData.new_password_confirmation
    );

    if (formData.profileImage) {
      form.append("profileImage", formData.profileImage);
    }

    console.log("form Data", formData);
    console.log("profile Data", formData.profileImage);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/student/profile/update`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Update response:", response.data);
      toast.success("Your profile information has been updated successfully.");
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("There was a problem updating your profile.");
    }
  };
  const fullData = getFullMemberSinceDate(userData?.created_at || "");
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Profile Information Card */}
        <Card className="w-full md:w-2/3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Student Profile</CardTitle>
              <div>
                <Button onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCcw
                    className={`w-4 h-4 mr-2 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
            </div>
            <CardDescription>
              View and update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Profile Image */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Avatar className="w-24 h-24">
                    {imagePreview ? (
                      <AvatarImage
                        src={imagePreview}
                        alt={userData?.name || ""}
                      />
                    ) : userData?.profile_image ? (
                      <AvatarImage
                        src={userData.profile_image}
                        alt={userData.name}
                      />
                    ) : (
                      <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                        {userData?.name ? generateAvatar(userData.name) : "??"}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1">
                    <Label htmlFor="profileImage" className="block mb-2">
                      Profile Picture
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="profileImage"
                        name="profileImage"
                        type="file"
                        className="max-w-xs"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={!isEditing}
                      />
                      {isEditing && (
                        <div className="relative">
                          <Input
                            id="hiddenFileInput"
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden"
                            onChange={handleImageUpload}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById("hiddenFileInput")
                                ?.click()
                            }
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="flex gap-2">
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        value={userData?.student?.student_id || ""}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Academic Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Academic Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={userData?.student?.department?.department || ""}
                        disabled={true}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="college">College</Label>
                      <Input
                        id="college"
                        value={userData?.student?.department?.college || ""}
                        disabled={true}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        value={userData?.student?.year || ""}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                {isEditing && (
                  <>
                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Change Password</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="oldPassword">Current Password</Label>
                          <Input
                            id="oldPassword"
                            name="oldPassword"
                            type={showPassword ? "text" : "password"}
                            value={formData.oldPassword}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new_password">New Password</Label>
                          <div className="relative">
                            <Input
                              id="new_password"
                              name="new_password"
                              type={showPassword ? "text" : "password"}
                              value={formData.new_password}
                              onChange={handleInputChange}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-2.5 text-gray-500"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new_password_confirmation">
                            Confirm New Password
                          </Label>
                          <Input
                            id="new_password_confirmation"
                            name="new_password_confirmation"
                            type={showPassword ? "text" : "password"}
                            value={formData.new_password_confirmation}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      {formData.new_password && (
                        <div className="text-xs text-muted-foreground">
                          Password must be at least 8 characters long.
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setImagePreview(null);
                          setFormData({
                            name: userData?.name || "",
                            username: userData?.username || "",
                            email: userData?.email || "",
                            oldPassword: "",
                            new_password: "",
                            new_password_confirmation: "",
                            profileImage: null,
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      <UserIcon className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">
                Account Type
              </h4>
              <p>{userData?.role} </p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground">
                Member Since
              </h4>
              <p>{fullData} </p>
            </div>
            <Separator />

            <div className="pt-4">
              <h4 className="font-medium mb-2">Account Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Request Account Information
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Download Personal Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
