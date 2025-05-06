import React, { useContext } from "react";
import { Context } from "../context/Context";

const Home = () => {
  const { navigate } = useContext(Context);

  return (
    <div>
      <h1>Home Page</h1>
      <button
        onClick={() => navigate("/login")}
        className="border px-6 py-2 border-gray-500 rounded-full"
      >
        Login
      </button>
    </div>
  );
};

export default Home;
