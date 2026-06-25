import React, { useState, useEffect} from "react";

function TaskCard({ task, onComplete, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const urgencyColors = {
    Low: "#4caf50",
    Medium: "#ff9800",
    High: "#f44336",
    Critical: "#9c27b0",
  };

  const color = urgencyColors[task.urgencyLabel] || "#667eea";

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
        const updateTimer = () => {
          if (task.completed) {
            setTimeLeft("✅ Completed");
            return;
          }
          const diff = new Date(task.deadline) - new Date();
        if (diff < 0) {
          setTimeLeft("⚠️ Overdue!");
          return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        if (days > 0) setTimeLeft(`${days}d ${hours}h ${minutes}m left`);
        else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m ${seconds}s left`);
        else setTimeLeft(`⚡ ${minutes}m ${seconds}s left!`);
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }, [task.deadline]);

  const styles = {
    card: {
      background: task.completed
        ? "rgba(255,255,255,0.03)"
        : "rgba(255,255,255,0.07)",
      border: `1px solid ${task.completed ? "rgba(255,255,255,0.05)" : color + "44"}`,
      borderLeft: `4px solid ${task.completed ? "#555" : color}`,
      borderRadius: "16px",
      padding: "1.2rem",
      marginBottom: "1rem",
      opacity: task.completed ? 0.6 : 1,
      transition: "all 0.3s",
    },
    top: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "0.5rem",
    },
    title: {
      fontSize: "1.05rem",
      fontWeight: "700",
      textDecoration: task.completed ? "line-through" : "none",
      color: task.completed ? "rgba(255,255,255,0.4)" : "#fff",
    },
    badge: {
      background: color + "33",
      color: color,
      border: `1px solid ${color}`,
      borderRadius: "20px",
      padding: "3px 10px",
      fontSize: "0.75rem",
      fontWeight: "700",
    },
    meta: {
      display: "flex",
      gap: "1rem",
      fontSize: "0.82rem",
      color: "rgba(255,255,255,0.5)",
      marginBottom: "0.8rem",
      flexWrap: "wrap",
    },
    actions: {
      display: "flex",
      gap: "0.5rem",
      marginTop: "0.8rem",
    },
    btn: (bg) => ({
      background: bg,
      border: "none",
      borderRadius: "8px",
      padding: "6px 14px",
      color: "#fff",
      cursor: "pointer",
      fontSize: "0.82rem",
      fontWeight: "600",
    }),
    steps: {
      marginTop: "0.8rem",
      padding: "0.8rem",
      background: "rgba(255,255,255,0.05)",
      borderRadius: "10px",
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <div style={styles.title}>{task.title}</div>
        <span style={styles.badge}>{task.urgencyLabel}</span>
      </div>

      <div style={styles.meta}>
        <span>📅 {new Date(task.deadline).toLocaleDateString()}</span>
        <span>⏰ {timeLeft}</span>
        <span>🏷️ {task.category}</span>
        <span>⚡ {task.urgencyScore}/10</span>
        <span>🕐 ~{task.estimatedHours}h</span>
      </div>

      {task.tip && (
        <div style={{
          fontSize: "0.82rem",
          color: "#667eea",
          fontStyle: "italic",
          marginBottom: "0.5rem"
        }}>
          💡 {task.tip}
        </div>
      )}

      {expanded && task.steps && (
        <div style={styles.steps}>
          <div style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.5rem" }}>
            📋 AI Action Plan:
          </div>
          {task.steps.map((step, i) => (
            <div key={i} style={{
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.7)",
              padding: "4px 0",
              borderBottom: "1px solid rgba(255,255,255,0.05)"
            }}>
              {i + 1}. {step}
            </div>
          ))}
        </div>
      )}

      <div style={styles.actions}>
        {!task.completed && (
          <button
            style={styles.btn("linear-gradient(90deg, #4caf50, #45a049)")}
            onClick={() => onComplete(task.id)}
          >
            ✅ Done
          </button>
        )}
        <button
          style={styles.btn("rgba(255,255,255,0.1)")}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "▲ Hide Plan" : "▼ Show Plan"}
        </button>
        <button
          style={styles.btn("#f4433633")}
          onClick={() => onDelete(task.id)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;