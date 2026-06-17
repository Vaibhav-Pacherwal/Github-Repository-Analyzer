# GitHub Repository Analyzer

A full-stack web application that analyzes GitHub profiles and repositories, generates useful insights, and stores analyzed data in a MySQL database.

## Live Application

🌐 Application: https://github-repository-analyzer-one.vercel.app/

⚙️ Backend API: https://github-repository-analyzer-1.onrender.com

## Features

- Search any GitHub username
- Fetch user profile information using GitHub API
- Fetch and analyze public repositories
- Calculate total stars across repositories
- Identify the most-used programming language
- Store analyzed profiles in MySQL
- Prevent duplicate records using username uniqueness
- Responsive and clean UI

---

## Tech Stack

### Frontend
- React.js
- Vite
- CSS
- Material UI

### Backend
- Node.js
- Express.js

### Database
- MySQL

### APIs
- GitHub REST API

### Deployment
- Vercel (Frontend)
- Render (Backend)
- Aiven MySQL (Database)

---

## Project Structure

```text
repo_analyzer
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── Utils
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## How It Works

1. User enters a GitHub username.
2. Frontend sends a request to the backend.
3. Backend fetches:
   - User details
   - Repository details
4. Repository data is analyzed:
   - Total Stars
   - Most Used Language
5. Results are stored in MySQL.
6. Processed data is returned to the frontend.

---

## API Endpoint

### Analyze GitHub Profile

```http
POST /fetch
```

Request:

```json
{
  "username": "torvalds"
}
```

Response:

```json
{
  "message": "Profile analyzed successfully",
  "profile": {
    "username": "torvalds",
    "followers": 250000,
    "public_repos": 8,
    "total_stars": 200000,
    "top_language": "C"
  }
}
```

---

## Database Schema

```sql
CREATE TABLE github_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    name VARCHAR(255),
    followers INT,
    following INT,
    public_repos INT,
    total_stars INT,
    top_language VARCHAR(100),
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Environment Variables

Backend `.env`

```env
PORT=8000

GITHUB_TOKEN=your_github_token

DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

Frontend `.env`

```env
VITE_API_URL=your_backend_url
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/repo_analyzer.git
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## Future Improvements

- Repository language breakdown charts
- GitHub activity analysis
- Profile comparison feature
- Repository recommendation engine
- GitHub score and ranking system
- Export analysis reports

---

## Author

Vaibhav Pacherwal

GitHub: https://github.com/Vaibhav-Pacherwal

---

## License

This project is open-source and available under the MIT License.