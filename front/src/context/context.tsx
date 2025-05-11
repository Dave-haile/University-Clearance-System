// import { createContext, useContext, useState } from "react";
// import { ReactNode } from "react";

// interface User {
//   name: string;
//   id: string;
//   student: Student
// }
// interface Student{
//   student_id: string,
//   department: string,
//   year: string
// }

// interface StateContextType {
//   users: User | null;
//   token: string | null;
//   setToken: (token: string | null) => void;
//   setUsers: (users: User) => void;
// }

// const StateContext = createContext<StateContextType | undefined>(undefined);

// export const ContextProvider = ({ children }: { children: ReactNode }) => {
//   const [users, _setUsers] = useState<User | null>(() => {
//     const user = localStorage.getItem("User");
//     return user ? JSON.parse(user) : null;
//   });
//   const [token, _setToken] = useState<string | null>(() => {
//     return localStorage.getItem("ACCESS") || null;
//   });

//   const setToken = (token: string | null) => {
//     _setToken(token);
//     if (token) {
//       localStorage.setItem("ACCESS", token);
//     } else {
//       localStorage.removeItem("ACCESS");
//     }
//   };
//   const setUsers = (user: User | null) => {
//     _setUsers(user);
//     if (user) {
//       localStorage.setItem("User", JSON.stringify(user));
//     } else {
//       localStorage.removeItem("User");
//     }
//   };
//   return (
//     <StateContext.Provider
//       value={{
//         users,
//         token,
//         setToken,
//         setUsers,
//       }}
//     >
//       {children}
//     </StateContext.Provider>
//   );
// };

// export const useStateContext = () => {
//   const context = useContext(StateContext);
//   if (!context) {
//     throw new Error("useStateContext must be used within a StateProvider");
//   }
//   return context;
// };


import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  username: string;
  email: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  student?: {
    id: number;
    user_id: number;
    student_id: string;
    department: string;
    year: string;
    created_at: string;
    updated_at: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setUsers: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (userData: { data: { user: User; token: string } }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: { data: { user: User; token: string } }) => {
    const { user, token } = userData.data;
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth2 = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
