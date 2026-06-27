import React from "react";
import { getAiProviderName } from "../gemini";

function RescueMode({ plan, onBack }) {
  return (
    <div className="slide-in" style={{
      maxWidth: "600px",
      margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "2rem",
        padding: "2rem",
        background: "linear-gradient(135deg, rgba(255,65,108,0.1), rgba(255,75,43,0.1))",
        borderRadius: "24px",
        border: "1px solid rgba(255,65,108,0.3)",
      }}>
        <div style={{
          fontSize: "3.5rem",
          marginBottom: "0.5rem",
          animation: "pulse 1s infinite",
          display: "inline-block",
        }}>
          🚨
        </div>
        <div style={{
          fontSize: "2rem",
          fontWeight: "800",
          background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "0.3rem",
        }}>
          RESCUE MODE
        </div>
        <div style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "0.9rem",
        }}>
          {getAiProviderName()} has analyzed your situation
        </div>
      </div>

      {/* Message */}
      <div style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: "16px",
        padding: "1.2rem 1.5rem",
        marginBottom: "1.2rem",
        borderLeft: "4px solid #ff416c",
        fontSize: "1rem",
        color: "rgba(255,255,255,0.85)",
        lineHeight: "1.6",
      }}>
        💬 {plan.message}
      </div>

      {/* Do this RIGHT NOW */}
      <div style={{
        background: "linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15))",
        border: "1px solid rgba(102,126,234,0.4)",
        borderRadius: "20px",
        padding: "1.5rem",
        marginBottom: "1.2rem",
        boxShadow: "0 8px 32px rgba(102,126,234,0.2)",
      }}>
        <div style={{
          fontSize: "0.78rem",
          color: "#667eea",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          marginBottom: "0.8rem",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}>
          ⚡ DO THIS RIGHT NOW
        </div>
        <div style={{
          fontSize: "1.2rem",
          fontWeight: "700",
          color: "#fff",
          lineHeight: "1.4",
        }}>
          {plan.nextAction}
        </div>
      </div>

      {/* Priority order */}
      {plan.priorityOrder?.length > 0 && (
        <div className="glass" style={{
          borderRadius: "16px",
          padding: "1.2rem",
          marginBottom: "1rem",
        }}>
          <div style={{
            fontSize: "0.78rem",
            color: "rgba(255,255,255,0.5)",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "0.8rem",
          }}>
            ✅ Focus on these
          </div>
          {plan.priorityOrder.map((task, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              padding: "10px 0",
              borderBottom: i < plan.priorityOrder.length - 1
                ? "1px solid rgba(255,255,255,0.05)"
                : "none",
              fontSize: "0.9rem",
            }}>
              <span style={{
                background: "linear-gradient(90deg, #667eea, #764ba2)",
                borderRadius: "50%",
                width: "26px",
                height: "26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: "700",
                flexShrink: 0,
              }}>
                {i + 1}
              </span>
              {task}
            </div>
          ))}
        </div>
      )}

      {/* Drop these */}
      {plan.dropThese?.length > 0 && (
        <div style={{
          background: "rgba(244,67,54,0.05)",
          border: "1px solid rgba(244,67,54,0.2)",
          borderRadius: "16px",
          padding: "1.2rem",
          marginBottom: "1.2rem",
        }}>
          <div style={{
            fontSize: "0.78rem",
            color: "#f44336",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "0.8rem",
          }}>
            🗑️ Drop or postpone
          </div>
          {plan.dropThese.map((task, i) => (
            <div key={i} style={{
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.4)",
              textDecoration: "line-through",
              padding: "6px 0",
            }}>
              ❌ {task}
            </div>
          ))}
        </div>
      )}

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "14px",
          padding: "14px",
          color: "#fff",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
        onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default RescueMode;