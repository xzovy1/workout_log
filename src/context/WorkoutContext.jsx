import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllRecords, writeRecord } from "../db";

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [currentView, setCurrentView] = useState("workout");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const allWorkouts = await getAllRecords("workouts");
        setHistory(
          allWorkouts.sort((a, b) => new Date(b.date) - new Date(a.date)),
        );

        // Resume session if app closed mid-workout
        const ongoing = allWorkouts.find((w) => w.status === "in-progress");
        if (ongoing) setActiveWorkout(ongoing);
      } catch (err) {
        console.error("IndexedDB initialization failed", err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const startWorkout = async (type) => {
    const session = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
      type,
      status: "in-progress",
    };
    await writeRecord("workouts", session);
    setActiveWorkout(session);
  };

  const finishWorkout = async () => {
    if (!activeWorkout) return;
    const completedSession = { ...activeWorkout, status: "completed" };
    await writeRecord("workouts", completedSession);

    // Refresh history state
    const allWorkouts = await getAllRecords("workouts");
    setHistory(allWorkouts.sort((a, b) => new Date(b.date) - new Date(a.date)));
    setActiveWorkout(null);
  };

  return (
    <WorkoutContext.Provider
      value={{
        activeWorkout,
        history,
        startWorkout,
        finishWorkout,
        loading,
        currentView,
        setCurrentView,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => useContext(WorkoutContext);
