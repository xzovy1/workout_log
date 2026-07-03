// src/components/BottomNav.jsx
import React from "react";
import { useWorkout } from "../context/WorkoutContext";

export default function BottomNav() {
  const { currentView, setCurrentView, activeWorkout } = useWorkout();

  // Navigation items config array
  const navItems = [
    { id: "history", label: "📊 History" },
    { id: "workout", label: activeWorkout ? "🔥 Active" : "🏋️‍♂️ Workout" },
    { id: "settings", label: "⚙️ Settings" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "64px",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #dadce0",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
        zIndex: 1000,
      }}
    >
      {navItems.map((item) => {
        const isActive = currentView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            style={{
              flex: 1,
              height: "100%",
              border: "none",
              background: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              fontWeight: isActive ? "bold" : "normal",
              color: isActive ? "#1a73e8" : "#5f6368",
              cursor: "pointer",
              transition: "color 0.2s ease",
            }}
          >
            <span style={{ fontSize: "20px" }}>{item.label.split(" ")[0]}</span>
            <span>{item.label.split(" ")[1]}</span>

            {/* Active page underline accent bar */}
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  height: "3px",
                  width: "40px",
                  backgroundColor: "#1a73e8",
                  borderRadius: "3px 3px 0 0",
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
