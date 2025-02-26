import React from 'react'
import { useState } from 'react';
import axios from 'axios';



const Home = () => {
  const [summonerData, setSummonerData] = useState(null);
  const [error, setError] = useState(null);

  const fetchSummonerData = async () => {
    try {
      const gameName = "HeNotBeatingGoku";
      const tagLine = "THO";
      const response = await axios.get(
        `http://localhost:3001/api/summoner/${gameName}/${tagLine}`
      );
      setSummonerData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching data");
    }
  };

  return (
    <div>
      <button onClick={fetchSummonerData}>Get Summoner Data</button>
      {error && <p>Error: {error}</p>}
      {summonerData && (
        <div>
          <h2>Summoner Info</h2>
          <p>Name: {summonerData.name}</p>
          <p>Level: {summonerData.summonerLevel}</p>
        </div>
      )}
    </div>
  );
};

export default Home