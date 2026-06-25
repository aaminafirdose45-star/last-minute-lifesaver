import React from "react";

const allBadges = [
  { id: 1, emoji: "🎯", name: "First Step", desc: "Complete your first task", xpRequired: 50 },
  { id: 2, emoji: "🔥", name: "On Fire", desc: "Complete 3 tasks", xpRequired: 150 },
  { id: 3, emoji: "⚡", name: "Speed Demon", desc: "Reach 250 XP", xpRequired: 250 },
  { id: 4, emoji: "💪", name: "Deadline Crusher", desc: "Reach 500 XP", xpRequired: 500 },
  { id: 5, emoji: "🚀", name: "Productivity Rocket", desc: "Reach 1000 XP", xpRequired: 1000 },
  { id: 6, emoji: "👑", name: "Last-Minute Legend", desc: "Reach 2000 XP", xpRequired: 2000 },
];

function Badges({ xp }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      borderRadius: "20px",
      padding: "2rem",
      border: "1px solid rgba(255,255,255,0.1)",
    }}>
      <h2 style={{
        fontSize: "1.5rem",
        fontWeight: "800",
        marginBottom: "1.5rem",
        background: "linear-gradient(90deg, #667eea, #764ba2)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        🏆 Your Badges
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
      }}>
        {allBadges.map((badge) => {
          const unlocked = xp >= badge.xpRequired;
          return (
            <div key={badge.id} style={{
              background: unlocked
                ? "linear-gradient(135deg, #667eea22, #764ba222)"
                : "rgba(255,255,255,0.03)",
              border: `1px solid ${unlocked ? "#667eea" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "16px",
              padding: "1.2rem",
              textAlign: "center",
              opacity: unlocked ? 1 : 0.4,
              transition: "all 0.3s",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                {unlocked ? badge.emoji : "🔒"}
              </div>
              <div style={{
                fontWeight: "700",
                fontSize: "0.9rem",
                marginBottom: "0.3rem",
                color: unlocked ? "#fff" : "rgba(255,255,255,0.4)",
              }}>
                {badge.name}
              </div>
              <div style={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.4)",
              }}>
                {badge.desc}
              </div>
              <div style={{
                fontSize: "0.75rem",
                color: unlocked ? "#667eea" : "rgba(255,255,255,0.3)",
                marginTop: "0.5rem",
                fontWeight: "700",
              }}>
                {unlocked ? "✅ Unlocked!" : `${badge.xpRequired} XP needed`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Badges;