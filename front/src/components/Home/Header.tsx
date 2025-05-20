import { GraduationCap, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import DarkMode from "./DarkMode";

export default function Header() {
  const { token,user } = useAuth();
  // const [message, setMessage] = useState();
  const text = user?.name;
  const username = text?.split(" ")[0];
  const {logout} = useAuth();
  return (
    <>
      <header className="fixed w-full bg-white top-0 shadow-sm z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">UniClear</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600">
              About
            </Link>
            <Link to="/admin" className="text-gray-600 hover:text-blue-600">
              How It Works
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600">
              Contact
            </Link>
            <DarkMode />
            {token ? (
              <>
                <span className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors capitalize">
                  {username}
                </span>
                <span
                  onClick={() => {
                    logout();
                  }}
                  className=" text-red-700 border-red-700 border-[3px] px-6 py-2 rounded-full hover:bg-red-500 hover:text-white hover:border-red-600 transition-colors hover:cursor-pointer"
                >
                  Logout
                </span>
              </>
            ) : (
              <Link
                to={"/login"}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
          <button className="md:hidden">
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </nav>
      </header>
    </>
  );
}
