import "./Dashboard.css";

// Language color map
const LANG_COLORS = {
  JavaScript: "#F1E05A",
  TypeScript: "#3178C6",
  Python: "#3572A5",
  Java: "#B07219",
  "C++": "#F34B7D",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Ruby: "#701516",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Shell: "#89E051",
  default: "#8B949E",
};

function langColor(lang) {
  return LANG_COLORS[lang] || LANG_COLORS.default;
}

// Compute language usage percentages from repos
function buildLangStats(repos) {
  const counts = {};
  for (const repo of repos) {
    if (repo.language) counts[repo.language] = (counts[repo.language] || 0) + 1;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return [];
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([lang, count]) => ({ lang, count, pct: Math.round((count / total) * 100) }));
}

// Derive simple activity bar heights from repo data (uses stars/forks as proxy)
function buildActivityBars(repos) {
  if (!repos || repos.length === 0) return Array(8).fill(20);
  const recent = repos.slice(0, 8);
  const max = Math.max(...recent.map((r) => (r.stargazers_count || 0) + (r.forks_count || 0)), 1);
  return recent.map((r) => {
    const val = (r.stargazers_count || 0) + (r.forks_count || 0);
    return Math.max(12, Math.round((val / max) * 56));
  });
}

// Arc path for the avatar ring (SVG circle trick)
function ArcRing({ ratio = 0.6 }) {
  const r = 46;
  const cx = 50;
  const cy = 50;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(ratio, 1));

  return (
    <svg viewBox="0 0 100 100">
      <circle className="arc-bg" cx={cx} cy={cy} r={r} />
      <circle
        className="arc-fill"
        cx={cx}
        cy={cy}
        r={r}
        strokeDasharray={circ}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

function Dashboard({ details }) {
  if (!details) {
    return (
      <div className="dashboard" style={{ textAlign: "center", paddingTop: 80 }}>
        <p style={{ fontFamily: "JetBrains Mono, monospace", color: "#8B949E" }}>
          // No profile data provided
        </p>
      </div>
    );
  }

  const { profile, repos = [] } = details;
  const {
    username = "—",
    name = username,
    followers = 0,
    following = 0,
    public_repos = 0,
    total_stars = 0,
    top_language = "—",
    avatar_url,
  } = profile || details; // support flat or nested shape

  const initial = (name || username)[0]?.toUpperCase() || "?";
  const followRatio = followers + following > 0 ? followers / (followers + following) : 0.5;
  const langStats = buildLangStats(repos);
  const topRepos = repos.slice(0, 5);
  const actBars = buildActivityBars(repos);
  const barColors = ["#58D5E8", "#3FB950", "#BC8CFF", "#F78166", "#58D5E8", "#3FB950", "#BC8CFF", "#F78166"];
  const now = new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="dashboard">
      {/* ── Header bar ── */}
      <div className="db-header">
        <a href="/" className="db-back-btn" title="Back to home">
          <span className="db-back-arrow">←</span> Home
        </a>
        <span className="db-logo">gh/analyzer</span>
        <div className="db-header-line" />
        <span className="db-header-ts">{now}</span>
      </div>

      <div className="bento">
        {/* ── Profile card ── */}
        <div className="card card-profile card-glow">
          <div className="avatar-ring-wrap">
            <ArcRing ratio={followRatio} />
            {avatar_url ? (
              <img className="avatar-img" src={avatar_url} alt={name} />
            ) : (
              <div className="avatar-placeholder">{initial}</div>
            )}
          </div>
          <div className="profile-name">{name}</div>
          <div className="profile-username">@{username}</div>
          <div className="profile-badge">GitHub Developer</div>
        </div>

        {/* ── Stars ── */}
        <div className="card card-stat">
          <div className="card-label">Total Stars</div>
          <div>
            <div className="stat-value cyan">{total_stars}</div>
            <div className="stat-desc">across all public repos</div>
          </div>
        </div>

        {/* ── Top Language ── */}
        <div className="card card-lang">
          <div className="card-label">Top Language</div>
          <div>
            <div className="lang-name" style={{ color: langColor(top_language) }}>
              {top_language}
            </div>
            <div style={{ marginTop: 8, fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#8B949E" }}>
              <span
                className="lang-dot"
                style={{ background: langColor(top_language), boxShadow: `0 0 8px ${langColor(top_language)}` }}
              />
              most used
            </div>
          </div>
        </div>

        {/* ── Repos ── */}
        <div className="card card-stat">
          <div className="card-label">Public Repos</div>
          <div>
            <div className="stat-value green">{public_repos}</div>
            <div className="stat-desc">repositories</div>
          </div>
        </div>

        {/* ── Followers / Following ── */}
        <div className="card card-follow">
          <div className="card-label">Network</div>
          <div className="follow-row">
            <div className="follow-item">
              <div className="follow-num">{followers}</div>
              <div className="follow-lbl">followers</div>
            </div>
            <div className="follow-item">
              <div className="follow-num">{following}</div>
              <div className="follow-lbl">following</div>
            </div>
          </div>
        </div>

        {/* ── Activity bars ── */}
        <div className="card card-activity">
          <div className="card-label">Repo Activity</div>
          <div className="activity-bars">
            {actBars.map((h, i) => (
              <div
                key={i}
                className="a-bar"
                style={{
                  height: `${h}px`,
                  background: barColors[i % barColors.length],
                  animationDelay: `${i * 60}ms`,
                }}
              />
            ))}
          </div>
          <div style={{ marginTop: 6, fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#8B949E" }}>
            stars + forks per repo
          </div>
        </div>

        {/* ── Top repos list ── */}
        <div className="card card-repos">
          <div className="card-label">Top Repositories</div>
          {topRepos.length > 0 ? (
            <div className="repo-list">
              {topRepos.map((repo) => (
                <div className="repo-item" key={repo.id || repo.name}>
                  <span className="repo-name">{repo.name}</span>
                  <div className="repo-meta">
                    {repo.language && (
                      <span className="repo-lang-badge">
                        <span
                          className="repo-lang-dot"
                          style={{ background: langColor(repo.language) }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="repo-stars">
                      <span className="star-icon">★</span>
                      {repo.stargazers_count ?? 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#8B949E", marginTop: 16 }}>
              // no repo data passed in
            </div>
          )}
        </div>

        {/* ── Language Breakdown ── */}
        {langStats.length > 0 && (
          <div className="card card-langs-breakdown">
            <div className="card-label">Language Breakdown</div>

            {/* Segmented bar */}
            <div className="lang-bar-track">
              {langStats.map(({ lang, pct }) => (
                <div
                  key={lang}
                  className="lang-bar-seg"
                  style={{ width: `${pct}%`, background: langColor(lang) }}
                  title={`${lang}: ${pct}%`}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="lang-legend">
              {langStats.map(({ lang, pct, count }) => (
                <div className="lang-legend-item" key={lang}>
                  <span
                    className="lang-legend-dot"
                    style={{ background: langColor(lang), boxShadow: `0 0 6px ${langColor(lang)}` }}
                  />
                  <span className="lang-legend-name">{lang}</span>
                  <span className="lang-legend-pct">{pct}%</span>
                  <span className="lang-legend-count">{count} repo{count !== 1 ? "s" : ""}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="db-footer">
        generated by gh/analyzer · {username} · {public_repos} repos · {total_stars} ★
      </div>
    </div>
  );
}

export default Dashboard;
