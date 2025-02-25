import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.RIOT_API_KEY;

const gameName = "HeNotBeatingGoku";
const tagLine = "THO";

async function getSummonerData() {
    try {
        // Step 1: Get PUUID
        const accountUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
        const accountResponse = await axios.get(accountUrl, {
            headers: { "X-Riot-Token": API_KEY }
        });

        const puuid = accountResponse.data.puuid;
        console.log(`PUUID: ${puuid}`);

        // Step 2: Get Summoner Data
        const summonerUrl = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
        const summonerResponse = await axios.get(summonerUrl, {
            headers: { "X-Riot-Token": API_KEY }
        });

        console.log("Summoner Data:", summonerResponse.data);
    } catch (error) {
        console.error("Error fetching data:", error.response ? error.response.data : error.message);
    }
}

getSummonerData();