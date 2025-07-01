import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const AnalyzePlayer = () => {
  const location = useLocation();
  const { gameName, tagLine } = location.state || {};
  const [inputValue, setInputValue] = useState(
    gameName && tagLine ? `${gameName}#${tagLine}` : ""
  );
  const [summonerData, setSummonerData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-search on first load if gameName and tagLine exist
  useEffect(() => {
    if (gameName && tagLine) {
      autoFetchSummonerData(gameName, tagLine);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameName, tagLine]);

  const autoFetchSummonerData = async (gName, tLine) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/summoner/${gName}/${tLine}`
      );
      setSummonerData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching data");
      setSummonerData(null);
    }
    setIsLoading(false);
  };

  const fetchSummonerData = async (e) => {
    e.preventDefault();
    const [gName, tLine] = inputValue.split("#");
    if (!gName || !tLine) {
      setError("Please enter a valid game name followed by # and tagline.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/summoner/${gName}/${tLine}`
      );
      setSummonerData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching data");
      setSummonerData(null);
    }
    setIsLoading(false);
  };

  return (
    <div className="h-screen bg-neutral-900 flex flex-col items-center justify-start pt-24">
      <h1 className="text-3xl font-bold mb-6 text-gray-300">
        Analyze Player
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
      {isLoading && <p className="text-cyan-400 mt-3">Loading...</p>}
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
            <strong className="text-gray-200">
              Name: {summonerData.name}
            </strong>
          </p>
          <p>
            <strong className="text-gray-200">
              Level: {summonerData.summonerLevel}
            </strong>
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <Tooltip label="Normal KDA = (Kills + Assists) / Deaths. This is the standard KDA ratio.">
              <span className="text-cyan-300 font-semibold">
                Normal KDA (last 10): {summonerData.normalKDA}
              </span>
            </Tooltip>
            <Tooltip label="True KDA = Kills / Deaths. This ignores assists and shows only pure kill/death ratio.">
              <span className="text-purple-300 font-semibold">
                True KDA (last 10): {summonerData.trueKDA}
              </span>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

function Tooltip({ label, children }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded bg-gray-800 text-xs text-white shadow-lg z-10 whitespace-nowrap">
          {label}
        </span>
      )}
    </span>
  );
}

export default AnalyzePlayer;