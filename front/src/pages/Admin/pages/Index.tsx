import { Navigate } from "react-router-dom";

const Index = () => {
  // Just redirect to the dashboard
  return <Navigate to="/" replace />;
};

export default Index;
