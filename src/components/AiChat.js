import React, { useState, useRef, useEffect } from "react";
import { askGemini } from "../gemini";

function AiChat({ user, tasks }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: `Hey ${user.displayName?.split(" ")[0]}! 👋 I'm your AI productivity coach. Ask me anything about your tasks, deadlines, or how to manage your time better!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    const taskSummary = tasks.length > 0
      ? tasks
          .filter((t) => !t.completed)
          .map((t) => `- ${t.title} (due: ${t.deadline}, urgency: ${t.urgencyLabel})`)
          .join("\n")
      : "No pending tasks";

    const prompt = `You are a helpful AI productivity coach for ${user.displayName}.
Their current pending tasks are:
${taskSummary}

User question: ${userMsg}

Give a helpful, concise, motivating response. Keep it under 150 words.`;

    const response = await askGemini(prompt);
    setMessages((prev) => [...prev, { role: "ai", text: response }]);
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "70vh",
      background: "rgba(255,255,255,0.03)",
      borderRadius: "20px",
      border: "1px solid rgba(255,255,255,0.1)",
      overflow: "hidden",
    },
    header: {
      padding: "1rem 1.5rem",
      background: "rgba(255,255,255,0.05)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      fontWeight: "700",
      fontSize: "1rem",
    },
    messages: {
      flex: 1,
      overflowY: "auto",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    bubble: (role) => ({
      maxWidth: "75%",
      padding: "12px 16px",
      borderRadius: role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
      background: role === "user"
        ? "linear-gradient(90deg, #667eea, #764ba2)"
        : "rgba(255,255,255,0.08)",
      alignSelf: role === "user" ? "flex-end" : "flex-start",
      fontSize: "0.9rem",
      lineHeight: "1.5",
      color: "#fff",
      border: role === "ai" ? "1px solid rgba(255,255,255,0.1)" : "none",
    }),
    inputArea: {
      display: "flex",
      gap: "0.5rem",
      padding: "1rem 1.5rem",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      background: "rgba(255,255,255,0.03)",
    },
    input: {
      flex: 1,
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: "12px",
      padding: "12px 16px",
      color: "#fff",
      fontSize: "0.95rem",
      outline: "none",
    },
    sendBtn: {
      background: "linear-gradient(90deg, #667eea, #764ba2)",
      border: "none",
      borderRadius: "12px",
      padding: "12px 20px",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "700",
      fontSize: "0.95rem",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>🤖 AI Productivity Coach</div>
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={styles.bubble(msg.role)}>
            {msg.role === "ai" && (
              <span style={{ fontSize: "0.75rem", color: "#667eea", display: "block", marginBottom: "4px" }}>
                ⚡ Gemini
              </span>
            )}
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={styles.bubble("ai")}>
            <span style={{ fontSize: "0.75rem", color: "#667eea", display: "block", marginBottom: "4px" }}>
              ⚡ Gemini
            </span>
            🤔 Thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={styles.inputArea}>
        <input
          style={styles.input}
          placeholder="Ask me anything about your tasks..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button style={styles.sendBtn} onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default AiChat;