import React from "react";

function Login({ onLogin }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
      color: "#fff",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        textAlign: "center",
        padding: "3rem",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "24px",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        maxWidth: "400px",
        width: "90%"
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚡</div>
        <h1 style={{
          fontSize: "2rem",
          fontWeight: "800",
          background: "linear-gradient(90deg, #667eea, #764ba2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "0.5rem"
        }}>
          Last-Minute Lifesaver
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.6)",
          marginBottom: "2rem",
          fontSize: "1rem"
        }}>
          Your AI-powered deadline rescue companion
        </p>
        <button
          onClick={onLogin}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#fff",
            color: "#333",
            border: "none",
            borderRadius: "12px",
            padding: "14px 28px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            margin: "0 auto",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
          onMouseOut={(e) => e.target.style.transform = "scale(1)"}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            style={{ width: "20px", height: "20px" }}
          />
          Sign in with Google
        </button>
        <p style={{
          marginTop: "1.5rem",
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.3)"
        }}>
          Never miss a deadline again 🚀
        </p>
      </div>
    </div>
  );
}

export default Login;