import { RouterProvider } from "react-router-dom";
import "./App.css";
import route from "./services/routes";

function App() {
  return <RouterProvider router={route} />;
}

export default App;
