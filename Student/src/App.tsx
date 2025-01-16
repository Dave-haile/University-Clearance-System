import { createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import Home from "./Page/Home";
import Error from "./Page/Error";
import ClearanceForm from "./Moke/ClearanceForm";
import "./App.css";
import ResetPasswordFlow from "./Page/Parent";
import ClearanceForm2 from "./Page/ClearanceForm";
import Dashboard from "./Moke/moke";
import { LoginParent } from "./Page/BeforLogin";
// import Header from "./components/Home/Header";
// import Hero from "./components/Home/Hero";
// import Features from "./components/Home/Features";
// import Process from "./components/Home/Process";
// import { Container } from "./Page/Layout";
// import Footer from "./components/Home/Footer";
// import { container } from "./Page/Layout";


const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
}

const route = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <LoginParent/>,
  },
  {
    path: "/Student",
    element: <ClearanceForm />,
  },
  {
    path: "/Student2",
    element: <ClearanceForm2 />,
  },
  {
    path: "forget-password",
    element: <ResetPasswordFlow/>
  },{
    path: "/moke",
    element: <Dashboard/>
  }
]);
function App() {
  return (
    <>
      <button
        onClick={() => {
          const root = document.documentElement;
          const isDarkMode = root.classList.toggle("dark");
          localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        }}
        className=" absolute bg-transparent border-none top-72 left-1 p-2 bg-gray-200 text-black dark:bg-gray-800 rounded"
      >
        <input type="checkbox" name="" id="" />
      </button>
      <RouterProvider router={route} />
      {/* <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path={"/header"} element={<Header />}>
          <Route path={"process"} element={<Process />} />
          <Route path={"features"} element={<Features />} />
          <Route path={"hero"} element={<Hero />} />
        </Route>
        <Route path="/footer" element={<Footer/>}/>
      </Routes> */}
      {/* <Routes> */}
      {/* Root route, everything goes inside Layout */}
      {/* <Route path="/" element={<Container />}>
        <Route index element={<Home />} />  */}
        {/* <Route path="header"  >
          <Route path="process" element={<Process />} />
          <Route path="features" element={<Features />} />
          <Route path="hero" element={<Hero />} />
        </Route>
      </Route> */}
    {/* </Routes> */}
    </>
  );
}

export default App;
