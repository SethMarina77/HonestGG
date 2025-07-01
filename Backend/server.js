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
    const matchHistoryUrl = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`;
    const matchHistoryResponse = await axios.get(matchHistoryUrl, {
      headers: { "X-Riot-Token": process.env.RIOT_API_KEY },
    });
    console.log("Match history received:", matchHistoryResponse.data);

    // Step 2.5: Fetch match details and calculate average KDA (parallel)
    let totalKills = 0,
      totalDeaths = 0,
      totalAssists = 0;
    const matchIds = matchHistoryResponse.data.slice(0, 10); // limit to 10

    try {
      const matchPromises = matchIds.map((matchId) => {
        const matchUrl = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`;
        return axios.get(matchUrl, {
          headers: { "X-Riot-Token": process.env.RIOT_API_KEY },
          timeout: 5000, // 5 seconds timeout per request
        });
      });

      const matchResponses = await Promise.all(matchPromises);

      for (const matchResponse of matchResponses) {
        const participants = matchResponse.data.info.participants;
        const player = participants.find((p) => p.puuid === puuid);
        if (player) {
          totalKills += player.kills;
          totalDeaths += player.deaths;
          totalAssists += player.assists;
        }
      }
    } catch (err) {
      console.error("Error fetching match details:", err.message);
      return res
        .status(504)
        .json({
          message:
            "Riot API timed out or is unavailable. Please try again later.",
        });
    }

    const gamesCount = matchIds.length;
    const normalKDA =
      gamesCount > 0
        ? ((totalKills + totalAssists) / Math.max(1, totalDeaths)).toFixed(2)
        : "N/A";
    const trueKDA =
      gamesCount > 0
        ? (totalKills / Math.max(1, totalDeaths)).toFixed(2)
        : "N/A";

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
      name: returnedGameName,
      tagline: returnedTagLine,
      matchHistory: matchHistoryResponse.data,
      profileIconUrl: profileIconUrl,
      averageKDA: normalKDA, // for backward compatibility
      normalKDA,
      trueKDA,
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
