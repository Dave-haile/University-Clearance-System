import { createContext, useContext, useState } from "react";
import { ReactNode } from "react";

interface User {
  name: string;
  id: string;
  student: Student
}
interface Student{
  student_id: string,
  department: string,
  year: string
}

interface StateContextType {
  users: User | null;
  token: string | null;
  setToken: (token: string | null) => void;
  setUsers: (users: User) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [users, _setUsers] = useState<User | null>(() => {
    const user = localStorage.getItem("User");
    return user ? JSON.parse(user) : null;
  });
  const [token, _setToken] = useState<string | null>(() => {
    return localStorage.getItem("ACCESS") || null;
  });

  const setToken = (token: string | null) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS", token);
    } else {
      localStorage.removeItem("ACCESS");
    }
  };
  const setUsers = (user: User | null) => {
    _setUsers(user);
    if (user) {
      localStorage.setItem("User", JSON.stringify(user));
    } else {
      localStorage.removeItem("User");
    }
  };
  return (
    <StateContext.Provider
      value={{
        users,
        token,
        setToken,
        setUsers,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};
