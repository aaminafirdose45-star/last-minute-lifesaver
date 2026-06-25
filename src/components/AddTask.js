import React, { useState } from "react";

function AddTask({ onAdd, onDone }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("Study");
  const [loading, setLoading] = useState(false);

  const categories = ["Study", "Work", "Personal", "Health", "Finance", "Other"];

  const handleSubmit = async () => {
    if (!title || !deadline) return alert("Please fill all fields!");
    setLoading(true);
    await onAdd(title, deadline, category);
    setLoading(false);
    onDone();
  };

  const styles = {
    container: {
      background: "rgba(255,255,255,0.05)",
      borderRadius: "20px",
      padding: "2rem",
      border: "1px solid rgba(255,255,255,0.1)",
      maxWidth: "500px",
      margin: "0 auto",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "800",
      marginBottom: "1.5rem",
      background: "linear-gradient(90deg, #667eea, #764ba2)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    label: {
      display: "block",
      fontSize: "0.85rem",
      color: "rgba(255,255,255,0.6)",
      marginBottom: "0.4rem",
      fontWeight: "600",
    },
    input: {
      width: "100%",
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: "10px",
      padding: "12px",
      color: "#fff",
      fontSize: "1rem",
      marginBottom: "1.2rem",
      boxSizing: "border-box",
      outline: "none",
    },
    categoryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "0.5rem",
      marginBottom: "1.5rem",
    },
    catBtn: (active) => ({
      background: active
        ? "linear-gradient(90deg, #667eea, #764ba2)"
        : "rgba(255,255,255,0.05)",
      border: `1px solid ${active ? "#667eea" : "rgba(255,255,255,0.1)"}`,
      borderRadius: "10px",
      padding: "10px",
      color: "#fff",
      cursor: "pointer",
      fontSize: "0.85rem",
      fontWeight: active ? "700" : "400",
      transition: "all 0.2s",
    }),
    submitBtn: {
      width: "100%",
      background: loading
        ? "rgba(255,255,255,0.1)"
        : "linear-gradient(90deg, #667eea, #764ba2)",
      border: "none",
      borderRadius: "12px",
      padding: "14px",
      color: "#fff",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "all 0.3s",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>➕ Add New Task</div>

      <label style={styles.label}>Task Title</label>
      <input
        style={styles.input}
        placeholder="e.g. Submit assignment, Pay bill..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label style={styles.label}>Deadline</label>
      <input
        style={styles.input}
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <label style={styles.label}>Category</label>
      <div style={styles.categoryGrid}>
        {categories.map((cat) => (
          <button
            key={cat}
            style={styles.catBtn(category === cat)}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <button
        style={styles.submitBtn}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "🤖 Gemini Analyzing..." : "⚡ Add Task & Analyze"}
      </button>
    </div>
  );
}

export default AddTask;