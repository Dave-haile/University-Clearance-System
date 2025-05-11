import { useAuth } from "../context/authContext";

const Index = () => {
  const { user } = useAuth();
  if (user?.role === "student") {
    console.log(user?.role);
  } else {
    console.log(user?.role);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-gray-600">
          Start building your amazing project here!
        </p>
      </div>
      {user?.role === "student" ? (
        <div className="text-center mt-4">
          <h2 className="text-2xl font-semibold">Student Dashboard</h2>
          <p className="text-gray-600">Access your courses and materials.</p>
        </div>
      ) : (
        <div className="text-center mt-4">Not a student</div>
      )}
    </div>
  );
};

export default Index;
