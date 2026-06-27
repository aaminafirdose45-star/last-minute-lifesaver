import React, { useState } from "react";
import { askGemini, getAiProviderName } from "../gemini";

function AiChat({ user, tasks }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState("");

  const suggestionTypes = [
    { id: "priority", label: "📊 What to do first?", emoji: "📊" },
    { id: "schedule", label: "🕐 Plan my day", emoji: "🕐" },
    { id: "tips", label: "💡 Productivity tips", emoji: "💡" },
    { id: "motivate", label: "🔥 Motivate me!", emoji: "🔥" },
  ];

  const getSuggestion = async (type) => {
    setLoading(true);
    setActiveType(type);
    setSuggestions([]);

    const pendingTasks = tasks.filter((t) => !t.completed);
    const taskList = pendingTasks.length > 0
      ? pendingTasks.map((t) => `- ${t.title} (due: ${t.deadline}, urgency: ${t.urgencyLabel})`).join("\n")
      : "No pending tasks";

    const prompts = {
      priority: `You are a productivity coach. Based on these tasks, tell me exactly what to do first and why. Be specific and actionable. Tasks:\n${taskList}\n\nGive 3 specific action points as a numbered list.`,
      schedule: `You are a time management expert. Create a simple hourly schedule for today based on these tasks:\n${taskList}\n\nFormat as: TIME - TASK - DURATION. Give 4-5 time blocks.`,
      tips: `You are a productivity expert. Give 3 specific productivity tips for someone with these pending tasks:\n${taskList}\n\nMake tips practical and specific to these tasks.`,
      motivate: `You are an energetic motivational coach. Give a short powerful motivational message for someone with these tasks:\n${taskList}\n\nBe energetic, specific, and end with a call to action!`,
    };

    const result = await askGemini(prompts[type]);
    
    const lines = result
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .slice(0, 5);
    
    setSuggestions(lines);
    setLoading(false);
  };

  const styles = {
    container: {
      background: "rgba(255,255,255,0.03)",
      borderRadius: "20px",
      padding: "2rem",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "800",
      marginBottom: "0.5rem",
      background: "linear-gradient(90deg, #667eea, #764ba2)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subtitle: {
      color: "rgba(255,255,255,0.5)",
      fontSize: "0.9rem",
      marginBottom: "1.5rem",
    },
    btnGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "1rem",
      marginBottom: "2rem",
    },
    btn: (active) => ({
      background: active
        ? "linear-gradient(90deg, #667eea, #764ba2)"
        : "rgba(255,255,255,0.05)",
      border: `1px solid ${active ? "#667eea" : "rgba(255,255,255,0.1)"}`,
      borderRadius: "14px",
      padding: "1rem",
      color: "#fff",
      cursor: "pointer",
      fontSize: "0.95rem",
      fontWeight: active ? "700" : "400",
      transition: "all 0.2s",
      textAlign: "left",
    }),
    results: {
      background: "rgba(255,255,255,0.05)",
      borderRadius: "14px",
      padding: "1.5rem",
      border: "1px solid rgba(102,126,234,0.3)",
    },
    resultTitle: {
      fontSize: "0.8rem",
      color: "#667eea",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: "1rem",
    },
    line: {
      padding: "0.7rem 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      fontSize: "0.9rem",
      color: "rgba(255,255,255,0.85)",
      lineHeight: "1.5",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>🤖 AI Assistant</div>
      <div style={styles.subtitle}>
        Powered by {getAiProviderName()} — tap a button to get instant AI advice!
      </div>

      <div style={styles.btnGrid}>
        {suggestionTypes.map((type) => (
          <button
            key={type.id}
            style={styles.btn(activeType === type.id)}
            onClick={() => getSuggestion(type.id)}
            disabled={loading}
          >
            {type.label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{
          textAlign: "center",
          padding: "2rem",
          color: "#667eea",
          fontSize: "1rem",
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🤖</div>
          {getAiProviderName()} is thinking...
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div style={styles.results}>
          <div style={styles.resultTitle}>
            ⚡ {getAiProviderName()} says:
          </div>
          {suggestions.map((line, i) => (
            <div key={i} style={styles.line}>
              {line}
            </div>
          ))}
        </div>
      )}

      {!loading && suggestions.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "2rem",
          color: "rgba(255,255,255,0.3)",
          fontSize: "0.9rem",
        }}>
          👆 Tap any button above to get AI-powered advice!
        </div>
      )}
    </div>
  );
}

export default AiChat;