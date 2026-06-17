import express, { response } from "express";
import cors from "cors";
import { getUserDetails, getUserRepos } from "./Utils/retrieve.js";
import saveProfile from "./Utils/saveProfile.js";
import pool from "./Utils/db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173"
    ]
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const port = process.env.PORT || 8000;
const startServer = async () => {

    await pool.execute(`
    CREATE TABLE IF NOT EXISTS github_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,

        username VARCHAR(100) UNIQUE,

        name VARCHAR(255),

        followers INT,

        following INT,

        public_repos INT,

        total_stars INT,

        top_language VARCHAR(100),

        analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `);

    app.listen(port, () => {
        console.log("Server running");
    });
}

startServer();

app.post("/fetch", async (req, res) => {
    const { username } = req.body;

    if(!username) {
        return res.json({
            message: "Need username to retrieve and analyze repository!"
        });
    }

    try {
        const user = await getUserDetails(username);
        const repos = await getUserRepos(username);

        let totalStars = 0;
        const languages = {};
        repos.forEach(repo => {
            totalStars += repo.stargazers_count;
            if(repo.language){
                languages[repo.language] =
                    (languages[repo.language] || 0) + 1;
            }
        });

        const topLanguage =
        Object.keys(languages).reduce(
            (a,b) =>
            languages[a] > languages[b]
                ? a
                : b,
            Object.keys(languages)[0]
        );

        const profile = await saveProfile(
            user,
            totalStars,
            topLanguage
        );

        return res.status(200).json({
            message: `Here is ${username} profile:`,
            profile,
            repos
        });

    } catch(err) {
        console.log(err);
        res.status(501).json({
            message: "Failed to fetch details!",
            err
        });
    }
});