import React, { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, updateDoc, query, where
} from "firebase/firestore";
import { analyzeTask, getRescuePlan, getAiProviderName } from "../gemini";

const TaskCard = require("./TaskCard").default;
const AddTask = require("./AddTask").default;
const AiChat = require("./AiChat").default;
const Badges = require("./Badges").default;
const RescueMode = require("./RescueMode").default;

function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [screen, setScreen] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [rescuePlan, setRescuePlan] = useState(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  
  const fetchTasks = useCallback(async () => {
    try {
      const q = query(
        collection(db, "tasks"),
        where("userId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const taskList = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      taskList.sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));
      setTasks(taskList);
    } catch (error) {
      console.warn("Firebase fetch error, falling back to local storage:", error);
      const localTasks = JSON.parse(localStorage.getItem(`tasks_${user.uid}`) || "[]");
      setTasks(localTasks);
    }
  }, [user.uid]);

  useEffect(() => {
  fetchTasks();

  const savedXp = localStorage.getItem("xp") || 0;
  const savedStreak = localStorage.getItem("streak") || 0;

  setXp(Number(savedXp));
  setStreak(Number(savedStreak));
}, [fetchTasks]);


  const addTask = async (title, deadline, category) => {
    setLoading(true);
    try {
      const analysis = await analyzeTask(title, deadline);
      const newTask = {
        title,
        deadline,
        category,
        userId: user.uid,
        completed: false,
        urgencyScore: analysis.urgencyScore,
        urgencyLabel: analysis.urgencyLabel,
        estimatedHours: analysis.estimatedHours,
        steps: analysis.steps,
        tip: analysis.tip,
        createdAt: new Date().toISOString(),
      };
      
      try {
        const docRef = await addDoc(collection(db, "tasks"), newTask);
        newTask.id = docRef.id;
      } catch (dbError) {
        console.warn("Firestore save failed, saving to localStorage instead:", dbError);
        const localTasks = JSON.parse(localStorage.getItem(`tasks_${user.uid}`) || "[]");
        newTask.id = "local_" + Date.now();
        localTasks.push(newTask);
        localTasks.sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));
        localStorage.setItem(`tasks_${user.uid}`, JSON.stringify(localTasks));
      }
      await fetchTasks();
    } catch (error) {
      console.error("Add task error:", error);
    }
    setLoading(false);
  };

  const completeTask = async (taskId) => {
    try {
      if (taskId.toString().startsWith("local_")) {
        const localTasks = JSON.parse(localStorage.getItem(`tasks_${user.uid}`) || "[]");
        const updated = localTasks.map(t => t.id === taskId ? { ...t, completed: true } : t);
        localStorage.setItem(`tasks_${user.uid}`, JSON.stringify(updated));
      } else {
        await updateDoc(doc(db, "tasks", taskId), { completed: true });
      }
    } catch (error) {
      console.warn("Firestore update failed, updating locally:", error);
      const localTasks = JSON.parse(localStorage.getItem(`tasks_${user.uid}`) || "[]");
      const updated = localTasks.map(t => t.id === taskId ? { ...t, completed: true } : t);
      localStorage.setItem(`tasks_${user.uid}`, JSON.stringify(updated));
    }
    const newXp = xp + 50;
    const newStreak = streak + 1;
    setXp(newXp);
    setStreak(newStreak);
    localStorage.setItem("xp", newXp);
    localStorage.setItem("streak", newStreak);
    await fetchTasks();
  };

  const deleteTask = async (taskId) => {
    try {
      if (taskId.toString().startsWith("local_")) {
        const localTasks = JSON.parse(localStorage.getItem(`tasks_${user.uid}`) || "[]");
        const filtered = localTasks.filter(t => t.id !== taskId);
        localStorage.setItem(`tasks_${user.uid}`, JSON.stringify(filtered));
      } else {
        await deleteDoc(doc(db, "tasks", taskId));
      }
    } catch (error) {
      console.warn("Firestore delete failed, deleting locally:", error);
      const localTasks = JSON.parse(localStorage.getItem(`tasks_${user.uid}`) || "[]");
      const filtered = localTasks.filter(t => t.id !== taskId);
      localStorage.setItem(`tasks_${user.uid}`, JSON.stringify(filtered));
    }
    await fetchTasks();
  };

  const activateRescueMode = async () => {
    setLoading(true);
    const pendingTasks = tasks.filter((t) => !t.completed);
    const plan = await getRescuePlan(pendingTasks);
    setRescuePlan(plan);
    setScreen("rescue");
    setLoading(false);
  };

  const getLevel = (xp) => {
    if (xp < 100) return { level: 1, title: "Procrastinator", next: 100 };
    if (xp < 250) return { level: 2, title: "Task Starter", next: 250 };
    if (xp < 500) return { level: 3, title: "Momentum Builder", next: 500 };
    if (xp < 1000) return { level: 4, title: "Deadline Crusher", next: 1000 };
    if (xp < 2000) return { level: 5, title: "Time Master", next: 2000 };
    return { level: 6, title: "Last-Minute Legend", next: 9999 };
  };

  const levelInfo = getLevel(xp);
  const xpProgress = ((xp % levelInfo.next) / levelInfo.next) * 100;
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const navItems = [
    { id: "dashboard", icon: "📋", label: "Tasks" },
    { id: "add", icon: "➕", label: "Add" },
    { id: "chat", icon: "🤖", label: "AI" },
    { id: "badges", icon: "🏆", label: "Badges" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* Header */}
      <header className="glass" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          fontSize: "1.4rem",
          fontWeight: "800",
          background: "linear-gradient(90deg, #667eea, #764ba2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          ⚡ Last-Minute Lifesaver
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <div className="glass" style={{
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "0.82rem",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}>
            🔥 {streak}
          </div>
          <div className="glass" style={{
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "0.82rem",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "linear-gradient(90deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))",
          }}>
            ⚡ {xp} XP
          </div>
          <div style={{
            background: "linear-gradient(90deg, #667eea, #764ba2)",
            borderRadius: "20px",
            padding: "6px 14px",
            fontSize: "0.82rem",
            fontWeight: "700",
          }}>
            Lv.{levelInfo.level} {levelInfo.title}
          </div>

          {/* Avatar */}
          <img
            src={user.photoURL || "https://via.placeholder.com/32"}
            alt="avatar"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              border: "2px solid #667eea",
              cursor: "pointer",
            }}
            onClick={onLogout}
            title="Click to logout"
          />
        </div>
      </header>

      {/* XP Progress Bar */}
      <div style={{
        height: "3px",
        background: "rgba(255,255,255,0.05)",
        position: "sticky",
        top: "64px",
        zIndex: 99,
      }}>
        <div style={{
          height: "100%",
          width: `${xpProgress}%`,
          background: "linear-gradient(90deg, #667eea, #764ba2)",
          transition: "width 0.5s ease",
          boxShadow: "0 0 10px rgba(102,126,234,0.8)",
        }} />
      </div>

      {/* Nav */}
      <nav style={{
        display: "flex",
        gap: "0.5rem",
        padding: "1rem 2rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            style={{
              background: screen === item.id
                ? "linear-gradient(90deg, #667eea, #764ba2)"
                : "rgba(255,255,255,0.05)",
              border: "1px solid",
              borderColor: screen === item.id ? "#667eea" : "rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "8px 20px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: screen === item.id ? "700" : "400",
              fontSize: "0.9rem",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div style={{
        padding: "1.5rem 2rem",
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        {loading && (
          <div className="glass slide-in" style={{
            textAlign: "center",
            padding: "3rem",
            borderRadius: "20px",
            marginBottom: "1.5rem",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤖</div>
            <div style={{ color: "#667eea", fontSize: "1.1rem", fontWeight: "600" }}>
              {getAiProviderName()} is analyzing your task...
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
              This takes 2-3 seconds
            </div>
          </div>
        )}

        {screen === "dashboard" && !loading && (
          <>
            {/* Rescue Mode Button */}
            <button
              onClick={activateRescueMode}
              style={{
                background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
                border: "none",
                borderRadius: "16px",
                padding: "16px 24px",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "1rem",
                marginBottom: "1.5rem",
                width: "100%",
                boxShadow: "0 8px 32px rgba(255,65,108,0.3)",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,65,108,0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,65,108,0.3)";
              }}
            >
              🚨 RESCUE MODE — I'm overwhelmed!
            </button>

            {/* Stats row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}>
              {[
                { label: "Pending", value: pendingTasks.length, color: "#ff416c" },
                { label: "Completed", value: completedTasks.length, color: "#4caf50" },
                { label: "Total XP", value: xp, color: "#667eea" },
              ].map((stat, i) => (
                <div key={i} className="glass" style={{
                  padding: "1rem",
                  borderRadius: "16px",
                  textAlign: "center",
                }}>
                  <div style={{
                    fontSize: "1.8rem",
                    fontWeight: "800",
                    color: stat.color,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.5)",
                    marginTop: "4px",
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Pending Tasks */}
            <h2 style={{
              fontSize: "1.1rem",
              marginBottom: "1rem",
              color: "rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              📋 Pending Tasks
              <span style={{
                background: "rgba(255,65,108,0.2)",
                color: "#ff416c",
                borderRadius: "20px",
                padding: "2px 10px",
                fontSize: "0.8rem",
              }}>
                {pendingTasks.length}
              </span>
            </h2>

            {pendingTasks.length === 0 ? (
              <div className="glass" style={{
                textAlign: "center",
                padding: "3rem",
                borderRadius: "20px",
                marginBottom: "1.5rem",
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
                <div style={{ color: "rgba(255,255,255,0.5)" }}>
                  No pending tasks! Add one to get started.
                </div>
              </div>
            ) : (
              pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                />
              ))
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <>
                <h2 style={{
                  fontSize: "1.1rem",
                  marginBottom: "1rem",
                  marginTop: "1.5rem",
                  color: "rgba(255,255,255,0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  ✅ Completed
                  <span style={{
                    background: "rgba(76,175,80,0.2)",
                    color: "#4caf50",
                    borderRadius: "20px",
                    padding: "2px 10px",
                    fontSize: "0.8rem",
                  }}>
                    {completedTasks.length}
                  </span>
                </h2>
                {completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={completeTask}
                    onDelete={deleteTask}
                  />
                ))}
              </>
            )}
          </>
        )}

        {screen === "add" && !loading && (
          <AddTask onAdd={addTask} onDone={() => setScreen("dashboard")} />
        )}

        {screen === "chat" && (
          <AiChat user={user} tasks={tasks} />
        )}

        {screen === "badges" && (
          <Badges xp={xp} />
        )}

        {screen === "rescue" && rescuePlan && (
          <RescueMode plan={rescuePlan} onBack={() => setScreen("dashboard")} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
