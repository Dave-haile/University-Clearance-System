import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const Dashboard: React.FC = () => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };

    fetchUser();
  }, []);

  const handleSubmit = async () => {
    if (!userId) {
      alert("User not logged in");
      return;
    }

    const { error } = await supabase
      .from("student-data")
      .upsert(
        { 
            user_id: userId,
            first_name: name 
            
        }
    );

    if (error) {
      alert(error.message);
    } else {
      alert("Name saved successfully!");
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-black border-x-2"
      />
      <button className="p-10 bg-black text-white ml-10" onClick={handleSubmit}>Save Name</button>
    </div>
  );
};

export default Dashboard;
