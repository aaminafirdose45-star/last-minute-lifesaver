import React, { useState, useEffect } from "react";

function TaskCard({ task, onComplete, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const urgencyColors = {
    Low: "#4caf50",
    Medium: "#ff9800",
    High: "#f44336",
    Critical: "#9c27b0",
  };

  const color = urgencyColors[task.urgencyLabel] || "#667eea";

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
  }, [task.deadline, task.completed]);

  const isUrgent = !task.completed && timeLeft.includes("⚡");
  const isOverdue = timeLeft.includes("⚠️");

  return (
    <div
      className="slide-in"
      style={{
        background: task.completed
          ? "rgba(255,255,255,0.02)"
          : "rgba(255,255,255,0.05)",
        border: `1px solid ${task.completed
          ? "rgba(255,255,255,0.05)"
          : isOverdue
          ? "rgba(244,67,54,0.5)"
          : color + "44"}`,
        borderLeft: `4px solid ${task.completed ? "#333" : isOverdue ? "#f44336" : color}`,
        borderRadius: "20px",
        padding: "1.4rem",
        marginBottom: "1rem",
        opacity: task.completed ? 0.6 : 1,
        transition: "all 0.3s",
        backdropFilter: "blur(10px)",
        boxShadow: task.completed
          ? "none"
          : isOverdue
          ? "0 4px 20px rgba(244,67,54,0.2)"
          : `0 4px 20px ${color}22`,
      }}
    >
      {/* Top row */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "0.8rem",
      }}>
        <div style={{
          fontSize: "1.05rem",
          fontWeight: "700",
          textDecoration: task.completed ? "line-through" : "none",
          color: task.completed ? "rgba(255,255,255,0.3)" : "#fff",
          flex: 1,
          marginRight: "1rem",
        }}>
          {task.title}
        </div>
        <span style={{
          background: color + "22",
          color: color,
          border: `1px solid ${color}66`,
          borderRadius: "20px",
          padding: "4px 12px",
          fontSize: "0.75rem",
          fontWeight: "700",
          whiteSpace: "nowrap",
        }}>
          {task.urgencyLabel}
        </span>
      </div>

      {/* Meta info */}
      <div style={{
        display: "flex",
        gap: "0.8rem",
        fontSize: "0.82rem",
        color: "rgba(255,255,255,0.5)",
        marginBottom: "0.8rem",
        flexWrap: "wrap",
        alignItems: "center",
      }}>
        <span>📅 {new Date(task.deadline).toLocaleDateString()}</span>
        <span style={{
          color: isOverdue ? "#f44336" : isUrgent ? "#ff9800" : "rgba(255,255,255,0.5)",
          fontWeight: isUrgent || isOverdue ? "700" : "400",
          animation: isUrgent ? "pulse 1s infinite" : "none",
        }}>
          ⏰ {timeLeft}
        </span>
        <span>🏷️ {task.category}</span>
        <span style={{ color: color }}>⚡ {task.urgencyScore}/10</span>
        <span>🕐 ~{task.estimatedHours}h</span>
      </div>

      {/* Urgency bar */}
      <div style={{
        height: "4px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "2px",
        marginBottom: "0.8rem",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${(task.urgencyScore / 10) * 100}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: "2px",
          transition: "width 0.5s ease",
        }} />
      </div>

      {/* Tip */}
      {task.tip && (
        <div style={{
          fontSize: "0.82rem",
          color: "#667eea",
          fontStyle: "italic",
          marginBottom: "0.8rem",
          padding: "8px 12px",
          background: "rgba(102,126,234,0.1)",
          borderRadius: "8px",
          borderLeft: "2px solid #667eea",
        }}>
          💡 {task.tip}
        </div>
      )}

      {/* Steps */}
      {expanded && task.steps && (
        <div style={{
          marginBottom: "0.8rem",
          padding: "1rem",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{
            fontSize: "0.8rem",
            fontWeight: "700",
            color: "rgba(255,255,255,0.6)",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "0.8rem",
          }}>
            📋 AI Action Plan
          </div>
          {task.steps.map((step, i) => (
            <div key={i} style={{
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.7)",
              padding: "6px 0",
              borderBottom: i < task.steps.length - 1
                ? "1px solid rgba(255,255,255,0.05)"
                : "none",
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
            }}>
              <span style={{
                background: "linear-gradient(90deg, #667eea, #764ba2)",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: "700",
                flexShrink: 0,
                marginTop: "1px",
              }}>
                {i + 1}
              </span>
              {step}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap",
      }}>
        {!task.completed && (
          <button
            onClick={() => onComplete(task.id)}
            style={{
              background: "linear-gradient(90deg, #4caf50, #45a049)",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: "700",
              transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(76,175,80,0.3)",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            ✅ Done +50XP
          </button>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            padding: "8px 16px",
            color: "#fff",
            cursor: "pointer",
            fontSize: "0.82rem",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
        >
          {expanded ? "▲ Hide Plan" : "▼ Show Plan"}
        </button>
        <button
          onClick={() => onDelete(task.id)}
          style={{
            background: "rgba(244,67,54,0.1)",
            border: "1px solid rgba(244,67,54,0.2)",
            borderRadius: "10px",
            padding: "8px 16px",
            color: "#f44336",
            cursor: "pointer",
            fontSize: "0.82rem",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "rgba(244,67,54,0.2)"}
          onMouseOut={(e) => e.currentTarget.style.background = "rgba(244,67,54,0.1)"}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;