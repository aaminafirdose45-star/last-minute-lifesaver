import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleGuestLogin = () => {
    setUser({
      uid: "guest-user-id",
      displayName: "Guest User",
      email: "guest@example.com",
      photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=guest"
    });
  };

  const handleLogout = async () => {
    if (user?.uid === "guest-user-id") {
      setUser(null);
    } else {
      await signOut(auth);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#0f0f1a",
        color: "#fff",
        fontSize: "1.5rem"
      }}>
        ⚡ Loading...
      </div>
    );
  }

  return (
    <div>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} onGuestLogin={handleGuestLogin} />
      )}
    </div>
  );
}

export default App;