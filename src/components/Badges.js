import React from "react";

const allBadges = [
  {
    id: 1,
    emoji: "🎯",
    name: "First Step",
    desc: "Complete your first task",
    xpRequired: 50,
    color: "#4caf50",
  },
  {
    id: 2,
    emoji: "🔥",
    name: "On Fire",
    desc: "Complete 3 tasks",
    xpRequired: 150,
    color: "#ff9800",
  },
  {
    id: 3,
    emoji: "⚡",
    name: "Speed Demon",
    desc: "Reach 250 XP",
    xpRequired: 250,
    color: "#667eea",
  },
  {
    id: 4,
    emoji: "💪",
    name: "Deadline Crusher",
    desc: "Reach 500 XP",
    xpRequired: 500,
    color: "#f44336",
  },
  {
    id: 5,
    emoji: "🚀",
    name: "Productivity Rocket",
    desc: "Reach 1000 XP",
    xpRequired: 1000,
    color: "#9c27b0",
  },
  {
    id: 6,
    emoji: "👑",
    name: "Last-Minute Legend",
    desc: "Reach 2000 XP",
    xpRequired: 2000,
    color: "#ff416c",
  },
];

function Badges({ xp }) {
  const unlockedCount = allBadges.filter((b) => xp >= b.xpRequired).length;

  return (
    <div className="slide-in" style={{ maxWidth: "700px", margin: "0 auto" }}>
      {/* Header */}
      <div className="glass" style={{
        borderRadius: "20px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <div style={{
            fontSize: "1.5rem",
            fontWeight: "800",
            background: "linear-gradient(90deg, #667eea, #764ba2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.3rem",
          }}>
            🏆 Your Badges
          </div>
          <div style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.85rem",
          }}>
            {unlockedCount} of {allBadges.length} unlocked
          </div>
        </div>

        {/* Progress */}
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: "2rem",
            fontWeight: "800",
            color: "#667eea",
          }}>
            {Math.round((unlockedCount / allBadges.length) * 100)}%
          </div>
          <div style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.8rem",
          }}>
            completion
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: "6px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "3px",
        marginBottom: "1.5rem",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${(unlockedCount / allBadges.length) * 100}%`,
          background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)",
          borderRadius: "3px",
          transition: "width 0.8s ease",
          boxShadow: "0 0 10px rgba(102,126,234,0.8)",
        }} />
      </div>

      {/* Badges grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
      }}>
        {allBadges.map((badge) => {
          const unlocked = xp >= badge.xpRequired;
          return (
            <div
              key={badge.id}
              style={{
                background: unlocked
                  ? `linear-gradient(135deg, ${badge.color}22, ${badge.color}11)`
                  : "rgba(255,255,255,0.03)",
                border: `1px solid ${unlocked ? badge.color + "44" : "rgba(255,255,255,0.06)"}`,
                borderRadius: "20px",
                padding: "1.5rem 1rem",
                textAlign: "center",
                opacity: unlocked ? 1 : 0.4,
                transition: "all 0.3s",
                boxShadow: unlocked ? `0 8px 24px ${badge.color}22` : "none",
                transform: unlocked ? "scale(1)" : "scale(0.97)",
              }}
            >
              <div style={{
                fontSize: "2.8rem",
                marginBottom: "0.6rem",
                filter: unlocked ? "none" : "grayscale(100%)",
              }}>
                {unlocked ? badge.emoji : "🔒"}
              </div>
              <div style={{
                fontWeight: "700",
                fontSize: "0.88rem",
                marginBottom: "0.3rem",
                color: unlocked ? "#fff" : "rgba(255,255,255,0.3)",
              }}>
                {badge.name}
              </div>
              <div style={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.35)",
                marginBottom: "0.6rem",
                lineHeight: "1.3",
              }}>
                {badge.desc}
              </div>
              <div style={{
                fontSize: "0.75rem",
                color: unlocked ? badge.color : "rgba(255,255,255,0.2)",
                fontWeight: "700",
                padding: "4px 10px",
                background: unlocked ? badge.color + "22" : "transparent",
                borderRadius: "20px",
                display: "inline-block",
              }}>
                {unlocked ? "✅ Unlocked!" : `${badge.xpRequired} XP`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Next badge hint */}
      {unlockedCount < allBadges.length && (
        <div className="glass" style={{
          borderRadius: "16px",
          padding: "1.2rem",
          marginTop: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}>
          <div style={{ fontSize: "2rem" }}>
            {allBadges.find((b) => xp < b.xpRequired)?.emoji}
          </div>
          <div>
            <div style={{
              fontWeight: "700",
              fontSize: "0.9rem",
              marginBottom: "0.2rem",
            }}>
              Next: {allBadges.find((b) => xp < b.xpRequired)?.name}
            </div>
            <div style={{
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.4)",
            }}>
              {allBadges.find((b) => xp < b.xpRequired)?.xpRequired - xp} XP to go!
            </div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{
              fontSize: "1.2rem",
              fontWeight: "800",
              color: "#667eea",
            }}>
              {xp} / {allBadges.find((b) => xp < b.xpRequired)?.xpRequired}
            </div>
            <div style={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.3)",
            }}>
              XP
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Badges;