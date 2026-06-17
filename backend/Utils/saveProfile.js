import pool from "./db.js";

const saveProfile = async (
    userDetails,
    totalStars,
    topLanguage
) => {

    await pool.execute(
        `
        INSERT INTO github_profiles
        (
            username,
            name,
            followers,
            following,
            public_repos,
            total_stars,
            top_language
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)

        ON DUPLICATE KEY UPDATE

        followers=VALUES(followers),
        following=VALUES(following),
        public_repos=VALUES(public_repos),
        total_stars=VALUES(total_stars),
        top_language=VALUES(top_language)
        `,
        [
            userDetails.login,
            userDetails.name,
            userDetails.followers,
            userDetails.following,
            userDetails.public_repos,
            totalStars,
            topLanguage
        ]
    );

    return {
        username: userDetails.login,
        name: userDetails.name,
        followers: userDetails.followers,
        following: userDetails.following,
        public_repos: userDetails.public_repos,
        total_stars: totalStars,
        top_language: topLanguage
    };
};

export default saveProfile;