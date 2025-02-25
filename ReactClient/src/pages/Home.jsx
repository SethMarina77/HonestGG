import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [summonerData, setSummonerData] = useState(null);
  const [error, setError] = useState(null);

  const fetchSummonerData = async () => {
    try {
      const gameName = "HeNotBeatingGoku";
      const tagLine = "THO";
      const response = await axios.get(
        `http://localhost:3000/api/summoner/${gameName}/${tagLine}`
      );
      setSummonerData(response.data);
      setError(null); // Clear errors on success
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching data");
      setSummonerData(null);
    }
  };

  return (
    <div>
      <button onClick={fetchSummonerData}>Get Summoner Data</button>
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
