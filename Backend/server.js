import express from "express";
import cors from "cors"; //lets me make requests to the server from a different origin
import dotenv from "dotenv"; //lets me use environment variables
const app = express();
dotenv.config(); //lets me use environment variables
const PORT = process.env.PORT



app.use(cors());
app.use(express.json()); //middleware that lets me parse JSON data

app.get("/", (req, res) => {
    res.send("was gud G");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

