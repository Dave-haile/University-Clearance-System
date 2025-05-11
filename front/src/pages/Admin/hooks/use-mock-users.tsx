
// This is a temporary mock data file to simulate API responses
// Remove this once the real API is connected

import { User, } from "../../../types/user";
import { Department } from "../components/UserManagement/EditUserInfoDialog";


export const useMockUsers = (): User[] => {
  const mockDepartments: { [key: string]: Department } = {
    "Computer Science": {
      id: 1,
      department: "Computer Science",
      college: "College of Computing and Informatics",
      created_at: null,
      updated_at: null
    },
    "Physics": {
      id: 2,
      department: "Physics",
      college: "College of Natural Sciences",
      created_at: null,
      updated_at: null
    },
    "Mathematics": {
      id: 3,
      department: "Mathematics",
      college: "College of Natural Sciences",
      created_at: null,
      updated_at: null
    },
    "Chemistry": {
      id: 4,
      department: "Chemistry",
      college: "College of Natural Sciences",
      created_at: null,
      updated_at: null
    },
    "English": {
      id: 5,
      department: "English",
      college: "College of Arts and Humanities",
      created_at: null,
      updated_at: null
    },
    "Biology": {
      id: 6,
      department: "Biology",
      college: "College of Natural Sciences",
      created_at: null,
      updated_at: null
    },
    "History": {
      id: 7,
      department: "History",
      college: "College of Arts and Humanities",
      created_at: null,
      updated_at: null
    },
    "Library": {
      id: 8,
      department: "Library",
      college: "Administration",
      created_at: null,
      updated_at: null
    },
    "Cafeteria": {
      id: 9,
      department: "Cafeteria",
      college: "Administration",
      created_at: null,
      updated_at: null
    }
  };

  const mockUsers: User[] = [
    {
      id: 1,
      name: "John Doe",
      username: "INUSR022113",
      email: "john.doe@example.com",
      email_verified_at: null,
      role: "student",
      profile_image: null,
      created_at: "2025-04-28T10:15:36.000000Z",
      updated_at: "2025-04-28T10:15:36.000000Z",
      staff: null,
      student: {
        id: 1,
        user_id: 1,
        student_id: "STU123",
        department_id: 1,
        year: "3rd Year",
        created_at: "2025-04-28T10:15:36.000000Z",
        updated_at: "2025-04-28T10:15:36.000000Z",
        department: mockDepartments["Computer Science"],
        clearance_requests: null
      }
    },
    {
      id: 2,
      name: "Jane Smith",
      username: "INUSR022114",
      email: "jane.smith@example.com",
      email_verified_at: null,
      role: "staff",
      profile_image: null,
      created_at: "2025-04-25T09:30:22.000000Z",
      updated_at: "2025-04-25T09:30:22.000000Z",
      staff: {
        id: 1,
        user_id: 2,
        position: "Department Head",
        department_id: 1,
        role: "department_head",
        created_at: "2025-04-25T09:30:22.000000Z",
        updated_at: "2025-04-25T09:30:22.000000Z",
        department: mockDepartments["Computer Science"]
      },
      student: null
    },
    {
      id: 3,
      name: "Alice Johnson",
      username: "INUSR022115",
      email: "alice.johnson@example.com",
      email_verified_at: null,
      role: "student",
      profile_image: null,
      created_at: "2025-04-26T14:20:45.000000Z",
      updated_at: "2025-04-26T14:20:45.000000Z",
      staff: null,
      student: {
        id: 2,
        user_id: 3,
        student_id: "STU124",
        department_id: 2,
        year: "2nd Year",
        created_at: "2025-04-26T14:20:45.000000Z",
        updated_at: "2025-04-26T14:20:45.000000Z",
        department: mockDepartments["Physics"],
        clearance_requests: null
      }
    },
    {
      id: 4,
      name: "Bob Brown",
      username: "INUSR022116",
      email: "bob.brown@example.com",
      email_verified_at: null,
      role: "admin",
      profile_image: null,
      created_at: "2025-04-20T08:10:33.000000Z",
      updated_at: "2025-04-20T08:10:33.000000Z",
      staff: null,
      student: null
    },
    {
      id: 5,
      name: "Charlie Davis",
      username: "INUSR022117",
      email: "charlie.davis@example.com",
      email_verified_at: null,
      role: "staff",
      profile_image: null,
      created_at: "2025-04-22T11:45:18.000000Z",
      updated_at: "2025-04-22T11:45:18.000000Z",
      staff: {
        id: 2,
        user_id: 5,
        position: "Professor",
        department_id: 3,
        role: "staff",
        created_at: "2025-04-22T11:45:18.000000Z",
        updated_at: "2025-04-22T11:45:18.000000Z",
        department: mockDepartments["Mathematics"]
      },
      student: null
    },
    {
      id: 6,
      name: "Diana White",
      username: "INUSR022118",
      email: "diana.white@example.com",
      email_verified_at: null,
      role: "student",
      profile_image: null,
      created_at: "2025-04-27T16:35:42.000000Z",
      updated_at: "2025-04-27T16:35:42.000000Z",
      staff: null,
      student: {
        id: 3,
        user_id: 6,
        student_id: "STU125",
        department_id: 4,
        year: "4th Year",
        created_at: "2025-04-27T16:35:42.000000Z",
        updated_at: "2025-04-27T16:35:42.000000Z",
        department: mockDepartments["Chemistry"],
        clearance_requests: null
      }
    },
    {
      id: 7,
      name: "Eve Black",
      username: "INUSR022119",
      email: "eve.black@example.com",
      email_verified_at: null,
      role: "staff",
      profile_image: null,
      created_at: "2025-04-23T13:25:52.000000Z",
      updated_at: "2025-04-23T13:25:52.000000Z",
      staff: {
        id: 3,
        user_id: 7,
        position: "Associate Professor",
        department_id: 5,
        role: "staff",
        created_at: "2025-04-23T13:25:52.000000Z",
        updated_at: "2025-04-23T13:25:52.000000Z",
        department: mockDepartments["English"]
      },
      student: null
    },
    {
      id: 8,
      name: "Frank Green",
      username: "INUSR022120",
      email: "frank.green@example.com",
      email_verified_at: null,
      role: "student",
      profile_image: null,
      created_at: "2025-04-29T09:05:27.000000Z",
      updated_at: "2025-04-29T09:05:27.000000Z",
      staff: null,
      student: {
        id: 4,
        user_id: 8,
        student_id: "STU126",
        department_id: 6,
        year: "1st Year",
        created_at: "2025-04-29T09:05:27.000000Z",
        updated_at: "2025-04-29T09:05:27.000000Z",
        department: mockDepartments["Biology"],
        clearance_requests: null
      }
    },
    {
      id: 9,
      name: "Grace Lee",
      username: "INUSR022121",
      email: "grace.lee@example.com",
      email_verified_at: null,
      role: "student",
      profile_image: null,
      created_at: "2025-04-24T10:50:39.000000Z",
      updated_at: "2025-04-24T10:50:39.000000Z",
      staff: null,
      student: {
        id: 5,
        user_id: 9,
        student_id: "STU127",
        department_id: 3,
        year: "3rd Year",
        created_at: "2025-04-24T10:50:39.000000Z",
        updated_at: "2025-04-24T10:50:39.000000Z",
        department: mockDepartments["Mathematics"],
        clearance_requests: null
      }
    },
    {
      id: 10,
      name: "Henry Wilson",
      username: "INUSR022122",
      email: "henry.wilson@example.com",
      email_verified_at: null,
      role: "staff",
      profile_image: null,
      created_at: "2025-04-21T15:40:12.000000Z",
      updated_at: "2025-04-21T15:40:12.000000Z",
      staff: {
        id: 4,
        user_id: 10,
        position: "Librarian",
        department_id: 8,
        role: "library",
        created_at: "2025-04-21T15:40:12.000000Z",
        updated_at: "2025-04-21T15:40:12.000000Z",
        department: mockDepartments["Library"]
      },
      student: null
    },
    {
      id: 11,
      name: "Irene Taylor",
      username: "INUSR022123",
      email: "irene.taylor@example.com",
      email_verified_at: null,
      role: "student",
      profile_image: null,
      created_at: "2025-04-19T12:15:58.000000Z",
      updated_at: "2025-04-19T12:15:58.000000Z",
      staff: null,
      student: {
        id: 6,
        user_id: 11,
        student_id: "STU128",
        department_id: 7,
        year: "2nd Year",
        created_at: "2025-04-19T12:15:58.000000Z",
        updated_at: "2025-04-19T12:15:58.000000Z",
        department: mockDepartments["History"],
        clearance_requests: null
      }
    },
    {
      id: 12,
      name: "Jack Robinson",
      username: "INUSR022124",
      email: "jack.robinson@example.com",
      email_verified_at: null,
      role: "staff",
      profile_image: null,
      created_at: "2025-04-18T14:55:31.000000Z",
      updated_at: "2025-04-18T14:55:31.000000Z",
      staff: {
        id: 5,
        user_id: 12,
        position: "Manager",
        department_id: 9,
        role: "cafeteria",
        created_at: "2025-04-18T14:55:31.000000Z",
        updated_at: "2025-04-18T14:55:31.000000Z",
        department: mockDepartments["Cafeteria"]
      },
      student: null
    }
  ];

  return mockUsers;
};