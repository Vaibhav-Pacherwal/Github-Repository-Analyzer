import dotenv from "dotenv";
dotenv.config();

const GITHUB_TOKEN = process.env.ACCESS_TOKEN;

const getUserDetails = async (username) => {
    const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`
        }
    });

    const userDetails = await response.json();
    return userDetails;
}

const getUserRepos = async (username) => {
    const response = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`
        }
    });

    const userRepos = await response.json();
    return userRepos;
}

export { getUserDetails, getUserRepos };