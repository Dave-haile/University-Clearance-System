import { useNavigate } from "react-router-dom";
import { LoginFormInputs, User } from "../types/user";
import axiosClient from "./axiosBackend";

export const loginFun = async (credentials: LoginFormInputs, navigate: ReturnType<typeof useNavigate>, login: (user: User, token: string) => void) => {
    try {
        const response = await axiosClient.post("/login", credentials);
        const user = response.data.user;
        const token = response.data.token;
        login(user, token);
        console.log(response)
        //   if (user.role === 'admin') navigator('/admin');
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'staff') navigate('/staff');
        else if (user.role === 'student') navigate('/student');
    } catch (error) {
        console.log(error)
    }
}