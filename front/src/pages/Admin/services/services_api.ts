import { User, ClearanceRequest, Department, ActivityItem, ChartData, Metric } from "../../../types";
import { toast } from "sonner";

// Base API configuration
const API_DELAY = 500; // Simulate network delay

// Mock data for users
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    isActive: true,
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=admin",
  },
  {
    id: "2",
    name: "Manager Smith",
    email: "manager@example.com",
    role: "manager",
    department: "Engineering",
    isActive: true,
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=manager",
  },
  {
    id: "3",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "user",
    department: "HR",
    isActive: true,
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=jane",
  },
  {
    id: "4",
    name: "John Brown",
    email: "john@example.com",
    role: "user",
    department: "Marketing",
    isActive: false,
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=john",
  },
  {
    id: "5",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "manager",
    department: "Sales",
    isActive: true,
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=sarah",
  },
];

// Mock data for clearance requests
const mockRequests: ClearanceRequest[] = [
  {
    id: "101",
    title: "Software License Request",
    description: "Request for Adobe Creative Cloud license",
    department: "Marketing",
    status: "approved",
    userId: "4",
    userName: "John Brown",
    createdAt: "2023-04-15T10:30:00Z",
    updatedAt: "2023-04-16T14:20:00Z",
  },
  {
    id: "102",
    title: "Database Access Request",
    description: "Need access to production database for debugging",
    department: "Engineering",
    status: "pending",
    userId: "2",
    userName: "Manager Smith",
    createdAt: "2023-04-17T08:45:00Z",
    updatedAt: "2023-04-17T08:45:00Z",
  },
  {
    id: "103",
    title: "Travel Approval",
    description: "Conference trip to San Francisco",
    department: "HR",
    status: "rejected",
    userId: "3",
    userName: "Jane Doe",
    createdAt: "2023-04-10T16:20:00Z",
    updatedAt: "2023-04-12T11:15:00Z",
  },
  {
    id: "104",
    title: "Budget Increase",
    description: "Request for Q2 marketing budget increase",
    department: "Marketing",
    status: "pending",
    userId: "5",
    userName: "Sarah Johnson",
    createdAt: "2023-04-18T09:10:00Z",
    updatedAt: "2023-04-18T09:10:00Z",
  },
  {
    id: "105",
    title: "New Equipment",
    description: "Request for new laptop for new hire",
    department: "HR",
    status: "approved",
    userId: "3",
    userName: "Jane Doe",
    createdAt: "2023-04-05T13:25:00Z",
    updatedAt: "2023-04-07T10:30:00Z",
  },
  {
    id: "106",
    title: "API Access Request",
    description: "Need access to third-party API",
    department: "Engineering",
    status: "pending",
    userId: "2",
    userName: "Manager Smith",
    createdAt: "2023-04-19T15:40:00Z",
    updatedAt: "2023-04-19T15:40:00Z",
  },
];

// Mock data for departments
const mockDepartments: Department[] = [
  {
    id: "d1",
    name: "Engineering",
    description: "Software development and infrastructure",
    headId: "2",
    headName: "Manager Smith",
    memberCount: 12,
  },
  {
    id: "d2",
    name: "HR",
    description: "Human resources and recruitment",
    headId: "3",
    headName: "Jane Doe",
    memberCount: 5,
  },
  {
    id: "d3",
    name: "Marketing",
    description: "Brand management and promotions",
    headName: "Sarah Johnson",
    headId: "5",
    memberCount: 8,
  },
  {
    id: "d4",
    name: "Sales",
    description: "Business development and client relations",
    headName: "Sarah Johnson",
    headId: "5",
    memberCount: 10,
  },
  {
    id: "d5",
    name: "Finance",
    description: "Accounting and financial operations",
    memberCount: 6,
  },
];

// Mock data for recent activity
const mockActivities: ActivityItem[] = [
  {
    id: "a1",
    user: "Admin User",
    action: "approved",
    target: "Software License Request",
    timestamp: "2023-04-16T14:20:00Z",
  },
  {
    id: "a2",
    user: "Jane Doe",
    action: "submitted",
    target: "New Equipment Request",
    timestamp: "2023-04-05T13:25:00Z",
  },
  {
    id: "a3",
    user: "Manager Smith",
    action: "rejected",
    target: "Travel Approval",
    timestamp: "2023-04-12T11:15:00Z",
  },
  {
    id: "a4",
    user: "Sarah Johnson",
    action: "submitted",
    target: "Budget Increase",
    timestamp: "2023-04-18T09:10:00Z",
  },
  {
    id: "a5",
    user: "Admin User",
    action: "deleted",
    target: "Outdated Request",
    timestamp: "2023-04-14T16:40:00Z",
  },
];

// Mock chart data
const mockRequestsChartData: ChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Requests",
      data: [12, 19, 15, 20, 25, 18],
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.5)",
    },
  ],
};

// Mock dashboard metrics
const mockDashboardMetrics: Metric[] = [
  {
    title: "Total Users",
    value: "35",
    description: "Active users in the system",
    trend: "up",
    trendValue: "12%",
  },
  {
    title: "Pending Requests",
    value: "8",
    description: "Awaiting approval",
    trend: "down",
    trendValue: "5%",
  },
  {
    title: "Departments",
    value: "5",
    description: "Organizational units",
    trend: "neutral",
  },
  {
    title: "Approval Rate",
    value: "78%",
    description: "Requests approved this month",
    trend: "up",
    trendValue: "8%",
  },
];

// API methods
export const api = {
  // User methods
  users: {
    getAll: async (): Promise<User[]> => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        return [...mockUsers];
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
        throw error;
      }
    },
    
    getById: async (id: string): Promise<User> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        const user = mockUsers.find(u => u.id === id);
        if (!user) {
          throw new Error("User not found");
        }
        return { ...user };
      } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        toast.error("Failed to fetch user details");
        throw error;
      }
    },
    
    update: async (id: string, data: Partial<User>): Promise<User> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        const index = mockUsers.findIndex(u => u.id === id);
        if (index === -1) {
          throw new Error("User not found");
        }
        const updatedUser = { ...mockUsers[index], ...data };
        mockUsers[index] = updatedUser;
        return { ...updatedUser };
      } catch (error) {
        console.error(`Error updating user ${id}:`, error);
        toast.error("Failed to update user");
        throw error;
      }
    },
    
    delete: async (id: string): Promise<void> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        const index = mockUsers.findIndex(u => u.id === id);
        if (index === -1) {
          throw new Error("User not found");
        }
        mockUsers.splice(index, 1);
        toast.success("User deleted successfully");
      } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
        toast.error("Failed to delete user");
        throw error;
      }
    },

    toggleActive: async (id: string): Promise<User> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        const index = mockUsers.findIndex(u => u.id === id);
        if (index === -1) {
          throw new Error("User not found");
        }
        mockUsers[index].isActive = !mockUsers[index].isActive;
        const status = mockUsers[index].isActive ? "activated" : "deactivated";
        toast.success(`User ${status} successfully`);
        return { ...mockUsers[index] };
      } catch (error) {
        console.error(`Error toggling user ${id} active status:`, error);
        toast.error("Failed to update user status");
        throw error;
      }
    }
  },

  // Clearance requests methods
  requests: {
    getAll: async (): Promise<ClearanceRequest[]> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        return [...mockRequests];
      } catch (error) {
        console.error("Error fetching clearance requests:", error);
        toast.error("Failed to fetch clearance requests");
        throw error;
      }
    },
    
    getById: async (id: string): Promise<ClearanceRequest> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        const request = mockRequests.find(r => r.id === id);
        if (!request) {
          throw new Error("Request not found");
        }
        return { ...request };
      } catch (error) {
        console.error(`Error fetching request ${id}:`, error);
        toast.error("Failed to fetch request details");
        throw error;
      }
    },
    
    update: async (id: string, data: Partial<ClearanceRequest>): Promise<ClearanceRequest> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        const index = mockRequests.findIndex(r => r.id === id);
        if (index === -1) {
          throw new Error("Request not found");
        }
        const updatedRequest = { 
          ...mockRequests[index], 
          ...data, 
          updatedAt: new Date().toISOString() 
        };
        mockRequests[index] = updatedRequest;
        toast.success("Request updated successfully");
        return { ...updatedRequest };
      } catch (error) {
        console.error(`Error updating request ${id}:`, error);
        toast.error("Failed to update request");
        throw error;
      }
    },
    
    updateStatus: async (id: string, status: "pending" | "approved" | "rejected"): Promise<ClearanceRequest> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        const index = mockRequests.findIndex(r => r.id === id);
        if (index === -1) {
          throw new Error("Request not found");
        }
        mockRequests[index].status = status;
        mockRequests[index].updatedAt = new Date().toISOString();
        
        const statusText = status.charAt(0).toUpperCase() + status.slice(1);
        toast.success(`Request ${statusText}`);
        
        return { ...mockRequests[index] };
      } catch (error) {
        console.error(`Error updating request ${id} status:`, error);
        toast.error("Failed to update request status");
        throw error;
      }
    },
    
    delete: async (id: string): Promise<void> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        const index = mockRequests.findIndex(r => r.id === id);
        if (index === -1) {
          throw new Error("Request not found");
        }
        mockRequests.splice(index, 1);
        toast.success("Request deleted successfully");
      } catch (error) {
        console.error(`Error deleting request ${id}:`, error);
        toast.error("Failed to delete request");
        throw error;
      }
    },
    
    getByDepartment: async (department: string): Promise<ClearanceRequest[]> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        return mockRequests.filter(r => r.department === department);
      } catch (error) {
        console.error(`Error fetching requests for department ${department}:`, error);
        toast.error("Failed to fetch department requests");
        throw error;
      }
    },
    
    getByStatus: async (status: "pending" | "approved" | "rejected"): Promise<ClearanceRequest[]> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        return mockRequests.filter(r => r.status === status);
      } catch (error) {
        console.error(`Error fetching requests with status ${status}:`, error);
        toast.error("Failed to filter requests by status");
        throw error;
      }
    }
  },

  // Departments methods
  departments: {
    getAll: async (): Promise<Department[]> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        return [...mockDepartments];
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Failed to fetch departments");
        throw error;
      }
    },
    
    getById: async (id: string): Promise<Department> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        const department = mockDepartments.find(d => d.id === id);
        if (!department) {
          throw new Error("Department not found");
        }
        return { ...department };
      } catch (error) {
        console.error(`Error fetching department ${id}:`, error);
        toast.error("Failed to fetch department details");
        throw error;
      }
    },
    
    create: async (data: Omit<Department, "id">): Promise<Department> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        const newId = `d${mockDepartments.length + 1}`;
        const newDepartment = { id: newId, ...data };
        mockDepartments.push(newDepartment);
        toast.success("Department created successfully");
        return { ...newDepartment };
      } catch (error) {
        console.error("Error creating department:", error);
        toast.error("Failed to create department");
        throw error;
      }
    },
    
    update: async (id: string, data: Partial<Department>): Promise<Department> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        const index = mockDepartments.findIndex(d => d.id === id);
        if (index === -1) {
          throw new Error("Department not found");
        }
        const updatedDepartment = { ...mockDepartments[index], ...data };
        mockDepartments[index] = updatedDepartment;
        toast.success("Department updated successfully");
        return { ...updatedDepartment };
      } catch (error) {
        console.error(`Error updating department ${id}:`, error);
        toast.error("Failed to update department");
        throw error;
      }
    },
    
    delete: async (id: string): Promise<void> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        const index = mockDepartments.findIndex(d => d.id === id);
        if (index === -1) {
          throw new Error("Department not found");
        }
        mockDepartments.splice(index, 1);
        toast.success("Department deleted successfully");
      } catch (error) {
        console.error(`Error deleting department ${id}:`, error);
        toast.error("Failed to delete department");
        throw error;
      }
    },
    
    assignHead: async (departmentId: string, userId: string, userName: string): Promise<Department> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        const index = mockDepartments.findIndex(d => d.id === departmentId);
        if (index === -1) {
          throw new Error("Department not found");
        }
        mockDepartments[index].headId = userId;
        mockDepartments[index].headName = userName;
        toast.success("Department head assigned successfully");
        return { ...mockDepartments[index] };
      } catch (error) {
        console.error(`Error assigning head to department ${departmentId}:`, error);
        toast.error("Failed to assign department head");
        throw error;
      }
    }
  },

  // Activity methods
  activities: {
    getRecent: async (): Promise<ActivityItem[]> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        return [...mockActivities];
      } catch (error) {
        console.error("Error fetching recent activities:", error);
        toast.error("Failed to fetch activity data");
        throw error;
      }
    }
  },

  // Dashboard data methods
  dashboard: {
    getMetrics: async (): Promise<Metric[]> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        return [...mockDashboardMetrics];
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        toast.error("Failed to fetch dashboard metrics");
        throw error;
      }
    },
    
    getRequestsChartData: async (): Promise<ChartData> => {
      try {
        await new Promise(resolve => setTimeout(resolve, API_DELAY));
        return { ...mockRequestsChartData };
      } catch (error) {
        console.error("Error fetching requests chart data:", error);
        toast.error("Failed to fetch chart data");
        throw error;
      }
    }
  }
};
