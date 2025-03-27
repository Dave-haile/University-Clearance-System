import { useEffect, useRef, useState } from "react";
import axiosClient from "../../services/axiosBackend";
import axios from "axios";
import { useStateContext } from "../../context/context";
import { useNavigate } from "react-router-dom";

const LaravelTestLogin = () => {
  const navigator = useNavigate();
  const { token, setUsers, setToken } = useStateContext();
  useEffect(() => {
    if (token) {
      navigator("/");
    }
  }, [token, navigator]);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ message?: string }>({});
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    setErrors({});
    if (!usernameRef.current?.value || !passwordRef.current?.value) {
      setErrors({ message: "Username and Password are required" });
      return;
    }
    setLoading(true);
    try {
      const load = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      };
      const { data } = await axiosClient.post("/login", load).catch((error) => {
        console.log(error);
        throw error;
      });
      console.log(`Data: ${data}`);
      setUsers(data.user);
      setToken(data.token);
      navigator("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setErrors({ message: error.response.data.message });
      } else {
        setErrors({ message: "An unexpected error occurred" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-xl py-6 px-8 h-80 mt-20 bg-white rounded shadow-xl">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            {errors && errors.message && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                <p className="font-bold">Error</p>
                <p>{errors.message}</p>
              </div>
            )}
            <label htmlFor="name" className="block text-gray-800 font-bold">
              Username:
            </label>
            <input
              ref={usernameRef}
              type="text"
              placeholder="Username"
              className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
            />
          </div>
          <div>
            <label htmlFor="Username" className="block text-gray-800 font-bold">
              Password:
            </label>
            <input
              ref={passwordRef}
              type="password"
              placeholder="password"
              className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
            />
            <a className="text-sm font-thin text-gray-800 hover:underline mt-2 inline-block hover:text-indigo-600">
              Forget Password
            </a>
          </div>
          <button
            className={`cursor-pointer py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LaravelTestLogin;
