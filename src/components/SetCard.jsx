import React, { useState, useEffect } from "react";
import { writeRecord, getLogsForExercise } from "../db";

export function SetCard({ exerciseName, workoutId, setNumber, onLogComplete }) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [lastPerf, setLastPerf] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchOverloadMetrics() {
      const logs = await getLogsForExercise(exerciseName);
      // Find the last record matching this specific set number
      const match = logs.find((log) => log.setNumber === setNumber);
      if (match) setLastPerf(match);
    }
    fetchOverloadMetrics();
  }, [exerciseName, setNumber]);

  const handleLog = async () => {
    if (!weight || !reps) return;

    const logEntry = {
      id: crypto.randomUUID(),
      workoutId,
      exerciseName,
      setNumber,
      weight: parseFloat(weight),
      reps: parseInt(reps, 10),
      timestamp: Date.now(),
    };

    await writeRecord("logs", logEntry);
    setSaved(true);

    // 2. Fire the callback after a brief delay so the user catches the visual green success confirmation
    setTimeout(() => {
      if (onLogComplete) onLogComplete();
    }, 400);
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "12px",
        margin: "8px 0",
        backgroundColor: saved ? "#e6f4ea" : "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>Set {setNumber}</strong>
        {lastPerf && (
          <span style={{ fontSize: "12px", color: "#666" }}>
            Last: {lastPerf.weight} lbs × {lastPerf.reps}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <input
          type="number"
          placeholder="lbs"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          disabled={saved}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="number"
          placeholder="reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          disabled={saved}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <button
        onClick={handleLog}
        disabled={saved}
        style={{
          width: "100%",
          marginTop: "8px",
          padding: "8px",
          backgroundColor: saved ? "#137333" : "#1a73e8",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          fontWeight: "bold",
        }}
      >
        {saved ? "✓ Logged" : "Log Set"}
      </button>
    </div>
  );
}
