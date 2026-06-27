import React from "react";

function Login({ onLogin }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Animated background orbs */}
      <div style={{
        position: "absolute",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(102,126,234,0.2), transparent)",
        top: "-100px",
        left: "-100px",
        animation: "float 6s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(118,75,162,0.2), transparent)",
        bottom: "-50px",
        right: "-50px",
        animation: "float 8s ease-in-out infinite reverse",
      }} />
      <div style={{
        position: "absolute",
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,65,108,0.15), transparent)",
        top: "50%",
        right: "10%",
        animation: "float 5s ease-in-out infinite",
      }} />

      {/* Main card */}
      <div className="glass-strong slide-in" style={{
        textAlign: "center",
        padding: "3.5rem",
        borderRadius: "32px",
        maxWidth: "420px",
        width: "90%",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{
          fontSize: "4rem",
          marginBottom: "1rem",
          animation: "float 3s ease-in-out infinite",
          display: "inline-block",
        }}>⚡</div>

        <h1 style={{
          fontSize: "2.2rem",
          fontWeight: "800",
          marginBottom: "0.5rem",
          background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Last-Minute
        </h1>
        <h1 style={{
          fontSize: "2.2rem",
          fontWeight: "800",
          marginBottom: "1rem",
          background: "linear-gradient(90deg, #f093fb, #667eea)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Lifesaver
        </h1>

        <p style={{
          color: "rgba(255,255,255,0.5)",
          marginBottom: "2.5rem",
          fontSize: "1rem",
          lineHeight: "1.6",
        }}>
          Your AI-powered deadline rescue companion 🚀
        </p>

        {/* Features preview */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.8rem",
          marginBottom: "2rem",
        }}>
          {[
            { emoji: "🤖", text: "AI Analysis" },
            { emoji: "⏱️", text: "Live Timer" },
            { emoji: "🚨", text: "Rescue Mode" },
            { emoji: "🏆", text: "Gamification" },
          ].map((f, i) => (
            <div key={i} className="glass" style={{
              padding: "0.8rem",
              borderRadius: "12px",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.7)",
            }}>
              {f.emoji} {f.text}
            </div>
          ))}
        </div>

        <button
          onClick={onLogin}
          className="glow"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#ffffff",
            color: "#333",
            border: "none",
            borderRadius: "16px",
            padding: "16px 32px",
            fontSize: "1rem",
            fontWeight: "700",
            cursor: "pointer",
            margin: "0 auto",
            transition: "all 0.3s",
            boxShadow: "0 8px 32px rgba(102,126,234,0.3)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(102,126,234,0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(102,126,234,0.3)";
          }}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            style={{ width: "22px", height: "22px" }}
          />
          Sign in with Google
        </button>

        <p style={{
          marginTop: "1.5rem",
          fontSize: "0.78rem",
          color: "rgba(255,255,255,0.25)",
        }}>
          Powered by Google Gemini AI ✨
        </p>
      </div>
    </div>
  );
}

export default Login;