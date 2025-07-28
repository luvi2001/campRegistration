import React, { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import ActionWrapper from "./components/Action/ActionWrapper";
import CountriesWrapper from "./components/Hero/CountriesWrapper";
import "./index.css";

function Home() {
  const [query, setQuery] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name);
      } catch (err) {
        console.error("Invalid token", err);
        setUserName("");
      }
    }
  }, []);

  const handleChatboxClick = () => {
    navigate("/chatbox");
  };

  return (
    <main>
      <div className="p-4 flex justify-between items-center text-gray-700 font-medium">
        <span>{userName ? `Welcome, ${userName}!` : "Welcome, Guest!"}</span>
        <button
          onClick={handleChatboxClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Ask the CountryBot
        </button>
      </div>
      <ActionWrapper setQuery={setQuery} />
      <CountriesWrapper query={query} />
    </main>
  );
}

export default Home;
