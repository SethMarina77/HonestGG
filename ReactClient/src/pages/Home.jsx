import React, { useState, useEffect } from "react";
import axios from "axios";
import GlitchedTitle from "../components/Title";
import GlitchyButton from "../components/Button";
import GlitchyLoader from "../components/GlitchyLoader";
import { useNavigate } from "react-router-dom";



const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (summonerData) {
      navigate("/AnalyzePlayer", {
        state: {
          gameName: summonerData.name,
          tagLine: summonerData.tagline,
        },
      });
    }
  };
  const [inputValue, setInputValue] = useState("");
  const [summonerData, setSummonerData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showData, setShowData] = useState(false);

  const fetchSummonerData = async (e) => {
    e.preventDefault();
    const [gameName, tagLine] = inputValue.split("#");
    if (!gameName || !tagLine) {
      setError(
        "Please enter a valid game name followed by # and tagline. don't f#cking piss me off you goddamn pissrandom nobody"
      );
      return;
    }

    setIsLoading(true);
    setShowData(false);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:3000/api/summoner/${gameName}/${tagLine}`
      );
      setSummonerData(response.data);
      // Don't hide the loader yet - it will complete on its own
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching data");
      setSummonerData(null);
      setIsLoading(false); // Stop loading on error
    }
  };

  // Handle loader completion
  const handleLoadComplete = () => {
    setIsLoading(false);
    setShowData(true);
  };

  return (
    <div className="h-screen bg-neutral-900 flex flex-col items-center justify-start pt-24">
      <GlitchedTitle />
      <h1 className="text-3xl font-bold mb-6 text-gray-300">
        Search a Player to see if you should dodge them
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

          {isLoading ? (
            <div className="mt-4">
              <GlitchyLoader onLoadComplete={handleLoadComplete} />
            </div>
          ) : showData ? (
            <>
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
              <button
                className="mt-4 w-full items-center justify-center flex cursor-pointer"
                onClick={handleClick}
                type="button"
              >
                <GlitchyButton />
              </button>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Home;
