import React, { useState } from "react";
import axios from "axios";

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
    <div>
      <h1>Get Summoner Data</h1>
      <form onSubmit={fetchSummonerData}>
        <input
          type="text"
          placeholder="GameName#Tagline"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Fetch Data</button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {summonerData && (
        <div>
          <h2>Summoner Info</h2>
          <p>
            <strong>Name:</strong> {summonerData.name}
          </p>
          <p>
            <strong>Level:</strong> {summonerData.summonerLevel}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
