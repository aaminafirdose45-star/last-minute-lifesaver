import React, { useState } from "react";
import { getAiProviderName } from "../gemini";

function AddTask({ onAdd, onDone }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("Study");
  const [loading, setLoading] = useState(false);

  const categories = [
    { name: "Study", emoji: "📚" },
    { name: "Work", emoji: "💼" },
    { name: "Personal", emoji: "🌟" },
    { name: "Health", emoji: "💪" },
    { name: "Finance", emoji: "💰" },
    { name: "Other", emoji: "📌" },
  ];

  const handleSubmit = async () => {
    if (!title || !deadline) return alert("Please fill all fields!");
    setLoading(true);
    await onAdd(title, deadline, category);
    setLoading(false);
    onDone();
  };

  return (
    <div className="glass-strong slide-in" style={{
      borderRadius: "24px",
      padding: "2rem",
      maxWidth: "520px",
      margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{
        fontSize: "1.5rem",
        fontWeight: "800",
        marginBottom: "0.3rem",
        background: "linear-gradient(90deg, #667eea, #764ba2)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        ➕ Add New Task
      </div>
      <p style={{
        color: "rgba(255,255,255,0.4)",
        fontSize: "0.85rem",
        marginBottom: "1.5rem",
      }}>
        {getAiProviderName()} will analyze urgency and create an action plan
      </p>

      {/* Title input */}
      <label style={{
        display: "block",
        fontSize: "0.82rem",
        color: "rgba(255,255,255,0.5)",
        marginBottom: "0.5rem",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}>
        Task Title
      </label>
      <input
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "14px",
          padding: "14px 16px",
          color: "#fff",
          fontSize: "1rem",
          marginBottom: "1.2rem",
          boxSizing: "border-box",
          outline: "none",
          transition: "border-color 0.2s",
        }}
        placeholder="e.g. Submit assignment, Pay electricity bill..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onFocus={(e) => e.target.style.borderColor = "#667eea"}
        onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
      />

      {/* Deadline input */}
      <label style={{
        display: "block",
        fontSize: "0.82rem",
        color: "rgba(255,255,255,0.5)",
        marginBottom: "0.5rem",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}>
        Deadline
      </label>
      <input
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "14px",
          padding: "14px 16px",
          color: "#fff",
          fontSize: "1rem",
          marginBottom: "1.2rem",
          boxSizing: "border-box",
          outline: "none",
          colorScheme: "dark",
          transition: "border-color 0.2s",
        }}
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        onFocus={(e) => e.target.style.borderColor = "#667eea"}
        onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
      />

      {/* Category */}
      <label style={{
        display: "block",
        fontSize: "0.82rem",
        color: "rgba(255,255,255,0.5)",
        marginBottom: "0.8rem",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}>
        Category
      </label>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "0.6rem",
        marginBottom: "1.5rem",
      }}>
        {categories.map((cat) => (
          <button
            key={cat.name}
            style={{
              background: category === cat.name
                ? "linear-gradient(90deg, #667eea, #764ba2)"
                : "rgba(255,255,255,0.05)",
              border: `1px solid ${category === cat.name ? "#667eea" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "12px",
              padding: "10px 8px",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: category === cat.name ? "700" : "400",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
            onClick={() => setCategory(cat.name)}
            onMouseOver={(e) => {
              if (category !== cat.name)
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseOut={(e) => {
              if (category !== cat.name)
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%",
          background: loading
            ? "rgba(255,255,255,0.1)"
            : "linear-gradient(90deg, #667eea, #764ba2)",
          border: "none",
          borderRadius: "14px",
          padding: "16px",
          color: "#fff",
          fontSize: "1rem",
          fontWeight: "700",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.3s",
          boxShadow: loading ? "none" : "0 8px 32px rgba(102,126,234,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
        onMouseOver={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(102,126,234,0.5)";
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(102,126,234,0.3)";
        }}
      >
        {loading ? (
          <>🤖 {getAiProviderName()} Analyzing...</>
        ) : (
          <>⚡ Add Task & Analyze</>
        )}
      </button>
    </div>
  );
}

export default AddTask;