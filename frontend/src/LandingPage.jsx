import { useState } from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

function LandingPage({ getData }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!username.trim()) return;
    setLoading(true);
    await getData(username.trim());
    setUsername("");
    setLoading(false);
    navigate("/dashboard");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="landing">
      {/* Badge */}
      <div className="landing-badge">gh / analyzer</div>

      {/* Hero */}
      <h1 className="landing-title">
        Analyze any<br />
        <span className="accent">GitHub profile</span>
      </h1>
      <p className="landing-subtitle">
        Enter a username to instantly explore repos, languages, stars, and activity.
      </p>

      {/* Terminal card */}
      <div className="terminal-card">
        <div className="terminal-titlebar">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">gh-analyzer — bash</span>
        </div>

        <div className="terminal-body">
          <div className="terminal-prompt-line">
            <span className="prompt-symbol">→</span>
            <span className="prompt-cmd">gh analyze</span>
            <span style={{ color: "#8B949E" }}>--user</span>
          </div>

          <div className="gh-input-wrap">
            <span className="gh-input-prefix">@</span>
            <input
              className="gh-input"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoFocus
            />
          </div>

          <button
            className="gh-btn"
            onClick={handleSubmit}
            disabled={loading || !username.trim()}
          >
            {loading ? (
              <>
                <span className="gh-btn-spinner" />
                Analyzing...
              </>
            ) : (
              "Run Analysis →"
            )}
          </button>
        </div>
      </div>

      <div className="landing-footer">
        press enter or click · public profiles only
      </div>
    </div>
  );
}

export default LandingPage;