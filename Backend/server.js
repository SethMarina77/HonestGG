import express from "express";
import cors from "cors"; //lets me make requests to the server from a different origin
import dotenv from "dotenv"; //lets me use environment variables
import axios from "axios";
const app = express();
dotenv.config(); //lets me use environment variables
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json()); //middleware that lets me parse JSON data

app.get("/", (req, res) => {
  res.send("was gud G");
});

//console.log(API_KEY);

// Endpoint to get summoner data
app.get("/api/summoner/:gameName/:tagLine", async (req, res) => {
  try {
    console.log("Request received for:", req.params);

    const { gameName, tagLine } = req.params;
    const API_KEY = process.env.RIOT_API_KEY;

    // Step 1: Get PUUID & Account Info
    const accountUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
    const accountResponse = await axios.get(accountUrl, {
      headers: { "X-Riot-Token": process.env.RIOT_API_KEY },
    });

    const {
      puuid,
      gameName: returnedGameName,
      tagLine: returnedTagLine,
    } = accountResponse.data;
    console.log("Account response received:", accountResponse.data);

    // Step 2: Get Match History
    const matchHistoryUrl = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=5`;
    const matchHistoryResponse = await axios.get(matchHistoryUrl, {
      headers: { "X-Riot-Token": process.env.RIOT_API_KEY },
    });
    console.log("Match history received:", matchHistoryResponse.data);

    // Step 3: Get Summoner Data
    const summonerUrl = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    const summonerResponse = await axios.get(summonerUrl, {
      headers: { "X-Riot-Token": process.env.RIOT_API_KEY },
    });

    console.log("Summoner data received:", summonerResponse.data);

    // Step 4: Generate Profile Icon URL

    const profileIconUrl = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${summonerResponse.data.profileIconId}.jpg`;

    // Step 5: Merge all data into a single response
    const summonerData = {
      ...summonerResponse.data,
      name: returnedGameName, // Add the gameName
      tagline: returnedTagLine, // Optional: Add the tagline
      matchHistory: matchHistoryResponse.data, // Add match history
      profileIconUrl: profileIconUrl, // Add profile icon URL
    };

    console.log("Profile Icon URL:", summonerData.profileIconUrl);
    res.json(summonerData);
  } catch (error) {
    console.error(
      "Error fetching summoner data:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({
        message: "Server error",
        error: error.response?.data || error.message,
      });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
