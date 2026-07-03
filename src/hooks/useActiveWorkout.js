// src/hooks/useActiveWorkout.js
import { useState, useEffect } from "react";
import { openDB, addRecord } from "../db";

export function useActiveWorkout() {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for any active workouts on app mount
  useEffect(() => {
    async function checkActiveSession() {
      try {
        const db = await openDB();
        const transaction = db.transaction("workouts", "readonly");
        const store = transaction.objectStore("workouts");
        const request = store.getAll();

        request.onsuccess = () => {
          // Find a workout that isn't finished yet
          const ongoing = request.result.find(
            (w) => w.status === "in-progress",
          );
          if (ongoing) setActiveWorkout(ongoing);
          setIsLoading(false);
        };
      } catch (err) {
        console.error("Failed to fetch session", err);
        setIsLoading(false);
      }
    }
    checkActiveSession();
  }, []);

  const startWorkout = async (type) => {
    const newWorkout = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
      type,
      status: "in-progress",
    };
    await addRecord("workouts", newWorkout);
    setActiveWorkout(newWorkout);
  };

  const logSet = async (exerciseId, setNumber, weight, reps) => {
    if (!activeWorkout) return;

    const newLog = {
      id: crypto.randomUUID(),
      workoutId: activeWorkout.id,
      exerciseId,
      setNumber: parseInt(setNumber),
      weight: parseFloat(weight),
      reps: parseInt(reps),
      timestamp: Date.now(),
    };

    await addRecord("exercise_logs", newLog);
    // Return the log so the UI component can update its local list if needed
    return newLog;
  };

  return { activeWorkout, isLoading, startWorkout, logSet };
}
