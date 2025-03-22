import React, { useState } from "react";
import axios from "axios";
import GlitchedTitle from "../components/Title";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [summonerData, setSummonerData] = useState(null);
  const [error, setError] = useState(null);

  const fetchSummonerData = async (e) => {
    e.preventDefault();
    const [gameName, tagLine] = inputValue.split("#");
    if (!gameName || !tagLine) {
      setError("Please enter a valid game name followed by # and tagline.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/api/summoner/${gameName}/${tagLine}`
      );
      setSummonerData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching data");
      setSummonerData(null);
    }
  };

  return (
    <div className="h-screen bg-neutral-900 flex flex-col items-center justify-start pt-24">
      <GlitchedTitle />
      <h1 className="text-3xl font-bold mb-6 text-gray-300 mt-8">
        Search a Player
      </h1>
      <form
        onSubmit={fetchSummonerData}
        className="flex flex-col items-center gap-1"
      >
        <input
          className="px-4 py-2 w-64 bg-neutral-800 text-white rounded-full outline-none focus:ring-2 focus:ring-cyan-500 border border-neutral-700 placeholder-gray-500 shadow-lg transition-all"
          type="text"
          placeholder="GameName#Tagline"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ cursor: "text" }}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-cyan-500 transition-all shadow-lg hover:shadow-cyan-500/50 mt-2"
          style={{ cursor: "pointer" }}
        >
          Search
        </button>
      </form>
      {error && <p className="text-red-500 mt-3">⚠️ Error: {error}</p>}
      {summonerData && (
        <div className="mt-6 p-5 bg-neutral-800 bg-opacity-50 backdrop-blur-lg rounded-lg shadow-xl border border-neutral-700">
          <h2 className="text-xl font-semibold text-cyan-400">Summoner Info</h2>
          <img
            src={summonerData.profileIconUrl}
            alt="Profile Icon"
            className="w-16 h-16 rounded-full mt-2"
          />
          <p className="mt-2">
            <strong className="text-gray-400">Name:</strong> {summonerData.name}
          </p>
          <p>
            <strong className="text-gray-400">Level:</strong>{" "}
            {summonerData.summonerLevel}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;


