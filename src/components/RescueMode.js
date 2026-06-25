import React from "react";

function RescueMode({ plan, onBack }) {
  const styles = {
    container: {
      background: "rgba(255,65,108,0.05)",
      border: "1px solid rgba(255,65,108,0.3)",
      borderRadius: "20px",
      padding: "2rem",
      maxWidth: "600px",
      margin: "0 auto",
    },
    header: {
      textAlign: "center",
      marginBottom: "1.5rem",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "800",
      background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "0.5rem",
    },
    message: {
      background: "rgba(255,255,255,0.05)",
      borderRadius: "12px",
      padding: "1rem",
      marginBottom: "1.5rem",
      fontSize: "1rem",
      color: "rgba(255,255,255,0.85)",
      lineHeight: "1.6",
      borderLeft: "4px solid #ff416c",
    },
    section: {
      marginBottom: "1.5rem",
    },
    sectionTitle: {
      fontSize: "0.85rem",
      fontWeight: "700",
      color: "rgba(255,255,255,0.5)",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: "0.8rem",
    },
    priorityItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.8rem",
      padding: "10px 14px",
      background: "rgba(255,255,255,0.05)",
      borderRadius: "10px",
      marginBottom: "0.5rem",
      fontSize: "0.9rem",
    },
    dropItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.8rem",
      padding: "10px 14px",
      background: "rgba(255,65,108,0.1)",
      borderRadius: "10px",
      marginBottom: "0.5rem",
      fontSize: "0.9rem",
      color: "rgba(255,255,255,0.6)",
      textDecoration: "line-through",
    },
    nextAction: {
      background: "linear-gradient(90deg, #667eea22, #764ba222)",
      border: "1px solid #667eea",
      borderRadius: "14px",
      padding: "1.2rem",
      marginBottom: "1.5rem",
    },
    nextActionTitle: {
      fontSize: "0.85rem",
      color: "#667eea",
      fontWeight: "700",
      marginBottom: "0.5rem",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    nextActionText: {
      fontSize: "1.1rem",
      fontWeight: "700",
      color: "#fff",
    },
    backBtn: {
      width: "100%",
      background: "rgba(255,255,255,0.1)",
      border: "none",
      borderRadius: "12px",
      padding: "14px",
      color: "#fff",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>🚨 RESCUE MODE</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
          Gemini has analyzed your situation
        </div>
      </div>

      <div style={styles.message}>
        💬 {plan.message}
      </div>

      <div style={styles.nextAction}>
        <div style={styles.nextActionTitle}>⚡ Do This RIGHT NOW</div>
        <div style={styles.nextActionText}>{plan.nextAction}</div>
      </div>

      {plan.priorityOrder?.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>✅ Focus on these</div>
          {plan.priorityOrder.map((task, i) => (
            <div key={i} style={styles.priorityItem}>
              <span style={{
                background: "linear-gradient(90deg, #667eea, #764ba2)",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
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

      {plan.dropThese?.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>🗑️ Drop or postpone these</div>
          {plan.dropThese.map((task, i) => (
            <div key={i} style={styles.dropItem}>
              ❌ {task}
            </div>
          ))}
        </div>
      )}

      <button style={styles.backBtn} onClick={onBack}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default RescueMode;