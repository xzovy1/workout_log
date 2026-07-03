// src/App.jsx
import React from "react";
import { WorkoutProvider, useWorkout } from "./context/WorkoutContext";
import WorkoutSelector from "./views/WorkoutSelector";
import ActiveWorkout from "./views/ActiveWorkout";
import History from "./views/History"; // You can stub these or build next
import Settings from "./views/Settings"; // You can stub these or build next
import BottomNav from "./components/BottomNav";

function MainAppContent() {
  const { activeWorkout, loading, currentView } = useWorkout();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "sans-serif",
        }}
      >
        <h3>Loading Local Engine...</h3>
      </div>
    );
  }

  // Dynamic Routing Engine based on Nav State
  const renderView = () => {
    switch (currentView) {
      case "history":
        return <History />;
      case "settings":
        return <Settings />;
      case "workout":
      default:
        return activeWorkout ? <ActiveWorkout /> : <WorkoutSelector />;
    }
  };

  return (
    <div
      style={{
        paddingBottom: "80px", // Prevents content from getting clipped behind the sticky nav
        fontFamily: "sans-serif",
        boxSizing: "border-box",
        minHeight: "100vh",
        backgroundColor: "#fff",
      }}
    >
      {renderView()}
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <WorkoutProvider>
      <MainAppContent />
    </WorkoutProvider>
  );
}
