import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, updateDoc, query, where
} from "firebase/firestore";
import { analyzeTask, getRescuePlan } from "../gemini";

const TaskCard = require("./TaskCard").default;
const AddTask = require("./AddTask").default;
const AiChat = require("./AiChat").default;
const RescueMode = require("./RescueMode").default;
const Badges = require("./Badges").default;

function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [screen, setScreen] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [rescuePlan, setRescuePlan] = useState(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const getLevel = (xp) => {
    if (xp < 100) return { level: 1, title: "Procrastinator", next: 100 };
    if (xp < 250) return { level: 2, title: "Task Starter", next: 250 };
    if (xp < 500) return { level: 3, title: "Momentum Builder", next: 500 };
    if (xp < 1000) return { level: 4, title: "Deadline Crusher", next: 1000 };
    if (xp < 2000) return { level: 5, title: "Time Master", next: 2000 };
    return { level: 6, title: "Last-Minute Legend", next: 9999 };
  };

  useEffect(() => {
    fetchTasks();
    const savedXp = localStorage.getItem("xp") || 0;
    const savedStreak = localStorage.getItem("streak") || 0;
    setXp(Number(savedXp));
    setStreak(Number(savedStreak));
  }, []);

  const fetchTasks = async () => {
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
      console.error("Fetch error:", error);
    }
  };

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
      await addDoc(collection(db, "tasks"), newTask);
      await fetchTasks();
    } catch (error) {
      console.error("Add task error:", error);
    }
    setLoading(false);
  };

  const completeTask = async (taskId) => {
    await updateDoc(doc(db, "tasks", taskId), { completed: true });
    const newXp = xp + 50;
    const newStreak = streak + 1;
    setXp(newXp);
    setStreak(newStreak);
    localStorage.setItem("xp", newXp);
    localStorage.setItem("streak", newStreak);
    await fetchTasks();
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
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

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
      color: "#fff",
      fontFamily: "'Segoe UI', sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      background: "rgba(255,255,255,0.05)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    },
    logo: {
      fontSize: "1.5rem",
      fontWeight: "800",
      background: "linear-gradient(90deg, #667eea, #764ba2)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    stats: {
      display: "flex",
      gap: "1rem",
      alignItems: "center",
    },
    statBadge: {
      background: "rgba(255,255,255,0.1)",
      borderRadius: "20px",
      padding: "6px 14px",
      fontSize: "0.85rem",
    },
    nav: {
      display: "flex",
      gap: "0.5rem",
      padding: "1rem 2rem",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    },
    navBtn: (active) => ({
      background: active ? "linear-gradient(90deg, #667eea, #764ba2)" : "rgba(255,255,255,0.05)",
      border: "none",
      borderRadius: "10px",
      padding: "8px 18px",
      color: "#fff",
      cursor: "pointer",
      fontWeight: active ? "700" : "400",
      fontSize: "0.9rem",
    }),
    content: {
      padding: "1.5rem 2rem",
      maxWidth: "900px",
      margin: "0 auto",
    },
    rescueBtn: {
      background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
      border: "none",
      borderRadius: "12px",
      padding: "12px 24px",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "700",
      fontSize: "1rem",
      marginBottom: "1.5rem",
      width: "100%",
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>⚡ Last-Minute Lifesaver</div>
        <div style={styles.stats}>
          <span style={styles.statBadge}>🔥 {streak} streak</span>
          <span style={styles.statBadge}>⚡ {xp} XP</span>
<span style={{
  background: "linear-gradient(90deg, #667eea, #764ba2)",
  borderRadius: "20px",
  padding: "6px 14px",
  fontSize: "0.85rem",
  fontWeight: "700"
}}>
  Lv.{getLevel(xp).level} {getLevel(xp).title}
</span>
          <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
            {user.displayName?.split(" ")[0]}
          </span>
          <button
            onClick={onLogout}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "8px",
              padding: "6px 14px",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <nav style={styles.nav}>
        {["dashboard", "add", "chat", "badges"].map((s) => (
          <button
            key={s}
            style={styles.navBtn(screen === s)}
            onClick={() => setScreen(s)}
          >
            {s === "dashboard" ? "📋 Tasks" : s === "add" ? "➕ Add Task" : s === "chat" ? "🤖 AI Chat" : "🏆 Badges"}
          </button>
        ))}
      </nav>

      <div style={styles.content}>
        {loading && (
          <div style={{
            textAlign: "center",
            padding: "2rem",
            color: "#667eea",
            fontSize: "1.1rem"
          }}>
            🤖 Gemini is analyzing... please wait
          </div>
        )}

        {screen === "dashboard" && !loading && (
          <>
            <button style={styles.rescueBtn} onClick={activateRescueMode}>
              🚨 RESCUE MODE — I'm overwhelmed!
            </button>
            <div style={{ marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "rgba(255,255,255,0.8)" }}>
                Pending Tasks ({pendingTasks.length})
              </h2>
              {pendingTasks.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "16px"
                }}>
                  🎉 No pending tasks! Add one to get started.
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
            </div>
            {completedTasks.length > 0 && (
              <div>
                <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "rgba(255,255,255,0.4)" }}>
                  ✅ Completed ({completedTasks.length})
                </h2>
                {completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={completeTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
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